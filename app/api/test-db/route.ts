import { NextResponse } from 'next/server'

// Firebase Auth is client-side only — server-side DB tests are not needed.
// Use /test page in the browser to verify Firebase connectivity.
export async function GET() {
  return NextResponse.json({
    message: 'Firebase is client-side. Visit /test in your browser to run connection tests.',
    firebase_project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not set',
  })
}
