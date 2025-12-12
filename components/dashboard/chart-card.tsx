import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ChartCardProps {
    title: string
    description?: string
    children: React.ReactNode
    className?: string
    onExport?: () => void
}

export function ChartCard({ title, description, children, className, onExport }: ChartCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                </div>
                {onExport && (
                    <Button variant="outline" size="icon" onClick={onExport} title="Export Data">
                        <Download className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
