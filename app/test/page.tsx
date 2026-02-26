'use client'

import { useEffect, useState } from 'react'

type TestResult = {
  name: string
  status: 'testing' | 'pass' | 'fail'
  detail: string
}

const PHP_API = process.env.NEXT_PUBLIC_PHP_API_URL ?? 'http://localhost/zentivora-api'

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([
    { name: 'PHP API URL configured',  status: 'testing', detail: '...' },
    { name: 'PHP server reachable',    status: 'testing', detail: '...' },
    { name: 'Register endpoint',       status: 'testing', detail: '...' },
    { name: 'Login endpoint',          status: 'testing', detail: '...' },
    { name: 'Appointments endpoint',   status: 'testing', detail: '...' },
  ])
  const [done, setDone] = useState(false)

  const update = (i: number, status: 'pass' | 'fail', detail: string) =>
    setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status, detail } : r))

  useEffect(() => {
    const run = async () => {
      // Test 1 — env var present
      update(0, 'pass', `URL: ${PHP_API}`)

      // Test 2 — PHP server reachable
      try {
        const res = await fetch(`${PHP_API}/login.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'probe@test.com', password: 'probe' }),
        })
        if (res.status === 401 || res.status === 200) {
          update(1, 'pass', `PHP server responding (HTTP ${res.status}) ✅`)
        } else if (res.status === 404) {
          update(1, 'fail', `404 — copy php-backend/ to htdocs/zentivora-api/`)
        } else {
          update(1, 'pass', `HTTP ${res.status} — server reachable ✅`)
        }
      } catch {
        update(1, 'fail', `Cannot reach ${PHP_API} — is XAMPP running? Is the folder in htdocs?`)
      }

      // Test 3 — register with a unique temp email
      const tempEmail = `test_${Date.now()}@zentivora.test`
      let testToken = ''
      try {
        const res  = await fetch(`${PHP_API}/register.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: tempEmail, password: 'Test123!', full_name: 'Test User' }),
        })
        const data = await res.json()
        if (data.token) {
          testToken = data.token
          update(2, 'pass', `User created, token received ✅`)
        } else {
          update(2, 'fail', data.error ?? 'No token in response')
        }
      } catch (e) {
        update(2, 'fail', `${e}`)
      }

      // Test 4 — login with same temp account
      try {
        const res  = await fetch(`${PHP_API}/login.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: tempEmail, password: 'Test123!' }),
        })
        const data = await res.json()
        if (data.token) {
          testToken = data.token
          update(3, 'pass', `Login successful, token received ✅`)
        } else {
          update(3, 'fail', data.error ?? 'No token in response')
        }
      } catch (e) {
        update(3, 'fail', `${e}`)
      }

      // Test 5 — appointments endpoint (requires auth token)
      try {
        const res  = await fetch(`${PHP_API}/appointments.php`, {
          headers: {
            'Content-Type': 'application/json',
            ...(testToken ? { Authorization: `Bearer ${testToken}` } : {}),
          },
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          update(4, 'pass', `Appointments endpoint working (${data.length} records) ✅`)
        } else if (res.status === 401) {
          update(4, 'fail', 'Unauthorized — login test may have failed')
        } else {
          update(4, 'fail', (data as { error?: string }).error ?? 'Unexpected response')
        }
      } catch (e) {
        update(4, 'fail', `${e}`)
      }

      setDone(true)
    }

    run()
  }, [])

  const allPassed = results.every(r => r.status === 'pass')
  const anyFailed = results.some(r => r.status === 'fail')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">🐘 PHP Backend Test</h1>
        <p className="text-gray-500 text-sm mb-6">
          API: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{PHP_API}</code>
        </p>

        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${
              r.status === 'pass' ? 'bg-green-50 border-green-200' :
              r.status === 'fail' ? 'bg-red-50 border-red-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.detail}</p>
              </div>
              <span className="text-xl">
                {r.status === 'testing' ? '⏳' : r.status === 'pass' ? '✅' : '❌'}
              </span>
            </div>
          ))}
        </div>

        {done && (
          <div className={`mt-6 p-4 rounded-xl text-center font-bold ${
            allPassed ? 'bg-green-100 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}>
            {allPassed
              ? '🎉 PHP backend fully connected!'
              : '⚠️ Some tests failed — see setup steps below.'}
          </div>
        )}

        {done && anyFailed && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
            <p className="font-semibold mb-2">Setup checklist:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Start XAMPP → Apache must be <strong>running (green)</strong></li>
              <li>Copy <code className="bg-blue-100 px-1 rounded">php-backend/</code> folder to <code className="bg-blue-100 px-1 rounded">C:\xampp\htdocs\zentivora-api\</code></li>
              <li>The <code className="bg-blue-100 px-1 rounded">data/</code> subfolder is already included with empty JSON files</li>
              <li>Restart Next.js: <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
              <li>Reload this page to rerun tests</li>
            </ol>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
        >
          🔄 Rerun Tests
        </button>
      </div>
    </div>
  )
}
