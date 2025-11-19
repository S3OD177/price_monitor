import { useTranslations } from 'next-intl';

export function HowItWorks() {
    const t = useTranslations('Landing');

    return (
        <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-12">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
                        {t('howItWorks.title')}
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10"></div>

                    <div className="flex flex-col items-center text-center space-y-4 relative group">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary/20 text-primary font-bold text-2xl shadow-lg group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                            1
                        </div>
                        <h3 className="text-xl font-bold">{t('howItWorks.step1.title')}</h3>
                        <p className="text-muted-foreground">{t('howItWorks.step1.desc')}</p>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 relative group">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary/20 text-primary font-bold text-2xl shadow-lg group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                            2
                        </div>
                        <h3 className="text-xl font-bold">{t('howItWorks.step2.title')}</h3>
                        <p className="text-muted-foreground">{t('howItWorks.step2.desc')}</p>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 relative group">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary/20 text-primary font-bold text-2xl shadow-lg group-hover:border-primary group-hover:scale-105 transition-all duration-300">
                            3
                        </div>
                        <h3 className="text-xl font-bold">{t('howItWorks.step3.title')}</h3>
                        <p className="text-muted-foreground">{t('howItWorks.step3.desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
