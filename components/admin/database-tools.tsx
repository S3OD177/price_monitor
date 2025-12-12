import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'

interface DatabaseStat {
    collection: string
    collectionId: string
    documentCount: number
    status: string
    error?: string
}

interface DatabaseToolsProps {
    stats: DatabaseStat[]
}

export function DatabaseTools({ stats }: DatabaseToolsProps) {
    const totalDocuments = stats.reduce((sum, stat) => sum + stat.documentCount, 0)
    const healthyCollections = stats.filter(s => s.status === 'healthy').length

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDocuments.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across all collections
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Collection Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {healthyCollections}/{stats.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Collections operational
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Collection Statistics</CardTitle>
                    <CardDescription>Document counts and health status for all collections</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Collection</TableHead>
                                <TableHead>Collection ID</TableHead>
                                <TableHead className="text-right">Documents</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((stat) => (
                                <TableRow key={stat.collectionId}>
                                    <TableCell className="font-medium">{stat.collection}</TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                            {stat.collectionId}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {stat.documentCount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {stat.status === 'healthy' ? (
                                            <Badge variant="default" className="gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Healthy
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="gap-1">
                                                <XCircle className="h-3 w-3" />
                                                Error
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
