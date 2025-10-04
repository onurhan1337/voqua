import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AvatarCard } from "@/components/creators/avatar-card";
import { RequestCard } from "@/components/creators/request-card";

export default async function CreatorsPage() {
  const supabase = await createClient();

  const { data: avatars, error } = await supabase
    .from("avatar_previews")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading avatars:", error);
  }
  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Available Avatars
            </h2>
            <p className="text-gray-600">
              Choose from our collection of AI-powered avatars. Each avatar has
              unique characteristics and voice options.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avatars && avatars.length > 0 ? (
              avatars.map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No avatars available yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Please add avatars to the database first.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <RequestCard
              title="Need More Avatars?"
              description="We're constantly adding new avatars with different styles, voices, and characteristics."
              buttonText="Request Custom Avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
