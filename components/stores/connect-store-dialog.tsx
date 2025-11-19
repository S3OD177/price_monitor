import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sallaApi } from "@/lib/api/salla"
import { trendyolApi } from "@/lib/api/trendyol"

interface ConnectStoreDialogProps {
    onConnect: (store: any) => void
}

export function ConnectStoreDialog({ onConnect }: ConnectStoreDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [platform, setPlatform] = useState<string>("")
    const [apiKey, setApiKey] = useState("")
    const [apiSecret, setApiSecret] = useState("")

    const handleConnect = async () => {
        setLoading(true)
        try {
            let store;
            if (platform === 'salla') {
                store = await sallaApi.connect(apiKey)
            } else if (platform === 'trendyol') {
                store = await trendyolApi.connect(apiKey, apiSecret)
            }

            if (store) {
                onConnect(store)
                setOpen(false)
                // Reset form
                setPlatform("")
                setApiKey("")
                setApiSecret("")
            }
        } catch (error) {
            console.error("Failed to connect store", error)
            alert("Failed to connect store. Check console for details.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Connect Store</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Connect Store</DialogTitle>
                    <DialogDescription>
                        Choose your platform and enter your API credentials.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select onValueChange={setPlatform} value={platform}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="salla">Salla</SelectItem>
                                <SelectItem value="trendyol">Trendyol</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {platform && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="apiKey">API Key</Label>
                                <Input
                                    id="apiKey"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>

                            {platform === 'trendyol' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="apiSecret">API Secret</Label>
                                    <Input
                                        id="apiSecret"
                                        type="password"
                                        value={apiSecret}
                                        onChange={(e) => setApiSecret(e.target.value)}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleConnect} disabled={loading || !platform}>
                        {loading ? "Connecting..." : "Connect"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
