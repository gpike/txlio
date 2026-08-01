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
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Transaction</h1>
        <p className="text-gray-500 mt-1">Upload a contract PDF to extract the dates and deadlines</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center cursor-pointer hover:border-brand-400 transition-colors"
          onClick={() => document.getElementById('contract-upload').click()}
        >
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {file ? (
            <p className="text-sm font-medium text-brand-600">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">Drop your contract PDF here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
            </>
          )}
          <input
            id="contract-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={!file || loading}
            className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing…' : 'Extract Timeline'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-gray-400">
        Supports Colorado CBS1 residential contracts. The PDF must be machine-readable (not a scanned image).
      </p>
    </div>
  )
}
