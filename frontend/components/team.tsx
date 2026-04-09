// Leadership component focusing exclusively on the founding team
// Using the "veil-team-1" modern design pattern
import Image from "next/image";

interface Member {
    name: string;
    role: string;
    avatar: string;
    bio: string;
}

const LeadershipMembers: Member[] = [
    {
        name: "Zeel Jasani",
        role: "Founder & CTO",
        avatar: "/teamimage/zeel.jpg",
        bio: "Builds and ships the core system. Focused on backend architecture, performance, and keeping the stack clean and scalable.",
    },
    {
        name: "Kunj Jarsaniya",
        role: "CEO",
        avatar: "/teamimage/kunj.jpg",
        bio: "Handles product direction and growth. Works on turning ideas into something people actually use.",
    },
    {
        name: "Sakshi Ghodasara",
        role: "HR & Operations",
        avatar: "/teamimage/download.jpg",
        bio: "Manages hiring, team coordination, and internal workflows. Keeps everything organized and running without chaos.",
    },
];

export default function TeamSection() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="space-y-4">
                    <h2 className="text-balance font-serif text-4xl font-medium tracking-tight">
                        Meet Our Founders
                    </h2>
                    <p className="text-muted-foreground text-balance">
                        The visionary leaders behind our mission to transform how students learn, grow, and collaborate.
                    </p>
                </div>
                
                <div className="mt-12 grid gap-12 text-sm">
                    {LeadershipMembers.map((member, index) => (
                        <div
                            key={index}
                            className="relative grid grid-cols-[auto_1fr] gap-4"
                        >
                            {/* Decorative Borders from veil-team-1 design */}
                            <div
                                aria-hidden
                                className="max-h-26 absolute -inset-x-6 inset-y-1 border-y border-border/50"
                            />
                            <div
                                aria-hidden
                                className="w-26 absolute -inset-y-6 inset-x-1 border-x border-border/50"
                            />
                            
                            <div className="before:border-foreground/10 shadow-foreground/6.5 dark:shadow-black/6.5 relative size-28 shrink-0 overflow-hidden rounded-xl shadow-md before:absolute before:inset-0 before:rounded-xl before:border transition-transform duration-300 hover:scale-105 z-10">
                                <Image
                                    src={member.avatar}
                                    alt={member.name}
                                    className="object-cover"
                                    fill
                                    priority={index === 0}
                                />
                            </div>

                            <div className="flex flex-col justify-between gap-6 py-1 z-10">
                                <div className="space-y-0.5">
                                    <p className="text-foreground text-base font-medium">
                                        {member.name}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {member.role}
                                    </p>
                                </div>

                                <p className="text-muted-foreground text-balance text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
