// import { LoginForm } from "@/components/login-form";

// export default async function LoginPage({
//   searchParams,
// }: {
//   searchParams?: Promise<{ redirect?: string }>;
// }) {
//   const params = (await searchParams) || {};

//   return (
//     <div className="flex min-h-[calc(100vh-96px)] items-center justify-center p-2 md:p-4">
//       <div className="w-full max-w-md space-y-4 rounded-lg border p-6 md:p-8 shadow-lg bg-white">
//         <div className="space-y-2 text-center">
//           <h1 className="text-xl md:text-3xl font-bold">Welcome Back</h1>
//           <p className="text-gray-500 text-justify">
//             Enter your credentials to access your account
//           </p>
//         </div>
//         <LoginForm redirect={params.redirect} />
//       </div>
//     </div>
//   );
// }
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const params = (await searchParams) || {};

  return (
    <div className="relative flex min-h-[calc(100vh-96px)] items-center justify-center overflow-hidden bg-[#0c0a08] p-4 md:p-6">
      {/* gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-[#c8a15a]/10 blur-[130px]"
      />

      <div className="relative w-full max-w-md border border-[#c8a15a]/30 bg-gradient-to-b from-[#1a150e] to-[#0c0a08] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] md:p-9 rounded-md md:rounded-lg">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-medium text-white md:text-4xl">
            Welcome back
          </h1>
          <span className="mx-auto mt-3 block h-px w-12 bg-[#c8a15a]" />
          <p className="mt-4 text-[15px] leading-relaxed text-[#968f83]">
            Sign in with your email to access your account.
          </p>
        </div>
        <LoginForm redirect={params.redirect} />
      </div>
    </div>
  );
}
