'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function SyncAllButton() {
    const { pending } = useFormStatus()

    return (
        <Button disabled={pending}>
            <RefreshCw className={`mr-2 h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
            {pending ? 'Syncing All...' : 'Sync All Stores'}
        </Button>
    )
}
