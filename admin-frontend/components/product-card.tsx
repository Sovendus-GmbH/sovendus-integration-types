import { ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import React from "react";

interface ProductCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: {
    active: boolean;
    details: React.ReactNode;
  };
  metrics: {
    label: string;
    value: string;
  }[];
  onConfigure: () => void;
  requestDemoHref: string;
}

export function ProductCard({
  title,
  description,
  icon,
  status,
  metrics,
  onConfigure,
  requestDemoHref,
}: ProductCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center text-2xl">
              {icon}
              <span className="ml-2">{title}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          </div>
          <Badge
            variant={status.active ? "default" : "secondary"}
            className={cn(
              "ml-4",
              status.active
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100",
            )}
          >
            {status.active ? "Active" : "Not Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(requestDemoHref, "_blank")}
              className="hidden sm:flex"
            >
              Request Demo Tour
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={onConfigure}>
              Configure
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        {status.details && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">
              Current Configuration
            </h4>
            {status.details}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
