// // import Image from "next/image";
// "use client";

// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/ui/themeToggle";
// // import { auth } from "@/lib/auth";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";

// // import { headers } from "next/headers";



// export default async function Home() {

//   const router = useRouter();
//   const { data: session } = await authClient.useSession();


//   async function signOut() {
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/");
//         },
//       },
//     });
//   }
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       <h1 className="text-3xl font-bold underline animate-pulse animate-spotlight bg-gradient-to-r bg-emerald-400 to-sky-700 from-emerald-500 bg-clip-text text-transparent">
//         hello world
//       </h1>
//       <ThemeToggle />


//       {session ? (
//         <div>
//           <p>{session.user.name}</p>
//           <Button
//             onClick={signOut}>
//             Logout
//           </Button>
//         </div>
//       ) : (
//         <Button>login</Button>
//       )}
//     </div>
//   );
// }










// 

// // "use client";


// import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button"
// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { ZeelThemeToggle } from "@/components/ui/ZeelThemeToggle";
// import { auth } from "@/lib/auth";
// // import { authClient } from "@/lib/auth-client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// // import router from "next/router";




// interface featuresProps {
//     title: string,
//     description: string,
//     icon: string;
// }

// const features: featuresProps[] = [
//     {
//         title: "Comprehensive Courses",
//         description: "Access a wide range of carefully curated courses designed by industry experts.",
//         icon: "📚"
//     },
//     {
//         title: "Interactive Learning",
//         description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
//         icon: "🎮"
//     },
//     {
//         title: "Progress Tracking",
//         description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
//         icon: "📊", // The image shows an empty string for the icon property.
//     },
//     {
//         title: "Community Support",
//         description: "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
//         icon: '👥', // The image shows an empty string for the icon property.
//     },
// ];









// export default function Home() {
//     // const router = useRouter
//     // // const default async function Home() {
//     // const { data: session } = authClient.useSession();
//     // async function signOut() {
//     //     await authClient.signOut({
//     //         fetchOptions: {
//     //             onSuccess: () => {
//     //                 router.push("/")
//     //                 toast.success('logout successfully')
//     //             },
//     //         },
//     //     });
//     // }
//     return (
//         // <div className="p-24">
//         //   <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 animate-gradient tracking-wide leading-snug">
//         //     hi i am zeel jasani welcome to my platform <span className="glow-text">masterji</span> where you master your learning journey with masterji
//         //   </h1>

//         //   <ZeelThemeToggle />
//         //   {session ? (
//         //     <div>
//         //       <p>{session.user.name}</p>
//         //       <Button onClick={signOut}>Logout</Button>
//         //     </div>
//         //   )  : (
//         //     <Button>login</Button>
//         //   )} 
//         // </div>
//         <>
//             <section className="reletive py-20">
//                 <div className="flex flex-col items-center text-center space-y-8">
//                     <Badge variant="outline">
//                         The Future of Online Education
//                     </Badge>
//                     <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate your Learning Experience</h1>
//                     <p className="max-w-[700px] text-muted-foreground md:text-xl">
//                         Discover a new way to learn with our modern, interactive learning
//                         management system. Access high-quality courses anytime, anywhere.
//                     </p>


//                     <div className="flex flex-col sm:flex-row gap-4 mt-8">
//                         <Link
//                             className={buttonVariants({
//                                 size: "lg",
//                             })}
//                             href="/courses"
//                         >
//                             Explore Courses
//                         </Link>
//                         <Link
//                             className={buttonVariants({
//                                 size: "lg",
//                                 variant: "outline"
//                             })}
//                             href="/login"
//                         >
//                             Sign In
//                         </Link>
//                     </div>


//                 </div>
//             </section>

//             {/* another section */}

//             {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {features.map((feature, index) => (
//                     <Card key={index} className="hover:shadow-lg transition-shadow">
//                         <CardHeader>
//                             <div className="text-4xl mb-4">
//                                 {feature.icon}
//                             </div>
//                         </CardHeader>

