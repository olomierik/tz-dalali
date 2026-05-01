"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const chatWithClaude = useAction(api.ai.chatWithClaude);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      // For now, just navigate to results. 
      // In a real implementation, we'd use Claude to parse the query into filters.
      const response = await chatWithClaude({ 
        message: `Parse this search query into JSON filters for a marketplace: "${query}". 
        Available verticals: real-estate, cars. 
        Return only JSON.` 
      });
      console.log("Claude parsed search:", response);
      
      // Simplified: just go to listings with query
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } catch (err) {
      console.error(err);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with AI: 'Luxury villa in Zanzibar' or 'Toyota SUV in Lagos'..."
          className="h-14 pl-12 pr-32 rounded-full shadow-lg border-2 border-[#003580]/10 focus:border-[#003580]"
        />
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-[#febb02] h-5 w-5" />
        <Button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 rounded-full bg-[#003580] hover:bg-[#003580]/90 px-6"
        >
          {loading ? "Parsing..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
