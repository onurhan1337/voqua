import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AudioLines,
  Users,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <AudioLines className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">Voqua</span>
          </div>
          <AuthButton />
        </div>
      </nav>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-in fade-in duration-1000">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered UGC Platform
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Create Authentic UGC Videos
              <br />
              <span className="text-stone-400 text-pretty font-mono">
                with AI Avatars
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate authentic user-generated content videos at scale. Perfect
              for brands, agencies, and creators who need diverse, high-quality
              UGC content.
            </p>

            <div className="bg-gradient-to-r from-muted/20 to-muted/30 rounded-xl p-8 mb-12 max-w-2xl mx-auto border border-muted/50">
              <div className="flex items-center justify-center space-x-12">
                <div className="text-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-105 transition-transform duration-200 shadow-inner">
                    <Users className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Choose Avatar
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    AI presenter
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary/30 to-primary/50"></div>
                  <div className="w-0 h-0 border-l-2 border-l-primary/50 border-t-1 border-t-transparent border-b-1 border-b-transparent ml-1"></div>
                </div>

                <div className="text-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-105 transition-transform duration-200 shadow-inner">
                    <AudioLines
                      className="h-7 w-7 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Write Script
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Multiple voices
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary/30 to-primary/50"></div>
                  <div className="w-0 h-0 border-l-2 border-l-primary/50 border-t-1 border-t-transparent border-b-1 border-b-transparent ml-1"></div>
                </div>

                <div className="text-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-105 transition-transform duration-200 shadow-inner">
                    <Zap className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Generate
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    2 min
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">UGC Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2min</div>
                <div className="text-sm text-muted-foreground">
                  Generation Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">AI Avatar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for UGC Content</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create authentic, diverse UGC videos at
              scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Professional AI Avatar</CardTitle>
                <CardDescription>
                  High-quality AI presenter with professional appearance and
                  natural voice for authentic UGC content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <AudioLines className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Multiple Voice Options</CardTitle>
                <CardDescription>
                  Choose from various ElevenLabs voices with different tones and
                  speaking styles to match your content needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Perfect Lip-Sync</CardTitle>
                <CardDescription>
                  Advanced AI ensures natural mouth movements that perfectly
                  sync with the generated speech.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Multi-Language</CardTitle>
                <CardDescription>
                  Create UGC content in multiple languages with native-sounding
                  voices for global campaigns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Fast Generation</CardTitle>
                <CardDescription>
                  Generate high-quality UGC videos in under 2 minutes, perfect
                  for rapid content creation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>
                  Simple API integration and quick video generation for seamless
                  content creation workflows.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Create UGC videos in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Avatar</h3>
              <p className="text-muted-foreground">
                Select our professional AI presenter for your UGC content
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Write Script</h3>
              <p className="text-muted-foreground">
                Input your UGC script and select the perfect voice and tone
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Generate & Download
              </h3>
              <p className="text-muted-foreground">
                Get your authentic UGC video ready for campaigns in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Perfect for UGC Campaigns
            </h2>
            <p className="text-lg text-muted-foreground">
              Ideal for brands and agencies creating authentic user-generated
              content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Brand Campaigns</CardTitle>
                <CardDescription>
                  Create diverse UGC content for product launches, testimonials,
                  and social media campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Product testimonials
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Social media content
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Influencer-style videos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agency Services</CardTitle>
                <CardDescription>
                  Scale your UGC production for multiple clients with consistent
                  quality and diverse representation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bulk content creation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    A/B testing variations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Multi-language campaigns
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Scale Your UGC Content?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join brands and agencies creating authentic UGC videos at scale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start Creating UGC
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground p-1.5 rounded">
                  <AudioLines className="h-4 w-4" />
                </div>
                <span className="font-semibold">Voqua</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered UGC content platform for brands and agencies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#api" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Voqua. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
