import { AuthSignUpForm } from '@/components/auth/auth-signup-form'
import { AuthRedirect } from '@/components/auth/auth-redirect'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join Hammond&apos;s Fight Lab
            </h1>
            <p className="text-muted-foreground">
              Create your account to start training
            </p>
          </div>
          <AuthSignUpForm />
        </div>
      </div>
    </>
  )
}

