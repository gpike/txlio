import { getUser } from '@/lib/auth'

export default async function SettingsPage() {
  const user = await getUser()
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')?.[0] || 'User'
  const email = user?.email || 'No email available'

  return (
    <div className='pb-3'>
      <header className='pb-8'>
        <p className='text-overline text-brand-600'>Workspace</p>
        <h1 className='text-h1 mt-2'>Settings</h1>
        <p className='text-body text-gray-500 mt-2'>
          Branding applied to every exported timeline PDF.
        </p>
      </header>

      <div className='grid gap-4 lg:grid-cols-2'>
        <section className='surface-card p-5'>
          <h2 className='text-h3'>Brand details</h2>
          <p className='text-caption mt-1'>
            Shown in the header of exported client PDFs.
          </p>

          <div className='mt-5 space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-label text-gray-700'>Company name</label>
              <input
                defaultValue='Summit Peak Transaction Co.'
                className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-label text-gray-700'>Contact phone</label>
              <input
                defaultValue='(303) 555-0148'
                className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-label text-gray-700'>
                Colorado license #
              </label>
              <input
                placeholder='FA.100xxxxx'
                className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300'
              />
              <p className='text-caption'>
                Optional. Printed in the PDF footer.
              </p>
            </div>
            <div className='flex gap-2 pt-1'>
              <button className='bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors'>
                Save changes
              </button>
              <button className='px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors'>
                Cancel
              </button>
            </div>
          </div>
        </section>

        <section className='surface-card p-5'>
          <h2 className='text-h3'>Workspace account</h2>
          <p className='text-caption mt-1'>Current signed-in user.</p>

          <div className='mt-5 rounded-xl border border-gray-200 p-4 bg-gray-50'>
            <p className='text-xs text-gray-400 uppercase tracking-wide font-medium mb-1'>
              Account
            </p>
            <p className='text-sm font-medium text-gray-900'>{displayName}</p>
            <p className='text-sm text-gray-500'>{email}</p>
          </div>

          <div className='mt-4 rounded-xl border border-dashed border-gray-300 p-8 text-center bg-white'>
            <p className='text-sm font-medium text-gray-700'>
              Team features are coming soon
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Invite agents so their contracts land in this workspace
              automatically.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
