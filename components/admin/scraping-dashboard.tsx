import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ScrapingStatsProps {
    stats: {
        total: number
        pending: number
        resolved: number
        recent24h: number
        successRate: string
    }
}

export function ScrapingDashboard({ stats }: ScrapingStatsProps) {
    const successRateNum = parseFloat(stats.successRate)

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground mt-1">Needs review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground mt-1">Completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Last 24h</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recent24h}</div>
                        <p className="text-xs text-muted-foreground mt-1">Recent reports</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Success Rate</CardTitle>
                    <CardDescription>Overall scraping success rate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{stats.successRate}%</span>
                        <Badge variant={successRateNum >= 80 ? 'default' : successRateNum >= 60 ? 'secondary' : 'destructive'}>
                            {successRateNum >= 80 ? 'Excellent' : successRateNum >= 60 ? 'Good' : 'Needs Attention'}
                        </Badge>
                    </div>
                    <Progress value={successRateNum} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                        Based on {stats.total} total reports
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
