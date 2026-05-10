import { NextResponse } from "next/server";
import { getPhase3ContentSnapshot } from "@/lib/phase3-content-service";

export async function GET() {
  try {
    const snapshot = await getPhase3ContentSnapshot();
    return NextResponse.json({ ok: true, snapshot });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", snapshot: null }, { status: 500 });
  }
}
