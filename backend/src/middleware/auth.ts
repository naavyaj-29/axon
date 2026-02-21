import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

if (!url || !anonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

// This client is used only to validate user JWTs
const supabasePublic = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing Bearer token" });

  const { data, error } = await supabasePublic.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // attach user to request
  (req as any).user = data.user;
  next();
}