'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Scissors, DollarSign, Calendar, Users, Star, Shield,
  ChevronRight, CheckCircle, Send,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const benefits = [
  { icon: DollarSign, title: 'Earn More',           desc: 'Set your own rates. Top Zentivora groomers earn £2,000–£5,000/month working flexible hours.'         },
  { icon: Calendar,   title: 'Flexible Schedule',   desc: 'Work the days and hours that suit you. You control your calendar — no forced shifts.'                 },
  { icon: Users,      title: 'Ready Customers',     desc: 'Access our growing base of 500+ pet owners actively booking appointments. No cold marketing needed.'  },
  { icon: Shield,     title: 'Insurance Covered',   desc: 'All groomers on our platform are covered under our professional liability insurance.'                 },
  { icon: Star,       title: 'Build Your Reputation', desc: 'Collect verified reviews that help you grow your clientele organically on our platform.'           },
  { icon: Scissors,   title: 'Tools & Support',     desc: 'Get access to training resources, a dedicated support team, and top-grade grooming supplies.'        },
]

const steps = [
  { step: '01', title: 'Apply Online',      desc: 'Fill in your details, upload your certifications, and tell us about your experience.'   },
  { step: '02', title: 'Quick Verification', desc: 'We review your credentials and run a background check (usually 24–48 hours).'          },
  { step: '03', title: 'Profile Live',      desc: 'Your profile goes live on Zentivora and customers can start booking you immediately.'   },
  { step: '04', title: 'Start Earning',     desc: 'Accept bookings, manage your schedule from the app, and get paid directly every week.'   },
]

export default function JoinPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', experience: '', message: '' })
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
        body:    JSON.stringify({
          name:    form.name,
          email:   form.email,
          subject: `Groomer Application – ${form.name}`,
          message: `Phone: ${form.phone}\nExperience: ${form.experience} years\n\n${form.message}`,
        }),
      })
      const json = await res.json()
      if (json.success) setSuccess(true)
      else setError('Something went wrong. Please email us at hello@zentivora.com')
    } catch {
      setError('Cannot connect. Please email us at hello@zentivora.com')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-500 py-20 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Scissors className="w-4 h-4" />
              Join Our Team
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Turn Your Passion Into<br />a Thriving Business
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Join 50+ certified groomers on Zentivora and get access to a stream of ready customers,
              flexible scheduling, and the tools you need to grow your grooming career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Apply Now — It&apos;s Free
                <ChevronRight className="w-5 h-5" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300"
              >
                How It Works
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 max-w-2xl mx-auto">
              {[
                { number: '£2K–5K', label: 'Monthly Earnings' },
                { number: '50+',    label: 'Active Groomers'  },
                { number: '48 hrs', label: 'To Go Live'       },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold">{s.number}</p>
                  <p className="text-orange-200 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">Why Zentivora</span>
              <h2 className="text-3xl font-extrabold text-gray-900">Everything You Need to Succeed</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(b => (
                <div key={b.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 px-4 bg-orange-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">The Process</span>
              <h2 className="text-3xl font-extrabold text-gray-900">From Application to First Booking</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {steps.map(s => (
                <div key={s.step} className="bg-white rounded-2xl p-6 shadow-md flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">What We Look For</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                'Professional grooming certification (any accredited body)',
                'Minimum 2 years hands-on grooming experience',
                'Clean background check',
                'Passion for animal welfare and positive handling techniques',
                'Your own grooming tools (we provide consumables)',
                'Reliable transport to reach our service areas',
              ].map(req => (
                <div key={req} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="py-16 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Apply to Join</h2>
              <p className="text-gray-500">Takes 2 minutes. We&apos;ll get back to you within 48 hours.</p>
            </div>

            {success ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-md">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-500 mb-6">Our team will review your application and contact you within 48 hours.</p>
                <Link href="/" className="text-orange-500 font-bold hover:text-orange-600">← Back to Home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-md space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience *</label>
                    <select required value={form.experience}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50">
                      <option value="">Select...</option>
                      <option value="2-3">2–3 years</option>
                      <option value="4-6">4–6 years</option>
                      <option value="7-10">7–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tell us about yourself</label>
                  <textarea rows={4} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Your specialties, certifications, why you want to join Zentivora..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70">
                  <Send className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
