'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Scissors, LogOut, Calendar, Clock, User, Plus, X, CheckCircle,
  AlertCircle, Home, Star, ChevronRight, Trash2
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import { SERVICES, GROOMERS, type Appointment } from './page'
import { format } from 'date-fns'

type Profile = {
  full_name?: string
  phone?: string
  address?: string
}

type Service = {
  id: string
  name: string
  price: number
  duration: number
  category: string
  description?: string
}

type Groomer = {
  id: string
  name: string
  speciality: string
  rating: number
  experience_years: number
}


type DashboardUser = {
  id: string
  email?: string
  full_name?: string
}

type Props = {
  user: DashboardUser
  profile: Profile | null
  appointments: Appointment[]
  services: Service[]
  groomers: Groomer[]
}

type Tab = 'overview' | 'appointments' | 'book' | 'profile'

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-400' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-400' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-400' },
}

export default function DashboardClient({ user, profile, appointments: initialAppointments, services, groomers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showBookModal, setShowBookModal] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    groomerId: '',
    date: '',
    time: '',
    petName: '',
    petBreed: '',
    petAge: '',
    notes: '',
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [cancelLoading, setCancelLoading] = useState<string | null>(null)
  const router = useRouter()

  const firstName = profile?.full_name?.split(' ')[0] || user.full_name?.split(' ')[0] || 'Pet Parent'

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status))
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status))

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError('')

    const selectedService = services.find(s => s.id === bookingData.serviceId)
    const selectedGroomer = groomers.find(g => g.id === bookingData.groomerId)

    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        user_id:          user.id,
        user_email:       user.email || '',
        service_id:       bookingData.serviceId,
        groomer_id:       bookingData.groomerId || null,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        pet_name:         bookingData.petName,
        pet_breed:        bookingData.petBreed || null,
        pet_age:          bookingData.petAge ? parseInt(bookingData.petAge) : null,
        notes:            bookingData.notes || null,
        total_price:      selectedService?.price ?? 0,
        status:           'pending',
        created_at:       new Date().toISOString(),
      })

      // Fire-and-forget email notification to admin
      fetch('/api/send-appointment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail:       user.email || '',
          petName:         bookingData.petName,
          petBreed:        bookingData.petBreed || '',
          petAge:          bookingData.petAge || '',
          serviceName:     selectedService?.name || 'Unknown Service',
          servicePrice:    selectedService?.price ?? 0,
          serviceDuration: selectedService?.duration ?? 0,
          groomerName:     selectedGroomer?.name || 'Any available groomer',
          date:            bookingData.date,
          time:            bookingData.time,
          notes:           bookingData.notes || '',
          appointmentId:   docRef.id,
        }),
      }).catch(() => {})

      // Add new appointment to local state instantly (no page reload needed)
      const newAppointment: Appointment = {
        id: docRef.id,
        user_id: user.id,
        user_email: user.email || '',
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        status: 'pending',
        pet_name: bookingData.petName,
        pet_breed: bookingData.petBreed || undefined,
        notes: bookingData.notes || undefined,
        total_price: selectedService?.price,
        service_id: bookingData.serviceId,
        groomer_id: bookingData.groomerId || undefined,
        services: selectedService ? { name: selectedService.name, price: selectedService.price, duration: selectedService.duration } : undefined,
        groomers: selectedGroomer ? { name: selectedGroomer.name } : undefined,
      }
      setAppointments(prev => [newAppointment, ...prev])

      setBookingLoading(false)
      setBookingSuccess(true)
      setTimeout(() => {
        setShowBookModal(false)
        setBookingSuccess(false)
        setBookingData({ serviceId: '', groomerId: '', date: '', time: '', petName: '', petBreed: '', petAge: '', notes: '' })
      }, 2000)
    } catch (err: unknown) {
      setBookingLoading(false)
      setBookingError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
    }
  }

  const handleCancel = async (id: string) => {
    setCancelLoading(id)
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' })
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch {
      // Cancel failed silently
    }
    setCancelLoading(null)
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'book', label: 'Book Now', icon: <Plus className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 shadow-sm z-40 flex-col hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Zenti<span className="text-orange-500">vora</span>
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{profile?.full_name || firstName}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'book') { setShowBookModal(true) }
                else { setActiveTab(tab.id) }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id && tab.id !== 'book'
                  ? 'bg-orange-50 text-orange-600 shadow-sm'
                  : tab.id === 'book'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'appointments' && upcoming.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {upcoming.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Zentivora</span>
        </Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 px-2 py-2 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'book') setShowBookModal(true)
              else setActiveTab(tab.id)
            }}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id && tab.id !== 'book'
                ? 'bg-orange-50 text-orange-600'
                : tab.id === 'book'
                ? 'bg-orange-500 text-white'
                : 'text-gray-500'
            }`}
          >
            {tab.icon}
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto p-6">

          {/* ============ OVERVIEW TAB ============ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Greeting */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-extrabold">
                  Welcome back, {firstName}! 🐾
                </h1>
                <p className="text-orange-100 mt-1 text-sm">
                  Manage your pet&apos;s grooming appointments in one place.
                </p>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="mt-4 px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl text-sm hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Book New Appointment
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Bookings', value: appointments.length, emoji: '📋', color: 'bg-blue-50 text-blue-600' },
                  { label: 'Upcoming', value: upcoming.length, emoji: '⏳', color: 'bg-orange-50 text-orange-600' },
                  { label: 'Completed', value: past.filter(a => a.status === 'completed').length, emoji: '✅', color: 'bg-green-50 text-green-600' },
                  { label: 'Total Spent', value: `$${appointments.filter(a => a.status === 'completed').reduce((s, a) => s + (a.total_price || 0), 0)}`, emoji: '💰', color: 'bg-purple-50 text-purple-600' },
                ].map((stat, i) => (
                  <div key={i} className={`rounded-2xl p-5 ${stat.color} border border-white`}>
                    <div className="text-2xl mb-1">{stat.emoji}</div>
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                    <p className="text-xs font-medium opacity-80 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Upcoming Appointments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-sm text-orange-500 font-medium flex items-center gap-1 hover:text-orange-600"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {upcoming.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                    <div className="text-5xl mb-3">🐾</div>
                    <p className="font-semibold text-gray-900 mb-1">No upcoming appointments</p>
                    <p className="text-gray-500 text-sm mb-4">Book your first grooming session today!</p>
                    <button
                      onClick={() => setShowBookModal(true)}
                      className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.slice(0, 3).map((appt) => (
                      <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} cancelLoading={cancelLoading} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ APPOINTMENTS TAB ============ */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-gray-900">My Appointments</h1>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Booking
                </button>
              </div>

              {upcoming.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Upcoming ({upcoming.length})
                  </h2>
                  <div className="space-y-3">
                    {upcoming.map(appt => (
                      <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} cancelLoading={cancelLoading} />
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Past ({past.length})
                  </h2>
                  <div className="space-y-3">
                    {past.map(appt => (
                      <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} cancelLoading={cancelLoading} />
                    ))}
                  </div>
                </div>
              )}

              {appointments.length === 0 && (
                <div className="bg-white rounded-2xl p-14 text-center border border-gray-100">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No appointments yet</p>
                  <p className="text-gray-500 mb-6">Book your first grooming session to get started!</p>
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Book Now 🐾
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============ PROFILE TAB ============ */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-6">
              <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{profile?.full_name || firstName}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">Verified Member</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: profile?.full_name || 'Not set', icon: <User className="w-4 h-4" /> },
                    { label: 'Email', value: user.email || '', icon: <AlertCircle className="w-4 h-4" /> },
                    { label: 'Phone', value: profile?.phone || 'Not set', icon: <Clock className="w-4 h-4" /> },
                    { label: 'Address', value: profile?.address || 'Not set', icon: <Home className="w-4 h-4" /> },
                  ].map((field, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-gray-400">{field.icon}</div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{field.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-gray-50 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
                    <p className="text-xs text-gray-500">Total Bookings</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{past.filter(a => a.status === 'completed').length}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">⭐ VIP</p>
                    <p className="text-xs text-gray-500">Status</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============ BOOKING MODAL ============ */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Book Appointment</h2>
                <p className="text-sm text-gray-500">Fill in your pet&apos;s details below</p>
              </div>
              <button
                onClick={() => { setShowBookModal(false); setBookingError(''); setBookingSuccess(false) }}
                className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-9 h-9 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 text-sm">Your appointment has been booked. You can track it in your dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="p-6 space-y-4">
                {bookingError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {bookingError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Service *</label>
                  <select
                    value={bookingData.serviceId}
                    onChange={e => setBookingData(p => ({ ...p, serviceId: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Choose a service...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — ${s.price} ({s.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Choose Groomer (Optional)</label>
                  <select
                    value={bookingData.groomerId}
                    onChange={e => setBookingData(p => ({ ...p, groomerId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Any available groomer</option>
                    {groomers.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} — ⭐{g.rating} ({g.speciality})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={e => setBookingData(p => ({ ...p, date: e.target.value }))}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time *</label>
                    <select
                      value={bookingData.time}
                      onChange={e => setBookingData(p => ({ ...p, time: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select time</option>
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                        <option key={t} value={t + ':00'}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Name *</label>
                    <input
                      type="text"
                      value={bookingData.petName}
                      onChange={e => setBookingData(p => ({ ...p, petName: e.target.value }))}
                      required
                      placeholder="e.g. Buddy"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Breed</label>
                    <input
                      type="text"
                      value={bookingData.petBreed}
                      onChange={e => setBookingData(p => ({ ...p, petBreed: e.target.value }))}
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Age (years)</label>
                  <input
                    type="number"
                    value={bookingData.petAge}
                    onChange={e => setBookingData(p => ({ ...p, petAge: e.target.value }))}
                    placeholder="e.g. 3"
                    min="0"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Special Instructions</label>
                  <textarea
                    value={bookingData.notes}
                    onChange={e => setBookingData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Any allergies, special requirements, or notes for your groomer..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>

                {bookingData.serviceId && (
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-orange-600 font-medium">Total Price</p>
                      <p className="text-xl font-extrabold text-orange-700">
                        ${services.find(s => s.id === bookingData.serviceId)?.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-orange-600 font-medium">Duration</p>
                      <p className="text-sm font-bold text-orange-700">
                        {services.find(s => s.id === bookingData.serviceId)?.duration} min
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 disabled:opacity-70 text-sm"
                >
                  {bookingLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    'Confirm Booking 🐾'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AppointmentCard({
  appt,
  onCancel,
  cancelLoading,
}: {
  appt: Appointment
  onCancel: (id: string) => void
  cancelLoading: string | null
}) {
  const status = statusConfig[appt.status] || statusConfig.pending

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>
          </div>

          <h3 className="font-bold text-gray-900">{appt.services?.name || 'Grooming Service'}</h3>
          <p className="text-orange-600 text-sm font-medium">🐾 {appt.pet_name}{appt.pet_breed ? ` • ${appt.pet_breed}` : ''}</p>

          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              {format(new Date(appt.appointment_date), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              {appt.appointment_time?.slice(0, 5)}
            </div>
            {appt.groomers && (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <User className="w-3.5 h-3.5 text-orange-400" />
                {appt.groomers.name}
              </div>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-extrabold text-gray-900">${appt.total_price || appt.services?.price || 0}</p>
          {['pending', 'confirmed'].includes(appt.status) && (
            <button
              onClick={() => onCancel(appt.id)}
              disabled={cancelLoading === appt.id}
              className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition-colors ml-auto"
            >
              <Trash2 className="w-3 h-3" />
              {cancelLoading === appt.id ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
