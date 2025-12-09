import { AdminSignInForm } from '@/components/admin/admin-signin-form'
import { AuthRedirect } from '@/components/auth/auth-redirect'

export const dynamic = 'force-dynamic'

export default function AdminSignInPage() {
  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>
          <AdminSignInForm />
        </div>
      </div>
    </>
  )
}

