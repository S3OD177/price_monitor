import { Building2, Users, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-[58rem] text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                About PriceMonitor
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground">
                                We're on a mission to help e-commerce businesses stay competitive with real-time price monitoring and intelligent insights.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader>
                                    <Building2 className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Our Mission</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Empower online retailers with data-driven pricing strategies to maximize profits and stay ahead of competition.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Users className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Our Team</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        A dedicated team of developers and e-commerce experts passionate about helping businesses succeed.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Target className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Our Vision</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        To become the leading price monitoring platform for e-commerce businesses across the Middle East and beyond.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <Award className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Our Values</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Transparency, innovation, and customer success drive everything we do at PriceMonitor.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mx-auto mt-16 max-w-3xl">
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    PriceMonitor was founded in 2024 with a simple goal: make competitive price tracking accessible to every e-commerce business, regardless of size.
                                </p>
                                <p>
                                    We noticed that many online retailers were losing sales simply because they couldn't keep track of competitor pricing in real-time. Manual price checking was time-consuming and error-prone.
                                </p>
                                <p>
                                    Today, PriceMonitor helps hundreds of businesses across the region optimize their pricing strategies, increase margins, and stay competitive in the fast-paced world of e-commerce.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
