import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle, Scale, ShieldCheck, Globe2, FileText, DollarSign } from 'lucide-react'

const INCLUDED = [
  { icon: Scale, text: 'Verified law firm assigned to every deal' },
  { icon: CheckCircle, text: 'Tax consultant for compliance & clearance' },
  { icon: ShieldCheck, text: 'Escrow-protected payment holding' },
  { icon: Globe2, text: 'Global reach in every country' },
  { icon: FileText, text: 'Guided 8-step transaction process' },
  { icon: DollarSign, text: 'Transparent, fixed commission — no surprises' },
]

const FAQ = [
  { q: 'When is the commission paid?', a: 'Commission is taken from the escrow account when the deal closes. The buyer deposits the agreed price, and the 10% commission is deducted before releasing the remainder to the seller.' },
  { q: 'Can I negotiate the commission?', a: 'No. TzDalali operates on a transparent, fixed commission structure. The 10% is split between the platform (5%), law firm (3%), and tax consultant (2%) — ensuring all parties are fairly compensated.' },
  { q: 'What if the deal falls through?', a: 'Commission is only charged on completed deals. If a deal is cancelled before escrow is funded, no commission is charged. Escrow refund policies depend on the stage of cancellation.' },
  { q: 'Are there any hidden fees?', a: 'No. TzDalali charges $50 to list a property and 10% commission on completed deals. There are no subscription fees, monthly fees, or hidden charges.' },
  { q: 'Does the seller or buyer pay the commission?', a: 'The commission comes from the buyer\'s payment held in escrow. The seller receives the agreed price minus the 10% commission.' },
  { q: 'What currencies are accepted?', a: 'TzDalali accepts USD, TZS, KES, GBP, AED, EUR, and many more. Stripe handles international cards; Flutterwave handles M-Pesa, Tigo Pesa, Airtel Money, and other African mobile money systems.' },
  { q: 'Is my money safe in escrow?', a: 'Yes. TzDalali holds buyer funds in a dedicated escrow account and only releases them after all legal and tax conditions are verified and the title transfer is confirmed.' },
]

export default function Pricing() {
  const [price, setPrice] = useState(150000)
  const commission = price * 0.10
  const platform = price * 0.05
  const law = price * 0.03
  const tax = price * 0.02
  const sellerGets = price - commission
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Transparent Pricing</span>
          <h1 className="font-serif text-5xl mb-4">Simple. Fair. Transparent.</h1>
          <p className="opacity-80 max-w-xl mx-auto">One listing fee. One commission structure. TzDalali earns only when you close.</p>
        </div>
      </section>

      {/* Two pricing cards */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Listing fee */}
          <div className="bg-card border-2 border-gold rounded-xl p-8 shadow-luxe text-center">
            <p className="text-xs uppercase tracking-widest text-gold mb-3">For Sellers</p>
            <div className="font-serif text-6xl text-primary font-bold mb-1">$50</div>
            <p className="text-muted-foreground mb-6">One-time listing fee</p>
            <ul className="text-sm text-left space-y-2 mb-8">
              {['Your property visible in every country','Listed until sold or rented','TzDalali markets your listing','No subscription, no monthly fees','TzDalali earns only on close'].map(t => (
                <li key={t} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-gold shrink-0" />{t}</li>
              ))}
            </ul>
            <Button asChild variant="gold" size="lg" className="w-full"><Link to="/seller/listings/new">List a Property</Link></Button>
          </div>

          {/* Commission */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-card text-center">
            <p className="text-xs uppercase tracking-widest text-gold mb-3">On Deal Close</p>
            <div className="font-serif text-6xl text-primary font-bold mb-1">10%</div>
            <p className="text-muted-foreground mb-6">Commission on deal value</p>
            <div className="space-y-3 text-sm text-left mb-8">
              {[{label:'TzDalali Platform',pct:'5%',color:'bg-gold'},{label:'Law Firm Partner',pct:'3%',color:'bg-blue-400'},{label:'Tax Consultant',pct:'2%',color:'bg-purple-400'}].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${row.color} shrink-0`} />
                  <span className="flex-1">{row.label}</span>
                  <span className="font-semibold">{row.pct}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="lg" className="w-full"><Link to="/listings">Browse Properties</Link></Button>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-secondary py-20">
        <div className="container">
          <div className="text-center mb-10">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Calculator</span>
            <h2 className="font-serif text-4xl text-primary mb-3">See exactly what you pay</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="max-w-lg mx-auto bg-card border border-border rounded-xl p-8 shadow-card">
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">Deal Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                <input type="number" min="0" step="1000" value={price}
                  onChange={e => setPrice(Math.max(0, +e.target.value))}
                  className="w-full border border-border rounded-lg pl-8 pr-4 py-3 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-border pb-2"><span className="text-muted-foreground">Deal Value</span><span className="font-semibold">{fmt(price)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">TzDalali (5%)</span><span>{fmt(platform)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Law Firm (3%)</span><span>{fmt(law)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax Consultant (2%)</span><span>{fmt(tax)}</span></div>
              <div className="flex justify-between font-semibold border-t border-border pt-2"><span>Total Commission</span><span className="text-gold">{fmt(commission)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t-2 border-primary pt-3 text-primary"><span>Seller Receives</span><span>{fmt(sellerGets)}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Included</span>
          <h2 className="font-serif text-4xl text-primary mb-3">What you get with TzDalali</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {INCLUDED.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-secondary rounded-lg p-4 border border-border">
              <item.icon className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary py-20">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">FAQ</span>
            <h2 className="font-serif text-4xl text-primary mb-3">Frequently Asked Questions</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container">
          <h2 className="font-serif text-4xl mb-3">Ready to get started?</h2>
          <p className="opacity-80 mb-8 max-w-xl mx-auto">List your property for $50 or browse thousands of properties globally — all legally protected by TzDalali.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gold" size="lg"><Link to="/seller/listings/new">List a Property — $50</Link></Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/listings">Browse Properties</Link></Button>
          </div>
        </div>
      </section>
    </div>
  )
}
