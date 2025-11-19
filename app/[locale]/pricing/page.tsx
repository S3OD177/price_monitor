'use client'

import { Check, X, Zap, TrendingUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for trying out PriceMonitor",
        icon: Zap,
        features: [
            { text: "Up to 10 products", included: true },
            { text: "1 connected store", included: true },
            { text: "Daily price updates", included: true },
            { text: "Basic analytics", included: true },
            { text: "Email support", included: true },
            { text: "Real-time alerts", included: false },
            { text: "Advanced analytics", included: false },
            { text: "API access", included: false },
            { text: "Priority support", included: false },
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: "49",
        description: "For growing businesses",
        icon: TrendingUp,
        features: [
            { text: "Up to 500 products", included: true },
            { text: "5 connected stores", included: true },
            { text: "Hourly price updates", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Real-time alerts", included: true },
            { text: "Email & chat support", included: true },
            { text: "API access", included: true },
            { text: "Custom reports", included: true },
            { text: "Priority support", included: false },
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large-scale operations",
        icon: Building2,
        features: [
            { text: "Unlimited products", included: true },
            { text: "Unlimited stores", included: true },
            { text: "Real-time price updates", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Real-time alerts", included: true },
            { text: "Dedicated support", included: true },
            { text: "API access", included: true },
            { text: "Custom integrations", included: true },
            { text: "SLA guarantee", included: true },
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

const faqs = [
    {
        question: "Can I change my plan later?",
        answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, Amex) and support local payment methods in the Middle East.",
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! The Pro plan comes with a 14-day free trial. No credit card required to start.",
    },
    {
        question: "What happens when I reach my product limit?",
        answer: "You'll receive a notification when you're approaching your limit. You can upgrade your plan to add more products.",
    },
    {
        question: "Do you offer refunds?",
        answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
    },
    {
        question: "Can I cancel anytime?",
        answer: "Absolutely! You can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-[58rem] text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Simple, Transparent Pricing
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground">
                                Choose the perfect plan for your business. Start free, upgrade as you grow.
                            </p>
                        </div>

                        {/* Billing Toggle */}
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
                                Monthly
                            </span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>
                                Yearly
                            </span>
                            {billingCycle === 'yearly' && (
                                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                            )}
                        </div>

                        {/* Pricing Cards */}
                        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
                            {plans.map((plan) => {
                                const Icon = plan.icon;
                                const yearlyPrice = plan.price !== "Custom" && plan.price !== "0"
                                    ? Math.round(parseFloat(plan.price) * 12 * 0.8).toString()
                                    : plan.price;
                                const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;

                                return (
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
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                            </div>
                                            <CardDescription>{plan.description}</CardDescription>
                                            <div className="mt-4">
                                                <span className="text-4xl font-bold">
                                                    {plan.price === "Custom" ? "Custom" : `$${displayPrice}`}
                                                </span>
                                                {plan.price !== "Custom" && (
                                                    <span className="text-muted-foreground">
                                                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                    </span>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        {feature.included ? (
                                                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                                        ) : (
                                                            <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                        )}
                                                        <span
                                                            className={
                                                                feature.included
                                                                    ? 'text-foreground'
                                                                    : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {feature.text}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Link href="/auth" className="w-full">
                                                <Button
                                                    className="w-full"
                                                    variant={plan.popular ? 'default' : 'outline'}
                                                    size="lg"
                                                >
                                                    {plan.cta}
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full py-12 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-[58rem] text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Frequently Asked Questions
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                Everything you need to know about our pricing and plans
                            </p>
                        </div>

                        <div className="mx-auto max-w-3xl grid gap-6 md:grid-cols-2">
                            {faqs.map((faq, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-muted-foreground mb-4">Still have questions?</p>
                            <Link href="/contact">
                                <Button variant="outline" size="lg">
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
