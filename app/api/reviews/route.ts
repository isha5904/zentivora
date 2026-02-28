import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { appointmentId, userId, groomerId, rating, comment } = await request.json()
    if (!appointmentId || !userId || !rating) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }
    const db  = getAdminDb()
    const ref = await db.collection('reviews').add({
      appointment_id: appointmentId,
      user_id:        userId,
      groomer_id:     groomerId || '',
      rating:         Number(rating),
      comment:        comment || '',
      created_at:     new Date().toISOString(),
    })
    return NextResponse.json({ success: true, id: ref.id })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
