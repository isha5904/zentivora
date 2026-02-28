import Link from 'next/link'
import { Scissors, Heart, Shield, Star, Users, Award, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const team = [
  { name: 'Sarah Johnson', role: 'Lead Groomer – Large Breeds',   emoji: '👩', years: 8,  bio: 'Certified master groomer with a passion for gentle handling of big dogs.' },
  { name: 'Mike Chen',     role: 'Groomer – Small Breeds',        emoji: '🧑', years: 5,  bio: 'Specialises in toy breeds and anxiety-free grooming experiences.' },
  { name: 'Emma Davis',    role: 'Groomer – Doodles & Poodles',   emoji: '👩', years: 10, bio: 'Award-winning stylist for curly and double-coated breeds.' },
  { name: 'Carlos Rivera', role: 'Groomer – Senior Dogs',         emoji: '👨', years: 6,  bio: 'Expert in gentle, low-stress care for older and mobility-limited dogs.' },
]

const values = [
  { icon: Heart,  title: 'Pet First',     desc: 'Every decision we make starts with your dog\'s comfort and wellbeing.'          },
  { icon: Shield, title: 'Safety Always', desc: 'Certified groomers, sanitised equipment, and vet-grade products every time.'    },
  { icon: Star,   title: 'Excellence',    desc: 'We don\'t just groom — we give your dog an experience they\'ll love.'          },
  { icon: Users,  title: 'Community',     desc: 'Built by pet lovers, for pet lovers. We treat every dog like our own.'         },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Scissors className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Built by Dog Lovers,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">For Dog Lovers</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Zentivora was founded with one simple belief — every dog deserves to be treated with expert care,
              patience, and love. We set out to make premium grooming accessible, transparent, and stress-free
              for both pets and their owners.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We started as a small team of certified groomers tired of seeing dogs treated as just another number.
                We believed that booking a grooming appointment should be as easy as ordering food online — and
                the experience itself should feel like a spa day for your pup.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, Zentivora connects hundreds of pet owners with verified, background-checked groomers who
                genuinely care. Our platform tracks every appointment in real time, so you always know exactly
                what's happening with your furry family member.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { number: '500+', label: 'Happy Pets' },
                  { number: '50+',  label: 'Groomers'   },
                  { number: '4.9★', label: 'Rating'     },
                ].map(s => (
                  <div key={s.label} className="bg-orange-50 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-orange-600">{s.number}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map(v => (
                <div key={v.title} className="bg-gray-50 rounded-2xl p-5">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                    <v.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">Our Team</span>
              <h2 className="text-3xl font-extrabold text-gray-900">Meet the Groomers</h2>
              <p className="text-gray-600 mt-2">Certified professionals who love dogs as much as you do.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(member => (
                <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {member.emoji}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-orange-500 text-xs font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{member.bio}</p>
                  <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                    <Award className="w-3 h-3" />
                    {member.years} yrs experience
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ready to meet our team in person?</h2>
          <p className="text-gray-500 mb-8">Book your dog's first appointment today — it takes under 3 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-orange-200 transition-all duration-300 hover:-translate-y-1"
            >
              Book Appointment
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-orange-200 text-orange-600 font-bold rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
