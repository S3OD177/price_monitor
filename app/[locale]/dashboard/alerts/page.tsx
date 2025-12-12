'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, Trash2 } from "lucide-react"

const alerts = [
    {
        id: 1,
        title: "Price Drop Alert",
        description: "iPhone 13 Pro Max price dropped by 5% on Amazon",
        time: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        title: "Stock Alert",
        description: "Samsung Galaxy S22 is back in stock at Noon",
        time: "5 hours ago",
        read: true,
    },
    {
        id: 3,
        title: "Competitor Update",
        description: "New competitor added for MacBook Air M2",
        time: "1 day ago",
        read: true,
    },
]

export default function AlertsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Mark all as read</Button>
                </div>
            </div>
            <div className="grid gap-4">
                {alerts.map((alert) => (
                    <Card key={alert.id} className={alert.read ? "opacity-60" : ""}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <div className={`p-2 rounded-full ${alert.read ? "bg-muted" : "bg-primary/10"}`}>
                                <Bell className={`h-4 w-4 ${alert.read ? "text-muted-foreground" : "text-primary"}`} />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">{alert.title}</CardTitle>
                                <CardDescription>{alert.time}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {alert.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
