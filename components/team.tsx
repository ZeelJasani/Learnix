import { TwitterVerifiedBadge } from "@/components/ui/TwitterVerifiedBadge";

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
        name: "Alex Thompson",
        role: "Software Engineer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Lucas Meyer",
        role: "Backend Developer & DevOps Engineer",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        name: "Emily Carter",
        role: "Frontend Developer & UI/UX Designer",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Daniel Kovacs",
        role: "Data Engineer & AI Engineer",
        avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    },
];

const Mentors: Member[] = [
    {
        name: "Michael Anderson",
        role: "Senior Software Engineer",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
        name: "Sophia Williams",
        role: "Cloud Architect & DevOps Mentor",
        avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
        name: "Oliver Bennett",
        role: "Product Designer & UX Mentor",
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
        name: "Ethan Novak",
        role: "Machine Learning & Data Science Mentor",
        avatar: "https://randomuser.me/api/portraits/men/88.jpg",
    },
];

// Reusable Grid Component to keep the code clean
const TeamGrid = ({ members }: { members: Member[] }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 border-t border-zinc-800 py-8 md:grid-cols-4">
        {members.map((member, index) => (
            <div key={index} className="flex flex-col items-start">
                {/* Avatar Container */}
                <div className="bg-background size-20 rounded-full border border-zinc-800 p-0.5 shadow-sm">
                    <img
                        className="aspect-square rounded-full object-cover"
                        src={member.avatar}
                        alt={member.name}
                        height="460"
                        width="460"
                        loading="lazy"
                    />
                </div>

                {/* Name and Verified Tick - ALIGNMENT HAPPENS HERE */}
                <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-sm font-medium text-zinc-100">
                        {member.name}
                    </span>
                    {member.isVerified && <TwitterVerifiedBadge />}
                </div>

                {/* Role */}
                <span className="text-muted-foreground mt-0.5 block text-xs">
                    {member.role}
                </span>
            </div>
        ))}
    </div>
);

export default function TeamSection() {
    return (
        <section className="bg-black py-12 text-white md:py-32">
            <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="mb-12 text-4xl font-bold tracking-tight lg:text-5xl">
                    Our team
                </h2>

                <div className="space-y-12">
                    {/* Leadership Section */}
                    <div>
                        <h3 className="mb-4 text-lg font-medium text-zinc-400">Leadership</h3>
                        <TeamGrid members={LeadershipMember} />
                    </div>

                    {/* Engineering Section */}
                    <div>
                        <h3 className="mb-4 text-lg font-medium text-zinc-400">Engineering</h3>
                        <TeamGrid members={EngineeringMember} />
                    </div>

                    {/* Mentors Section */}
                    <div>
                        <h3 className="mb-4 text-lg font-medium text-zinc-400">
                            Mentors and Teachers
                        </h3>
                        <TeamGrid members={Mentors} />
                    </div>
                </div>
            </div>
        </section>
    );
}