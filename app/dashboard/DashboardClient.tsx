'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Scissors, LogOut, Calendar, Clock, User, Plus, X, CheckCircle,
  AlertCircle, Home, Star, ChevronRight, Trash2, Shield, Edit2,
  RefreshCw,
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { SERVICES, GROOMERS, type Appointment } from './page'
import { format } from 'date-fns'

/* ─── Types ─── */
type Profile = { full_name?: string; phone?: string; address?: string }
type Service  = { id: string; name: string; price: number; duration: number; category: string; description?: string }
type Groomer  = { id: string; name: string; speciality: string; rating: number; experience_years: number }
type DashboardUser = { id: string; email?: string; full_name?: string }
type Tab      = 'overview' | 'appointments' | 'pets' | 'profile'

type Pet = {
  id: string
  name: string
  breed?: string
  age?: number
  temperament?: string
  notes?: string
}

type Props = {
  user: DashboardUser
  profile: Profile | null
  appointments: Appointment[]
  services: Service[]
  groomers: Groomer[]
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:   { label: 'Pending',   color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700',   bg: 'bg-blue-50',   dot: 'bg-blue-400'   },
  completed: { label: 'Completed', color: 'text-green-700',  bg: 'bg-green-50',  dot: 'bg-green-400'  },
  cancelled: { label: 'Cancelled', color: 'text-red-700',    bg: 'bg-red-50',    dot: 'bg-red-400'    },
}

function getCountdown(dateStr: string, timeStr: string): string {
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const apptDate = new Date(dateStr)
    apptDate.setHours(h, m, 0, 0)
    const diff = apptDate.getTime() - Date.now()
    if (diff <= 0) return 'Today!'
    const days  = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    if (days > 0) return `${days}d ${hours}h away`
    const mins = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${mins}m away`
  } catch { return '' }
}

/* ═══════════════════════════════════════════════════════════════ */
export default function DashboardClient({ user, profile, appointments: initialAppointments, services, groomers }: Props) {
  const [activeTab, setActiveTab]       = useState<Tab>('overview')
  const [showBookModal, setShowBookModal] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)

  /* Booking state */
  const [bookingData, setBookingData] = useState({
    serviceId: '', groomerId: '', date: '', time: '',
    petName: '', petBreed: '', petAge: '', notes: '',
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError]     = useState('')
  const [cancelLoading, setCancelLoading]   = useState<string | null>(null)

  /* Pet state */
  const [pets, setPets]               = useState<Pet[]>([])
  const [petsLoading, setPetsLoading] = useState(false)
  const [showPetModal, setShowPetModal] = useState(false)
  const [editingPet, setEditingPet]   = useState<Pet | null>(null)
  const [petForm, setPetForm]         = useState({ name: '', breed: '', age: '', temperament: 'friendly', notes: '' })
  const [petSaving, setPetSaving]     = useState(false)

  /* Review state */
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewingAppt, setReviewingAppt]     = useState<Appointment | null>(null)
  const [reviewRating, setReviewRating]       = useState(5)
  const [reviewComment, setReviewComment]     = useState('')
  const [reviewSaving, setReviewSaving]       = useState(false)
  const [reviewedIds, setReviewedIds]         = useState<Set<string>>(new Set())

  const router    = useRouter()
  const firstName = profile?.full_name?.split(' ')[0] || user.full_name?.split(' ')[0] || 'Pet Parent'
  const upcoming  = appointments.filter(a => ['pending', 'confirmed'].includes(a.status))
  const past      = appointments.filter(a => ['completed', 'cancelled'].includes(a.status))
  const nextAppt  = upcoming.sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0]

  /* Fetch pets */
  useEffect(() => {
    const fetchPets = async () => {
      setPetsLoading(true)
      try {
        const res  = await fetch(`/api/pets?uid=${user.id}`)
        const json = await res.json()
        if (json.success) setPets(json.pets)
      } catch { /* silent */ }
      setPetsLoading(false)
    }
    fetchPets()
  }, [user.id])

  const handleLogout = async () => { await signOut(auth); router.push('/') }

  /* ── Booking ── */
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError('')
    const selectedService = services.find(s => s.id === bookingData.serviceId)
    const selectedGroomer = groomers.find(g => g.id === bookingData.groomerId)
    try {
      const res    = await fetch('/api/book-appointment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, userEmail: user.email || '',
          serviceId: bookingData.serviceId, groomerId: bookingData.groomerId || null,
          date: bookingData.date, time: bookingData.time,
          petName: bookingData.petName, petBreed: bookingData.petBreed || '',
          petAge: bookingData.petAge || '', notes: bookingData.notes || '',
          totalPrice: selectedService?.price ?? 0,
        }),
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error || 'Booking failed')

      fetch('/api/send-appointment-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email || '', petName: bookingData.petName,
          petBreed: bookingData.petBreed || '', petAge: bookingData.petAge || '',
          serviceName: selectedService?.name || '', servicePrice: selectedService?.price ?? 0,
          serviceDuration: selectedService?.duration ?? 0,
          groomerName: selectedGroomer?.name || 'Any available groomer',
          date: bookingData.date, time: bookingData.time,
          notes: bookingData.notes || '', appointmentId: result.id,
        }),
      }).catch(() => {})

      const newAppt: Appointment = {
        id: result.id as string, user_id: user.id, user_email: user.email || '',
        appointment_date: bookingData.date, appointment_time: bookingData.time,
        status: 'pending', pet_name: bookingData.petName,
        pet_breed: bookingData.petBreed || undefined, notes: bookingData.notes || undefined,
        total_price: selectedService?.price, service_id: bookingData.serviceId,
        groomer_id: bookingData.groomerId || undefined,
        services: selectedService ? { name: selectedService.name, price: selectedService.price, duration: selectedService.duration } : undefined,
        groomers: selectedGroomer ? { name: selectedGroomer.name } : undefined,
      }
      setAppointments(prev => [newAppt, ...prev])
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

  const handleBookAgain = (appt: Appointment) => {
    setBookingData({
      serviceId: appt.service_id, groomerId: appt.groomer_id || '',
      date: '', time: '',
      petName: appt.pet_name, petBreed: appt.pet_breed || '',
      petAge: '', notes: appt.notes || '',
    })
    setShowBookModal(true)
  }

  const handleCancel = async (id: string) => {
    setCancelLoading(id)
    try {
      const res  = await fetch('/api/update-appointment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'cancelled' }),
      })
      const json = await res.json()
      if (json.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch { /* silent */ }
    setCancelLoading(null)
  }

  /* ── Pets ── */
  const openAddPet = () => {
    setEditingPet(null)
    setPetForm({ name: '', breed: '', age: '', temperament: 'friendly', notes: '' })
    setShowPetModal(true)
  }
  const openEditPet = (pet: Pet) => {
    setEditingPet(pet)
    setPetForm({ name: pet.name, breed: pet.breed || '', age: pet.age?.toString() || '', temperament: pet.temperament || 'friendly', notes: pet.notes || '' })
    setShowPetModal(true)
  }
  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault()
    setPetSaving(true)
    try {
      const body = { uid: user.id, ...petForm, id: editingPet?.id }
      const res  = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (json.success) {
        const saved: Pet = { id: json.id, name: petForm.name, breed: petForm.breed, age: petForm.age ? Number(petForm.age) : undefined, temperament: petForm.temperament, notes: petForm.notes }
        if (editingPet) {
          setPets(prev => prev.map(p => p.id === editingPet.id ? saved : p))
        } else {
          setPets(prev => [...prev, saved])
        }
        setShowPetModal(false)
      }
    } catch { /* silent */ }
    setPetSaving(false)
  }
  const handleDeletePet = async (id: string) => {
    try {
      await fetch(`/api/pets?uid=${user.id}&petId=${id}`, { method: 'DELETE' })
      setPets(prev => prev.filter(p => p.id !== id))
    } catch { /* silent */ }
  }

  /* ── Reviews ── */
  const openReview = (appt: Appointment) => {
    setReviewingAppt(appt)
    setReviewRating(5)
    setReviewComment('')
    setShowReviewModal(true)
  }
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewingAppt) return
    setReviewSaving(true)
    try {
      const res  = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: reviewingAppt.id, userId: user.id, groomerId: reviewingAppt.groomer_id || '', rating: reviewRating, comment: reviewComment }),
      })
      const json = await res.json()
      if (json.success) {
        setReviewedIds(prev => new Set([...prev, reviewingAppt.id]))
        setShowReviewModal(false)
      }
    } catch { /* silent */ }
    setReviewSaving(false)
  }

  /* ── Tabs ── */
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',      label: 'Overview',     icon: <Home className="w-4 h-4" />     },
    { id: 'appointments',  label: 'Appointments',  icon: <Calendar className="w-4 h-4" /> },
    { id: 'pets',          label: 'My Pets',       icon: <span className="text-base leading-none">🐾</span> },
    { id: 'profile',       label: 'My Profile',    icon: <User className="w-4 h-4" />     },
  ]

  /* ════════════════════════════════════════ RENDER ════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 shadow-sm z-40 flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Zenti<span className="text-orange-500">vora</span></span>
          </Link>
        </div>

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

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-orange-50 text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'appointments' && upcoming.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">{upcoming.length}</span>
              )}
              {tab.id === 'pets' && pets.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-gray-200 text-gray-600 text-xs rounded-full flex items-center justify-center">{pets.length}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowBookModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Book Now
          </button>
        </nav>

        <div className="p-4 space-y-1">
          {user.email === 'ishapatharia2004@gmail.com' && (
            <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all duration-200">
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Zentivora</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBookModal(true)} className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Mobile Tab Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 px-2 py-2 flex gap-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-orange-50 text-orange-600' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto p-6">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Greeting */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-extrabold">Welcome back, {firstName}! 🐾</h1>
                <p className="text-orange-100 mt-1 text-sm">Manage your pet&apos;s grooming appointments in one place.</p>
                <button onClick={() => setShowBookModal(true)} className="mt-4 px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl text-sm hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Book New Appointment
                </button>
              </div>

              {/* Next Appointment Countdown */}
              {nextAppt && (
                <div className="bg-white rounded-2xl p-5 border-2 border-orange-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      Next Appointment
                    </h2>
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                      {getCountdown(nextAppt.appointment_date, nextAppt.appointment_time)}
                    </span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-lg">{nextAppt.services?.name || 'Grooming Service'}</p>
                  <p className="text-orange-500 text-sm font-medium">🐾 {nextAppt.pet_name}{nextAppt.pet_breed ? ` • ${nextAppt.pet_breed}` : ''}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      {format(new Date(nextAppt.appointment_date), 'EEE, MMM d')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {nextAppt.appointment_time?.slice(0, 5)}
                    </span>
                    {nextAppt.groomers && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-orange-400" />
                        {nextAppt.groomers.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

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

              {/* My Pets quick view */}
              {pets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900">My Pets</h2>
                    <button onClick={() => setActiveTab('pets')} className="text-sm text-orange-500 font-medium flex items-center gap-1 hover:text-orange-600">
                      Manage <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {pets.slice(0, 4).map(pet => (
                      <div key={pet.id} className="bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-2">
                        <span className="text-xl">🐶</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{pet.name}</p>
                          {pet.breed && <p className="text-xs text-gray-400">{pet.breed}</p>}
                        </div>
                      </div>
                    ))}
                    <button onClick={openAddPet} className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-orange-500 hover:bg-orange-100 transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" />
                      Add Pet
                    </button>
                  </div>
                </div>
              )}

              {/* Upcoming Appointments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                  <button onClick={() => setActiveTab('appointments')} className="text-sm text-orange-500 font-medium flex items-center gap-1 hover:text-orange-600">
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {upcoming.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                    <div className="text-5xl mb-3">🐾</div>
                    <p className="font-semibold text-gray-900 mb-1">No upcoming appointments</p>
                    <p className="text-gray-500 text-sm mb-4">Book your first grooming session today!</p>
                    <button onClick={() => setShowBookModal(true)} className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
                      Book Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.slice(0, 3).map(appt => (
                      <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} onBookAgain={handleBookAgain} onReview={openReview} cancelLoading={cancelLoading} reviewedIds={reviewedIds} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS TAB ── */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-gray-900">My Appointments</h1>
                <button onClick={() => setShowBookModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
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
                      <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} onBookAgain={handleBookAgain} onReview={openReview} cancelLoading={cancelLoading} reviewedIds={reviewedIds} />
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
                      <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} onBookAgain={handleBookAgain} onReview={openReview} cancelLoading={cancelLoading} reviewedIds={reviewedIds} />
                    ))}
                  </div>
                </div>
              )}

              {appointments.length === 0 && (
                <div className="bg-white rounded-2xl p-14 text-center border border-gray-100">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No appointments yet</p>
                  <p className="text-gray-500 mb-6">Book your first grooming session to get started!</p>
                  <button onClick={() => setShowBookModal(true)} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                    Book Now 🐾
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PETS TAB ── */}
          {activeTab === 'pets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">My Pets</h1>
                  <p className="text-gray-500 text-sm mt-1">Save your pets' info for faster booking</p>
                </div>
                <button onClick={openAddPet} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                  Add Pet
                </button>
              </div>

              {petsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-orange-400 animate-spin" />
                </div>
              ) : pets.length === 0 ? (
                <div className="bg-white rounded-2xl p-14 text-center border border-gray-100">
                  <div className="text-6xl mb-4">🐶</div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No pets added yet</p>
                  <p className="text-gray-500 mb-6">Add your pet's profile to speed up future bookings!</p>
                  <button onClick={openAddPet} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                    Add My First Pet 🐾
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pets.map(pet => (
                    <div key={pet.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🐶</div>
                        <div className="flex gap-1">
                          <button onClick={() => openEditPet(pet)} className="w-8 h-8 bg-gray-100 hover:bg-orange-50 hover:text-orange-500 rounded-lg flex items-center justify-center transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeletePet(pet.id)} className="w-8 h-8 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{pet.name}</h3>
                      {pet.breed && <p className="text-orange-500 text-sm font-medium">{pet.breed}</p>}
                      <div className="mt-3 space-y-1">
                        {pet.age && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-4">🎂</span>
                            <span>{pet.age} years old</span>
                          </div>
                        )}
                        {pet.temperament && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-4">💭</span>
                            <span className="capitalize">{pet.temperament}</span>
                          </div>
                        )}
                        {pet.notes && (
                          <div className="text-xs text-gray-400 italic mt-2 bg-gray-50 rounded-lg p-2">
                            &quot;{pet.notes}&quot;
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setBookingData(prev => ({ ...prev, petName: pet.name, petBreed: pet.breed || '' }))
                          setShowBookModal(true)
                        }}
                        className="mt-4 w-full py-2 bg-orange-50 text-orange-600 font-semibold text-xs rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        Book for {pet.name}
                      </button>
                    </div>
                  ))}

                  {/* Add new pet card */}
                  <button onClick={openAddPet} className="bg-white rounded-2xl p-5 border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-center group">
                    <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Plus className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="font-semibold text-orange-500 text-sm">Add Another Pet</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ── */}
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
                    { label: 'Email',     value: user.email || '',                 icon: <AlertCircle className="w-4 h-4" /> },
                    { label: 'Phone',     value: profile?.phone || 'Not set',      icon: <Clock className="w-4 h-4" /> },
                    { label: 'Address',   value: profile?.address || 'Not set',    icon: <Home className="w-4 h-4" /> },
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
                    <p className="text-xl font-bold text-gray-900">{pets.length}</p>
                    <p className="text-xs text-gray-500">Pets Registered</p>
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

      {/* ══════════════════ BOOKING MODAL ══════════════════ */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Book Appointment</h2>
                <p className="text-sm text-gray-500">Fill in your pet&apos;s details below</p>
              </div>
              <button onClick={() => { setShowBookModal(false); setBookingError(''); setBookingSuccess(false) }}
                className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
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
                    <AlertCircle className="w-4 h-4 shrink-0" />{bookingError}
                  </div>
                )}

                {/* Quick fill from saved pets */}
                {pets.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quick Fill from My Pets</label>
                    <div className="flex gap-2 flex-wrap">
                      {pets.map(pet => (
                        <button key={pet.id} type="button"
                          onClick={() => setBookingData(p => ({ ...p, petName: pet.name, petBreed: pet.breed || '' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${bookingData.petName === pet.name ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'}`}
                        >
                          🐶 {pet.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Service *</label>
                  <select value={bookingData.serviceId} onChange={e => setBookingData(p => ({ ...p, serviceId: e.target.value }))} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white">
                    <option value="">Choose a service...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price} ({s.duration} min)</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Choose Groomer (Optional)</label>
                  <select value={bookingData.groomerId} onChange={e => setBookingData(p => ({ ...p, groomerId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white">
                    <option value="">Any available groomer</option>
                    {groomers.map(g => <option key={g.id} value={g.id}>{g.name} — ⭐{g.rating} ({g.speciality})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
                    <input type="date" value={bookingData.date} onChange={e => setBookingData(p => ({ ...p, date: e.target.value }))} required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time *</label>
                    <select value={bookingData.time} onChange={e => setBookingData(p => ({ ...p, time: e.target.value }))} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white">
                      <option value="">Select time</option>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => (
                        <option key={t} value={t + ':00'}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Name *</label>
                    <input type="text" value={bookingData.petName} onChange={e => setBookingData(p => ({ ...p, petName: e.target.value }))} required placeholder="e.g. Buddy"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Breed</label>
                    <input type="text" value={bookingData.petBreed} onChange={e => setBookingData(p => ({ ...p, petBreed: e.target.value }))} placeholder="e.g. Golden Retriever"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Age (years)</label>
                  <input type="number" value={bookingData.petAge} onChange={e => setBookingData(p => ({ ...p, petAge: e.target.value }))} placeholder="e.g. 3" min="0" max="20"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Special Instructions</label>
                  <textarea value={bookingData.notes} onChange={e => setBookingData(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Any allergies, special requirements..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white resize-none" />
                </div>

                {bookingData.serviceId && (
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between">
                    <div><p className="text-xs text-orange-600 font-medium">Total Price</p>
                      <p className="text-xl font-extrabold text-orange-700">${services.find(s => s.id === bookingData.serviceId)?.price}</p></div>
                    <div className="text-right"><p className="text-xs text-orange-600 font-medium">Duration</p>
                      <p className="text-sm font-bold text-orange-700">{services.find(s => s.id === bookingData.serviceId)?.duration} min</p></div>
                  </div>
                )}

                <button type="submit" disabled={bookingLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 disabled:opacity-70 text-sm">
                  {bookingLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Booking...
                    </span>
                  ) : 'Confirm Booking 🐾'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════ PET MODAL ══════════════════ */}
      {showPetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900">{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
              <button onClick={() => setShowPetModal(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSavePet} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pet Name *</label>
                  <input type="text" required value={petForm.name} onChange={e => setPetForm(p => ({ ...p, name: e.target.value }))} placeholder="Buddy"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Breed</label>
                  <input type="text" value={petForm.breed} onChange={e => setPetForm(p => ({ ...p, breed: e.target.value }))} placeholder="Golden Retriever"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age (years)</label>
                  <input type="number" value={petForm.age} onChange={e => setPetForm(p => ({ ...p, age: e.target.value }))} placeholder="3" min="0" max="25"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temperament</label>
                  <select value={petForm.temperament} onChange={e => setPetForm(p => ({ ...p, temperament: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50">
                    <option value="friendly">Friendly 😊</option>
                    <option value="anxious">Anxious 😟</option>
                    <option value="energetic">Energetic ⚡</option>
                    <option value="calm">Calm 😌</option>
                    <option value="aggressive">Needs Care ⚠️</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Medical Notes / Special Instructions</label>
                <textarea value={petForm.notes} onChange={e => setPetForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Allergies, medical conditions, special care needs..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 resize-none" />
              </div>
              <button type="submit" disabled={petSaving}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-70 text-sm">
                {petSaving ? 'Saving...' : editingPet ? 'Save Changes' : 'Add Pet 🐾'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════ REVIEW MODAL ══════════════════ */}
      {showReviewModal && reviewingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Leave a Review</h2>
                <p className="text-sm text-gray-500">{reviewingAppt.services?.name}</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-3">How was the experience?</p>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-200'}`}>
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{['','Needs Improvement','Fair','Good','Very Good','Excellent!'][reviewRating]}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comment (optional)</label>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3} placeholder="Tell us about your experience..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 resize-none" />
              </div>
              <button type="submit" disabled={reviewSaving}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-70 text-sm">
                {reviewSaving ? 'Submitting...' : 'Submit Review ⭐'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────── */
function AppointmentCard({
  appt, onCancel, onBookAgain, onReview, cancelLoading, reviewedIds,
}: {
  appt: Appointment
  onCancel: (id: string) => void
  onBookAgain: (appt: Appointment) => void
  onReview: (appt: Appointment) => void
  cancelLoading: string | null
  reviewedIds: Set<string>
}) {
  const status   = statusConfig[appt.status] || statusConfig.pending
  const isActive = ['pending', 'confirmed'].includes(appt.status)

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
            <span className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              {format(new Date(appt.appointment_date), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              {appt.appointment_time?.slice(0, 5)}
            </span>
            {appt.groomers && (
              <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                <User className="w-3.5 h-3.5 text-orange-400" />
                {appt.groomers.name}
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0 space-y-2">
          <p className="text-lg font-extrabold text-gray-900">${appt.total_price || appt.services?.price || 0}</p>

          {isActive && (
            <button onClick={() => onCancel(appt.id)} disabled={cancelLoading === appt.id}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition-colors ml-auto">
              <Trash2 className="w-3 h-3" />
              {cancelLoading === appt.id ? 'Cancelling...' : 'Cancel'}
            </button>
          )}

          {appt.status === 'completed' && !reviewedIds.has(appt.id) && (
            <button onClick={() => onReview(appt)}
              className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-600 font-semibold transition-colors ml-auto">
              <Star className="w-3 h-3 fill-yellow-400" />
              Review
            </button>
          )}
          {appt.status === 'completed' && reviewedIds.has(appt.id) && (
            <span className="text-xs text-green-500 font-medium flex items-center gap-1 ml-auto">
              <CheckCircle className="w-3 h-3" /> Reviewed
            </span>
          )}

          {['completed', 'cancelled'].includes(appt.status) && (
            <button onClick={() => onBookAgain(appt)}
              className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors ml-auto">
              <RefreshCw className="w-3 h-3" />
              Book Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
