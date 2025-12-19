// import {
//   BoltIcon,
//   BookOpen,
//   BookOpenIcon,
//   ChevronDownIcon,
//   HomeIcon,
//   Layers2Icon,
//   LayoutDashboardIcon,
//   LogOutIcon,
//   PinIcon,
//   UserPenIcon,
// } from "lucide-react"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import Home from "../page"
// import Link from "next/link"
// import { authClient } from "@/lib/auth-client"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { useSignOut } from "@/hooks/use-signout"



// interface iAppProps {
//   name: string,
//   email: string,
//   image: string;
// }




// export default function UserDropdown({ email, name, image }: iAppProps) {
//   const handlerSignout = useSignOut();
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
//           <Avatar>
//             <AvatarImage src={image} alt="Profile image" />
//             <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
//           </Avatar>
//           <ChevronDownIcon
//             size={16}
//             className="opacity-60"
//             aria-hidden="true"
//           />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="max-w-64">
//         <DropdownMenuLabel className="flex min-w-0 flex-col">
//           <span className="text-foreground truncate text-sm font-medium">
//             {name}
//           </span>
//           <span className="text-muted-foreground truncate text-xs font-normal">
//             k.kennedy@originui.com
//           </span>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem asChild>
//             <Link href="/">
//             <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
//             <span>Home</span>
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//            <Link href="/course"> 
//             <BookOpen size={16} className="opacity-60" aria-hidden="true" />
//             <span>Courses</span>
//            </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link href="/dashboard">
//             <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
//             <span>Dashboard</span>
//             </Link>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handlerSignout}>
//           <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
//           <span>Logout</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }







// chat gpt no code



"use client";

import {
  BookOpen,
  ChevronDownIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignOut } from "@/hooks/use-signout";
// Removed unused imports: Home, authClient, useRouter, toast
// import Home from "../page";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useSignOut } from "@/hooks/use-signout"; // Correctly using the hook

interface iAppProps {
  name: string;
  email: string;
  image: string;
}

export default function UserDropdown({ email, name, image }: iAppProps) {
  const handlerSignout = useSignOut(); // Correctly calling the custom hook

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          {/* Corrected: Use the email prop here */}
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
              <BookOpen size={16} className="opacity-60" aria-hidden="true" />
              <span>Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboardIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* You had two separators here, removed one if not intentional */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handlerSignout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}