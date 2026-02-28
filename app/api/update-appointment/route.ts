import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 })
    }

    const db = getAdminDb()
    await db.collection('appointments').doc(id).update({ status })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('update-appointment error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
