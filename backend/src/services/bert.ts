export async function analyzeText(text: string) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(
      process.env.BERT_SERVICE_URL + "/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } finally {
    clearTimeout(id);
  }
}