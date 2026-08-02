import { redirect } from 'next/navigation'
import Sidebar from '@/components/platform/Sidebar'
import { getAuth, isAuthConfigured } from '@/lib/auth'

export default async function PlatformLayout({ children }) {
  if (!isAuthConfigured) {
    redirect('/')
  }

  const { userId } = await getAuth()
  if (!userId) redirect('/login')

  return (
    <div className='flex min-h-screen bg-[var(--surface)]'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <div className='max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-10'>
          {children}
        </div>
      </main>
    </div>
  )
}
