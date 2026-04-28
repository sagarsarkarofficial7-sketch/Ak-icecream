"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, FileText, Image as ImageIcon, Settings, LogOut, Grid, Star, MapPin, Share2, BookOpen, Users, Mail } from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, permId: 'dashboard' },
  { name: 'Categories', href: '/admin/categories', icon: Grid, permId: 'categories' },
  { name: 'Products', href: '/admin/products', icon: Package, permId: 'products' },
  { name: 'Blogs', href: '/admin/blogs', icon: BookOpen, permId: 'blogs' },
  { name: 'Hero Flavors', href: '/admin/hero-flavors', icon: Star, permId: 'hero-flavors' },
  { name: 'Stores', href: '/admin/stores', icon: MapPin, permId: 'stores' },
  { name: 'Social Posts', href: '/admin/social-posts', icon: Share2, permId: 'social-posts' },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, permId: 'orders' },
  { name: 'Inquiries', href: '/admin/inquiries', icon: Mail, permId: 'inquiries' },
  { name: 'Users', href: '/admin/users', icon: Users, permId: 'users' },
  { name: 'Content', href: '/admin/content', icon: FileText, permId: 'content' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, permId: 'settings' },
]

export function Sidebar({ userPermissions = ["all"] }: { userPermissions?: string[] }) {
  const pathname = usePathname()
  
  const filteredNav = navigation.filter(item => {
     if (userPermissions.includes("all")) return true;
     if (userPermissions.includes(item.permId)) return true;
     // Ensure that basic access might still getDashboard if we wanted, else strict cutoff
     return false;
  });

  return (
    <div className="flex h-full w-64 flex-col bg-neutral-900 border-r border-neutral-800">
      <div className="flex bg-neutral-950 h-16 shrink-0 items-center justify-center border-b border-neutral-800">
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          AK Admin
        </span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-500' : 'text-neutral-500 group-hover:text-emerald-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex shrink-0 border-t border-neutral-800 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0 text-neutral-500 transition-colors group-hover:text-red-400" />
          Sign out
        </button>
      </div>
    </div>
  )
}
