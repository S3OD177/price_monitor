import Link from "next/link"
import { logout } from "@/app/[locale]/auth/actions"
import { Button } from "@/components/ui/button"

export function MainNav() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            PriceMonitor
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/integrations"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Integrations
                        </Link>
                        <Link
                            href="/products"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Products
                        </Link>
                    </nav>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <form action={logout}>
                        <Button variant="ghost" size="sm">
                            Log out
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
