"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-neutral-500" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="admin@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-500" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  )
}
