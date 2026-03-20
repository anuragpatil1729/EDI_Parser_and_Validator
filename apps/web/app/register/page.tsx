import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Register</h1>
      <AuthForm mode="register" />
    </main>
  );
}
