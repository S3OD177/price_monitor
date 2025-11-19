import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface StoreCardProps {
    store: {
        id: string
        name: string
        platform: string
        status: string
    }
    onDisconnect: (id: string) => void
}

export function StoreCard({ store, onDisconnect }: StoreCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {store.name}
                </CardTitle>
                <Badge variant={store.status === 'connected' ? 'default' : 'destructive'}>
                    {store.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground mb-4">
                    Platform: {store.platform}
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => onDisconnect(store.id)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Disconnect
                </Button>
            </CardContent>
        </Card>
    )
}
