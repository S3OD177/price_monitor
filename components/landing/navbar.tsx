import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">P</span>
                </div>
                <span className="font-bold text-xl tracking-tight">PriceMonitor</span>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary/80 transition-colors">
                    Login
                </Link>
                <Link href="/signup">
                    <Button>Get Started</Button>
                </Link>
                <ModeToggle />
            </div>
        </nav>
    )
}
