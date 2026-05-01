import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFeaturedProperties = query({
  handler: async (ctx: any) => {
    return await ctx.db
      .query("properties")
      .withIndex("by_status", (q: any) => q.eq("status", "available"))
      .filter((q: any) => q.eq(q.field("featured"), true))
      .take(6);
  },
});

export const getFeaturedCars = query({
  handler: async (ctx: any) => {
    return await ctx.db
      .query("cars")
      .withIndex("by_status", (q: any) => q.eq("status", "available"))
      .filter((q: any) => q.eq(q.field("featured"), true))
      .take(6);
  },
});

export const searchListings = query({
  args: {
    query: v.string(),
    type: v.union(v.literal("property"), v.literal("car"), v.literal("all")),
  },
  handler: async (ctx: any, args: any) => {
    const properties = args.type === "car" ? [] : await ctx.db.query("properties").collect();
    const cars = args.type === "property" ? [] : await ctx.db.query("cars").collect();
    
    const lowerQuery = args.query.toLowerCase();
    
    const filteredProperties = properties.filter((p: any) => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.location.toLowerCase().includes(lowerQuery)
    );
    
    const filteredCars = cars.filter((c: any) => 
      c.make.toLowerCase().includes(lowerQuery) || 
      c.model.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.location.toLowerCase().includes(lowerQuery)
    );
    
    return {
      properties: filteredProperties,
      cars: filteredCars
    };
  },
});

export const getPropertyById = query({
  args: { id: v.any() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.id);
  },
});

export const getCarById = query({
  args: { id: v.any() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.id);
  },
});
