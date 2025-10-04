import { NextResponse } from "next/server";
import { getAvatars, getAvatarCount } from "@/lib/api/avatars";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = searchParams.get("count") === "true";

    if (count) {
      const avatarCount = await getAvatarCount();
      return NextResponse.json({ count: avatarCount });
    }

    const avatars = await getAvatars();
    return NextResponse.json(avatars);
  } catch (error) {
    console.error("Error in avatars API:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}
