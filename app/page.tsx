"use client";

import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [error, setError] = useState("");

  function extractVideoId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  async function handleLoadVideo() {
    setError("");
    const videoId = extractVideoId(videoUrl) || videoUrl.trim();
    if (!videoId) {
      setError("Please enter a valid YouTube URL or video ID.");
      return;
    }
    setLoadingVideo(true);
    try {
      const res = await fetch("/api/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load video");
      setVideoLoaded(true);
      setVideoTitle(data.title || videoId);
      setMessages([{ role: "assistant", content: `✅ Video loaded! Ask me anything about "${data.title || videoId}".` }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingVideo(false);
    }
  }

  async function handleAsk() {
    if (!question.trim() || !videoLoaded) return;
    const userMsg = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const videoId = extractVideoId(videoUrl) || videoUrl.trim();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg, videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get answer");
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err: unknown) {
      setMessages((prev) => [...prev, { role: "assistant", content: `❌ Error: ${err instanceof Error ? err.message : "Something went wrong"}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">📺 YouTube Chat Bot</h1>
          <p className="text-gray-400 mt-1 text-sm">Ask anything about a YouTube video</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3">
          <label className="text-sm text-gray-400 font-medium">YouTube URL or Video ID</label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
              placeholder="https://youtube.com/watch?v=... or video ID"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadVideo()}
              disabled={loadingVideo}
            />
            <button
              onClick={handleLoadVideo}
              disabled={loadingVideo || !videoUrl.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              {loadingVideo ? "Loading..." : "Load"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {videoLoaded && <p className="text-green-400 text-xs">✓ Loaded: {videoTitle}</p>}
        </div>
        {messages.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-100"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-xl text-sm text-gray-400 animate-pulse">Thinking...</div>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600 disabled:opacity-50"
            placeholder={videoLoaded ? "Ask something about the video..." : "Load a video first"}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
            disabled={!videoLoaded || loading}
          />
          <button
            onClick={handleAsk}
            disabled={!videoLoaded || loading || !question.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-3 rounded-xl text-sm font-semibold transition"
          >
            Ask
          </button>
        </div>
      </div>
    </main>
  );
}