//                     </Card>
//                 ))}
//             </section> */}
//             <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
//                 {features.map((feature, index) => (
//                     <Card key={index} className="hover:shadow-lg transition-shadow">
//                         <CardHeader>
//                             <div className="text-4xl mb-4">{feature.icon}</div>
//                             <CardTitle>{feature.title}</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <p className="text-muted-foreground">{feature.description}</p>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </section>
//         </>

//     );
// }





// chat gpt no code




// "use client";

// import { Badge } from "@/components/ui/badge";
// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { auth } from "@/lib/auth";
// import Link from "next/link";
// import { toast } from "sonner";

// interface featuresProps {
//   title: string;
//   description: string;
//   icon: string;
// }

// const features: featuresProps[] = [
//   {
//     title: "Comprehensive Courses",
//     description: "Access a wide range of carefully curated courses designed by industry experts.",
//     icon: "📚",
//   },
//   {
//     title: "Interactive Learning",
//     description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
//     icon: "🎮",
//   },
//   {
//     title: "Progress Tracking",
//     description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
//     icon: "📊",
//   },
//   {
//     title: "Community Support",
//     description: "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
//     icon: "👥",
//   },
// ];

// export default function Home() {
//   return (
//     <>
//       <section className="reletive py-20">
//         <div className="flex flex-col items-center text-center space-y-8">
//           <Badge variant="outline">The Future of Online Education</Badge>
//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
//             Elevate your Learning Experience
//           </h1>
//           <p className="max-w-[700px] text-muted-foreground md:text-xl">
//             Discover a new way to learn with our modern, interactive learning
//             management system. Access high-quality courses anytime, anywhere.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 mt-8">
//             <Link
//               className={buttonVariants({
//                 size: "lg",
//               })}
//               href="/courses"
//             >
//               Explore Courses
//             </Link>
//             <Link
//               className={buttonVariants({
//                 size: "lg",
//                 variant: "outline",
//               })}
//               href="/login"
//             >
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </section>

//       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
//         {features.map((feature, index) => (
//           <Card key={index} className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <div className="text-4xl mb-4">{feature.icon}</div>
//               <CardTitle>{feature.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">{feature.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </section>
//     </>
//   );
// }





"use client";

import { Badge } from "@/components/ui/badge";
// import { buttonVariants } from "@/components/ui/button"; // No longer needed in Home.tsx if buttons are in Navbar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { auth } from "@/lib/auth"; // If auth is not used directly in this component, it can be commented out
// import Link from "next/link"; // No longer needed in Home.tsx if buttons are in Navbar
// import { toast } from "sonner"; // If toast is not used directly in this component, it can be commented out

interface featuresProps {
  title: string;
  description: string;
  icon: string;
}

const features: featuresProps[] = [
  {
    title: "Comprehensive Courses",
    description: "Access a wide range of carefully curated courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description: "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <>
      {/*
        The <header> section with Login/Get Started buttons has been REMOVED from here.
        It should ideally be in a global layout or Navbar component.
      */}

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>

          {/* These links ("Explore Courses" and "Sign In") have been REMOVED from the Hero Section */}
          {/* <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href="/login"
            >
              Sign In
            </Link>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}


// 



























// "use client";

// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/ui/themeToggle";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export default function Home() {
//   const router = useRouter();
//   const { data: session } = authClient.useSession();

//   async function signOut() {
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/");
//           toast.success("Logged out successfully");
//         },
//       },
//     });
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       <h1 className="text-3xl font-bold underline animate-pulse animate-spotlight bg-gradient-to-r bg-emerald-400 to-sky-700 from-emerald-500 bg-clip-text text-transparent">
//         hello world
//       </h1>

//       <ThemeToggle />

//       {session ? (
//         <div>
//           <p>{session.user.name}</p>
//           <Button onClick={signOut}>Logout</Button>
//         </div>
//       ) : (
//         <Button>Login</Button>
//       )}
//     </div>
//   );
// }
