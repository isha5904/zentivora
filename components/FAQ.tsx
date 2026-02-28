'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'Simply create a free account, choose your preferred service, pick a date and time, select a groomer, and confirm your booking. The entire process takes less than 3 minutes!',
  },
  {
    question: 'Are your groomers certified and background-checked?',
    answer: 'Absolutely! All Zentivora groomers hold professional certifications and have undergone thorough background verification. They also have a minimum of 5 years of hands-on grooming experience.',
  },
  {
    question: 'What do I need to bring for my dog\'s appointment?',
    answer: 'Please bring your dog\'s vaccination records (rabies is required), any special shampoos or conditioners if your dog has skin sensitivities, and a favorite toy if it helps your dog feel comfortable.',
  },
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking 3-7 days in advance for regular appointments. However, we often have same-day and next-day slots available. Weekend appointments book up quickly, so plan ahead!',
  },
  {
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Yes! You can cancel or reschedule up to 24 hours before your appointment at no charge through your dashboard. Late cancellations (less than 24 hours) may incur a small fee.',
  },
  {
    question: 'What if my dog is anxious about grooming?',
    answer: 'We specialize in handling anxious dogs! Let us know when booking, and we\'ll assign one of our gentle-care specialists. We use positive reinforcement techniques and take as many breaks as needed.',
  },
  {
    question: 'Do you offer grooming for all dog breeds and sizes?',
    answer: 'Yes! From tiny Chihuahuas to giant Great Danes, we groom all breeds and sizes. Our groomers have specialized experience with different coat types including curly, double-coated, and wiry coats.',
  },
  {
    question: 'How do I track my appointment status?',
    answer: 'Log into your Zentivora dashboard to see real-time status updates on your appointment: Pending → Confirmed → In Progress → Completed. You\'ll also receive email notifications at each stage.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'You can cancel or reschedule free of charge up to 24 hours before your appointment via your dashboard. Cancellations made less than 24 hours before the scheduled time may incur a 50% cancellation fee. No-shows are charged the full service price. We understand emergencies happen — contact us and we\'ll do our best to accommodate you.',
  },
  {
    question: 'What should I expect on my first visit?',
    answer: 'On your first visit, arrive 5–10 minutes early to complete a quick check-in form about your dog\'s health and temperament. Bring vaccination records (rabies certificate required), your dog\'s usual treats, and any favourite toys for comfort. Our groomer will walk you through the planned service before starting. Drop-off typically takes 5 minutes and you\'ll receive a notification when your pup is ready for pick-up.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Have more questions? We&apos;re happy to help. Contact us anytime.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'border-orange-200 shadow-md' : 'border-gray-100 hover:border-orange-100'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-orange-50 transition-colors duration-200"
              >
                <span className={`font-semibold text-sm sm:text-base ${openIndex === i ? 'text-orange-600' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-orange-400 flex-shrink-0 ml-4 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 bg-white">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
