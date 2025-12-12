import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, ArrowUp, ArrowDown } from 'lucide-react'

export function PriceAlertsWidget() {
    // Mock data - in real app would come from props or API
    const alerts = [
        { id: 1, product: 'iPhone 15 Pro', change: '-5%', type: 'drop', time: '2h ago' },
        { id: 2, product: 'Samsung S24', change: '+2%', type: 'rise', time: '5h ago' },
        { id: 3, product: 'Sony WH-1000XM5', change: '-10%', type: 'drop', time: '1d ago' },
    ]

    return (
        <Card className="col-span-3">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Recent Price Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium">{alert.product}</p>
                                <p className="text-xs text-muted-foreground">{alert.time}</p>
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${alert.type === 'drop' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {alert.type === 'drop' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                                {alert.change}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
