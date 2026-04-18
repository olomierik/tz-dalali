import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, ShieldCheck, BadgeCheck } from "lucide-react";

const Partners = () => (
  <div className="container py-20 max-w-4xl">
    <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">TzDalali Partner Network</span>
    <h1 className="font-serif text-5xl text-primary mb-3">Verified Partners</h1>
    <div className="gold-divider mb-8" />

    <p className="text-muted-foreground leading-relaxed text-lg mb-12">
      TzDalali works exclusively with verified law firms and tax consultants in every country.
      All partners are screened, credentialed, and assigned automatically to deals in their
      jurisdiction.
    </p>

    <div className="grid sm:grid-cols-2 gap-6 mb-12">
      {[
        {
          icon: Scale,
          name: "GODVIL Consult",
          type: "Founding Legal Partner · Tanzania",
          tier: "Elite",
          desc: "Tanzanian property law, title verification, contract drafting, and legal guarantees.",
          specializations: ["Property Law", "Title Verification", "Contract Drafting", "Dispute Resolution"],
        },
        {
          icon: ShieldCheck,
          name: "PRIME AUDITORS",
          type: "Founding Tax Partner · Tanzania",
          tier: "Elite",
          desc: "Property taxation, TRA compliance, stamp duty, and financial due diligence.",
          specializations: ["Stamp Duty", "TRA Compliance", "Capital Gains Tax", "Property Valuation"],
        },
      ].map((p) => (
        <div key={p.name} className="bg-card border border-border rounded-lg p-8 shadow-card">
          <p.icon className="h-7 w-7 text-gold mb-4" />
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif text-xl text-primary">{p.name}</h3>
            <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{p.tier}</span>
            <BadgeCheck className="h-4 w-4 text-gold" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">{p.type}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
          <div className="flex flex-wrap gap-1">
            {p.specializations.map((s) => (
              <span key={s} className="text-xs bg-secondary border border-border px-2 py-0.5 rounded-full text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-secondary rounded-lg p-8 border border-border text-center">
      <h2 className="font-serif text-2xl text-primary mb-3">Join as a Partner Firm</h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto mb-6">
        Is your law firm or tax consultancy interested in joining TzDalali's global partner network?
        Apply to become a verified partner and earn commissions on deals in your country.
      </p>
      <Button asChild variant="gold">
        <Link to="/auth?mode=signup&role=law_firm">Apply to Become a Partner</Link>
      </Button>
    </div>
  </div>
);

export default Partners;
