"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundGradients } from "@/components/BackgroundGradients";
import { SummaryView } from "@/components/SummaryView";
import { ChatView } from "@/components/ChatView";
import { Summary, Message } from "@/types";

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string | undefined;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const mockSummaries: Record<string, Omit<Summary, "handle" | "timestamp">> = {
    "@alex_dev": {
      text: "AI-focused developer building the future of software. Recently excited about new ML frameworks and startup challenges.",
      tags: ["AI", "Dev", "Startups"],
    },
    "@sarah_design": {
      text: "UX designer passionate about accessibility and inclusive design. Currently working on design systems for tech.",
      tags: ["Design", "UX", "A11y"],
    },
    "@mike_crypto": {
      text: "Crypto trader analyzing markets and DeFi protocols. Bullish on emerging blockchain technologies.",
      tags: ["Crypto", "DeFi", "Trading"],
    },
  };

  useEffect(() => {
    if (username) {
      loadSummary(username);
    } else {
      setLoading(false);
    }
  }, [username]);

  const loadSummary = async (handle: string) => {
    setLoading(true);

    // Add @ if not present
    const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;

    // Try to load from recent summaries first
    const saved = localStorage.getItem("glance-recent-summaries");
    if (saved) {
      try {
        const recentSummaries: Summary[] = JSON.parse(saved);
        const existingSummary = recentSummaries.find(
          (s) => s.handle === cleanHandle
        );
        if (existingSummary) {
          setSummary(existingSummary);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Failed to load recent summaries:", e);
      }
    }

    // If not found in recent, create new summary (simulate API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockData = mockSummaries[cleanHandle] || {
      text: "Active user sharing insights and engaging with their community through meaningful conversations.",
      tags: ["General", "Community"],
    };

    const newSummary: Summary = {
      ...mockData,
      handle: cleanHandle,
      timestamp: Date.now(),
    };

    setSummary(newSummary);

    // Save to recent summaries
    const updatedRecent = [
      newSummary,
      ...(saved
        ? JSON.parse(saved).filter((s: Summary) => s.handle !== cleanHandle)
        : []),
    ].slice(0, 5);
    localStorage.setItem(
      "glance-recent-summaries",
      JSON.stringify(updatedRecent)
    );

    setLoading(false);
  };

  const goHome = () => {
    router.push("/");
  };

  const startChat = () => {
    setShowChat(true);
    setMessages([
      {
        role: "assistant",
        content: `I've analyzed ${summary?.handle}'s recent activity. What would you like to know more about?`,
      },
    ]);
  };

  const backToSummary = () => {
    setShowChat(false);
    setMessages([]);
    setChatInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <BackgroundGradients />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-light text-white tracking-wide">
                  Glance
                </h1>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <p className="text-gray-300">
                  Loading summary for {username}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary || !username) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <BackgroundGradients />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-light text-white tracking-wide">
                  Glance
                </h1>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="space-y-4">
                <p className="text-gray-300">
                  {!username
                    ? "Invalid URL"
                    : `Summary not found for ${username}`}
                </p>
                <Button
                  onClick={goHome}
                  variant="outline"
                  className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-2xl backdrop-blur-sm transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BackgroundGradients />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-light text-white tracking-wide">
                Glance
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {!showChat ? (
              <>
                <SummaryView
                  summary={summary}
                  startChat={startChat}
                  reset={goHome}
                />
                <Button
                  onClick={goHome}
                  variant="outline"
                  className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-2xl backdrop-blur-sm transition-all duration-300 px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </>
            ) : (
              <ChatView
                summary={summary}
                messages={messages}
                setMessages={setMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                chatLoading={chatLoading}
                setChatLoading={setChatLoading}
                backToSummary={backToSummary}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
