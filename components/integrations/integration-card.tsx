'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ProductSelectionDialog } from "./product-selection-dialog"

interface IntegrationCardProps {
    name: string
    description: string
    logo?: React.ReactNode
    isConnected: boolean
    connectUrl: string
    manageUrl?: string
    onDisconnect?: () => void
    storeId?: string // For product selection
}

export function IntegrationCard({
    name,
    description,
    logo,
    isConnected,
    connectUrl,
    manageUrl,
    onDisconnect,
    storeId
}: IntegrationCardProps) {
    const [showProductDialog, setShowProductDialog] = useState(false)

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {logo && (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                    {logo}
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-xl">{name}</CardTitle>
                                <CardDescription className="mt-1">{description}</CardDescription>
                            </div>
                        </div>
                        <Badge
                            variant={isConnected ? "default" : "secondary"}
                            className="flex items-center gap-1"
                        >
                            {isConnected ? (
                                <>
                                    <CheckCircle2 className="h-3 w-3" />
                                    Connected
                                </>
                            ) : (
                                <>
                                    <Circle className="h-3 w-3" />
                                    Not Connected
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex gap-2">
                    {isConnected ? (
                        <>
                            {storeId && (
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setShowProductDialog(true)}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Sync Products
                                </Button>
                            )}
                            {manageUrl && (
                                <Link href={manageUrl} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Manage
                                    </Button>
                                </Link>
                            )}
                            {onDisconnect && (
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={onDisconnect}
                                >
                                    Disconnect
                                </Button>
                            )}
                        </>
                    ) : (
                        connectUrl.startsWith('http') ? (
                            <a href={connectUrl} className="flex-1">
                                <Button className="w-full">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Connect
                                </Button>
                            </a>
                        ) : (
                            <Link href={connectUrl} className="flex-1">
                                <Button className="w-full">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Connect
                                </Button>
                            </Link>
                        )
                    )}
                </CardFooter>
            </Card>

            {storeId && (
                <ProductSelectionDialog
                    open={showProductDialog}
                    onOpenChange={setShowProductDialog}
                    storeId={storeId}
                    storeName={name}
                />
            )}
        </>
    )
}
