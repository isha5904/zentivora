'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Star, Shield, Clock, ChevronRight, MapPin } from 'lucide-react'

export default function Hero() {
  const [imgError, setImgError] = useState(false)
  const [city, setCity]         = useState('')
  const router                  = useRouter()

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/register')
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-amber-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-50 rounded-full opacity-60 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
              Rated #1 Dog Grooming Service
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Premium Grooming
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Your Dog Deserves
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Book expert dog grooming services in minutes. Certified groomers, flexible appointments,
                and a tail-wagging experience guaranteed for your furry best friend.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl text-lg hover:shadow-xl hover:shadow-orange-200 transition-all duration-300 hover:-translate-y-1"
              >
                Book Appointment
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-orange-200 text-orange-600 font-bold rounded-2xl text-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
              >
                View Services
              </a>
            </div>

            {/* Location Selector */}
            <form onSubmit={handleCitySearch} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Enter your city..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 bg-white shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
              >
                Find Groomers
              </button>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Certified Groomers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <span className="text-sm font-medium">4.9★ Rated</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main card — dog photo */}
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl shadow-2xl overflow-hidden animate-float border-4 border-white">
                <Image
                  src="/DOG.jpg"
                  alt="Happy groomed dog"
                  width={384}
                  height={384}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -top-6 -left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-fade-in delay-200">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✂️</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-xs text-gray-500">Happy Pets</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-fade-in delay-300">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-xl p-4 animate-fade-in delay-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['🧑', '👩', '👨'].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white text-sm">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">+50 groomers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '500+', label: 'Happy Pets Groomed', emoji: '🐾' },
            { number: '50+', label: 'Expert Groomers', emoji: '✂️' },
            { number: '4.9★', label: 'Average Rating', emoji: '⭐' },
            { number: '100%', label: 'Satisfaction Rate', emoji: '💯' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md border border-orange-50 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <p className="text-2xl font-extrabold text-gray-900">{stat.number}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
