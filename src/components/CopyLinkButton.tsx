"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Summary } from "@/types";

interface CopyLinkButtonProps {
  summary: Summary;
  className?: string;
}

export const CopyLinkButton = ({
  summary,
  className = "",
}: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const username = summary.handle.startsWith("@")
      ? summary.handle.slice(1)
      : summary.handle;
    const url = `${window.location.origin}/summary/${encodeURIComponent(
      username
    )}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      onClick={copyLink}
      className={`w-full bg-white/5 hover:bg-white/10 border-white/20 text-gray-300 hover:text-white rounded-2xl backdrop-blur-sm transition-all duration-300 ${className}`}
      variant="outline"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Link copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy link
        </>
      )}
    </Button>
  );
};
