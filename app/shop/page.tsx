import { Metadata } from "next";
import ShopClient from "@/components/Shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop - All Collections",
  description: "Browse all premium streetwear collections from GenZonic.",
  alternates: {
    canonical: "/shop",
  }
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      products = data.products;
    }
  } catch (error) {
    console.error("Failed to load collection", error);
  }

  return <ShopClient products={products} />;
}