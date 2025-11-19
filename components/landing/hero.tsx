import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
    const t = useTranslations('Landing');

    return (
        <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-6 py-12 md:py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            </div>

            <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center relative">
                <Badge variant="outline" className="animate-in fade-in zoom-in duration-500 px-4 py-1.5 text-sm rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                    {t('hero.badge')}
                </Badge>

                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {t('hero.title')} <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        {t('hero.titleHighlight')}
                    </span>
                </h1>

                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    {t('hero.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <Link href="/auth">
                        <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                            {t('hero.startTrial')}
                            <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                        </Button>
                    </Link>
                    <Link href="/features">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full hover:bg-muted/50">
                            {t('hero.viewDemo')}
                        </Button>
                    </Link>
                </div>

                {/* Mockup / Visual */}
                <div className="mt-12 w-full max-w-5xl animate-in fade-in zoom-in duration-1000 delay-300">
                    <DashboardPreview />
                </div>
            </div>
        </section>
    )
}
