import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Zap, Sparkles, Globe2, Shield, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function AISearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gold/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-gold mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">AI-Powered</span>
          </div>
          <h1 className="font-serif text-5xl font-bold mb-6">
            Search Like You <span className="text-gold">Talk</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Describe what you're looking for in natural language. Our AI understands context, 
            preferences, and location — just like talking to a local expert.
          </p>
          
          {/* Search Box */}
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text"
                    className="w-full h-14 pl-12 pr-4 text-lg border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder='e.g., "A modern villa near the beach in Zanzibar for under $500k"'
                  />
                </div>
                <Button size="lg" className="bg-black text-gold hover:bg-black/90 px-8">
                  <Zap className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-gray-500">Try:</span>
                {[
                  "Family house in Lagos with pool",
                  "Beachfront apartment in Bali",
                  "Commercial space in Nairobi",
                ].map((example, i) => (
                  <button key={i} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    {example}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">Natural language understanding meets global property data</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Describe</h3>
              <p className="text-gray-600">
                Tell us what you need in plain language — any style, any location, any budget.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Understands</h3>
              <p className="text-gray-600">
                Our semantic engine processes context, preferences, and market data to find matches.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe2 className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Discover</h3>
              <p className="text-gray-600">
                Get personalized results from 195 countries with verified properties and secure transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-[#F9F7F5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6">
                Why Use AI Search?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">10x Faster</h3>
                    <p className="text-gray-600">No more fiddling with 20+ filters. One search, perfect results.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Smarter Matching</h3>
                    <p className="text-gray-600">Understands synonyms, neighborhoods, and hidden preferences.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Better Deals</h3>
                    <p className="text-gray-600">AI finds undervalued properties and negotiates better prices.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Your search:</p>
                  <p className="font-medium">"A quiet apartment in Osaka with good schools nearby, around $300k"</p>
                </div>
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-semibold">
                    Found 23 matching properties
                  </div>
                </div>
                <div className="p-4 bg-gold/5 rounded-lg border border-gold/20">
                  <p className="text-sm font-semibold mb-2">Top Match:</p>
                  <p className="text-gray-600 text-sm">
                    Modern 2BR in Higashi-Yodogawa district, 3 min to subway, ¥42M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers who found their dream property with AI search
          </p>
          <Button size="lg" className="bg-gold text-black hover:bg-gold/90" asChild>
            <Link to="/listings">
              <Search className="h-5 w-5 mr-2" />
              Start Searching
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}