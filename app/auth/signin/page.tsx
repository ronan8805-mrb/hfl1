import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access your courses
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}

