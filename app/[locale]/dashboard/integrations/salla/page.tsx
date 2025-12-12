import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getSallaAuthUrl } from "@/lib/salla/client"
import { createSessionClient } from "@/lib/appwrite/server"
import { redirect } from "next/navigation"

export default async function SallaConnectPage() {
    const { account } = await createSessionClient();

    let user;
    try {
        user = await account.get();
    } catch (error) {
        redirect("/auth");
    }

    // Generate OAuth URL with user ID as state for security
    const sallaAuthUrl = getSallaAuthUrl(user.$id);

    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Connect Salla Store</CardTitle>
                    <CardDescription>
                        You will be redirected to Salla to authorize access to your store.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">What we'll access:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Store information</li>
                            <li>Products (read-only)</li>
                            <li>Basic merchant details</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <a href={sallaAuthUrl}>Authorize with Salla</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
