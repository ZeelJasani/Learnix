// Aa component team section render kare chhe (Leadership, Engineering, Mentors groups sathe)
// This component renders the team section with member cards grouped by Leadership, Engineering, and Mentors
import { TwitterVerifiedBadge } from "@/components/ui/TwitterVerifiedBadge";
import Image from "next/image";



interface Member {
    name: string;
    role: string;
    avatar: string;
    isVerified?: boolean;
}

const LeadershipMember: Member[] = [
    {
        name: "Zeel Jasani",
        role: "Founder",
        avatar: "/teamimage/zeel.jpg",
        isVerified: true,
    },
    {
        name: "Kunj Jarsaniya",
        role: "Co-Founder and CEO",
        avatar: "/teamimage/loki.jpg",
        isVerified: true,
    },
];

const EngineeringMember: Member[] = [
    {
        name: "Batman",
        role: "Software Engineer",
        avatar: "/teamimage/Batman.jpg",
        isVerified: true,
    },
    {
        name: "Thanos",
        role: "Backend Developer & DevOps Engineer",
        avatar: "/teamimage/Thanos.jpg",
    },
    {
        name: "Iron Man",
        role: "Frontend Developer & UI/UX Designer",
        avatar: "/teamimage/iron-man.jpg",
        isVerified: true,
    },
    {
        name: "Peter Parker",
        role: "Data Engineer & AI Engineer",
        avatar: "/teamimage/peter.jpg",
    },
];

const Mentors: Member[] = [
    {
        name: "Thor Odinson",
        role: "Senior Software Engineer",
        avatar: "/teamimage/thor.jpg",
        isVerified: true,
    },
    {
        name: "Super Man",
        role: "Cloud Architect & DevOps Mentor",
        avatar: "/teamimage/super-man.jpg",
    },
    {
        name: "Jon Snow",
        role: "Product Designer & UX Mentor",
        avatar: "/teamimage/jon-snow.jpg",
        isVerified: true,
    },
    {
        name: "Kesri Billa",
        role: "Machine Learning & Data Science Mentor",
        avatar: "/teamimage/Elee.jpg",
        isVerified: true,
    },
];

// Reusable Team Card Component
const TeamCard = ({ member }: { member: Member }) => (
    <div className="group relative flex flex-col items-center p-4 transition-all duration-300">
        <div className="relative mb-3">
            {/* Glow effect on hover */}
            {/* Glow effect on hover - REMOVED */}
            {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40" /> */}

            <div className="relative rounded-full p-1 transition-transform duration-300 group-hover:scale-105">
                <div className="h-20 w-20 relative rounded-full overflow-hidden border-2 border-border/50 group-hover:border-foreground/50 transition-colors">
                    <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground tracking-tight">
                    {member.name}
                </span>
                {member.isVerified && <TwitterVerifiedBadge />}
            </div>

            <span className="text-muted-foreground mt-1 text-xs max-w-[150px] leading-relaxed">
                {member.role}
            </span>
        </div>
    </div>
);

const SectionGrid = ({ members }: { members: Member[] }) => (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12 w-full">
        {members.map((member, index) => (
            <TeamCard key={index} member={member} />
        ))}
    </div>
);

export default function TeamSection() {
    return (
        <section className="bg-background py-16 text-foreground md:py-32">
            <div className="mx-auto max-w-5xl px-8 lg:px-0">
                <div className="mb-16 md:mb-24">
                    <h2 className="text-4xl font-bold tracking-tight lg:text-5xl font-mono">
                        Our team
                    </h2>
                </div>

                <div className="space-y-24">
                    {/* Leadership Section */}
                    <div>
                        <h3 className="mb-10 text-2xl font-semibold text-foreground/80 tracking-tight font-mono">
                            Leadership
                        </h3>
                        {/* Leadership has fewer members, so we maintain left alignment but can center if preferred. keeping generic grid. */}
                        <div className="flex flex-wrap gap-12">
                            {LeadershipMember.map((member, index) => (
                                <TeamCard key={index} member={member} />
                            ))}
                        </div>
                    </div>

                    {/* Engineering Section */}
                    <div>
                        <h3 className="mb-10 text-2xl font-semibold text-foreground/80 tracking-tight font-mono">
                            Engineering
                        </h3>
                        <SectionGrid members={EngineeringMember} />
                    </div>

                    {/* Mentors Section */}
                    <div>
                        <h3 className="mb-10 text-2xl font-semibold text-foreground/80 tracking-tight font-mono">
                            Mentors and Teachers
                        </h3>
                        <SectionGrid members={Mentors} />
                    </div>
                </div>
            </div>
        </section>
    );
}

/*
// PREVIOUS IMPLEMENTATION WITH AVATAR CIRCLES
import { AvatarCircles } from "@/components/ui/avatar-circles";

const teamMembers = [
    {
        name: "Zeel Jasani",
        imageUrl: "/teamimage/zeel.jpg",
        profileUrl: "#",
    },
    {
        name: "Kunj Jarsaniya",
        imageUrl: "/teamimage/loki.jpg",
        profileUrl: "#",
    },
    // ... other members
];

export default function TeamSection() {
    return (
         <section className="bg-background py-12 text-foreground md:py-32">
            <div className="mx-auto max-w-3xl px-8 lg:px-0 text-center">
                <h2 className="mb-12 text-4xl font-bold tracking-tight lg:text-5xl">
                    Our team
                </h2>

                <div className="flex items-center justify-center">
                    <AvatarCircles
                        avatarUrls={teamMembers}
                        avatarClassName="h-20 w-20"
                        numPeople={0}
                    />
                </div>
            </div>
        </section>
    );
}
*/