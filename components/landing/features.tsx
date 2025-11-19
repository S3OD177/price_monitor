import { BarChart3, Bell, Globe, Zap, Lock, CheckCircle2, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl';

export function Features() {
    const t = useTranslations('Landing');

    return (
        <section id="features" className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
                        {t('features.title')}
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        {t('features.subtitle')}
                    </p>
                </div>

                <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
                    <Card className="group relative overflow-hidden border-muted-foreground/10 bg-background transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                <Globe className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{t('features.multiPlatform.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('features.multiPlatform.desc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-muted-foreground/10 bg-background transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                <BarChart3 className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{t('features.analytics.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('features.analytics.desc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-muted-foreground/10 bg-background transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                <Zap className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{t('features.sync.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('features.sync.desc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-muted-foreground/10 bg-background transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                <Lock className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{t('features.secure.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('features.secure.desc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-muted-foreground/10 bg-background transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{t('features.alerts.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('features.alerts.desc')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-muted-foreground/10 bg-background transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{t('features.insights.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('features.insights.desc')}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
