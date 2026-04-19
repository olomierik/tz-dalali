import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Scale, ShieldCheck, Globe2, DollarSign, CheckCircle, FileText, CreditCard, ArrowRight } from 'lucide-react'

const BUYER_STEPS = [
  { n: 1, title: 'Browse & Find', desc: 'Search millions of properties worldwide. Filter by country, region, type, price, and more.' },
  { n: 2, title: 'Initiate a Deal', desc: 'Click "Proceed to Buy/Rent". Fill in source of funds and intended use. Acknowledge TzDalali\'s 10% commission structure.' },
  { n: 3, title: 'Partner Assignment', desc: 'TzDalali automatically assigns a verified local law firm and tax consultant to your deal.' },
  { n: 4, title: 'Due Diligence', desc: 'Your law firm verifies the title deed, ownership, legal status, and any encumbrances.' },
  { n: 5, title: 'Tax Clearance', desc: 'Your tax consultant calculates stamp duty, capital gains tax, and any TRA fees applicable.' },
  { n: 6, title: 'Contract Preparation', desc: 'The law firm drafts the sale/lease agreement. Both parties review and sign electronically.' },
  { n: 7, title: 'Escrow Funding', desc: 'You deposit the agreed price into TzDalali\'s secure escrow account via Stripe or mobile money.' },
  { n: 8, title: 'Title Transfer & Completion', desc: 'The law firm files the title transfer at the Land Registry. Escrow is released to seller. You receive your property.' },
]

const SELLER_STEPS = [
  { icon: DollarSign, title: 'Pay $50 listing fee', desc: 'One-time flat fee. No subscription. No recurring charges.' },
  { icon: Globe2, title: 'Your property goes live globally', desc: 'Visible to buyers in every country. TzDalali markets your listing.' },
  { icon: Scale, title: 'TzDalali handles the deal', desc: 'When a buyer proceeds, TzDalali assigns legal and tax experts automatically.' },
  { icon: CreditCard, title: 'Receive your payment', desc: 'After title transfer, escrow releases to you minus 10% commission.' },
]

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-500 text-white border-green-500',
  active: 'bg-gold text-white border-gold',
  pending: 'bg-muted text-muted-foreground border-border',
}

export default function HowItWorks() {
  const [examplePrice, setExamplePrice] = useState(100000)
  const commission = examplePrice * 0.10
  const platformFee = examplePrice * 0.05
  const lawFee = examplePrice * 0.03
  const taxFee = examplePrice * 0.02
  const sellerReceives = examplePrice - commission
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Process</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">How TzDalali Works</h1>
          <p className="opacity-80 max-w-2xl mx-auto text-lg">From listing to legal transfer — every step handled by verified professionals.</p>
        </div>
      </section>

      {/* Buyer journey */}
      <section className="container py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">For Buyers</span>
          <h2 className="font-serif text-4xl text-primary mb-3">The 8-Step Transaction Process</h2>
          <div className="gold-divider mx-auto" />
        </div>

        <div className="max-w-3xl mx-auto space-y-0">
          {BUYER_STEPS.map((step, i) => (
            <div key={step.n} className="flex gap-6 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {step.n}
                </div>
                {i < BUYER_STEPS.length - 1 && <div className="w-0.5 h-12 bg-border mt-1" />}
              </div>
              <div className="pb-10">
                <h3 className="font-serif text-xl text-primary mb-1.5">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="gold" size="lg"><Link to="/listings">Browse Properties</Link></Button>
        </div>
      </section>

      {/* Seller journey */}
      <section className="bg-secondary py-20">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">For Sellers</span>
            <h2 className="font-serif text-4xl text-primary mb-3">List and Sell in 4 Simple Steps</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SELLER_STEPS.map((step, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 shadow-card text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="gold" size="lg"><Link to="/seller/listings/new">List a Property — $50</Link></Button>
          </div>
        </div>
      </section>

      {/* Commission Calculator */}
      <section className="container py-20">
        <div className="text-center mb-10">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Transparency</span>
          <h2 className="font-serif text-4xl text-primary mb-3">Commission Calculator</h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">TzDalali earns only when your deal closes. 10% commission, shared between platform, law firm, and tax consultant.</p>
        </div>
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Deal Value (USD)</label>
            <input
              type="number"
              className="w-full border border-border rounded-md px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
              value={examplePrice}
              onChange={e => setExamplePrice(Math.max(0, +e.target.value))}
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Deal Value</span><span className="font-semibold">{fmt(examplePrice)}</span></div>
            <div className="flex justify-between py-1.5"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold inline-block" />TzDalali Platform (5%)</span><span>{fmt(platformFee)}</span></div>
            <div className="flex justify-between py-1.5"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Law Firm (3%)</span><span>{fmt(lawFee)}</span></div>
            <div className="flex justify-between py-1.5"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />Tax Consultant (2%)</span><span>{fmt(taxFee)}</span></div>
            <div className="flex justify-between py-2 border-t border-border font-semibold text-base"><span>Total Commission (10%)</span><span className="text-gold">{fmt(commission)}</span></div>
            <div className="flex justify-between py-2 border-t-2 border-primary text-primary font-bold text-base"><span>Seller Receives</span><span>{fmt(sellerReceives)}</span></div>
          </div>
        </div>
      </section>

      {/* For Partners */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">For Partners</span>
          <h2 className="font-serif text-4xl mb-4">Join as a Verified Partner Firm</h2>
          <p className="opacity-80 max-w-2xl mx-auto mb-8">Law firms earn 3% · Tax consultants earn 2% on every completed deal in their jurisdiction. No upfront costs — earn on every TzDalali transaction in your country.</p>
          <Button asChild variant="gold" size="lg"><Link to="/partners">Apply as Partner Firm</Link></Button>
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
