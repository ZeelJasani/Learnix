// Aa file Learnix logo na different variants export kare chhe (Logo, LogoIcon, LogoStroke)
// This file exports Learnix logo variants in different sizes for use across the app
import Image from 'next/image'
import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Image
                src="/learnix.png"
                alt="Learnix Logo"
                width={32}
                height={32}
                className="h-8 w-8"
            />
            <span className="font-bold text-lg">Learnix</span>
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/learnix.png"
            alt="Learnix Logo"
            width={20}
            height={20}
            className={cn('size-5', className)}
        />
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/learnix.png"
            alt="Learnix Logo"
            width={28}
            height={28}
            className={cn('size-7 w-7', className)}
        />
    )
}
