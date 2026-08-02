'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { getBrowserSupabase, isAuthConfigured } from '@/lib/authClient'

const tools = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        />
      </svg>
    ),
  },
  {
    href: '/timeline',
    label: 'Contract Timeline',
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
        />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    if (!isAuthConfigured || isSigningOut) return

    setIsSigningOut(true)
    try {
      const supabase = getBrowserSupabase()
      if (supabase) {
        await supabase.auth.signOut()
      }
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <aside className='hidden md:flex sticky top-0 h-screen w-60 bg-[var(--background)] border-r border-gray-200 flex-col py-4 px-3'>
      <div className='h-14 px-2 flex items-center gap-2.5 mb-4'>
        <span className='w-7 h-7 rounded-md bg-brand-600 text-white text-xs font-semibold flex items-center justify-center'>
          T
        </span>
        <div className='leading-tight'>
          <p className='text-h4 text-brand-700'>Txlio</p>
          <p className='text-caption'>Transaction Management</p>
        </div>
      </div>

      <nav className='flex-1 px-1 py-1 space-y-1'>
        <p className='text-overline text-gray-400 px-2 pt-2 pb-1.5'>
          Workspace
        </p>
        {tools.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 h-9 px-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'active-nav-item'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className='border-t border-gray-200 p-2 mt-2'>
        <div className='flex items-center justify-between gap-2 rounded-md px-2 py-2 bg-gray-50'>
          <span className='text-xs text-gray-500'>Signed in</span>
          {isAuthConfigured ? (
            <button
              type='button'
              onClick={handleSignOut}
              disabled={isSigningOut}
              className='text-xs px-2 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-60'
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          ) : (
            <span className='text-xs text-gray-400'>Auth disabled</span>
          )}
        </div>
      </div>
    </aside>
  )
}
