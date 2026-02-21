import OpenAI from "openai";
import fs from "node:fs";

const apiKey = process.env.OPENAI_API_KEY!;
if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

export const openai = new OpenAI({ apiKey });

export async function transcribeAudio(filePath: string) {
  const model = process.env.OPENAI_STT_MODEL || "gpt-4o-mini-transcribe";

  // OpenAI SDK expects a readable stream for file uploads
  const audioStream = fs.createReadStream(filePath);

  const result = await openai.audio.transcriptions.create({
    file: audioStream,
    model,
    // optional: language: "en",
    // optional: response_format: "json",
  });

  // result.text is the transcript in SDK responses
  return result.text;
}