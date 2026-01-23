import { ReactNode } from "react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <HeroHeader />
            <main className="pt-16">
                {children}
            </main>
            <FooterSection />
        </>
    );
}
