import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Sign In</h1>
      <AuthForm mode="login" />
    </main>
  );
}
