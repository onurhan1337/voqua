import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

interface CampaignCardProps {
  campaign: Campaign;
}

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

function getStatusVariant(
  status: CampaignStatus
): "default" | "secondary" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "draft":
    default:
      return "outline";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <CardDescription className="mt-1">
              {campaign.description}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(campaign.status)}>
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
            {formatViews(campaign.views)} views
          </Badge>
          <Badge variant="outline" className="text-xs">
            {campaign.engagement}% engagement
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Ends: {formatDate(campaign.endDate)}</p>
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
  );
}
