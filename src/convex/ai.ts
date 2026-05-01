import { action } from "./_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const chatWithClaude = action({
  args: {
    message: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an AI assistant for TzDalali, a global marketplace for Real Estate and Cars. 
          Context: ${args.context || "No specific context provided."}
          User message: ${args.message}`,
        },
      ],
    });

    return response.content[0].type === "text" ? response.content[0].text : "Sorry, I couldn't process that.";
  },
});

export const generateDescription = action({
  args: {
    type: v.union(v.literal("property"), v.literal("car")),
    specs: v.any(),
  },
  handler: async (ctx: any, args: any) => {
    const prompt = args.type === "property" 
      ? `Generate a professional real estate listing description for a ${args.specs.type} in ${args.specs.location} with ${args.specs.bedrooms} bedrooms and ${args.specs.bathrooms} bathrooms. Price: ${args.specs.price} ${args.specs.currency}.`
      : `Generate a professional car listing description for a ${args.specs.year} ${args.specs.make} ${args.specs.model} with ${args.specs.mileage} miles. Fuel type: ${args.specs.fuelType}, Transmission: ${args.specs.transmission}.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content[0].type === "text" ? response.content[0].text : "Professional description coming soon.";
  },
});
