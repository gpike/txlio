'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTimelinePage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('contract', file)

      const res = await fetch('/api/timeline', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to process contract')
      }

      const { id } = await res.json()
      router.push(`/timeline/${id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl'>
      <div className='mb-8'>
        <p className='text-overline text-brand-600'>Contract Timeline</p>
        <h1 className='text-h1 mt-2'>Upload a contract</h1>
        <p className='text-body text-gray-500 mt-2'>
          Upload a PDF and Txlio will parse dates and contingencies into a
          review-ready timeline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='surface-card p-6 md:p-8'>
        <div className='mb-6 rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 text-sm text-brand-800'>
          Use machine-readable PDFs for best results. Scanned image-only files
          may miss fields.
        </div>
        <div
          className='border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 transition-colors'
          onClick={() => document.getElementById('contract-upload').click()}
        >
          <div className='w-16 h-16 rounded-full bg-brand-50 mx-auto mb-4 flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-brand-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
          </div>
          {file ? (
            <p className='text-sm font-medium text-brand-700'>{file.name}</p>
          ) : (
            <>
              <p className='text-sm font-medium text-gray-800'>
                Drag and drop your PDF here
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                or click to browse files
              </p>
            </>
          )}
          <input
            id='contract-upload'
            type='file'
            accept='.pdf'
            className='hidden'
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </div>

        {error && (
          <p className='mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2'>
            {error}
          </p>
        )}

        <div className='mt-6 flex gap-3'>
          <button
            type='submit'
            disabled={!file || loading}
            className='bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Processing…' : 'Extract timeline'}
          </button>
          <button
            type='button'
            onClick={() => router.back()}
            className='px-5 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors'
          >
            Cancel
          </button>
        </div>
      </form>

      <p className='mt-4 text-caption'>
        Supports Colorado CBS1 residential contracts. The PDF must be
        machine-readable.
      </p>
    </div>
  )
}
