export default function Privacy() {
  return (
    <div className="container py-16 max-w-4xl">
      <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Legal</span>
      <h1 className="font-serif text-5xl text-primary mb-3">Privacy Policy</h1>
      <div className="gold-divider mb-6" />
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 1, 2024</p>

      <div className="space-y-8">
        {[
          { title: '1. Data We Collect', body: 'TzDalali collects the following types of information: Account information (name, email, phone, password hash); Identity verification data (national ID, passport, selfie — deleted after verification); Property listing details (title, description, images, location); Transaction data (deal price, source of funds, documents); Payment information (processed by Stripe/Flutterwave — we do not store card numbers); Usage data (pages visited, search terms, device information); Communication data (emails, support messages).' },
          { title: '2. How We Use Your Data', body: 'We use your data to: provide and improve the TzDalali platform; process and facilitate property transactions; verify your identity for transaction security; send transactional emails and notifications; comply with legal obligations and anti-money laundering requirements; analyze platform usage to improve features; send marketing communications (with your consent).' },
          { title: '3. Data Sharing', body: 'We share your data with: Assigned law firm and tax consultant partners (transaction-specific data only); Supabase (database and authentication infrastructure); Stripe and Flutterwave (payment processing); Resend (email delivery); Twilio (SMS/WhatsApp notifications); Regulatory authorities when required by law. We do not sell your personal data to third parties.' },
          { title: '4. GDPR Rights', body: 'If you are in the European Union or United Kingdom, you have the right to: access your personal data; rectify inaccurate data; request deletion of your data ("right to be forgotten"); data portability; restrict processing; object to processing for direct marketing. To exercise these rights, contact support@tzdalali.com. We will respond within 30 days.' },
          { title: '5. Data Retention', body: 'We retain your data for as long as your account is active or as needed to provide services. Transaction records are retained for 7 years for legal and tax compliance. Identity verification documents are deleted immediately after verification. You may request account deletion at any time; this will remove your personal data within 30 days, except where retention is required by law.' },
          { title: '6. Cookies', body: 'TzDalali uses essential cookies for authentication and session management. We also use analytics cookies to understand platform usage. You may disable non-essential cookies in your browser settings. Essential cookies cannot be disabled as they are required for platform functionality.' },
          { title: '7. Security', body: 'We implement industry-standard security measures including: SSL/TLS encryption for data in transit; AES encryption for sensitive data at rest; Row-Level Security on all database tables; Regular security audits; Access controls and audit logs. Despite these measures, no system is completely secure. Please use a strong, unique password and never share your credentials.' },
          { title: '8. Children\'s Privacy', body: 'TzDalali is not intended for users under 18 years of age. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately.' },
          { title: '9. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or platform notification. Your continued use of TzDalali after changes constitutes acceptance of the updated policy.' },
          { title: '10. Contact', body: 'For privacy-related questions or to exercise your rights, contact us at: support@tzdalali.com or admin@tzdalali.com. TzDalali Ltd., Dar es Salaam, Tanzania.' },
        ].map(section => (
          <div key={section.title}>
            <h2 className="font-serif text-2xl text-primary mb-3">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
