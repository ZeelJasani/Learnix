




const LeadershipMember = [
    {
        name: 'Zeel Jasani',
        role: 'Founder',
        avatar: '/teamimage/zeel.jpg',
    },
    {
        name: 'Kunj Jarsaniya',
        role: 'Co-Founder and CEO',
        avatar: '/teamimage/loki.jpg',
    },
]



const EngineeringMember = [
    {
        name: 'Alex Thompson',
        role: 'Software Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        name: 'Lucas Meyer',
        role: 'Backend Developer & DevOps Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
        name: 'Emily Carter',
        role: 'Frontend Developer & UI/UX Designer',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
        name: 'Daniel Kovacs',
        role: 'Data Engineer & AI Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    },
]

const members = [
    {
        name: 'Michael Anderson',
        role: 'Senior Software Engineer',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    },
    {
        name: 'Sophia Williams',
        role: 'Cloud Architect & DevOps Mentor',
        avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
    {
        name: 'Oliver Bennett',
        role: 'Product Designer & UX Mentor',
        avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
        name: 'Ethan Novak',
        role: 'Machine Learning & Data Science Mentor',
        avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
    },
]






// const members = [
//     {
//         name: 'Zeel Jasani',
//         role: 'Founder',
//         avatar: 'https://avatars.githubusercontent.com/u/47919550?v=4',
//     },
//     {
//         name: 'Kunj Jarsaniya',
//         role: 'Co-Founder and CEO',
//         avatar: 'https://avatars.githubusercontent.com/u/68236786?v=4',
//     },
//     {
//         name: '',
//         role: 'Frontend Dev',
//         avatar: 'https://avatars.githubusercontent.com/u/99137927?v=4',
//     },
//     {
//         name: 'Bernard Ngandu',
//         role: 'Backend Dev',
//         avatar: 'https://avatars.githubusercontent.com/u/31113941?v=4',
//     },
// ]




export default function TeamSection() {
    return (
        <section className="py-12 md:py-32">
            <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">Our team</h2>

                <div>
                    <h3 className="mb-6 text-lg font-medium">Leadership</h3>
                    <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {LeadershipMember.map((leader, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img className="aspect-square rounded-full object-cover" src={leader.avatar} alt={leader.name} height="460" width="460" loading="lazy" />
                                </div>
                                <span className="mt-2 block text-sm">{leader.name}</span>
                                <span className="text-muted-foreground block text-xs">{leader.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Engineering</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {EngineeringMember.map((EngineeringMember, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img className="aspect-square rounded-full object-cover" src={EngineeringMember.avatar} alt={EngineeringMember.name} height="460" width="460" loading="lazy" />
                                </div>
                                <span className="mt-2 block text-sm">{EngineeringMember.name}</span>
                                <span className="text-muted-foreground block text-xs">{EngineeringMember.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Mentor and Teachers</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {members.map((member, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img className="aspect-square rounded-full object-cover" src={member.avatar} alt={member.name} height="460" width="460" loading="lazy" />
                                </div>
                                <span className="mt-2 block text-sm">{member.name}</span>
                                <span className="text-muted-foreground block text-xs">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
