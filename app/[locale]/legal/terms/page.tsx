export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <section className="w-full py-12 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
                            <p className="text-sm text-muted-foreground mb-8">Last updated: January 2024</p>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground mb-4">
                                    By accessing and using PriceMonitor, you accept and agree to be bound by the terms and provision of this agreement.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
                                <p className="text-muted-foreground mb-4">
                                    We grant you a limited, non-exclusive, non-transferable license to use PriceMonitor for your business purposes in accordance with these terms.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
                                <p className="text-muted-foreground mb-4">
                                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">4. Acceptable Use</h2>
                                <p className="text-muted-foreground mb-4">
                                    You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">5. Service Availability</h2>
                                <p className="text-muted-foreground mb-4">
                                    While we strive for 99.9% uptime, we do not guarantee that the service will be available at all times and may suspend access for maintenance.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">6. Termination</h2>
                                <p className="text-muted-foreground mb-4">
                                    We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
                                <p className="text-muted-foreground mb-4">
                                    PriceMonitor shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the service.
                                </p>

                                <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact</h2>
                                <p className="text-muted-foreground mb-4">
                                    For questions about these Terms of Service, contact us at legal@pricemonitor.com
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
