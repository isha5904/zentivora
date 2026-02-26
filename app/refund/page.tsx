import Link from 'next/link'
import { Scissors, RefreshCw } from 'lucide-react'

export const metadata = {
  title: 'Refund Policy — Zentivora',
  description: 'Understand Zentivora\'s cancellation and refund policy for pet grooming appointments.',
}

export default function RefundPage() {
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
            <RefreshCw className="w-8 h-8 text-white" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund Policy</h1>
          </div>
          <p className="text-orange-100 text-sm">Last updated: January 1, 2025 &nbsp;·&nbsp; Effective: January 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm text-orange-800">
            We want every experience with Zentivora to be excellent. If something goes wrong, this policy explains exactly how cancellations, rescheduling, and refunds work.
          </div>

          {/* Quick Summary Table */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Quick Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="text-left p-3 font-semibold text-gray-900 border border-orange-100 rounded-tl-xl">Situation</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-orange-100">Refund Amount</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border border-orange-100 rounded-tr-xl">Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Cancelled 24+ hours before appointment', '100% full refund', '5–7 business days'],
                    ['Cancelled less than 24 hours before', '50% refund', '5–7 business days'],
                    ['No-show (no cancellation)', 'No refund', 'N/A'],
                    ['Service not completed due to our fault', '100% full refund', '3–5 business days'],
                    ['Pet refused service (undisclosed behavior)', 'No refund for time spent', 'N/A'],
                    ['Duplicate booking charged', '100% full refund', '3–5 business days'],
                  ].map(([situation, refund, time], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-gray-700 border border-gray-100">{situation}</td>
                      <td className={`p-3 font-semibold border border-gray-100 ${refund.includes('100%') ? 'text-green-600' : refund.includes('50%') ? 'text-yellow-600' : 'text-red-500'}`}>{refund}</td>
                      <td className="p-3 text-gray-500 border border-gray-100">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Section title="1. Cancellation Policy">
            <ul>
              <li><strong>Free cancellation:</strong> Cancel at least 24 hours before your appointment start time for a full refund with no questions asked.</li>
              <li><strong>Late cancellation:</strong> Cancellations made less than 24 hours before the appointment time will receive a 50% refund. The remaining 50% covers the groomer&apos;s reserved time.</li>
              <li><strong>Emergency cancellations:</strong> In genuine emergencies (e.g., hospitalization), we will waive the cancellation fee at our discretion. Please contact us as soon as possible with documentation if available.</li>
            </ul>
            <p className="mt-2">To cancel, log in to your dashboard and click &quot;Cancel&quot; on the appointment, or email us at <a href="mailto:support@zentivora.com" className="text-orange-500 hover:underline">support@zentivora.com</a>.</p>
          </Section>

          <Section title="2. No-Show Policy">
            <ul>
              <li>If you do not arrive within 15 minutes of your scheduled appointment time without prior notice, it will be considered a no-show.</li>
              <li>No-shows are not eligible for a refund.</li>
              <li>After two no-shows, we reserve the right to require prepayment for future bookings or to suspend your account.</li>
            </ul>
          </Section>

          <Section title="3. Rescheduling Policy">
            <ul>
              <li><strong>Free rescheduling:</strong> You may reschedule your appointment at no cost up to 24 hours before the scheduled time, subject to availability.</li>
              <li><strong>Late rescheduling:</strong> Rescheduling requests made less than 24 hours in advance may be treated as a late cancellation and a new booking, depending on availability.</li>
              <li>You can reschedule through your dashboard or by contacting us directly.</li>
            </ul>
          </Section>

          <Section title="4. Service Quality Guarantee">
            <ul>
              <li><strong>Satisfaction guarantee:</strong> If you are unhappy with the quality of grooming, contact us within 48 hours of the appointment with a description of the issue and photos if possible.</li>
              <li><strong>Re-groom:</strong> We will offer a free re-groom service within 7 days as our first resolution.</li>
              <li><strong>Partial refund:</strong> If a re-groom is not practical, we may offer a partial refund of 25–50% at our discretion.</li>
              <li><strong>Full refund:</strong> A full refund is provided only if the service was not completed due to our failure or if the groomer caused verified injury to your pet.</li>
            </ul>
          </Section>

          <Section title="5. Incidents During Grooming">
            <ul>
              <li>If your pet is injured during grooming due to our negligence, we will cover reasonable veterinary costs (up to the cost of the grooming service) and issue a full refund.</li>
              <li>Injuries resulting from undisclosed pet behavior (biting, extreme anxiety, movement during sensitive procedures) are not covered.</li>
              <li>All incidents are documented and we will contact you immediately if anything occurs.</li>
            </ul>
          </Section>

          <Section title="6. Prepayment and Deposits">
            <ul>
              <li>Some services or new customers may be required to pay a deposit at the time of booking.</li>
              <li>Deposits are fully refundable if the appointment is cancelled 24 hours in advance.</li>
              <li>Deposits are non-refundable for late cancellations and no-shows.</li>
            </ul>
          </Section>

          <Section title="7. How Refunds Are Processed">
            <ul>
              <li>Refunds are returned to the original payment method used at the time of booking.</li>
              <li>Processing time is typically 5–7 business days, depending on your bank or card provider.</li>
              <li>We do not offer cash refunds for online bookings.</li>
              <li>You will receive an email confirmation once a refund has been issued.</li>
            </ul>
          </Section>

          <Section title="8. How to Request a Refund">
            <p>To request a refund, please contact our support team:</p>
            <ul>
              <li>Email: <a href="mailto:support@zentivora.com" className="text-orange-500 hover:underline">support@zentivora.com</a></li>
              <li>Include your full name, appointment ID, and reason for the refund request</li>
              <li>We aim to respond to all refund requests within 2 business days</li>
            </ul>
          </Section>

          <Section title="9. Exceptions">
            <p>Refunds will not be issued for:</p>
            <ul>
              <li>Services that were completed as described and to a professional standard</li>
              <li>Dissatisfaction with a haircut style that was clearly requested by the customer</li>
              <li>Situations where inaccurate or incomplete pet information was provided</li>
              <li>Requests made more than 7 days after the service date</li>
            </ul>
          </Section>

          <Section title="10. Contact Us">
            <p>For refund or cancellation questions:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl text-sm">
              <p className="font-semibold text-gray-900">Zentivora — Support Team</p>
              <p className="text-gray-600">Email: <a href="mailto:support@zentivora.com" className="text-orange-500 hover:underline">support@zentivora.com</a></p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-600">Hours: Mon–Sat 8AM–7PM, Sunday 10AM–5PM</p>
            </div>
          </Section>

        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
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
