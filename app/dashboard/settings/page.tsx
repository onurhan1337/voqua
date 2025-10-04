import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/app/dashboard/settings/settings-client";
import { logger } from "@/lib/logger";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("User not found");
    redirect("/auth/login");
  }

  return <SettingsClient user={user} />;
}
