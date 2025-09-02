import { cn } from "@/lib/utils"

export function Spinner({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent",
                className
            )}
        />
    )
}