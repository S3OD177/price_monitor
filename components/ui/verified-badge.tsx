import { BadgeCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface VerifiedBadgeProps {
    className?: string
    size?: number
}

export function VerifiedBadge({ className, size = 16 }: VerifiedBadgeProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <BadgeCheck
                        className={`text-blue-500 ${className}`}
                        size={size}
                        fill="currentColor"
                        color="white"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Verified by Admin</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
