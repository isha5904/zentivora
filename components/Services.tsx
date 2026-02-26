'use client'

import Link from 'next/link'
import { Clock, DollarSign, ArrowRight } from 'lucide-react'

const services = [
  {
    emoji: '🛁',
    name: 'Basic Bath & Brush',
    description: 'Full bath with premium shampoo, blow dry, brush out, and ear cleaning.',
    price: '$35',
    duration: '60 min',
    badge: 'Popular',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    emoji: '✂️',
    name: 'Full Groom Package',
    description: 'Complete grooming: bath, haircut, nail trim, ear cleaning, and teeth brushing.',
    price: '$65',
    duration: '120 min',
    badge: 'Best Value',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    emoji: '🐶',
    name: 'Puppy First Groom',
    description: 'Gentle introduction to grooming for puppies under 6 months.',
    price: '$45',
    duration: '90 min',
    badge: 'New Pets',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    emoji: '💆',
    name: 'De-Shedding Treatment',
    description: 'Specialized treatment to reduce shedding up to 80%.',
    price: '$55',
    duration: '90 min',
    badge: '',
    badgeColor: '',
  },
  {
    emoji: '🌸',
    name: 'Luxury Spa Package',
    description: 'Luxury spa: bath, deep conditioning, massage, pawdicure, and cologne.',
    price: '$85',
    duration: '150 min',
    badge: 'Premium',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    emoji: '💅',
    name: 'Nail Trim & File',
    description: 'Quick nail trim and filing for comfort and safety.',
    price: '$15',
    duration: '20 min',
    badge: 'Quick',
    badgeColor: 'bg-gray-100 text-gray-700',
  },
  {
    emoji: '🦷',
    name: 'Teeth Brushing',
    description: 'Professional teeth cleaning to maintain oral health.',
    price: '$12',
    duration: '15 min',
    badge: '',
    badgeColor: '',
  },
  {
    emoji: '🐛',
    name: 'Flea & Tick Treatment',
    description: 'Medicated bath to eliminate and prevent fleas and ticks.',
    price: '$50',
    duration: '75 min',
    badge: '',
    badgeColor: '',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Grooming Packages for Every Pup
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From quick nail trims to full luxury spa days — we have everything your furry friend needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              <div className="relative z-10">
                {/* Badge */}
                {service.badge && (
                  <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-3 ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="text-4xl mb-4">{service.emoji}</div>

                {/* Info */}
                <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>

                {/* Price & Duration */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-orange-500 font-bold text-lg">
                    <DollarSign className="w-4 h-4" />
                    <span>{service.price.replace('$', '')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                {/* Book Button */}
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 group-hover:gap-3"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
