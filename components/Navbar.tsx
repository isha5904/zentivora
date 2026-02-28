'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Scissors, User, LogOut, Shield } from 'lucide-react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#groomers', label: 'Groomers' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#faq', label: 'FAQ' },
    { href: '/join', label: 'Become a Groomer' },
  ]

  const displayName = user?.displayName?.split(' ')[0] || 'Dashboard'
  const isAdmin = user?.email === 'ishapatharia2004@gmail.com'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Zenti<span className="text-orange-500">vora</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-orange-500 font-medium text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {displayName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-orange-500 font-medium py-2 text-sm"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-orange-600 py-2">
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 py-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-center py-2 text-gray-700 font-medium border border-gray-200 rounded-lg">Login</Link>
                  <Link href="/register" className="text-center py-2 bg-orange-500 text-white font-semibold rounded-lg">Sign Up Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
