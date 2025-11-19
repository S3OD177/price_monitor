import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

export function CTA() {
    const t = useTranslations('Landing');

    return (
        <section className="w-full py-24">
            <div className="container mx-auto px-4">
                <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-24 text-center shadow-2xl">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                            {t('cta.title')}
                        </h2>
                        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                            {t('cta.desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link href="/auth">
                                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg w-full sm:w-auto">
                                    {t('cta.button')}
                                    <ArrowRight className="ml-2 h-5 w-5 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-primary-foreground/60 mt-4">
                            {t('cta.subtext')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
