export default function CookiesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <section className="w-full py-12 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight mb-8">Cookie Policy</h1>
                            <p className="text-sm text-muted-foreground mb-8">Last updated: January 2024</p>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h2 className="text-2xl font-bold mt-8 mb-4">What Are Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use cookies for various purposes including:
                                </p>
                                <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
                                    <li>Keeping you signed in to your account</li>
                                    <li>Understanding how you use our service</li>
                                    <li>Remembering your preferences</li>
                                    <li>Improving our service performance</li>
                                </ul>

                                <h2 className="text-2xl font-bold mt-8 mb-4">Types of Cookies We Use</h2>
                                <div className="space-y-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                                        <p className="text-muted-foreground">
                                            These cookies are necessary for the website to function and cannot be switched off.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                                        <p className="text-muted-foreground">
                                            These help us understand how visitors interact with our website.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Preference Cookies</h3>
                                        <p className="text-muted-foreground">
                                            These remember your choices and preferences for a better experience.
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4">Managing Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    You can control and manage cookies through your browser settings. However, disabling cookies may affect your experience on our website.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have questions about our use of cookies, please contact us at privacy@pricemonitor.com
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
