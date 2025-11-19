import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for trying out",
        features: [
            "Up to 10 products",
            "1 connected store",
            "Daily price updates",
            "Basic analytics",
        ],
        popular: false,
    },
    {
        name: "Pro",
        price: "49",
        description: "For growing businesses",
        features: [
            "Up to 500 products",
            "5 connected stores",
            "Hourly price updates",
            "Advanced analytics",
            "Real-time alerts",
            "API access",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large-scale operations",
        features: [
            "Unlimited products",
            "Unlimited stores",
            "Real-time updates",
            "Dedicated support",
            "Custom integrations",
        ],
        popular: false,
    },
];

export function PricingPreview() {
    return (
        <section id="pricing" className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[58rem] text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Choose the perfect plan for your business
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative flex flex-col ${plan.popular
                                    ? 'border-primary shadow-lg scale-105'
                                    : 'border-muted-foreground/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">
                                        {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                                    </span>
                                    {plan.price !== "Custom" && (
                                        <span className="text-muted-foreground">/mo</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href="/pricing" className="w-full">
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? 'default' : 'outline'}
                                        size="lg"
                                    >
                                        {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/pricing">
                        <Button variant="ghost" size="lg">
                            View Full Pricing Details →
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
