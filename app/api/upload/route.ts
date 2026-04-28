import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a promise-wrapped stream
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "ak-icecream-general",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Return the secure Cloudinary URL
    return NextResponse.json({ url: (uploadResult as any).secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
