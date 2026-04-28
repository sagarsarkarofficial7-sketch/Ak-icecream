import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Trash2, Save } from "lucide-react"

export default async function AdminHeroFlavorsPage() {
  const flavors = await prisma.heroFlavor.findMany({ orderBy: { createdAt: 'asc' } })

  async function updateFlavor(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    await prisma.heroFlavor.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        subName: formData.get("subName") as string,
        description: formData.get("description") as string,
        themeColor: formData.get("themeColor") as string,
      }
    })
    revalidatePath("/admin/hero-flavors")
  }

  async function deleteFlavor(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    await prisma.heroFlavor.delete({ where: { id } })
    revalidatePath("/admin/hero-flavors")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hero Flavors</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage the prominent scrolling flavors on the home page.</p>
      </div>

      <div className="grid gap-6">
        {flavors.map(flavor => (
          <form key={flavor.id} action={updateFlavor} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col gap-4">
            <input type="hidden" name="id" value={flavor.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Name</label>
                <input name="name" defaultValue={flavor.name} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Sub Name</label>
                <input name="subName" defaultValue={flavor.subName} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Description</label>
                <textarea name="description" defaultValue={flavor.description} rows={2} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Theme Color Hex</label>
                <div className="flex gap-2 items-center">
                  <div className="h-8 w-8 rounded shrink-0 border border-neutral-700" style={{ backgroundColor: flavor.themeColor }} />
                  <input name="themeColor" defaultValue={flavor.themeColor} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button formAction={deleteFlavor} className="flex items-center justify-center gap-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 px-4 py-2 rounded-lg text-sm transition-colors">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <button type="submit" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}
