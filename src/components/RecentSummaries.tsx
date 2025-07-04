"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { XLogo } from "./XLogo";
import { Summary } from "@/types";

interface RecentSummariesProps {
  onLoadSummary: (summary: Summary) => void;
}

export const RecentSummaries = ({ onLoadSummary }: RecentSummariesProps) => {
  const [recentSummaries, setRecentSummaries] = useState<Summary[]>([]);

  // Initialize with dummy data
  const initializeDummyData = () => {
    const dummyData: Summary[] = [
      {
        handle: "@alex_dev",
        text: "AI-focused developer building the future of software. Recently excited about new ML frameworks and startup challenges.",
        tags: ["AI", "Dev", "Startups"],
        timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      },
      {
        handle: "@sarah_design",
        text: "UX designer passionate about accessibility and inclusive design. Currently working on design systems for tech.",
        tags: ["Design", "UX", "A11y"],
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      },
    ];
    setRecentSummaries(dummyData);
    localStorage.setItem("glance-recent-summaries", JSON.stringify(dummyData));
  };

  // Load recent summaries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("glance-recent-summaries");
    if (saved) {
      try {
        const parsedSummaries = JSON.parse(saved);
        setRecentSummaries(parsedSummaries);
      } catch (e) {
        console.error("Failed to load recent summaries:", e);
        // Initialize with dummy data if localStorage fails
        initializeDummyData();
      }
    } else {
      // Initialize with dummy data if no saved data
      initializeDummyData();
    }
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (recentSummaries.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-300">Recent Summaries</h3>
      </div>
      <div className="space-y-3">
        {recentSummaries.map((recent, index) => (
          <button
            key={`${recent.handle}-${recent.timestamp}`}
            onClick={() => onLoadSummary(recent)}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <XLogo className="w-3 h-3 text-blue-400" />
                <span className="text-sm font-medium text-white">
                  {recent.handle}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(recent.timestamp)}
              </span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
              {recent.text}
            </p>
            <div className="flex gap-1 mt-2">
              {recent.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  className="text-xs bg-white/10 text-gray-400 border-white/20 rounded-full px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
