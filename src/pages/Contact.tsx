import { Mail, MessageCircle, MapPin } from "lucide-react";

const Contact = () => (
  <div className="container py-20 max-w-3xl">
    <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Contact</span>
    <h1 className="font-serif text-5xl text-primary mb-3">Get in touch</h1>
    <div className="gold-divider mb-8" />
    <p className="text-muted-foreground leading-relaxed text-lg mb-12">
      Our team is available to assist buyers, sellers, and partner firms. Reach us through any of
      the channels below.
    </p>

    <div className="grid sm:grid-cols-3 gap-6">
      <div className="bg-secondary rounded-lg p-6 border border-border">
        <Mail className="h-6 w-6 text-gold mb-3" />
        <h3 className="font-serif text-lg text-primary mb-1">Email Support</h3>
        <p className="text-xs text-muted-foreground mb-3">For all enquiries</p>
        <a className="text-sm text-gold hover:underline" href="mailto:support@tzdalali.com">
          support@tzdalali.com
        </a>
      </div>

      <div className="bg-secondary rounded-lg p-6 border border-border">
        <Mail className="h-6 w-6 text-gold mb-3" />
        <h3 className="font-serif text-lg text-primary mb-1">Admin</h3>
        <p className="text-xs text-muted-foreground mb-3">Platform & partnerships</p>
        <a className="text-sm text-gold hover:underline" href="mailto:admin@tzdalali.com">
          admin@tzdalali.com
        </a>
      </div>

      <div className="bg-secondary rounded-lg p-6 border border-border">
        <MessageCircle className="h-6 w-6 text-gold mb-3" />
        <h3 className="font-serif text-lg text-primary mb-1">WhatsApp</h3>
        <p className="text-xs text-muted-foreground mb-3">TzDalali Business</p>
        <p className="text-sm text-muted-foreground">Available via WhatsApp Business</p>
      </div>
    </div>

    <div className="mt-8 bg-secondary rounded-lg p-6 border border-border flex items-start gap-4">
      <MapPin className="h-5 w-5 text-gold mt-0.5 shrink-0" />
      <div>
        <h3 className="font-serif text-lg text-primary mb-1">Headquarters</h3>
        <p className="text-sm text-muted-foreground">
          Dar es Salaam, Tanzania · tzdalali.com
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Founding legal partner: GODVIL Consult · Founding tax partner: PRIME AUDITORS
        </p>
      </div>
    </div>
  </div>
);

export default Contact;
