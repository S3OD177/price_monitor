import { createSessionClient } from "@/lib/appwrite/server";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Package, Tag, Layers, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AddCompetitorForm } from "@/components/products/add-competitor-form";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";

async function getProduct(id: string) {
    const { databases, account } = await createSessionClient();

    try {
        await account.get();
    } catch (error) {
        redirect("/auth");
    }

    return databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
        id
    );
}

async function getCompetitors(productId: string) {
    const { databases } = await createSessionClient();
    const competitors = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
        [Query.equal('productId', productId)]
    );
    return competitors.documents;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    const competitors = await getCompetitors(id);

    return (
        <div className="flex-1 space-y-8">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/products">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Product Details</h2>
                    <p className="text-muted-foreground">View and manage product information and competitors.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="h-fit hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>Key details about your product.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start space-x-6">
                            {product.imageUrl ? (
                                <div className="relative h-40 w-40 overflow-hidden rounded-xl border bg-muted shadow-sm">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-40 w-40 rounded-xl border bg-muted flex flex-col items-center justify-center text-muted-foreground shadow-sm">
                                    <Package className="h-10 w-10 mb-2 opacity-50" />
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}
                            <div className="space-y-3 flex-1">
                                <h3 className="text-xl font-semibold leading-tight">{product.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        {product.sku || 'No SKU'}
                                    </Badge>
                                    <Badge variant={product.platform === 'salla' ? 'default' : 'secondary'} className="flex items-center gap-1 capitalize">
                                        <Globe className="h-3 w-3" />
                                        {product.platform}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    Price
                                </p>
                                <p className="text-2xl font-bold tracking-tight">{product.price} <span className="text-sm font-normal text-muted-foreground">{product.currency}</span></p>
                            </div>
                            <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Layers className="h-4 w-4" />
                                    Stock
                                </p>
                                <p className="text-2xl font-bold tracking-tight">{product.stock}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>Competitor Links</CardTitle>
                            <CardDescription>Track prices from other stores.</CardDescription>
                        </div>
                        <AddCompetitorForm productId={product.$id} />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {competitors.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed bg-muted/30">
                                    <Globe className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                                    <p className="text-sm font-medium">No competitors added</p>
                                    <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                                        Add a competitor link to start tracking their prices.
                                    </p>
                                </div>
                            ) : (
                                competitors.map((comp: any) => (
                                    <div key={comp.$id} className="group flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{comp.label || "Competitor"}</p>
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                                    {new URL(comp.url).hostname.replace('www.', '')}
                                                </Badge>
                                            </div>
                                            <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center truncate max-w-[300px]">
                                                {comp.url}
                                                <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
