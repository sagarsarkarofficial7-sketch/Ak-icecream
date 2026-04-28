import { prisma } from "@/lib/prisma"
import { UserClient } from "@/components/admin/UserClient"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  }) as any[]

  const serializedUsers = users.map(u => ({
     ...u,
     createdAt: u.createdAt.toISOString(),
     updatedAt: u.updatedAt.toISOString(),
  }))

  return <UserClient initialUsers={serializedUsers} />
}
