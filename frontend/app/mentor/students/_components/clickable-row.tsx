"use client"

import { useRouter } from "next/navigation"
import { TableRow } from "@/components/ui/table"
import { ReactNode } from "react"

interface ClickableRowProps {
    children: ReactNode
    href: string
}

export function ClickableRow({ children, href }: ClickableRowProps) {
    const router = useRouter()

    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push(href)}
        >
            {children}
        </TableRow>
    )
}
