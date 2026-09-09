import { CheckCircleIcon, CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./acquire-plan-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

interface PricingCardProps {
  title: string;
  description: string;
  price: string | number;
  period?: string;
  equivalentPrice?: string;
  isCurrentPlan: boolean;
  highlightBadge?: string;
  isHighlighted?: boolean;
  features: {
    title: string;
    description: React.ReactNode;
    isIncluded: boolean;
  }[];
  button: {
    title: string;
    buttonType: "manage" | "downgrade" | "upgrade";
    priceId?: string;
  };
}

export default function PricingCard({
  title,
  description,
  price,
  period = "/mês",
  equivalentPrice,
  isCurrentPlan,
  highlightBadge,
  isHighlighted,
  features,
  button,
}: PricingCardProps) {
  return (
    <Card
      className={`relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isHighlighted ? "border-2 border-primary shadow-lg" : "border-border"
      }`}
    >
      {highlightBadge && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {highlightBadge}
        </div>
      )}

      <CardHeader
        className={`space-y-3 border-b p-4 py-5 md:p-6 md:py-5 ${isHighlighted || highlightBadge ? "bg-primary/[0.03]" : ""}`}
      >
        {isCurrentPlan && (
          <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <CheckCircleIcon className="size-3.5" />
            Plano atual
          </div>
        )}

        <div
          className={`space-y-1.5 text-center ${highlightBadge ? "pr-16 sm:pr-20" : ""}`}
        >
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-0.5 text-center">
          <div className="flex items-end justify-center gap-2">
            <span className="mb-1 text-lg font-medium text-muted-foreground">
              R$
            </span>
            <span
              className={`text-4xl font-bold tracking-tight sm:text-5xl ${isHighlighted ? "text-primary" : ""}`}
            >
              {price}
            </span>
            {period && (
              <span className="mb-1.5 text-sm text-muted-foreground">
                {period}
              </span>
            )}
          </div>
          {equivalentPrice && (
            <p className="text-xs text-muted-foreground">
              por ano · equivalente a{" "}
              <span className="font-semibold text-foreground">
                {equivalentPrice}
              </span>
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-5 p-4 py-5 md:p-6 md:py-5">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`mt-0.5 shrink-0 rounded-full p-1 ${feature.isIncluded ? "bg-primary/10" : "bg-muted"}`}
              >
                {feature.isIncluded ? (
                  <CheckIcon className="size-4 text-primary" />
                ) : (
                  <XIcon className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`font-medium ${!feature.isIncluded ? "text-muted-foreground" : ""}`}
                >
                  {feature.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <AcquirePlanButton
          title={button.title}
          priceId={button.priceId}
          buttonType={button.buttonType}
        />
      </CardContent>
    </Card>
  );
}
