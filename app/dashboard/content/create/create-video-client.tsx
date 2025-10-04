"use client";

import { useState, useCallback, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Volume2, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AvatarPreview {
  id: string;
  name: string;
  style: string;
  voice: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  story: string | null;
  accent: string | null;
}

interface CreateVideoClientProps {
  avatars: AvatarPreview[];
  initialSelectedAvatar: string;
}

interface VoiceOption {
  id: string;
  name: string;
  gender: string;
  description: string;
}

const ELEVENLABS_VOICES: VoiceOption[] = [
  { id: "Rachel", name: "Rachel", gender: "female", description: "Warm, calm" },
  {
    id: "Domi",
    name: "Domi",
    gender: "female",
    description: "Strong, confident",
  },
  { id: "Bella", name: "Bella", gender: "female", description: "Soft, kind" },
  { id: "Antoni", name: "Antoni", gender: "male", description: "Well-rounded" },
  { id: "Elli", name: "Elli", gender: "female", description: "Energetic" },
  { id: "Josh", name: "Josh", gender: "male", description: "Young, casual" },
  { id: "Arnold", name: "Arnold", gender: "male", description: "Crisp, clear" },
  { id: "Adam", name: "Adam", gender: "male", description: "Deep, confident" },
  { id: "Sam", name: "Sam", gender: "male", description: "Raspy, young" },
];

function calculateDuration(text: string): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordsPerSecond = 2.5;
  return Math.ceil(words.length / wordsPerSecond);
}

export function CreateVideoClient({
  avatars,
  initialSelectedAvatar,
}: CreateVideoClientProps) {
  const [script, setScript] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string>("Rachel");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentAvatar = avatars.find((a) => a.id === initialSelectedAvatar);

  const duration = useMemo(() => calculateDuration(script), [script]);
  const wordCount = useMemo(
    () =>
      script
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    [script]
  );

  const handleGenerateVideo = useCallback(async () => {
    if (!currentAvatar || !script.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar_id: currentAvatar.id,
          script,
          voice: selectedVoice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = `/dashboard/content?video_id=${data.id}`;
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Video generation error:", error);
      alert("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [currentAvatar, script, selectedVoice]);

  if (!currentAvatar) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No avatars available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/creators">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Avatars
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="grid gap-6">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      {currentAvatar.thumbnail_url ? (
                        <Image
                          src={currentAvatar.thumbnail_url}
                          alt={currentAvatar.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-4xl">👤</div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {currentAvatar.name}
                      </CardTitle>
                      <CardDescription className="mb-3">
                        {currentAvatar.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{currentAvatar.style}</Badge>
                        <Badge variant="outline">{currentAvatar.voice}</Badge>
                        {currentAvatar.accent && (
                          <Badge variant="outline">
                            🌍 {currentAvatar.accent}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/creators">Change Avatar</Link>
                  </Button>
                </div>
              </CardHeader>
              {currentAvatar.story && (
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Character Story
                    </h4>
                    <p className="text-sm text-blue-700">
                      {currentAvatar.story}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Text-to-Speech
              </CardTitle>
              <CardDescription>
                Enter the text you want {currentAvatar.name} to say in the video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="voice">Voice</Label>
                  <Select
                    value={selectedVoice}
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                        Female Voices
                      </div>
                      {ELEVENLABS_VOICES.filter(
                        (v) => v.gender === "female"
                      ).map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name} — {voice.description}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 mt-2">
                        Male Voices
                      </div>
                      {ELEVENLABS_VOICES.filter((v) => v.gender === "male").map(
                        (voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name} — {voice.description}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the voice for your avatar
                  </p>
                </div>

                <div>
                  <Label htmlFor="script">Script</Label>
                  <Textarea
                    id="script"
                    placeholder="Enter what you want the avatar to say..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="mt-1"
                    rows={8}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Write the exact text that will be converted to speech and
                    lip-synced
                  </p>
                  <div className="mt-2 text-xs text-gray-400 tabular-nums">
                    {wordCount} words • {script.length} characters • ~{duration}{" "}
                    seconds
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || !script.trim()}
                  className="w-fit flex-row items-center outline-dashed outline-blue-800 outline-1 outline-offset-2 font-mono disabled:outline-none transition-all duration-300"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2 text-white" />
                      Processing TTS & Lip-sync...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2 fill-blue-400 stroke-blue-600" />
                      Generate Video
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  TTS + Lip-sync processing typically takes 1-3 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
