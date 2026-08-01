import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600">Txlio</h1>
          <p className="text-gray-500 mt-1">Transaction tools for real estate professionals</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
