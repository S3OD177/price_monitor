import { useTranslations } from 'next-intl';

export default function ProductPage() {
    const t = useTranslations('Landing');
    return (
        <div className="container py-24">
            <h1 className="text-4xl font-bold">Product</h1>
            <p className="mt-4 text-muted-foreground">Coming soon...</p>
        </div>
    );
}
