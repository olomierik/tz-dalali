"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Star, TrendingUp, Building2, Shield, Zap, ChevronRight, Car } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [vertical, setVertical] = useState<"property" | "car">("property");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredProperties = useQuery(api.listings.getFeaturedProperties) || [];
  const featuredCars = useQuery(api.listings.getFeaturedCars) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-[#003580] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003580] via-[#004a99] to-[#003580]" />
        
        <div className="container relative py-16 md:py-24 mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              Find your next {vertical === "property" ? "stay" : "ride"}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Search {vertical === "property" ? "properties" : "cars"} across 195 countries with legal guarantee and escrow protection
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Vertical Toggle */}
            <div className="flex gap-2 mb-4 justify-center">
              <Button 
                variant={vertical === "property" ? "default" : "secondary"}
                className={vertical === "property" ? "bg-[#febb02] text-[#003580] hover:bg-[#febb02]/90" : "bg-white/10 text-white hover:bg-white/20"}
                onClick={() => setVertical("property")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Real Estate
              </Button>
              <Button 
                variant={vertical === "car" ? "default" : "secondary"}
                className={vertical === "car" ? "bg-[#febb02] text-[#003580] hover:bg-[#febb02]/90" : "bg-white/10 text-white hover:bg-white/20"}
                onClick={() => setVertical("car")}
              >
                <Car className="mr-2 h-4 w-4" />
                Cars
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-2 md:p-3">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder={vertical === "property" ? "Where are you going?" : "What car are you looking for?"}
                    className="pl-10 h-12 md:h-14 border-0 text-black text-base focus-visible:ring-[#003580]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button 
                  size="lg" 
                  className="h-12 md:h-14 px-8 bg-[#febb02] text-[#003580] hover:bg-[#febb02]/90 font-semibold rounded-lg"
                >
                  <Search className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Banner */}
      <section className="bg-[#febb02]/10 border-b border-[#febb02]/20">
        <div className="container py-4 mx-auto px-4">
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
            <span className="flex items-center gap-2 font-medium text-[#003580]">
              <Zap className="h-4 w-4 text-[#febb02]" />
              Smart Search with Claude AI
            </span>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <span className="text-gray-600">
              Try: "3 bedroom villa in Dar es Salaam under $200k" or "Toyota Land Cruiser in Nairobi"
            </span>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif">Featured Properties</h2>
            <Link href="/real-estate" className="text-[#003580] font-medium flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p: any) => (
              <div key={p._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-gray-500">{p.location}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xl font-bold text-[#003580]">{p.currency} {p.price.toLocaleString()}</span>
                    <Badge variant="secondary">{p.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
            {featuredProperties.length === 0 && (
              <p className="text-gray-500 col-span-full">No featured properties found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif">Trending Cars</h2>
            <Link href="/cars" className="text-[#003580] font-medium flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((c: any) => (
              <div key={c._id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <img src={c.images[0]} alt={`${c.make} ${c.model}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{c.year} {c.make} {c.model}</h3>
                  <p className="text-gray-500">{c.location}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xl font-bold text-[#003580]">{c.currency} {c.price.toLocaleString()}</span>
                    <Badge variant="outline">{c.transmission}</Badge>
                  </div>
                </div>
              </div>
            ))}
            {featuredCars.length === 0 && (
              <p className="text-gray-500 col-span-full">No trending cars found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">Why use TzDalali?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We bridge the gap between global buyers and local markets with secure transactions and legal protection.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: "Legal Guarantee", desc: "Every transaction is verified by partner law firms." },
              { icon: TrendingUp, title: "Market Insights", desc: "AI-driven analytics to help you make informed decisions." },
              { icon: Zap, title: "Instant Escrow", desc: "Secure payments with Stripe and Flutterwave integration." }
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#003580]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <f.icon className="h-8 w-8 text-[#003580]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
