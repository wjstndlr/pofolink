import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const portfolioId = formData.get("portfolioId") as string | null;
    const path = formData.get("path") as string | null;

    if (!file || !portfolioId) {
      return NextResponse.json(
        { error: "File and portfolioId are required" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}.${ext}`;
    const storagePath = `${portfolioId}/${path || "general"}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("portfolio-images")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Private bucket: signed URL (1년 유효)
    const { data: signedData, error: signError } = await supabase.storage
      .from("portfolio-images")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

    if (signError || !signedData?.signedUrl) {
      console.error("Signed URL error:", signError);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: signedData.signedUrl });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
