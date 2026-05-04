"use client"

import Hero from "@/components/Hero/Hero"
import ProductGrid from "@/components/Product/ProductGrid"
import Collections from "@/components/UI/Collections"
import BrandStory from "@/components/UI/BrandStory"
import Newsletter from "@/components/UI/Newsletter"


export default function Home() {

  return (

    <main>

      {/* HERO SECTION */}
      <Hero />

        <ProductGrid />


      {/* COLLECTIONS */}
      <Collections />


      {/* BRAND STORY */}
      <BrandStory />


      {/* NEWSLETTER */}
      <Newsletter />


  

    </main>

  )
}