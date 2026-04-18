import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, ShieldCheck, Globe2, BadgeCheck } from "lucide-react";

const pillars = [
  { icon: Scale, title: "Legal Guarantee", desc: "Every transaction backed by a verified local law firm — title checked, contracts drafted, transfer certified." },
  { icon: ShieldCheck, title: "Escrow Protection", desc: "Buyer funds held in TzDalali-managed escrow and released only after all legal and tax conditions are met." },
  { icon: Globe2, title: "Global Coverage", desc: "We operate in every country on Earth, assigning local partners who know the laws, language, and land registry of their jurisdiction." },
  { icon: BadgeCheck, title: "Transparent Fees", desc: "$50 to list. 10% commission on close — 5% TzDalali, 3% law firm, 2% tax consultant. Nothing hidden." },
];

const About = () => (
  <div className="container py-20 max-w-4xl">
    <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">About</span>
    <h1 className="font-serif text-5xl text-primary mb-3">Tanzania's Global Broker.</h1>
    <div className="gold-divider mb-8" />

    <p className="text-muted-foreground leading-relaxed text-lg mb-6">
      <strong className="text-primary">TzDalali</strong> — from <em>Dalali</em>, the Swahili word for broker — was built on a
      simple conviction: buying and selling property anywhere in the world should be legally safe,
      transparent, and accessible to everyone.
    </p>
    <p className="text-muted-foreground leading-relaxed text-lg mb-12">
      Today, TzDalali operates as a full-service global brokerage platform. Property owners pay a
      flat $50 listing fee and reach buyers worldwide. When a buyer proceeds, TzDalali acts as the
      agent and assigns a verified local law firm and tax consultant to handle due diligence,
      contracts, tax clearance, and title transfer — from first offer to final handover.
    </p>

    <div className="grid sm:grid-cols-2 gap-6 mb-16">
      {pillars.map((p) => (
        <div key={p.title} className="bg-secondary rounded-lg p-6 border border-border">
          <p.icon className="h-6 w-6 text-gold mb-3" />
          <h3 className="font-serif text-xl text-primary mb-2">{p.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
      <h2 className="font-serif text-3xl mb-2">Founding Partners</h2>
      <p className="text-gold/80 italic mb-4">Based in Tanzania</p>
      <p className="opacity-80 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
        TzDalali was founded in partnership with <strong>GODVIL Consult</strong> (legal) and{" "}
        <strong>PRIME AUDITORS</strong> (tax) — both elite Tanzanian firms committed to making
        every property transaction legally sound and financially transparent.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="gold">
          <Link to="/partners">Meet Our Partner Network</Link>
        </Button>
        <Button asChild variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
          <Link to="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default About;
