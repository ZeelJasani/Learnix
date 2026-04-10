// Logo cloud section displaying tech giants with improved scaling and fixed containers
// Ensures uniform visibility for all logo types (square, wide, or tall)
import Image from "next/image";
import { cn } from "@/lib/utils";

const partners = [
    { name: "Netflix", src: "https://cdn.simpleicons.org/netflix" },
    { name: "Tesla", src: "https://cdn.simpleicons.org/tesla" },
    { name: "Spotify", src: "https://cdn.simpleicons.org/spotify" },
    { name: "Notion", src: "https://cdn.simpleicons.org/notion" },
    { name: "Slack", src: "https://cdn.simpleicons.org/slack" },
    { name: "Discord", src: "https://cdn.simpleicons.org/discord" },
    { name: "Cloudflare", src: "https://cdn.simpleicons.org/cloudflare" },
    { name: "DigitalOcean", src: "https://cdn.simpleicons.org/digitalocean" },
    { name: "Docker", src: "https://cdn.simpleicons.org/docker" },
    { name: "Stripe", src: "https://cdn.simpleicons.org/stripe" },
    { name: "PayPal", src: "https://cdn.simpleicons.org/paypal" },
    { name: "Shopify", src: "https://cdn.simpleicons.org/shopify" }
];

export default function LogoCloud() {
    return (
        <section className="bg-background py-20">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                    Trusted by students at leading tech companies
                </h2>
                
                <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-10 sm:gap-x-8 sm:gap-y-24">
                    {partners.map((partner, index) => (
                        <div 
                            key={partner.name}
                            className={cn(
                                "group relative flex items-center justify-center transition-all duration-300 hover:scale-110",
                                "col-span-1 sm:col-span-2",
                                // 5-5-2 Alignment: Center the last 2 items on Desktop
                                index === 10 && "sm:col-start-4",
                                index === 11 && "sm:col-start-6"
                            )}
                        >
                            <div className="relative h-9 w-28 sm:h-10 sm:w-36">
                                <Image
                                    src={partner.src}
                                    alt={`${partner.name} logo`}
                                    fill
                                    className="object-contain opacity-70 transition-all duration-300 group-hover:opacity-100 dark:brightness-110"
                                    priority={index < 4}
                                />
                            </div>
                            
                            {/* Hover Reveal Name */}
                            <span className="pointer-events-none absolute -bottom-8 translate-y-2 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-foreground/40">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
