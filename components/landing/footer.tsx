import Link from "next/link";
import { TrendingUp, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Landing');

    return (
        <footer className="w-full border-t bg-muted/20">
            <div className="container mx-auto px-4 pt-16 pb-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 mb-12">
                    <div className="col-span-2 lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <div className="bg-primary/10 p-1.5 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-bold text-xl">PriceMonitor</span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            {t('footer.desc')}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link
                                href="mailto:support@pricemonitor.com"
                                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
                            >
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">{t('footer.product')}</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/features" className="hover:text-foreground transition-colors">{t('nav.features')}</Link></li>
                            <li><Link href="/pricing" className="hover:text-foreground transition-colors">{t('nav.pricing')}</Link></li>
                            <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                            <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">{t('footer.company')}</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">{t('footer.legal')}</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        {t('footer.rights')}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
                        <span>•</span>
                        <Link href="/legal/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
