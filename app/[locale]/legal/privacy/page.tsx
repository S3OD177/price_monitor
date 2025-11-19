export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <section className="w-full py-12 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
                            <p className="text-sm text-muted-foreground mb-8">Last updated: January 2024</p>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
                                <p className="text-muted-foreground mb-4">
                                    We collect information that you provide directly to us, including when you create an account, connect your store, or contact us for support.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use the information we collect to provide, maintain, and improve our services, including monitoring competitor prices and providing analytics.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">3. Information Sharing</h2>
                                <p className="text-muted-foreground mb-4">
                                    We do not sell your personal information. We may share your information with service providers who assist us in operating our platform.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
                                <p className="text-muted-foreground mb-4">
                                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
                                <p className="text-muted-foreground mb-4">
                                    You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use cookies and similar technologies to provide and improve our services. You can control cookies through your browser settings.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about this Privacy Policy, please contact us at privacy@pricemonitor.com
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
