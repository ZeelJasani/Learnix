// Aa file Learnix logo na different variants export kare chhe (Logo, LogoIcon, LogoStroke)
// This file exports Learnix logo variants in different sizes for use across the app
import Image from 'next/image'
import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Image
                src="/learnix.webp"
                alt="Learnix Logo"
                width={128}
                height={128}
                className="h-8 w-8 object-contain"
                unoptimized
            />
            <span className="font-bold text-lg">Learnix</span>
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/learnix.webp"
            alt="Learnix Logo"
            width={128}
            height={128}
            className={cn('size-5 object-contain', className)}
            unoptimized
        />
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/learnix.webp"
            alt="Learnix Logo"
            width={128}
            height={128}
            className={cn('size-7 w-7 object-contain', className)}
            unoptimized
        />
    )
}
