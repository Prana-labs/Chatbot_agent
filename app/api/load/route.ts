import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export const vectorStores: Record<string, { chunks: string[]; embeddings: number[][] }> = {};

export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json();
    if (!videoId) return NextResponse.json({ error: "videoId is required" }, { status: 400 });

    // Fetch transcript
    let transcript = "";
    try {
      const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = transcriptArr.map((t) => t.text).join(" ").replace(/\n/g, " ").trim();
    } catch (e) {
      console.error("Transcript error:", e);
      return NextResponse.json({ error: "Could not fetch transcript. Make sure the video has captions enabled." }, { status: 400 });
    }

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is empty." }, { status: 400 });
    }

    // Chunk the transcript
    const chunkSize = 1000;
    const overlap = 200;
    const chunks: string[] = [];
    let i = 0;
    while (i < transcript.length) {
      chunks.push(transcript.slice(i, i + chunkSize));
      i += chunkSize - overlap;
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });

    const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({ model: "text-embedding-ada-002", input: chunks }),
    });

    const embedData = await embedRes.json();
    if (!embedRes.ok) throw new Error(embedData.error?.message || "Embedding failed");

    const embeddings: number[][] = embedData.data.map((d: { embedding: number[] }) => d.embedding);
    vectorStores[videoId] = { chunks, embeddings };

    return NextResponse.json({ success: true, title: videoId, chunkCount: chunks.length });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error" }, { status: 500 });
  }
}
