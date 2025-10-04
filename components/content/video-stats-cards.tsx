import { Card, CardContent } from "@/components/ui/card";
import { Play, Eye, Clock, Download } from "lucide-react";

interface VideoStats {
  totalVideos: number;
  completedVideos: number;
  processingVideos: number;
  totalDuration: number;
}

interface VideoStatsCardsProps {
  stats: VideoStats;
}

export function VideoStatsCards({ stats }: VideoStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Total Videos
              </p>
              <p className="text-2xl font-bold">{stats.totalVideos}</p>
            </div>
            <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 shadow-inner flex items-center justify-center">
              <Play className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-bold">{stats.completedVideos}</p>
            </div>
            <div className="h-8 w-8 rounded-md bg-green-100 border border-green-900/20 shadow-inner flex items-center justify-center">
              <Eye className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Processing
              </p>
              <p className="text-2xl font-bold">{stats.processingVideos}</p>
            </div>
            <div className="h-8 w-8 rounded-md bg-yellow-100 border border-yellow-900/20 shadow-inner flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Total Duration
              </p>
              <p className="text-2xl font-bold">
                {stats.totalDuration.toFixed(1)}m
              </p>
            </div>
            <div className="h-8 w-8 rounded-md bg-purple-100 border border-purple-900/20 shadow-inner flex items-center justify-center">
              <Download className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
