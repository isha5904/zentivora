import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function GET() {
  try {
    const db = getAdminDb()
    const snap = await db.collection('appointments')
      .orderBy('created_at', 'desc')
      .get()

    const appointments = snap.docs.map(d => ({ ...d.data(), id: d.id }))
    return NextResponse.json({ success: true, appointments })
  } catch (err) {
    console.error('all-appointments error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
