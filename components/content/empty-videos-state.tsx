import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyVideosState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          No videos yet
        </h3>
        <p className="text-neutral-500 mb-6">
          Create your first UGC video by selecting an avatar and generating
          content
        </p>
        <Button asChild>
          <Link href="/dashboard/creators">Create Your First Video</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
