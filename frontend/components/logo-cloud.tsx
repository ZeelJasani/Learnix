// Logo cloud section displaying tech giants with improved scaling and fixed containers
// Ensures uniform visibility for all logo types (square, wide, or tall)
import Image from "next/image";

const partners = [
    { name: "Google", src: "https://cdn.simpleicons.org/google" },
    { name: "Meta", src: "https://cdn.simpleicons.org/meta" },
    { name: "Amazon", src: "https://cdn.simpleicons.org/amazon" },
    { name: "Microsoft", src: "https://cdn.simpleicons.org/microsoft" },
    { name: "Apple", src: "https://cdn.simpleicons.org/apple/000000" },
    { name: "Nvidia", src: "https://cdn.simpleicons.org/nvidia" },
    { name: "GitHub", src: "https://cdn.simpleicons.org/github/181717" },
    { name: "Vercel", src: "https://cdn.simpleicons.org/vercel/000000" },
    { name: "Supabase", src: "https://cdn.simpleicons.org/supabase" },
    { name: "Figma", src: "https://cdn.simpleicons.org/figma" },
    { name: "Claude", src: "https://cdn.simpleicons.org/anthropic" },
    { name: "ChatGPT", src: "https://cdn.simpleicons.org/openai" },
];

export default function LogoCloud() {
    return (
        <section className="bg-background py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-lg font-medium tracking-tight text-foreground/80">
                    Trusted by students at leading tech companies
                </h2>
                
                {/* Fixed-size container grid to prevent oversized logos */}
                <div className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-12 sm:gap-x-16 sm:gap-y-16">
                    {partners.map((partner, index) => (
                        <div 
                            key={partner.name}
                            className="group relative flex h-9 w-28 items-center justify-center transition-all duration-300 hover:scale-110 sm:h-10 sm:w-36"
                        >
                            <Image
                                src={partner.src}
                                alt={`${partner.name} logo`}
                                fill
                                // object-contain is the secret sauce to fix the "GIGANTIC" issue
                                className="object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 dark:brightness-110"
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
