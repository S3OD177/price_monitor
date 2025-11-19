import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations } from 'next-intl';
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  const t = useTranslations('Landing');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                PriceMonitor
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary text-muted-foreground">{t('nav.features')}</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-primary text-muted-foreground">{t('nav.howItWorks')}</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary text-muted-foreground">{t('nav.pricing')}</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <ModeToggle />
            <Link href="/auth">
              <Button variant="ghost" size="sm">{t('nav.signIn')}</Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="rounded-full px-6">{t('nav.getStarted')}</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                    {t('nav.features')}
                  </Link>
                  <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                    {t('nav.howItWorks')}
                  </Link>
                  <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                    {t('nav.pricing')}
                  </Link>
                  <div className="border-t pt-4 flex flex-col gap-2">
                    <Link href="/auth" className="w-full">
                      <Button variant="outline" className="w-full justify-start">{t('nav.signIn')}</Button>
                    </Link>
                    <Link href="/auth" className="w-full">
                      <Button className="w-full justify-start">{t('nav.getStarted')}</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <PricingPreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
