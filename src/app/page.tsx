"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { BackgroundGradients } from "@/components/BackgroundGradients";
import { HandleInputForm } from "@/components/HandleInputForm";
import { SummaryView } from "@/components/SummaryView";
import { ChatView } from "@/components/ChatView";
import { Summary, Message } from "@/types";

export default function GlancePage() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

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

  const reset = () => {
    setSummary(null);
    setHandle("");
    setShowChat(false);
    setMessages([]);
    setChatInput("");
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradients */}
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

          {/* Main Interface */}
          {!summary ? (
            <HandleInputForm
              handle={handle}
              setHandle={setHandle}
              loading={loading}
              setLoading={setLoading}
              setSummary={setSummary}
              mockSummaries={mockSummaries}
            />
          ) : (
            <div className="space-y-8">
              {!showChat ? (
                <SummaryView
                  summary={summary}
                  startChat={startChat}
                  reset={reset}
                />
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
          )}
        </div>
      </div>
    </div>
  );
}
