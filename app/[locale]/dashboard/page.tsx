import { createSessionClient } from "@/lib/appwrite/server";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Package, Plus, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { StoreCard } from "@/components/dashboard/store-card";

async function getDashboardData(locale: string) {
    const { databases, account } = await createSessionClient();

    try {
        await account.get();
    } catch (error) {
        redirect(`/${locale}/auth`);
    }

    const stores = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.STORES,
        []
    );

    const products = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
        []
    );

    return { stores: stores.documents, products: products.documents, totalProducts: products.total };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { stores, totalProducts } = await getDashboardData(locale);

    return (
        <div className="flex-1 space-y-8">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your stores and products.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/settings">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Store
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Stores"
                    value={stores.length}
                    icon={Store}
                    description={
                        <span className="flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                            Active platforms
                        </span>
                    }
                />
                <StatCard
                    title="Total Products"
                    value={totalProducts}
                    icon={Package}
                    description="Across all stores"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Connected Stores</CardTitle>
                        <CardDescription>Manage your store integrations and sync status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stores.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed bg-muted/50">
                                    <Store className="h-10 w-10 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No stores connected</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                                        Connect your Salla or Trendyol store to start monitoring prices.
                                    </p>
                                    <Link href="/dashboard/settings">
                                        <Button variant="outline">Connect Store</Button>
                                    </Link>
                                </div>
                            ) : (
                                stores.map((store) => (
                                    <StoreCard key={store.$id} store={store} />
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/dashboard/products" className="block group">
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-sm">View All Products</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                        <Link href="/dashboard/settings" className="block group">
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-sm">Connect New Store</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
