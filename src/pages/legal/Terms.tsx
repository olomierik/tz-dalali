export default function Terms() {
  return (
    <div className="container py-16 max-w-4xl">
      <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Legal</span>
      <h1 className="font-serif text-5xl text-primary mb-3">Terms of Service</h1>
      <div className="gold-divider mb-6" />
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 1, 2024</p>

      <div className="prose prose-neutral max-w-none space-y-8">
        {[
          { title: '1. Agreement to Terms', body: 'By accessing or using TzDalali ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform. These terms constitute a legally binding agreement between you and TzDalali Ltd.' },
          { title: '2. Platform Description', body: 'TzDalali is a global real estate brokerage platform that connects property buyers and sellers worldwide. TzDalali acts as a broker, facilitating transactions with the assistance of verified local law firm and tax consultant partners. TzDalali does not own any listed properties.' },
          { title: '3. Listing Fee', body: 'Property sellers are required to pay a non-refundable listing fee of USD $50 per property. Payment of this fee activates the listing for public visibility. The listing fee does not guarantee a sale. TzDalali reserves the right to reject any listing that violates platform policies.' },
          { title: '4. Commission Structure', body: 'On completion of a property transaction, TzDalali charges a 10% commission on the agreed deal value. This commission is split as follows: 5% to TzDalali platform, 3% to the assigned law firm partner, and 2% to the assigned tax consultant partner. Commission is deducted from the escrow funds before release to the seller.' },
          { title: '5. Escrow Services', body: 'TzDalali provides escrow services to secure buyer funds during the transaction process. Funds are held in a dedicated escrow account and released only upon completion of all required legal and tax conditions, and confirmation of title transfer by the assigned law firm.' },
          { title: '6. Partner Network', body: 'TzDalali assigns verified law firms and tax consultants ("Partners") to transactions based on jurisdiction and availability. TzDalali does not guarantee specific partner assignment response times. Partners are independent contractors and not employees of TzDalali.' },
          { title: '7. User Obligations', body: 'You agree to: provide accurate and truthful information on all forms and listings; not misrepresent property conditions, ownership, or legal status; comply with all applicable laws in your jurisdiction; not use the platform for money laundering, fraud, or illegal activities; maintain the confidentiality of your account credentials.' },
          { title: '8. Prohibited Uses', body: 'You may not: post listings for properties you do not own or have authority to sell; engage in price manipulation or false bidding; circumvent TzDalali\'s commission structure by conducting off-platform deals; harass other users or platform staff; attempt to reverse-engineer or compromise the platform\'s security.' },
          { title: '9. Limitation of Liability', body: 'TzDalali is not liable for: any defects in title discovered after transaction completion; acts or omissions of partner law firms or tax consultants; market fluctuations in property values; delays caused by government agencies or land registries; force majeure events. TzDalali\'s total liability is limited to the fees paid by the user in the preceding 12 months.' },
          { title: '10. Dispute Resolution', body: 'Any disputes arising from use of the platform shall first be attempted through TzDalali\'s internal dispute process. Unresolved disputes shall be submitted to mediation in Dar es Salaam, Tanzania. Governing law: the laws of the United Republic of Tanzania.' },
          { title: '11. Governing Law', body: 'These Terms are governed by the laws of the United Republic of Tanzania. Any disputes are subject to the exclusive jurisdiction of the courts of Dar es Salaam, Tanzania.' },
          { title: '12. Contact', body: 'For questions about these Terms, contact us at support@tzdalali.com or admin@tzdalali.com.' },
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
