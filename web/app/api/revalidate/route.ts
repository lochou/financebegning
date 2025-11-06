
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const tag = req.nextUrl.searchParams.get("tag") || "items";
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(tag);
  return NextResponse.json({ ok: true, tag });
}
