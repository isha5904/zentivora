'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Scissors, LogOut, Calendar, Clock, User,
  CheckCircle, XCircle, RefreshCw, Shield,
} from 'lucide-react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import { SERVICES, GROOMERS } from '../dashboard/page'
import { format } from 'date-fns'

const ADMIN_EMAIL = 'ishapatharia2004@gmail.com'

type AdminAppointment = {
  id: string
  user_id: string
  user_email: string
  service_id: string
  groomer_id?: string | null
  appointment_date: string
  appointment_time: string
  pet_name: string
  pet_breed?: string | null
  pet_age?: number | null
  notes?: string | null
  total_price?: number
  status: string
  created_at: string
}

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

const statusConfig = {
  pending:   { label: 'Pending',   color: 'text-yellow-700', bg: 'bg-yellow-50',  dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700',   bg: 'bg-blue-50',    dot: 'bg-blue-400'   },
  completed: { label: 'Completed', color: 'text-green-700',  bg: 'bg-green-50',   dot: 'bg-green-400'  },
  cancelled: { label: 'Cancelled', color: 'text-red-700',    bg: 'bg-red-50',     dot: 'bg-red-400'    },
} as const

export default function AdminClient() {
  const [loading, setLoading]           = useState(true)
  const [authorized, setAuthorized]     = useState(false)
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [filter, setFilter]             = useState<FilterStatus>('all')
  const [updatingId, setUpdatingId]     = useState<string | null>(null)
  const [adminEmail, setAdminEmail]     = useState('')
  const router = useRouter()

  const fetchAllAppointments = async () => {
    const q    = query(collection(db, 'appointments'), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as AdminAppointment))
    setAppointments(data)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        router.push('/login')
        return
      }
      if (fbUser.email !== ADMIN_EMAIL) {
        router.push('/dashboard')
        return
      }
      setAuthorized(true)
      setAdminEmail(fbUser.email)
      try {
        await fetchAllAppointments()
      } catch { /* Firestore rules may need updating */ }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus })
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      )
    } catch (err) {
      console.error('Status update failed:', err)
    }
    setUpdatingId(null)
  }

  const handleRefresh = async () => {
    try {
      await fetchAllAppointments()
    } catch { /* silent */ }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  const stats = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                Zenti<span className="text-orange-500">vora</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{adminEmail}</span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:block">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Appointment Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Review and manage all customer bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total',     value: stats.total,     bg: 'bg-gray-50',    text: 'text-gray-700'   },
            { label: 'Pending',   value: stats.pending,   bg: 'bg-yellow-50',  text: 'text-yellow-700' },
            { label: 'Confirmed', value: stats.confirmed, bg: 'bg-blue-50',    text: 'text-blue-700'   },
            { label: 'Completed', value: stats.completed, bg: 'bg-green-50',   text: 'text-green-700'  },
            { label: 'Cancelled', value: stats.cancelled, bg: 'bg-red-50',     text: 'text-red-700'    },
          ].map(s => (
            <div key={s.label} className={`${s.bg} ${s.text} rounded-2xl p-4`}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterStatus[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {f === 'all' ? `All (${stats.total})` : f}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-14 text-center border border-gray-100">
            <div className="text-5xl mb-3">📅</div>
            <p className="font-bold text-gray-900">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(appt => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                onStatusUpdate={handleStatusUpdate}
                updatingId={updatingId}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

function AppointmentCard({
  appt,
  onStatusUpdate,
  updatingId,
}: {
  appt: AdminAppointment
  onStatusUpdate: (id: string, status: string) => void
  updatingId: string | null
}) {
  const service    = SERVICES.find(s => s.id === appt.service_id)
  const groomer    = GROOMERS.find(g => g.id === appt.groomer_id)
  const status     = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.pending
  const isUpdating = updatingId === appt.id

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>
            <h3 className="font-bold text-gray-900 text-lg">
              {service?.name || 'Grooming Service'}
            </h3>
            <span className="text-orange-600 font-bold text-sm">
              £{appt.total_price ?? service?.price ?? 0}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span>🐾</span>
              <span>
                <strong>{appt.pet_name}</strong>
                {appt.pet_breed ? ` • ${appt.pet_breed}` : ''}
                {appt.pet_age ? ` • ${appt.pet_age}y` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="truncate">{appt.user_email || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{format(new Date(appt.appointment_date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{appt.appointment_time?.slice(0, 5)}</span>
            </div>
            {groomer && (
              <div className="flex items-center gap-2 text-gray-600">
                <Scissors className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{groomer.name}</span>
              </div>
            )}
          </div>

          {appt.notes && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 italic">
              &quot;{appt.notes}&quot;
            </p>
          )}

          <p className="text-xs text-gray-400">
            ID: {appt.id} &bull; Booked: {new Date(appt.created_at).toLocaleString('en-GB')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[140px]">
          {appt.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusUpdate(appt.id, 'confirmed')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60 w-full justify-center"
              >
                <CheckCircle className="w-4 h-4" />
                {isUpdating ? '...' : 'Confirm'}
              </button>
              <button
                onClick={() => onStatusUpdate(appt.id, 'cancelled')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 w-full justify-center"
              >
                <XCircle className="w-4 h-4" />
                {isUpdating ? '...' : 'Reject'}
              </button>
            </>
          )}
          {appt.status === 'confirmed' && (
            <>
              <button
                onClick={() => onStatusUpdate(appt.id, 'completed')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 w-full justify-center"
              >
                <CheckCircle className="w-4 h-4" />
                {isUpdating ? '...' : 'Complete'}
              </button>
              <button
                onClick={() => onStatusUpdate(appt.id, 'cancelled')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 w-full justify-center"
              >
                <XCircle className="w-4 h-4" />
                {isUpdating ? '...' : 'Cancel'}
              </button>
            </>
          )}
          {['completed', 'cancelled'].includes(appt.status) && (
            <span className="text-xs text-gray-400 text-center px-2 py-2">No actions</span>
          )}
        </div>

      </div>
    </div>
  )
}
