"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, ArrowRight, MessageCircle, Send, ArrowLeft } from "lucide-react"

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

interface Summary {
  text: string
  tags: string[]
  handle: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function GlancePage() {
  const [handle, setHandle] = useState("")
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  const mockSummaries: Record<string, Omit<Summary, "handle">> = {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handle.trim()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`
    const mockData = mockSummaries[cleanHandle] || {
      text: "Active user sharing insights and engaging with their community through meaningful conversations.",
      tags: ["General", "Community"],
    }

    setSummary({
      ...mockData,
      handle: cleanHandle,
    })
    setLoading(false)
  }

  const reset = () => {
    setSummary(null)
    setHandle("")
    setShowChat(false)
    setMessages([])
    setChatInput("")
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading) return

    const userMessage = chatInput.trim()
    setChatInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setChatLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockResponses = [
      `Based on ${summary?.handle}'s recent activity, they seem to focus heavily on their core interests. Their engagement patterns suggest they're quite active in their community.`,
      `From what I can see in ${summary?.handle}'s posts, they tend to share insights that align with their professional background and personal interests.`,
      `${summary?.handle} appears to be someone who values meaningful conversations and often engages with topics that matter to their field.`,
      `Looking at their posting patterns, ${summary?.handle} seems to maintain a consistent voice and perspective across their content.`,
    ]

    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
    setChatLoading(false)
  }

  const startChat = () => {
    setShowChat(true)
    setMessages([
      {
        role: "assistant",
        content: `I've analyzed ${summary?.handle}'s recent activity. What would you like to know more about?`,
      },
    ])
  }

  const backToSummary = () => {
    setShowChat(false)
    setMessages([])
    setChatInput("")
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-light text-white tracking-wide">Glance</h1>
            </div>
          </div>

          {/* Main Interface */}
          {!summary ? (
            <div className="space-y-8">
              {/* Glass input container */}
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <XLogo className="w-5 h-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="@username"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-2xl backdrop-blur-sm focus:bg-white/10 focus:border-blue-400/50 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!handle.trim() || loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 border-0 rounded-2xl backdrop-blur-sm transition-all duration-300 group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Analyze</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Example handles */}
              <div className="flex justify-center gap-2">
                {Object.keys(mockSummaries).map((exampleHandle) => (
                  <button
                    key={exampleHandle}
                    onClick={() => setHandle(exampleHandle)}
                    className="px-3 py-1 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all duration-200"
                  >
                    {exampleHandle}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {!showChat ? (
                <>
                  {/* Summary View */}
                  <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="space-y-6">
                      {/* Handle */}
                      <div className="flex items-center justify-center gap-2 pb-4 border-b border-white/10">
                        <XLogo className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{summary.handle}</span>
                      </div>

                      {/* Summary */}
                      <p className="text-gray-300 leading-relaxed">{summary.text}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {summary.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-white/10 text-gray-300 border-white/20 rounded-full px-3 py-1 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Ask More Button */}
                      <div className="pt-4 border-t border-white/10">
                        <Button
                          onClick={startChat}
                          className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 group"
                          variant="outline"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Ask more about this person
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={reset}
                    variant="outline"
                    className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-2xl backdrop-blur-sm transition-all duration-300 px-6"
                  >
                    Analyze another
                  </Button>
                </>
              ) : (
                <>
                  {/* Chat View */}
                  <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                      <Button
                        onClick={backToSummary}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white p-2"
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
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              message.role === "user"
                                ? "bg-blue-500/80 text-white"
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
