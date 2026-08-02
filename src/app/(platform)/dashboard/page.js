import Link from 'next/link'
import { getAuth } from '@/lib/auth'

export default async function DashboardPage() {
  const { userId } = await getAuth()
  if (!userId) return null

  const tools = [
    {
      title: 'Contract Timeline',
      description:
        'Upload a contract, review parsed deadlines, and export a branded PDF.',
      href: '/timeline',
      live: true,
      icon: (
        <svg
          className='w-4.5 h-4.5'
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
      title: 'Deadline Reminders',
      description: 'Email nudges before each milestone so dates never slip.',
      live: false,
      icon: (
        <svg
          className='w-4.5 h-4.5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 12H8m8 4H8m8-8H8m-2 12h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      ),
    },
    {
      title: 'Amendment Tracker',
      description: 'Log extensions and keep one accurate timeline version.',
      live: false,
      icon: (
        <svg
          className='w-4.5 h-4.5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
          />
        </svg>
      ),
    },
  ]

  return (
    <div className='pb-3'>
      <header className='flex flex-wrap items-end justify-between gap-4 pb-8'>
        <div className='max-w-2xl'>
          <p className='text-overline text-brand-600'>Workspace</p>
          <h1 className='text-h1 mt-2'>Welcome back</h1>
          <p className='text-body mt-2 text-gray-600'>
            Manage your real estate workflow with precision. Start a new
            timeline or continue where you left off.
          </p>
        </div>
        <Link
          href='/timeline/new'
          className='bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors'
        >
          New transaction
        </Link>
      </header>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {tools.map((tool) => {
          const card = (
            <div
              className={`h-full rounded-xl border p-5 bg-white transition-all ${
                tool.live
                  ? 'border-gray-200 hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-md'
                  : 'border-dashed border-gray-300'
              }`}
            >
              <div className='flex items-start justify-between gap-3'>
                <span
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center ${tool.live ? 'bg-brand-50 border-brand-100 text-brand-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                >
                  {tool.icon}
                </span>
                {tool.live ? (
                  <span className='text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200'>
                    Live
                  </span>
                ) : (
                  <span className='text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200'>
                    Coming soon
                  </span>
                )}
              </div>

              <h2
                className={`text-h3 mt-4 ${tool.live ? 'text-gray-900' : 'text-gray-500'}`}
              >
                {tool.title}
              </h2>
              <p className='text-body mt-1.5 text-gray-500'>
                {tool.description}
              </p>

              <p className='text-sm font-medium mt-4 text-brand-600'>
                {tool.live ? 'Open tool' : 'In development'}
              </p>
            </div>
          )

          if (tool.live && tool.href) {
            return (
              <Link key={tool.title} href={tool.href} className='block h-full'>
                {card}
              </Link>
            )
          }

          return (
            <div key={tool.title} className='h-full' aria-disabled>
              {card}
            </div>
          )
        })}
      </section>

      <section className='surface-card mt-8 p-5'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h2 className='text-h3'>Recent timelines</h2>
            <p className='text-caption mt-1'>Last 30 days</p>
          </div>
          <button className='text-sm px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-gray-600'>
            View all
          </button>
        </div>

        <ul className='mt-4 border-t border-gray-200 divide-y divide-gray-200'>
          {[
            {
              ref: '1428 Pearl St',
              status: 'Exported',
              tone: 'success',
              when: '2h ago',
            },
            {
              ref: '77 Aspen Grove Ln',
              status: 'Review needed',
              tone: 'warning',
              when: 'Yesterday',
            },
            {
              ref: '9 Sundance Ct',
              status: 'Exported',
              tone: 'success',
              when: '3d ago',
            },
          ].map((row) => (
            <li key={row.ref} className='flex items-center gap-4 py-3'>
              <span className='text-sm font-medium flex-1 truncate'>
                {row.ref}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  row.tone === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {row.status}
              </span>
              <span className='text-xs text-gray-500 w-20 text-right'>
                {row.when}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
