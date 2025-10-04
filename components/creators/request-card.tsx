import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RequestCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function RequestCard({
  title,
  description,
  buttonText,
  onButtonClick,
}: RequestCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
