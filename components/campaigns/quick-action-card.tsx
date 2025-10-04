import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  href?: string;
  variant?: "default" | "outline";
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  href,
  variant = "default",
}: QuickActionCardProps) {
  const buttonContent = (
    <Button size="sm" variant={variant} asChild={!!href}>
      {href ? <Link href={href}>{title}</Link> : <span>{title}</span>}
    </Button>
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`h-8 w-8 rounded-lg ${iconBgColor} flex items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <h4 className="font-medium">{title}</h4>
        </div>
        <p className="text-sm text-neutral-600 mb-4">{description}</p>
        {buttonContent}
      </CardContent>
    </Card>
  );
}
