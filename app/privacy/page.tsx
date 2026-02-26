import Link from 'next/link'
import { Scissors, Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Zentivora',
  description: 'Learn how Zentivora collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Zenti<span className="text-orange-100">vora</span></span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          </div>
          <p className="text-orange-100 text-sm">Last updated: January 1, 2025 &nbsp;·&nbsp; Effective: January 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm text-orange-800">
            Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we keep it safe. By using Zentivora, you agree to the practices described here.
          </div>

          <Section title="1. Who We Are">
            <p>Zentivora is a professional pet grooming booking platform. We are the data controller for the personal information we collect from you. If you have any questions about this policy, contact us at <a href="mailto:privacy@zentivora.com" className="text-orange-500 hover:underline">privacy@zentivora.com</a>.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong>Information you provide directly:</strong></p>
            <ul>
              <li>Full name, email address, and phone number when you register</li>
              <li>Home or billing address for service delivery</li>
              <li>Pet information: name, breed, age, health notes, and behavioral information</li>
              <li>Appointment preferences and special instructions</li>
              <li>Payment information (processed securely — we do not store full card numbers)</li>
            </ul>
            <p className="mt-3"><strong>Information collected automatically:</strong></p>
            <ul>
              <li>Browser type, device type, and operating system</li>
              <li>IP address and approximate location</li>
              <li>Pages visited, time spent on pages, and links clicked</li>
              <li>Cookies and similar tracking technologies (see Section 7)</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li><strong>Service delivery:</strong> To schedule, manage, and fulfill grooming appointments</li>
              <li><strong>Account management:</strong> To create and maintain your account and preferences</li>
              <li><strong>Communications:</strong> To send appointment confirmations, reminders, and important updates</li>
              <li><strong>Customer support:</strong> To respond to your inquiries and resolve issues</li>
              <li><strong>Safety:</strong> To protect the safety of your pet and our staff through health disclosures</li>
              <li><strong>Improvements:</strong> To analyze usage patterns and improve our website and services</li>
              <li><strong>Marketing:</strong> To send promotional offers (only with your consent — you can opt out at any time)</li>
              <li><strong>Legal compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </Section>

          <Section title="4. How We Share Your Information">
            <p>We do not sell your personal information. We may share it with:</p>
            <ul>
              <li><strong>Groomers:</strong> Your pet information and appointment details are shared with the assigned groomer to provide the service</li>
              <li><strong>Service providers:</strong> Third-party vendors who help us operate (e.g., Firebase for authentication and data storage, payment processors). These vendors are contractually obligated to protect your data.</li>
              <li><strong>Legal authorities:</strong> When required by law, court order, or to protect the safety of individuals</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new owner</li>
            </ul>
          </Section>

          <Section title="5. Data Storage and Security">
            <ul>
              <li>Your data is stored securely using Firebase (Google Cloud), which employs industry-standard encryption in transit and at rest.</li>
              <li>Passwords are hashed and never stored in plain text.</li>
              <li>We use HTTPS to encrypt all data transmitted between your browser and our servers.</li>
              <li>We regularly review and update our security practices.</li>
              <li>While we take all reasonable steps to protect your data, no system is 100% secure. Please notify us immediately at <a href="mailto:security@zentivora.com" className="text-orange-500 hover:underline">security@zentivora.com</a> if you suspect a breach.</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <ul>
              <li>We retain your account and appointment data for as long as your account is active or as needed to provide services.</li>
              <li>After account deletion, we retain minimal data for up to 90 days for fraud prevention and legal compliance before permanent deletion.</li>
              <li>Financial transaction records are retained for 7 years as required by law.</li>
            </ul>
          </Section>

          <Section title="7. Cookies">
            <p>We use cookies to:</p>
            <ul>
              <li>Keep you logged in to your account (session cookies)</li>
              <li>Remember your preferences</li>
              <li>Analyze website traffic (analytics cookies)</li>
            </ul>
            <p className="mt-2">You can disable cookies in your browser settings, but some features of the website may not function correctly without them. We do not use third-party advertising cookies.</p>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Ask us to correct inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time using the link in any email</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain types of data processing</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, email us at <a href="mailto:privacy@zentivora.com" className="text-orange-500 hover:underline">privacy@zentivora.com</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Zentivora is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately and we will delete it.</p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any external sites you visit.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on our website. The &quot;Last updated&quot; date at the top of this page will always reflect the most recent revision.</p>
          </Section>

          <Section title="12. Contact Us">
            <p>For privacy-related questions or to exercise your rights:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl text-sm">
              <p className="font-semibold text-gray-900">Zentivora — Privacy Team</p>
              <p className="text-gray-600">Email: <a href="mailto:privacy@zentivora.com" className="text-orange-500 hover:underline">privacy@zentivora.com</a></p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-600">Address: 123 Paw Street, Pet City, PC 45678</p>
            </div>
          </Section>

        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <Link href="/refund" className="text-orange-500 hover:underline">Refund Policy</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3 [&_ul]:list-none [&_ul]:space-y-2 [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['•'] [&_li]:before:text-orange-400 [&_li]:before:font-bold [&_li]:before:shrink-0">
        {children}
      </div>
    </div>
  )
}
