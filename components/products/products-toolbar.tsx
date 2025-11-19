'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function ProductsToolbar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('q') || '')
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedSearch) {
            params.set('q', debouncedSearch)
        } else {
            params.delete('q')
        }
        router.push(`?${params.toString()}`)
    }, [debouncedSearch, router, searchParams])

    return (
        <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8 bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
                {search && (
                    <Button variant="ghost" onClick={() => setSearch('')} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
