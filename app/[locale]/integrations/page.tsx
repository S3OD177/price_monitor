import { createSessionClient } from "@/lib/appwrite/server";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import { redirect } from "next/navigation";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { Store } from "lucide-react";

async function getConnectedStores() {
    const { databases, account } = await createSessionClient();

    try {
        await account.get();
    } catch (error) {
        redirect("/auth");
    }

    const stores = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.STORES,
        []
    );

    return stores.documents;
}

export default async function IntegrationsPage() {
    const stores = await getConnectedStores();

    const sallaConnected = stores.some((store: any) => store.platform === 'salla');
    const trendyolConnected = stores.some((store: any) => store.platform === 'trendyol');

    return (
        <div className="flex-1 space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
                <p className="text-muted-foreground">
                    Connect your e-commerce platforms to start monitoring prices.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <IntegrationCard
                    name="Salla"
                    description="Connect your Salla store to import products and track competitor prices."
                    logo={<Store className="h-6 w-6 text-green-600" />}
                    isConnected={sallaConnected}
                    connectUrl="/integrations/salla"
                    manageUrl="/dashboard/stores"
                />
                <IntegrationCard
                    name="Trendyol"
                    description="Connect your Trendyol store to import products and monitor market prices."
                    logo={<Store className="h-6 w-6 text-orange-600" />}
                    isConnected={trendyolConnected}
                    connectUrl="/integrations/trendyol"
                    manageUrl="/dashboard/stores"
                />
            </div>
        </div>
    );
}
