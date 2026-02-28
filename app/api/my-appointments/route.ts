import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ success: false, error: 'Missing uid' }, { status: 400 })
  }

  try {
    const db = getAdminDb()
    const snap = await db.collection('appointments')
      .where('user_id', '==', uid)
      .get()

    const appointments = snap.docs
      .map(d => ({ ...d.data(), id: d.id }) as Record<string, unknown> & { id: string; appointment_date?: string })
      .sort((a, b) => new Date(b.appointment_date ?? '').getTime() - new Date(a.appointment_date ?? '').getTime())
    return NextResponse.json({ success: true, appointments })
  } catch (err) {
    console.error('my-appointments error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
