import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { StatsCard } from "@/components/campaigns/stats-card";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { QuickActionCard } from "@/components/campaigns/quick-action-card";

type CampaignStatus = "active" | "completed" | "draft";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  videos: number;
  views: number;
  engagement: number;
  createdAt: string;
  endDate: string;
}

const campaigns: Campaign[] = [
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

function calculateStats(campaigns: Campaign[]) {
  const totalVideos = campaigns.reduce(
    (sum: number, campaign: Campaign) => sum + campaign.videos,
    0
  );
  const totalViews = campaigns.reduce(
    (sum: number, campaign: Campaign) => sum + campaign.views,
    0
  );
  const averageEngagement =
    campaigns.length > 0
      ? campaigns.reduce(
          (sum: number, campaign: Campaign) => sum + campaign.engagement,
          0
        ) / campaigns.length
      : 0;

  return {
    totalCampaigns: campaigns.length,
    totalVideos,
    totalViews,
    averageEngagement: Number(averageEngagement.toFixed(1)),
  };
}

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

export default function CampaignsPage() {
  const stats = calculateStats(campaigns);
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

          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              title="Total Campaigns"
              value={stats.totalCampaigns}
              icon={Target}
              isPrimary
            />
            <StatsCard
              title="Total Videos"
              value={stats.totalVideos}
              icon={AudioLines}
            />
            <StatsCard
              title="Total Views"
              value={formatViews(stats.totalViews)}
              icon={TrendingUp}
            />
            <StatsCard
              title="Avg Engagement"
              value={`${stats.averageEngagement}%`}
              icon={Users}
            />
          </div>

          {campaigns.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
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

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <QuickActionCard
                title="Create Video"
                description="Generate a new UGC video with AI avatars"
                icon={AudioLines}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
                href="/dashboard/creators"
              />
              <QuickActionCard
                title="New Campaign"
                description="Set up a new campaign for your videos"
                icon={Target}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
                variant="outline"
              />
              <QuickActionCard
                title="Analytics"
                description="View detailed performance metrics"
                icon={TrendingUp}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
