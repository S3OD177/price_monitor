import { createSessionClient } from "@/lib/appwrite/server";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import { Query } from "appwrite";
import { redirect } from "next/navigation";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsToolbar } from "@/components/products/products-toolbar";

async function getProducts(query?: string) {
    const { databases, account } = await createSessionClient();

    try {
        await account.get();
    } catch (error) {
        redirect("/auth");
    }

    const queries = [];
    if (query) {
        queries.push(Query.search('name', query));
    }

    const products = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
        queries
    );
    return products.documents;
}

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
    const products = await getProducts(searchParams.q);

    return (
        <div className="flex-1 space-y-8">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage and monitor your product catalog.</p>
                </div>
            </div>

            <div className="space-y-4">
                <ProductsToolbar />
                <ProductsTable products={products as any} />
            </div>
        </div>
    );
}
