import Link from 'next/link'
import { Scissors, FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Zentivora',
  description: 'Read the Terms of Service for Zentivora pet grooming services.',
}

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-white" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          </div>
          <p className="text-orange-100 text-sm">Last updated: January 1, 2025 &nbsp;·&nbsp; Effective: January 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm text-orange-800">
            Please read these Terms of Service carefully before using Zentivora. By booking an appointment or creating an account, you agree to be bound by these terms.
          </div>

          <Section title="1. About Zentivora">
            <p>Zentivora (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a professional pet grooming service that connects pet owners with certified dog groomers. These Terms of Service (&quot;Terms&quot;) govern your use of our website at zentivora.com and any related services.</p>
          </Section>

          <Section title="2. Eligibility">
            <ul>
              <li>You must be at least 18 years old to create an account or book services.</li>
              <li>By using our services, you confirm that the information you provide is accurate and complete.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>One person may not maintain more than one active account.</li>
            </ul>
          </Section>

          <Section title="3. Booking and Appointments">
            <ul>
              <li><strong>Confirmation:</strong> A booking is confirmed only when you receive a confirmation email or see it reflected in your dashboard.</li>
              <li><strong>Cancellations:</strong> You may cancel an appointment up to 24 hours before the scheduled time at no charge. Late cancellations (less than 24 hours) may be subject to a cancellation fee of up to 50% of the service price.</li>
              <li><strong>No-shows:</strong> If you do not show up for a confirmed appointment without prior cancellation, the full service price may be charged.</li>
              <li><strong>Rescheduling:</strong> Appointments may be rescheduled at no cost up to 24 hours in advance, subject to availability.</li>
              <li><strong>Pricing:</strong> All prices listed on the website are in USD and are subject to change. The price displayed at the time of booking is the price you will be charged.</li>
            </ul>
          </Section>

          <Section title="4. Pet Owner Responsibilities">
            <ul>
              <li><strong>Health:</strong> You confirm that your pet is in good health and up to date on all required vaccinations (including Rabies, Distemper, and Bordetella) before each grooming session.</li>
              <li><strong>Disclosure:</strong> You must inform us of any known health conditions, behavioral issues, allergies, or special requirements your pet has before the appointment.</li>
              <li><strong>Aggressive behavior:</strong> We reserve the right to refuse service or stop a grooming session at any time if a pet poses a safety risk to our staff or other animals. In such cases, you will be charged for the time spent.</li>
              <li><strong>Senior or medically fragile pets:</strong> Grooming can be stressful for elderly or ill animals. We will take precautions, but we are not liable for stress-related health events in pets with undisclosed pre-existing conditions.</li>
            </ul>
          </Section>

          <Section title="5. Our Service Standards">
            <ul>
              <li>All groomers are trained professionals and will treat your pet with care and respect.</li>
              <li>We use pet-safe, veterinarian-recommended grooming products.</li>
              <li>We will notify you immediately if any injury, accident, or health concern arises during grooming.</li>
              <li>We reserve the right to refuse service to any pet or person for safety, health, or behavioral reasons.</li>
            </ul>
          </Section>

          <Section title="6. Limitation of Liability">
            <ul>
              <li>Zentivora is not liable for any injury, illness, or death of a pet that arises from an undisclosed pre-existing medical condition.</li>
              <li>Our maximum liability for any claim related to a grooming service is limited to the amount paid for that specific service.</li>
              <li>We are not responsible for any indirect, incidental, or consequential damages arising from the use of our services.</li>
            </ul>
          </Section>

          <Section title="7. User Accounts">
            <ul>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              <li>We may delete inactive accounts after 12 months of inactivity.</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content on the Zentivora website, including text, graphics, logos, and images, is the property of Zentivora and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>
          </Section>

          <Section title="9. Changes to These Terms">
            <p>We may update these Terms from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page. Continued use of our services after changes are posted constitutes your acceptance of the revised Terms.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms will be resolved through good-faith negotiation. If unresolved, disputes will be submitted to binding arbitration.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl text-sm">
              <p className="font-semibold text-gray-900">Zentivora</p>
              <p className="text-gray-600">Email: <a href="mailto:legal@zentivora.com" className="text-orange-500 hover:underline">legal@zentivora.com</a></p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-600">Address: 123 Paw Street, Pet City, PC 45678</p>
            </div>
          </Section>

        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
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
