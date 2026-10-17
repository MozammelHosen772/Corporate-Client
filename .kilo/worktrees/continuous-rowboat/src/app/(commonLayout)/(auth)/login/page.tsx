import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const params = (await searchParams) || {};

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 md:p-8 shadow-lg bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-xl md:text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-justify">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm redirect={params.redirect} />
      </div>
    </div>
  );
}
