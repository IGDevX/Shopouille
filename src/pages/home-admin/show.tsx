import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

const cards = [
  {
    description: "Total Revenue",
    value: "$1,250.00",
    badge: "+12.5%",
    badgeTrend: "up",
    footerTitle: "Trending up this month",
    footerDescription: "Visitors for the last 6 months",
  },
  {
    description: "New Customers",
    value: "1,234",
    badge: "-20%",
    badgeTrend: "down",
    footerTitle: "Down 20% this period",
    footerDescription: "Acquisition needs attention",
  },
  {
    description: "Active Accounts",
    value: "45,678",
    badge: "+12.5%",
    badgeTrend: "up",
    footerTitle: "Strong user retention",
    footerDescription: "Engagement exceed targets",
  },
  {
    description: "Growth Rate",
    value: "4.5%",
    badge: "+4.5%",
    badgeTrend: "up",
    footerTitle: "Steady performance increase",
    footerDescription: "Meets growth projections",
  },
];

export function ShowHomeAdmin() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">
          Survolez vos métriques clés depuis une mosaïque homogène, cohérente
          avec la personnalisation.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.description} className="@container/card">
            <CardHeader>
              <CardDescription>{card.description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {card.badgeTrend === "up" ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {card.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerTitle}
                {card.badgeTrend === "up" ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                {card.footerDescription}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
