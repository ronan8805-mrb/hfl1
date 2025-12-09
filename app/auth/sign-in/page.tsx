import { AuthForm } from '@/components/auth/auth-form'
import { AuthRedirect } from '@/components/auth/auth-redirect'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Hammond&apos;s Fight Lab
            </h1>
          <p className="text-muted-foreground">
            Sign in with your email and password
          </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </>
  )
}

