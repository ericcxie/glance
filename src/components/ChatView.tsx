import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import { XLogo } from "./XLogo";
import { Summary, Message } from "@/types";

interface ChatViewProps {
  summary: Summary;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatInput: string;
  setChatInput: (input: string) => void;
  chatLoading: boolean;
  setChatLoading: (loading: boolean) => void;
  backToSummary: () => void;
}

export const ChatView = ({
  summary,
  messages,
  setMessages,
  chatInput,
  setChatInput,
  chatLoading,
  setChatLoading,
  backToSummary,
}: ChatViewProps) => {
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResponses = [
      `Based on ${summary.handle}'s recent activity, they seem to focus heavily on their core interests. Their engagement patterns suggest they're quite active in their community.`,
      `From what I can see in ${summary.handle}'s posts, they tend to share insights that align with their professional background and personal interests.`,
      `${summary.handle} appears to be someone who values meaningful conversations and often engages with topics that matter to their field.`,
      `Looking at their posting patterns, ${summary.handle} seems to maintain a consistent voice and perspective across their content.`,
    ];

    const response =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setChatLoading(false);
  };

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <Button
          onClick={backToSummary}
          variant="ghost"
          size="sm"
          className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all duration-300 px-6 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <XLogo className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">{summary.handle}</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto hide-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex text-left ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-500/60 text-white"
                  : "bg-white/10 text-gray-300 border border-white/20"
              } backdrop-blur-sm`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-gray-300 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleChatSubmit} className="flex gap-2">
        <Input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask anything about this person..."
          className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-2xl backdrop-blur-sm focus:bg-white/10 focus:border-blue-400/50 transition-all duration-300"
          disabled={chatLoading}
        />
        <Button
          type="submit"
          disabled={!chatInput.trim() || chatLoading}
          className="bg-blue-500/80 hover:bg-blue-500 rounded-2xl px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
