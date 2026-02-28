import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    const db = getAdminDb()
    await db.collection('contact_messages').add({
      name, email, subject, message,
      created_at: new Date().toISOString(),
      read: false,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('contact error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
