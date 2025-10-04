import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AudioLines,
  Plus,
  Users,
  Target,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const campaigns = [
  {
    id: "1",
    name: "Q1 Product Launch",
    description: "Launch campaign for new product features",
    status: "active",
    videos: 12,
    views: 15420,
    engagement: 8.5,
    createdAt: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: "2",
    name: "Holiday Marketing",
    description: "Seasonal promotional content",
    status: "completed",
    videos: 8,
    views: 22300,
    engagement: 12.3,
    createdAt: "2023-12-01",
    endDate: "2023-12-31",
  },
  {
    id: "3",
    name: "Brand Awareness",
    description: "General brand awareness and education",
    status: "draft",
    videos: 0,
    views: 0,
    engagement: 0,
    createdAt: "2024-01-15",
    endDate: "2024-06-30",
  },
];

export default function CampaignsPage() {
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
        <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-0">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2 text-balance tracking-tight">
                Campaign Management
              </h2>
              <p className="text-neutral-600 text-balance">
                Organize and track your UGC video campaigns
              </p>
            </div>
            <Button className="outline-dashed outline-amber-600 outline-1 outline-offset-2">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Campaign Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Campaigns
                    </p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Videos
                    </p>
                    <p className="text-2xl font-bold">20</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shadow-inner border border-neutral-200">
                    <AudioLines className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Views
                    </p>
                    <p className="text-2xl font-bold">37.7K</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shadow-inner border border-neutral-200">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Avg Engagement
                    </p>
                    <p className="text-2xl font-bold">10.4%</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shadow-inner border border-neutral-200">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          {campaigns.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {campaign.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {campaign.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          campaign.status === "active"
                            ? "default"
                            : campaign.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {campaign.videos} videos
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {campaign.views.toLocaleString()} views
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {campaign.engagement}% engagement
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Ends: {campaign.endDate}</p>
                    </div>

                    <Button
                      size="sm"
                      className="w-full outline-dashed outline-neutral-600 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-800 outline-1 outline-offset-2"
                      asChild
                    >
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        View Campaign Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No campaigns yet
                </h3>
                <p className="text-neutral-500 mb-6">
                  Create your first campaign to organize and track your UGC
                  videos
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <AudioLines className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-medium">Create Video</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Generate a new UGC video with AI avatars
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/creators">Start Creating</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="font-medium">New Campaign</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Set up a new campaign for your videos
                  </p>
                  <Button size="sm" variant="outline">
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className="font-medium">Analytics</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    View detailed performance metrics
                  </p>
                  <Button size="sm" variant="outline">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
