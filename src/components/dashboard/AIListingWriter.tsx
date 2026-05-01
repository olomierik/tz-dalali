"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export function AIListingWriter({ type, specs }: { type: "property" | "car", specs: any }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const generate = useAction(api.ai.generateDescription);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generate({ type, specs });
      setDescription(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Description</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerate}
          disabled={loading}
          className="text-[#003580] border-[#003580]/20"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      <Textarea 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Tell us about your listing..."
        className="h-48"
      />
    </div>
  );
}
