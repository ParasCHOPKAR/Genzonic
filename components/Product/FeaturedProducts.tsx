"use client"

import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Oversized Street Tee",
    price: 799,
    image: "/products/p1.jpg",
  },
  {
    id: 2,
    name: "GenZonic Hoodie",
    price: 1499,
    image: "/products/p2.jpg",
  },
  {
    id: 3,
    name: "Urban Essential Tee",
    price: 699,
    image: "/products/p3.jpg",
  },
  {
    id: 4,
    name: "Streetwear Black Tee",
    price: 899,
    image: "/products/p4.jpg",
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-20 px-10">

      <h2 className="text-3xl font-bold mb-10 text-center">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">

            <div className="overflow-hidden rounded-xl">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="group-hover:scale-110 transition duration-500"
              />
            </div>

            <h3 className="mt-3 font-semibold">{product.name}</h3>
            <p className="text-gray-500">₹{product.price}</p>

          </div>
        ))}

      </div>
    </section>
  )
}