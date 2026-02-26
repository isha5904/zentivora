import { NextResponse, type NextRequest } from 'next/server'

// Firebase Auth is client-side only (uses localStorage/IndexedDB).
// Route protection is handled client-side inside each page component.
// This middleware simply passes all requests through.
export async function proxy(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
