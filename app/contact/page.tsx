'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Scissors } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Cannot connect. Please email us directly at hello@zentivora.com')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Scissors className="w-4 h-4" />
              Get In Touch
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              We&apos;d Love to <span className="text-orange-500">Hear From You</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Have a question about a booking, a special request, or just want to say hi?
              Our team typically replies within a few hours.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Contact Details</h2>
                <p className="text-gray-500 text-sm">Reach us through any of the channels below.</p>
              </div>

              {[
                { icon: Mail,    label: 'Email',    value: 'hello@zentivora.com',  href: 'mailto:hello@zentivora.com' },
                { icon: Phone,   label: 'Phone',    value: '+1 (555) 123-4567',    href: 'tel:+15551234567'           },
                { icon: MapPin,  label: 'Location', value: '123 Paw Street, Pet City, PC 45678', href: '#'          },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">{item.label}</p>
                    <a href={item.href} className="text-gray-900 font-medium text-sm hover:text-orange-500 transition-colors">
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <p className="font-bold text-gray-900 text-sm">Business Hours</p>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">8 AM – 7 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium">9 AM – 6 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="font-medium">10 AM – 5 PM</span></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Message Received!</h3>
                  <p className="text-gray-500 mb-6">We&apos;ll get back to you within a few hours. Check your email for confirmation.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 space-y-5">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="e.g. Booking question, special request..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help you and your pup..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Or email us directly at{' '}
                    <a href="mailto:hello@zentivora.com" className="text-orange-500 hover:underline">hello@zentivora.com</a>
                  </p>
                </form>
              )}
            </div>

          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-12 px-4 bg-orange-50 text-center">
          <p className="text-gray-700 font-medium mb-3">Looking for quick answers?</p>
          <Link href="/#faq" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
            Visit our FAQ section →
          </Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
