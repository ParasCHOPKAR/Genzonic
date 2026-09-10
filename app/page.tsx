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

      <ProductGrid title="PREMIUM COLLECTION" category="premium" viewAllLink="/shop/premium" />
      <ProductGrid title="MEN'S COLLECTION" category="men" viewAllLink="/shop/men" />

      {/* BRAND STORY */}
      <BrandStory />


      {/* NEWSLETTER */}
      <Newsletter />




    </main>

  )
}