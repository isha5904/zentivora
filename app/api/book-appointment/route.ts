import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId, userEmail, serviceId, groomerId,
      date, time, petName, petBreed, petAge,
      notes, totalPrice,
    } = body

    const docRef = await adminDb.collection('appointments').add({
      user_id:          userId,
      user_email:       userEmail || '',
      service_id:       serviceId,
      groomer_id:       groomerId || null,
      appointment_date: date,
      appointment_time: time,
      pet_name:         petName,
      pet_breed:        petBreed || null,
      pet_age:          petAge ? parseInt(petAge) : null,
      notes:            notes || null,
      total_price:      totalPrice ?? 0,
      status:           'pending',
      created_at:       new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
