import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary using a promise-wrapped stream
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "ak-icecream",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: (uploadResult as any).secure_url })
  } catch (error) {
    console.error("UPLOAD ERROR", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
