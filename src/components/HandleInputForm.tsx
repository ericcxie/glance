import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight } from "lucide-react";
import { XLogo } from "./XLogo";
import { RecentSummaries } from "./RecentSummaries";

interface HandleInputFormProps {
  handle: string;
  setHandle: (handle: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const HandleInputForm = ({
  handle,
  setHandle,
  loading,
  setLoading,
}: HandleInputFormProps) => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);

    try {
      const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

      // Navigate to the summary page - the API will be called there
      router.push(`/summary/${encodeURIComponent(cleanHandle)}`);
    } catch (error) {
      console.error("Error navigating to summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentSummary = (summary: any) => {
    const username = summary.handle.startsWith("@")
      ? summary.handle.slice(1)
      : summary.handle;
    router.push(`/summary/${encodeURIComponent(username)}`);
  };

  return (
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
                <span>Summarize</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </div>
      {/* Recent Summaries */}
      <RecentSummaries onLoadSummary={loadRecentSummary} />
    </div>
  );
};
