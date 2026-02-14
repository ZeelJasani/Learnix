"use client"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"

interface Avatar {
  imageUrl: string
  profileUrl: string
  name?: string
}
interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatarUrls: Avatar[]
  avatarClassName?: string
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
  avatarClassName,
}: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={url.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  key={index}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 border-white object-cover dark:border-gray-800",
                    avatarClassName
                  )}
                  src={url.imageUrl}
                  width={40}
                  height={40}
                  alt={`Avatar ${index + 1}`}
                />
              </a>
            </TooltipTrigger>
            {url.name && (
              <TooltipContent>
                <p>{url.name}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
      {(numPeople ?? 0) > 0 && (
        <a
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black",
            avatarClassName
          )}
          href=""
        >
          +{numPeople}
        </a>
      )}
    </div>
  )
}
