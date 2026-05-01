import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(
      v.literal("buyer"),
      v.literal("seller"),
      v.literal("agent"),
      v.literal("admin"),
      v.literal("law_firm"),
      v.literal("tax_consultant")
    ),
    profileImage: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  properties: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.string(), // e.g., house, apartment, land
    status: v.string(), // e.g., available, sold, pending
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    area: v.optional(v.number()),
    location: v.string(),
    images: v.array(v.string()),
    sellerId: v.id("users"),
    featured: v.boolean(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  cars: defineTable({
    make: v.string(),
    model: v.string(),
    year: v.number(),
    price: v.number(),
    currency: v.string(),
    mileage: v.number(),
    fuelType: v.string(),
    transmission: v.string(),
    bodyType: v.string(),
    engineSize: v.optional(v.string()),
    description: v.string(),
    status: v.string(),
    images: v.array(v.string()),
    sellerId: v.id("users"),
    location: v.string(),
    featured: v.boolean(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  locations: defineTable({
    country: v.string(),
    region: v.optional(v.string()),
    district: v.optional(v.string()),
  }),

  transactions: defineTable({
    listingId: v.union(v.id("properties"), v.id("cars")),
    listingType: v.union(v.literal("property"), v.literal("car")),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: v.string(), // initiation, escrow, completed, cancelled
    paymentReference: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_buyer", ["buyerId"]).index("by_seller", ["sellerId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
