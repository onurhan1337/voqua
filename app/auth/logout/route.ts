import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Logout error");
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
