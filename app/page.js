import Calculator from "../components/Calculator";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
    return (
        <>
            <Hero />
            <div className="container space-y-24">
                <Calculator />
                <HowItWorks />
            </div>
            <Footer />
        </>
    );
}
