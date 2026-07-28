import { Metadata } from "next";
import Hero from "@/components/Hero/Hero"
import ProductGrid from "@/components/Product/ProductGrid"
import BrandStory from "@/components/UI/BrandStory"
import Newsletter from "@/components/UI/Newsletter"

export const metadata: Metadata = {
  title: "Home",
  alternates: {
    canonical: "/",
  }
};

export default function Home() {

  return (

    <main>

      {/* HERO SECTION */}
      <Hero />

        <ProductGrid />

      {/* BRAND STORY */}
      <BrandStory />


      {/* NEWSLETTER */}
      <Newsletter />


  

    </main>

  )
}