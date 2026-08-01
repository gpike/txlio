'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function TimelineReviewPage() {
  const { id } = useParams()
  const [transaction, setTransaction] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/timeline/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTransaction(data)
        setEntries(data.entries || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load transaction')
        setLoading(false)
      })
  }, [id])

  function updateEntry(index, field, value) {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    )
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch(`/api/timeline/${id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `timeline-${id}.pdf`
      a.click()
    } catch (err) {
      alert(err.message)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <div className="text-gray-400 p-8">Loading…</div>
  if (error) return <div className="text-red-500 p-8">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/timeline" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">
            ← All transactions
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {transaction?.propertyAddress || 'Timeline Review'}
          </h1>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-40 transition-colors"
        >
          {exporting ? 'Generating…' : 'Export PDF'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">Reference</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry, i) => (
              <tr key={i} className={entry.requires_review ? 'bg-amber-50' : ''}>
                <td className="px-4 py-2 text-gray-500 font-mono text-xs">{entry.contractReference}</td>
                <td className="px-4 py-2">
                  <input
                    className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-300 rounded px-1"
                    value={entry.title || ''}
                    onChange={(e) => updateEntry(i, 'title', e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-300 rounded px-1 text-xs"
                    value={entry.date || ''}
                    onChange={(e) => updateEntry(i, 'date', e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  {entry.requires_review && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Review</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
