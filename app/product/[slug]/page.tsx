import { Metadata } from "next";
import ProductDetailClient from "@/components/Product/ProductDetailClient";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Script from "next/script";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.genzonic.com';

async function getProduct(slug: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return { title: 'Product Not Found | GenZonic' };
  }

  const imageUrl = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : product.image;

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at GenZonic. Premium streetwear.`,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at GenZonic.`,
      url: `${BASE_URL}/product/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg)", color: "var(--text)" }}>
        <h2>ARTIFACT NOT FOUND</h2>
      </div>
    );
  }

  const imageUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: product.description,
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: "GenZonic"
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <Script
        id={`product-schema-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}