"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export function PriceRecommender({ type, specs }: { type: "property" | "car", specs: any }) {
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const recommend = useAction(api.ai.recommendPrice);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const result = await recommend({ type, specs });
      setRecommendation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#febb02]/10 rounded-lg border border-[#febb02]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#003580]" />
          AI Price Recommender
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRecommend}
          disabled={loading}
          className="text-[#003580] hover:bg-[#febb02]/20"
        >
          {loading ? "Analyzing..." : "Get Recommendation"}
        </Button>
      </div>
      {recommendation ? (
        <p className="text-sm text-[#003580]">{recommendation}</p>
      ) : (
        <p className="text-sm text-gray-500">Get an AI-driven price suggestion based on market trends.</p>
      )}
    </div>
  );
}
