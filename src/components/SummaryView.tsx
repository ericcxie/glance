import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { XLogo } from "./XLogo";
import { CopyLinkButton } from "./CopyLinkButton";
import { Summary } from "@/types";

interface SummaryViewProps {
  summary: Summary;
  startChat: () => void;
  reset: () => void;
}

export const SummaryView = ({
  summary,
  startChat,
  reset,
}: SummaryViewProps) => {
  return (
    <div className="space-y-8">
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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <Button
              onClick={startChat}
              className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 group"
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask more about this person
            </Button>

            <CopyLinkButton summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
};
