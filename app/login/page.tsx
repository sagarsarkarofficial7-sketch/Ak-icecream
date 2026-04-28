import { LoginForm } from "@/components/admin/LoginForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata = { title: "Admin Login | AK Icecream" }

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-neutral-400">Sign in to manage AK Icecream</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
