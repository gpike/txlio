import Link from 'next/link'

export default function TimelinePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Timeline</h1>
          <p className="text-gray-500 mt-1">Upload a contract PDF to extract dates and deadlines</p>
        </div>
        <Link
          href="/timeline/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + New Transaction
        </Link>
      </div>

      {/* Transaction list — populated from DB in future sprint */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-12 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-medium text-gray-500">No transactions yet</p>
          <p className="text-sm mt-1">Upload a contract PDF to get started</p>
          <Link href="/timeline/new" className="inline-block mt-4 text-brand-600 text-sm font-medium hover:underline">
            Create your first transaction →
          </Link>
        </div>
      </div>
    </div>
  )
}
