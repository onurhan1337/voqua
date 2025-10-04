import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioLines, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

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
                <Card key={avatar.id}>
                  <CardHeader className="pb-4">
                    <div className="relative">
                      <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                        {avatar.thumbnail_url ? (
                          <Image
                            src={avatar.thumbnail_url}
                            alt={avatar.name}
                            width={300}
                            height={200}
                            className="w-full h-auto object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-6xl">👤</div>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2"
                      >
                        {avatar.style}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{avatar.name}</CardTitle>
                      <CardDescription>{avatar.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {avatar.voice}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {avatar.style}
                      </Badge>
                    </div>

                    <Button
                      asChild
                      className="w-full outline-dashed outline-neutral-600 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-800 outline-1 outline-offset-2"
                    >
                      <Link
                        href={`/dashboard/content/create?avatar=${avatar.id}`}
                      >
                        <AudioLines className="h-4 w-4 mr-2" />
                        Create Video with {avatar.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
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
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Need More Avatars?</CardTitle>
                <CardDescription>
                  We&apos;re constantly adding new avatars with different
                  styles, voices, and characteristics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">Request Custom Avatar</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
