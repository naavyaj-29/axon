import { Router } from "express";
import multer from "multer";
import fs from "node:fs/promises";
import { z } from "zod";
import { requireUser } from "../middleware/auth.js";
import { transcribeAudio } from "../services/openai.js";
import { supabaseAdmin } from "../services/supabase.js";

const upload = multer({ dest: "tmp/" });
export const sttRouter = Router();

sttRouter.post(
  "/transcribe",
  requireUser,
  upload.single("file"),
  async (req, res) => {
    const user = (req as any).user as { id: string };

    try {
      if (!req.file) return res.status(400).json({ error: "Missing file" });

      const bodySchema = z.object({
        store: z.string().optional(), // "true" to store
      });

      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid body" });
      }

      const transcript = await transcribeAudio(req.file.path);

      // Clean up temp file
      await fs.unlink(req.file.path).catch(() => {});

      const shouldStore = parsed.data.store === "true";

      if (shouldStore) {
        // Example: store transcript in Supabase
        const { error } = await supabaseAdmin.from("transcripts").insert({
          user_id: user.id,
          text: transcript,
          created_at: new Date().toISOString(),
        });

        if (error) {
          return res.status(500).json({ error: "DB insert failed", details: error.message });
        }
      }

      return res.json({ transcript });
    } catch (e: any) {
      // Attempt cleanup if file still exists
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(500).json({ error: "Transcription failed", details: e?.message ?? String(e) });
    }
  }
);