import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Txlio</p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/timeline" className="block">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-500 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Contract Timeline</h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload a contract PDF and generate a clean dates and deadlines timeline.
            </p>
          </div>
        </Link>

        {/* Placeholder for future tools */}
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 opacity-50">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-400">More tools coming soon</h2>
          <p className="text-sm text-gray-400 mt-1">Listing copy, lead follow-up, and more.</p>
        </div>
      </div>
    </div>
  )
}
