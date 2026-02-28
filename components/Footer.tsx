import Link from 'next/link'
import { Scissors, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to book your dog&apos;s groom?
            </h2>
            <p className="text-orange-100 mt-2">
              Join 500+ happy pet parents. First booking gets 20% off!
            </p>
          </div>
          <Link
            href="/register"
            className="flex-shrink-0 px-8 py-3 bg-white text-orange-600 font-bold rounded-2xl hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 text-lg"
          >
            Book Now — Free Account
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Zenti<span className="text-orange-400">vora</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Premium dog grooming services with certified professionals. Making every pup look and feel their best.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2.5">
              {['Basic Bath & Brush', 'Full Groom Package', 'Puppy First Groom', 'De-Shedding Treatment', 'Luxury Spa Package', 'Nail Trim & File'].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'How It Works',     href: '#how-it-works' },
                { label: 'Our Groomers',     href: '#groomers'     },
                { label: 'Reviews',          href: '#reviews'      },
                { label: 'FAQ',              href: '#faq'          },
                { label: 'About Us',         href: '/about'        },
                { label: 'Contact Us',       href: '/contact'      },
                { label: 'Become a Groomer', href: '/join'         },
                { label: 'Login',            href: '/login'        },
                { label: 'Create Account',   href: '/register'     },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Paw Street, Pet City, PC 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href="mailto:hello@zentivora.com" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                  hello@zentivora.com
                </a>
              </li>
            </ul>

            <div className="mt-5 p-4 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 font-medium mb-1">Business Hours</p>
              <p className="text-sm text-gray-300">Mon–Sat: 8AM – 7PM</p>
              <p className="text-sm text-gray-300">Sunday: 10AM – 5PM</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Zentivora. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-orange-400 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-orange-400 text-xs transition-colors">Terms of Service</Link>
            <Link href="/refund" className="text-gray-500 hover:text-orange-400 text-xs transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
