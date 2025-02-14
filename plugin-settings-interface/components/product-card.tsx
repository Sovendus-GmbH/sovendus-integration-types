import { ChevronRight, ExternalLink } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
  buttonsDisabled: boolean;
}

export function ProductCard({
  title,
  description,
  icon,
  status,
  metrics,
  onConfigure,
  requestDemoHref,
  buttonsDisabled,
}: ProductCardProps): JSX.Element {
  return (
    <Card className={cn("w-full")}>
      <CardHeader className={cn("border-b")}>
        <div className={cn("flex items-start justify-between")}>
          <div className={cn("space-y-1")}>
            <CardTitle className={cn("flex items-center text-2xl")}>
              {icon}
              <span className={cn("ml-2")}>{title}</span>
            </CardTitle>
            <p className={cn("text-sm text-muted-foreground max-w-2xl")}>
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
      <CardContent className={cn("pt-6")}>
        <div
          className={cn("flex flex-wrap items-center justify-between gap-4")}
        >
          <div className={cn("flex flex-wrap gap-8")}>
            {metrics.map((metric, index) => (
              <div key={index} className={cn("space-y-1")}>
                <p className={cn("text-sm text-muted-foreground")}>
                  {metric.label}
                </p>
                <p className={cn("text-2xl font-bold")}>{metric.value}</p>
              </div>
            ))}
          </div>
          <div className={cn("flex gap-2")}>
            <Button
              variant="outline"
              onClick={(): void => void window.open(requestDemoHref, "_blank")}
            >
              Request Demo Tour
              <ExternalLink className={cn("ml-2 h-4 w-4")} />
            </Button>
            <Button onClick={onConfigure} disabled={buttonsDisabled}>
              Configure
              <ChevronRight className={cn("ml-2 h-4 w-4")} />
            </Button>
          </div>
        </div>
        {status.details && (
          <div className={cn("mt-4 p-4 bg-gray-50 rounded-lg")}>
            <h4 className={cn("text-sm font-semibold mb-2")}>
              Current Configuration
            </h4>
            {status.details}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
