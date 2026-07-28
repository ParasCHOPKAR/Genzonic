import { MetadataRoute } from 'next'
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.genzonic.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: any[] = []
  
  try {
    await connectDB();
    products = await Product.find({}, 'slug updatedAt').lean();
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error)
  }

  const productUrls = products.map((product: any) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}
