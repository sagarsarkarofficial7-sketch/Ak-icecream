import { prisma } from "@/lib/prisma"
import BlogClientLayout from "./BlogClientLayout";

export const dynamic = 'force-dynamic'

// Revalidates dynamically on new fetches locally, or handles dynamic rendering
export default async function BlogPage() {
  const blogs = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  return <BlogClientLayout blogs={blogs} />;
}
