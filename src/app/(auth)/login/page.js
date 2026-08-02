'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getBrowserSupabase, isAuthConfigured } from '@/lib/authClient'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()

    if (!isAuthConfigured) {
      setError(
        'Supabase is not configured. Add env vars and restart dev server.',
      )
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = getBrowserSupabase()
      if (!supabase) throw new Error('Supabase client unavailable')

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) throw signInError
      if (!data.session?.access_token) {
        throw new Error('No session returned. Check your credentials.')
      }

      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create server session.')
      }

      router.replace('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-white px-4 py-10 md:py-16'>
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-50 blur-3xl' />
        <div className='absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl' />
      </div>

      <div className='relative max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center'>
        <section className='hidden lg:block'>
          <p className='text-overline text-brand-600'>Welcome back</p>
          <h1 className='text-h1 mt-3'>
            Sign in to your transaction workspace
          </h1>
          <p className='text-body text-gray-600 mt-3 max-w-md'>
            Access your contract timelines, review milestones, and export
            client-ready PDFs with Txlio branding.
          </p>
          <div className='mt-6 surface-card p-5 max-w-md'>
            <p className='text-h4'>Trusted workflow</p>
            <ul className='mt-3 space-y-2 text-body text-gray-600'>
              <li>Automated date extraction from contracts</li>
              <li>Branded timeline PDF exports</li>
              <li>Centralized milestone tracking</li>
            </ul>
          </div>
        </section>

        <form
          onSubmit={onSubmit}
          className='surface-card p-6 md:p-7 space-y-4 w-full max-w-md lg:ml-auto'
        >
          <div>
            <div className='flex items-center gap-2.5 mb-2'>
              <span className='w-7 h-7 rounded-md bg-brand-600 text-white text-xs font-semibold flex items-center justify-center'>
                T
              </span>
              <span className='text-h4 text-brand-700'>Txlio</span>
            </div>
            <h2 className='text-h3'>Sign in</h2>
            <p className='text-caption mt-1'>
              Transaction tools for real estate professionals
            </p>
          </div>

          <div className='space-y-1.5'>
            <label className='text-label text-gray-700'>Email</label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-label text-gray-700'>Password</label>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
            />
          </div>

          {error ? <p className='text-sm text-red-600'>{error}</p> : null}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-70'
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className='text-sm text-gray-500'>
            Need an account?{' '}
            <Link href='/signup' className='text-brand-700 hover:underline'>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
