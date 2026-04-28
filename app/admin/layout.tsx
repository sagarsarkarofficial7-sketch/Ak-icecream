import { Sidebar } from "@/components/admin/Sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Admin Dashboard | AK Icecream",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  let finalPermissions = ["all"];
  if (session.user?.email && session.user.email !== process.env.ADMIN_EMAIL) {
     const authedDBUser = await prisma.user.findUnique({ where: { email: session.user.email } }) as any;
     if (authedDBUser && authedDBUser.permissions) {
        try { finalPermissions = JSON.parse(authedDBUser.permissions); } catch (e) {}
     }
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar userPermissions={finalPermissions} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900 px-8">
          <h2 className="text-lg font-medium text-neutral-200">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">Logged in as {session.user?.email}</span>
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">
              {session.user?.name ? session.user.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-950 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
