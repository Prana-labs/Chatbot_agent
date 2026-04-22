import { NextRequest, NextResponse } from "next/server";
import { vectorStores } from "../load/route";

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: NextRequest) {
  try {
    const { question, videoId } = await req.json();
    if (!question || !videoId) {
      return NextResponse.json({ error: "question and videoId are required" }, { status: 400 });
    }

    const store = vectorStores[videoId];
    if (!store) {
      return NextResponse.json({ error: "Video not loaded. Please load the video first." }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });

    const qEmbedRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({ model: "text-embedding-ada-002", input: [question] }),
    });
    const qEmbedData = await qEmbedRes.json();
    if (!qEmbedRes.ok) throw new Error(qEmbedData.error?.message || "Embedding failed");

    const questionEmbedding: number[] = qEmbedData.data[0].embedding;

    const similarities = store.embeddings.map((emb, idx) => ({
      idx,
      score: cosineSimilarity(questionEmbedding, emb),
    }));
    similarities.sort((a, b) => b.score - a.score);
    const topChunks = similarities.slice(0, 2).map((s) => store.chunks[s.idx]);
    const context = topChunks.join("\n\n");

    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: `You are a helpful assistant. Answer ONLY from the provided transcript context. If the context is insufficient, just say you don't know.` },
          { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
        ],
      }),
    });

    const chatData = await chatRes.json();
    if (!chatRes.ok) throw new Error(chatData.error?.message || "Chat completion failed");

    const answer = chatData.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error" }, { status: 500 });
  }
}
