import { createClient } from "@/lib/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, ArrowRight, Users, Clock, Play, Download } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.email?.split("@")[0] || "User";

  const { data: recentVideos } = await supabase
    .from("generated_videos")
    .select(
      `
      id,
      script,
      status,
      created_at,
      avatar:avatar_previews(name)
    `
    )
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch total video count
  const { count: totalVideos } = await supabase
    .from("generated_videos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id || "");

  // Fetch avatar count
  const { count: avatarCount } = await supabase
    .from("avatar_previews")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
        <SidebarTrigger />
      </header>

      <div className="flex-1 overflow-auto bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-muted-foreground">
              Create AI-powered UGC videos with avatars and manage your content.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Total Videos
                    </p>
                    <p className="text-2xl font-bold">{totalVideos || 0}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      AI Avatars
                    </p>
                    <p className="text-2xl font-bold">{avatarCount || 0}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Generation Time
                    </p>
                    <p className="text-2xl font-bold">2min</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative group">
              <Card className="hover:shadow-md transition-shadow cursor-pointer rounded-none border border-neutral-300 group-hover:border-muted-foreground/40 duration-300">
                <CardContent className="p-6">
                  <Link href="/dashboard/content/create" className="block">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shadow-inner border border-neutral-300">
                        <Video
                          className="h-5 w-5 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Create Video
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generate new content
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary/50 group-hover:border-primary group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-primary/50 group-hover:border-primary group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
            </div>

            <div className="relative group">
              <Card className="hover:shadow-md transition-shadow cursor-pointer rounded-none border border-neutral-300 group-hover:border-muted-foreground/40 duration-300">
                <CardContent className="p-6">
                  <Link href="/dashboard/content" className="block">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shadow-inner border border-neutral-300">
                        <Download
                          className="h-5 w-5 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Manage Videos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          View & download
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-muted-foreground/50 group-hover:border-muted-foreground group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-muted-foreground/50 group-hover:border-muted-foreground group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
            </div>

            <div className="relative group">
              <Card className="hover:shadow-md transition-shadow cursor-pointer rounded-none border border-neutral-300 group-hover:border-muted-foreground/40 duration-300">
                <CardContent className="p-6">
                  <Link href="/dashboard/creators" className="block">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shadow-inner border border-neutral-300">
                        <Users
                          className="h-5 w-5 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Browse Avatars
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Choose presenters
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
              {/* Corner decorations that "close" the border */}
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-muted-foreground/50 group-hover:border-muted-foreground group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-muted-foreground/50 group-hover:border-muted-foreground group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
            </div>
          </div>

          {/* Recent Videos */}
          {recentVideos && recentVideos.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Videos</CardTitle>
                    <CardDescription>Your latest UGC content</CardDescription>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="border border-dashed border-neutral-300 rounded-none"
                  >
                    <Link href="/dashboard/content">
                      View All
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentVideos.slice(0, 3).map((video) => (
                    <Link
                      key={video.id}
                      href="/dashboard/content"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shadow-inner border border-neutral-300">
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {video.script.slice(0, 40)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.avatar[0]?.name} •{" "}
                          {new Date(video.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          video.status === "completed"
                            ? "default"
                            : video.status === "processing"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {video.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {(!recentVideos || recentVideos.length === 0) && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Video
                    className="h-8 w-8 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No videos yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start creating your first AI-powered UGC video with our
                  professional avatars
                </p>
                <Button asChild>
                  <Link href="/dashboard/content/create">
                    <Video className="mr-2 h-4 w-4" />
                    Create Your First Video
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
