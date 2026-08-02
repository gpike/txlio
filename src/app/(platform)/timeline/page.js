import Link from 'next/link'

export default function TimelinePage() {
  return (
    <div className='pb-3'>
      <div className='flex flex-wrap items-end justify-between gap-4 mb-8'>
        <div>
          <p className='text-overline text-brand-600'>Contract Timeline</p>
          <h1 className='text-h1 mt-2'>Review deadlines</h1>
          <p className='text-body text-gray-500 mt-2'>
            Upload a contract PDF to extract dates and deadlines, then export a
            branded client PDF.
          </p>
        </div>
        <Link
          href='/timeline/new'
          className='bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors'
        >
          New Transaction
        </Link>
      </div>

      <div className='surface-card p-5'>
        <div className='flex flex-wrap items-center gap-3 pb-4 border-b border-gray-200'>
          <span className='text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200'>
            0 deadlines
          </span>
          <span className='text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200'>
            Awaiting upload
          </span>
          <span className='text-xs text-gray-500'>No contract parsed yet</span>
        </div>

        <div className='py-14 text-center'>
          <div className='mx-auto w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4'>
            <svg
              className='w-5 h-5 text-brand-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.8}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
          </div>
          <p className='text-h3 text-gray-900'>No transactions yet</p>
          <p className='text-body text-gray-500 mt-1'>
            Upload a contract PDF to build your first deadline timeline.
          </p>
          <Link
            href='/timeline/new'
            className='inline-block mt-5 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors'
          >
            Upload first contract
          </Link>
        </div>
      </div>
    </div>
  )
}
