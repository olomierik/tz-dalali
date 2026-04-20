import { Mail, MessageCircle, MapPin } from "lucide-react";

const Contact = () => (
  <div className="container py-20 max-w-3xl">
    <h1 className="font-serif text-5xl mb-8">Contact</h1>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-card rounded-md p-5 border border-white/15">
        <Mail className="h-5 w-5 text-gold mb-3" />
        <p className="text-sm text-white/70 mb-1">Email</p>
        <a className="text-gold hover:underline" href="mailto:support@tzdalali.com">
          support@tzdalali.com
        </a>
      </div>

      <div className="bg-card rounded-md p-5 border border-white/15">
        <MessageCircle className="h-5 w-5 text-gold mb-3" />
        <p className="text-sm text-white/70 mb-1">WhatsApp</p>
        <p>TzDalali Business</p>
      </div>

      <div className="bg-card rounded-md p-5 border border-white/15 sm:col-span-2 flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gold mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-white/70 mb-1">Headquarters</p>
          <p>Dar es Salaam, Tanzania</p>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
