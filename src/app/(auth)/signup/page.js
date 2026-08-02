'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getBrowserSupabase, isAuthConfigured } from '@/lib/authClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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
    setMessage('')

    try {
      const supabase = getBrowserSupabase()
      if (!supabase) throw new Error('Supabase client unavailable')

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (data.session?.access_token) {
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
        return
      }

      setMessage(
        'Account created. Check your email to verify your account, then sign in.',
      )
    } catch (err) {
      setError(err.message || 'Unable to create account.')
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
          <p className='text-overline text-brand-600'>Get started</p>
          <h1 className='text-h1 mt-3'>Create your Txlio account</h1>
          <p className='text-body text-gray-600 mt-3 max-w-md'>
            Set up your workspace to transform contracts into clear,
            client-ready timelines in minutes.
          </p>
          <div className='mt-6 surface-card p-5 max-w-md'>
            <p className='text-h4'>What you get</p>
            <ul className='mt-3 space-y-2 text-body text-gray-600'>
              <li>Contract timeline extraction and review</li>
              <li>Organized workflow for transaction deadlines</li>
              <li>Professional PDF exports with brokerage branding</li>
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
            <h2 className='text-h3'>Create account</h2>
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
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
            />
          </div>

          {error ? <p className='text-sm text-red-600'>{error}</p> : null}
          {message ? <p className='text-sm text-green-700'>{message}</p> : null}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-70'
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className='text-sm text-gray-500'>
            Already have an account?{' '}
            <Link href='/login' className='text-brand-700 hover:underline'>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
