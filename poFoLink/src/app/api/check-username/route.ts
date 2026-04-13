import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  if (!/^[a-z0-9-]{3,30}$/.test(username)) {
    return NextResponse.json({ available: false, reason: "Invalid format" });
  }

  const { data } = await supabase
    .from("portfolios")
    .select("id")
    .eq("username", username)
    .single();

  return NextResponse.json({ available: !data });
}
