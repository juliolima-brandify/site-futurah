import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Partners from "@/components/sections/Partners";
import Features from "@/components/sections/Features";
import Contact from "@/components/sections/Contact";
import { BlogSection } from "@/components/sections/BlogSection";
import { SchoolSection } from "@/components/sections/SchoolSection";
import { TeamTestimonialSection } from "@/components/sections/TeamTestimonialSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Partners />
                <SchoolSection />
                <Features />
                <TeamTestimonialSection />
                <BlogSection />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
