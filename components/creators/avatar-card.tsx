import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioLines } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Avatar {
  id: string;
  name: string;
  description: string;
  style: string;
  voice: string;
  thumbnail_url?: string;
  video_url?: string;
}

interface AvatarCardProps {
  avatar: Avatar;
}

export function AvatarCard({ avatar }: AvatarCardProps) {
  return (
    <Card>
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
          <Badge variant="secondary" className="absolute top-2 right-2">
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
          <Link href={`/dashboard/content/create?avatar=${avatar.id}`}>
            <AudioLines className="h-4 w-4 mr-2" />
            Create Video with {avatar.name}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
