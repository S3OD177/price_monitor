import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
            <div className="w-full flex-1">
                {/* Breadcrumbs or search could go here */}
                <h1 className="font-semibold text-lg">Dashboard</h1>
            </div>
            <ModeToggle />
            <Button variant="outline" size="sm">
                Logout
            </Button>
        </header>
    )
}
