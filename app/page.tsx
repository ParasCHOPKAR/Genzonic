import { Metadata } from "next";
import Hero from "@/components/Hero/Hero"
import ProductGrid from "@/components/Product/ProductGrid"
import BrandStory from "@/components/UI/BrandStory"
import Newsletter from "@/components/UI/Newsletter"
import FallingFestive from "@/components/UI/FallingFestive"

export const metadata: Metadata = {
  title: "Home",
  alternates: {
    canonical: "/",
  }
};

export default function Home() {

  return (

    <main>
      <FallingFestive />

      {/* HERO SECTION */}
      <Hero />

      <ProductGrid title="ALL PRODUCTS" viewAllLink="/shop" />

      {/* BRAND STORY */}
      <BrandStory />


      {/* NEWSLETTER */}
      <Newsletter />




    </main>

  )
}