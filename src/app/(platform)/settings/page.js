import { currentUser } from '@clerk/nextjs/server'

export default async function SettingsPage() {
  const user = await currentUser()

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Account</p>
          <p className="text-sm font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Branding</p>
          <p className="text-sm text-gray-500">
            Custom agent name, logo, and contact info for exported PDFs — coming soon.
          </p>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Billing</p>
          <p className="text-sm text-gray-500">
            Subscription management — coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
