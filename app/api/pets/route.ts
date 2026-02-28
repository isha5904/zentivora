import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  const uid = new URL(request.url).searchParams.get('uid')
  if (!uid) return NextResponse.json({ success: false, error: 'Missing uid' }, { status: 400 })
  try {
    const db   = getAdminDb()
    const snap = await db.collection('pets').where('user_id', '==', uid).get()
    const pets = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ success: true, pets })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { uid, id, name, breed, age, temperament, notes } = await request.json()
    if (!uid || !name) return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    const db   = getAdminDb()
    const data = { user_id: uid, name, breed: breed || '', age: age ? Number(age) : null, temperament: temperament || 'friendly', notes: notes || '', updated_at: new Date().toISOString() }
    if (id) {
      await db.collection('pets').doc(id).set(data, { merge: true })
      return NextResponse.json({ success: true, id })
    } else {
      const ref = await db.collection('pets').add({ ...data, created_at: new Date().toISOString() })
      return NextResponse.json({ success: true, id: ref.id })
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid   = searchParams.get('uid')
  const petId = searchParams.get('petId')
  if (!uid || !petId) return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 })
  try {
    const db  = getAdminDb()
    const ref = db.collection('pets').doc(petId)
    const doc = await ref.get()
    if (!doc.exists || doc.data()?.user_id !== uid) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    await ref.delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
