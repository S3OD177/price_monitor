import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-[58rem] text-center mb-12">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Get in Touch
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground">
                                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                        <CardDescription>Reach out to us through any of these channels</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <Mail className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Email</p>
                                                <a href="mailto:support@pricemonitor.com" className="text-sm text-muted-foreground hover:text-primary">
                                                    support@pricemonitor.com
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <Phone className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Phone</p>
                                                <a href="tel:+966123456789" className="text-sm text-muted-foreground hover:text-primary">
                                                    +966 12 345 6789
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Office</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Riyadh, Saudi Arabia
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Live Chat</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Available Mon-Fri, 9am-5pm GST
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                    <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="Your name" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="your@email.com" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="How can we help?" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={5}
                                            />
                                        </div>

                                        <Button type="submit" className="w-full">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
