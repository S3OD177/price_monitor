import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function SallaConnectPage() {
    // Construct Salla OAuth URL
    const sallaAuthUrl = `https://accounts.salla.sa/oauth2/auth?client_id=${process.env.SALLA_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        process.env.SALLA_REDIRECT_URI || ""
    )}&response_type=code&scope=offline_access readonly.products readonly.orders`

    return (
        <div className="flex min-h-screen flex-col">
            <MainNav />
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Connect Salla Store</CardTitle>
                        <CardDescription>
                            You will be redirected to Salla to authorize access.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <a href={sallaAuthUrl}>Authorize with Salla</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
