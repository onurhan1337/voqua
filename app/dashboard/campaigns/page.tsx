import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioLines, Plus, Users, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

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
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Campaigns
            </h2>
            <p className="text-gray-600">
              Organize and track your UGC video campaigns
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Campaign Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">3</p>
                  <p className="text-sm text-gray-500">Total Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <AudioLines className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">20</p>
                  <p className="text-sm text-gray-500">Total Videos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">37.7K</p>
                  <p className="text-sm text-gray-500">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">10.4%</p>
                  <p className="text-sm text-gray-500">Avg Engagement</p>
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
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Videos:</span>
                      <span className="ml-1 font-semibold">
                        {campaign.videos}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Views:</span>
                      <span className="ml-1 font-semibold">
                        {campaign.views.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Engagement:</span>
                      <span className="ml-1 font-semibold">
                        {campaign.engagement}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <span className="ml-1 font-semibold">
                        {campaign.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/creators">Add Video</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first campaign to organize and track your UGC videos
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                <p className="text-sm text-gray-600 mb-4">
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
                <p className="text-sm text-gray-600 mb-4">
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
                <p className="text-sm text-gray-600 mb-4">
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
  );
}
