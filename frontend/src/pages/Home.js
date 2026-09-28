import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductGrid from "@/components/ProductGrid";
import Values from "@/components/Values";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <ProductGrid />
      <Values />
      <About />
      <Contact />
    </main>
  );
}
