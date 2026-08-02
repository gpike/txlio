import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuth, isAuthConfigured } from '@/lib/auth'

export default async function Home() {
  const { userId } = await getAuth()
  if (isAuthConfigured && userId) redirect('/dashboard')

  const features = [
    {
      title: 'Deadline timeline',
      description:
        'Automatically map every critical date from contract to closing in one clean timeline.',
    },
    {
      title: 'Branded PDF export',
      description:
        'Generate a professional PDF with your brokerage branding for clients and co-op agents.',
    },
    {
      title: 'Automatic reminders',
      description:
        'Keep everyone on track with milestone reminders before important deadlines.',
    },
    {
      title: 'Secure workspace',
      description:
        'Contracts remain private in your workspace with role-based access via login.',
    },
  ]

  const steps = [
    {
      title: 'Upload the contract',
      description:
        'Drop in a PDF of the executed contract and let Txlio parse the key dates.',
    },
    {
      title: 'Review the timeline',
      description:
        'Adjust any event names or dates, and flag anything that needs human review.',
    },
    {
      title: 'Export and share',
      description:
        'Download a branded PDF timeline to send to clients and partner agents.',
    },
  ]

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur'>
        <div className='max-w-6xl mx-auto h-14 px-6 md:px-10 flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <span className='w-7 h-7 rounded-md bg-brand-600 text-white text-xs font-semibold flex items-center justify-center'>
              T
            </span>
            <span className='text-h4'>Txlio</span>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              href='/login'
              className='px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900'
            >
              Log in
            </Link>
            <Link
              href='/signup'
              className='bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors'
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className='relative overflow-hidden px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-28'>
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute -top-20 -right-24 w-96 h-96 rounded-full bg-brand-50 blur-3xl' />
          <div className='absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-50 blur-3xl' />
        </div>

        <div className='relative max-w-6xl mx-auto'>
          <div className='max-w-3xl'>
            <p className='text-overline text-brand-600'>
              Colorado real estate, simplified
            </p>
            <h1 className='text-h1 mt-3'>
              Turn contracts into client-ready timelines
            </h1>
            <p className='text-body mt-4 text-gray-600 max-w-2xl'>
              Txlio reads contract dates, builds a clear deadline sequence, and
              exports a polished PDF for clients.
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Link
                href='/signup'
                className='bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors'
              >
                Start free
              </Link>
              <Link
                href='/login'
                className='px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Open app
              </Link>
            </div>
          </div>

          <div className='mt-12 surface-card p-6 md:p-8'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <p className='text-overline text-brand-600'>Sample timeline</p>
                <h2 className='text-h3 mt-1'>1428 Pearl St, Boulder</h2>
                <p className='text-caption mt-1'>
                  MEC 08/03/2026 · Closing 09/14/2026
                </p>
              </div>
              <div className='flex gap-2'>
                <span className='text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200'>
                  8 confirmed
                </span>
                <span className='text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200'>
                  2 review
                </span>
              </div>
            </div>
            <div className='mt-5 divide-y divide-gray-200 border-t border-gray-200'>
              {[
                {
                  ref: '§ 3.1',
                  event: 'Mutual acceptance (MEC)',
                  date: 'Aug 3',
                  status: 'Confirmed',
                },
                {
                  ref: '§ 4.3',
                  event: 'Earnest money deadline',
                  date: 'Aug 6',
                  status: 'Confirmed',
                },
                {
                  ref: '§ 8.1',
                  event: 'Inspection objection deadline',
                  date: 'Aug 14',
                  status: 'Review',
                },
                {
                  ref: '§ 17.1',
                  event: 'Closing date',
                  date: 'Sep 14',
                  status: 'Confirmed',
                },
              ].map((row) => (
                <div key={row.ref} className='flex items-center gap-4 py-3'>
                  <span className='text-xs w-16 text-gray-500'>{row.ref}</span>
                  <span className='text-sm flex-1'>{row.event}</span>
                  <span className='text-xs w-16 text-right text-gray-500'>
                    {row.date}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md ${row.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='border-t border-gray-200 bg-[var(--surface)] px-6 md:px-10 py-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='max-w-2xl'>
            <p className='text-overline text-brand-600'>Features</p>
            <h2 className='text-h2 mt-3'>
              Everything your transaction workflow needs
            </h2>
          </div>
          <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature) => (
              <div
                key={feature.title}
                className='surface-card p-5 hover:shadow-md transition-shadow'
              >
                <h3 className='text-h4'>{feature.title}</h3>
                <p className='text-body mt-2 text-gray-500'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 md:px-10 py-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='max-w-2xl'>
            <p className='text-overline text-brand-600'>How it works</p>
            <h2 className='text-h2 mt-3'>
              From contract to client PDF in three steps
            </h2>
          </div>
          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            {steps.map((step, index) => (
              <div key={step.title} className='surface-card p-5'>
                <div className='w-8 h-8 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold flex items-center justify-center'>
                  {index + 1}
                </div>
                <h3 className='text-h3 mt-4'>{step.title}</h3>
                <p className='text-body mt-2 text-gray-500'>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className='border-t border-gray-200 px-6 md:px-10 py-10 bg-white'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2.5'>
            <span className='w-7 h-7 rounded-md bg-brand-600 text-white text-xs font-semibold flex items-center justify-center'>
              T
            </span>
            <span className='text-h4'>Txlio</span>
          </div>
          <p className='text-caption'>
            © 2026 Txlio. Built for real estate professionals.
          </p>
        </div>
      </footer>
    </div>
  )
}
