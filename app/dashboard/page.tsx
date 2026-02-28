'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import DashboardClient from './DashboardClient'

export const SERVICES = [
  { id: 's1', name: 'Basic Bath & Brush',    price: 35, duration: 60,  category: 'Bath',      description: 'Full bath, blow dry, and brush out' },
  { id: 's2', name: 'Full Groom',             price: 65, duration: 120, category: 'Full Groom', description: 'Bath, haircut, nail trim, ear cleaning' },
  { id: 's3', name: 'Nail Trim',              price: 15, duration: 20,  category: 'Nail',       description: 'Nail trimming and filing' },
  { id: 's4', name: 'Teeth Brushing',         price: 12, duration: 15,  category: 'Dental',     description: 'Brushing with pet-safe toothpaste' },
  { id: 's5', name: 'De-shedding Treatment',  price: 45, duration: 90,  category: 'Treatment',  description: 'Reduce shedding by up to 80%' },
  { id: 's6', name: 'Puppy First Groom',      price: 40, duration: 60,  category: 'Puppy',      description: 'Gentle first grooming experience' },
  { id: 's7', name: 'Flea & Tick Treatment',  price: 30, duration: 45,  category: 'Treatment',  description: 'Medicated shampoo and treatment' },
  { id: 's8', name: 'Ear Cleaning',           price: 10, duration: 15,  category: 'Ear',        description: 'Gentle ear canal cleaning' },
]

export const GROOMERS = [
  { id: 'g1', name: 'Sarah Johnson', speciality: 'Large Breeds',      rating: 4.9, experience_years: 8  },
  { id: 'g2', name: 'Mike Chen',     speciality: 'Small Breeds',      rating: 4.8, experience_years: 5  },
  { id: 'g3', name: 'Emma Davis',    speciality: 'Doodles & Poodles', rating: 5.0, experience_years: 10 },
  { id: 'g4', name: 'Carlos Rivera', speciality: 'Senior Dogs',       rating: 4.7, experience_years: 6  },
]

type RawAppointment = {
  id: string
  user_id: string
  user_email: string
  service_id: string
  groomer_id?: string | null
  appointment_date: string
  appointment_time: string
  pet_name: string
  pet_breed?: string | null
  notes?: string | null
  total_price?: number
  status: string
}

export type Appointment = RawAppointment & {
  services?: { name: string; price: number; duration: number }
  groomers?: { name: string }
}

function enrichAppointments(raw: RawAppointment[]): Appointment[] {
  return raw.map(appt => {
    const service = SERVICES.find(s => s.id === appt.service_id)
    const groomer = GROOMERS.find(g => g.id === appt.groomer_id)
    return {
      ...appt,
      services: service ? { name: service.name, price: service.price, duration: service.duration } : undefined,
      groomers: groomer ? { name: groomer.name } : undefined,
    }
  })
}

type Profile = { full_name?: string; phone?: string; address?: string }

export default function DashboardPage() {
  const [loading, setLoading]           = useState(true)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile]           = useState<Profile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        router.push('/login')
        return
      }
      setFirebaseUser(fbUser)

      // Fetch profile and appointments in parallel
      const [profileResult, apptResult] = await Promise.allSettled([
        getDoc(doc(db, 'profiles', fbUser.uid)),
        fetch(`/api/my-appointments?uid=${fbUser.uid}`).then(r => r.json()),
      ])

      if (profileResult.status === 'fulfilled' && profileResult.value.exists()) {
        setProfile(profileResult.value.data() as Profile)
      }

      if (apptResult.status === 'fulfilled' && apptResult.value.success) {
        const raw = (apptResult.value.appointments as RawAppointment[])
        setAppointments(enrichAppointments(raw))
      }

      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!firebaseUser) return null

  return (
    <DashboardClient
      user={{ id: firebaseUser.uid, email: firebaseUser.email ?? undefined, full_name: firebaseUser.displayName ?? undefined }}
      profile={profile}
      appointments={appointments}
      services={SERVICES}
      groomers={GROOMERS}
    />
  )
}
