"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ShopClient({ products }: { products: any[] }) {
  return (
    <div className="category-page">
      <div className="page-header">
        <span className="label">GENZONIC ARCHIVE</span>
        <h1 className="title">ALL COLLECTIONS</h1>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>NO ARTIFACTS FOUND</h2>
          <p>This collection is currently empty. Our designers are forging new items.</p>
          <Link href="/" className="btn-return">
            RETURN TO BASE <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product: any) => (
            <Link href={`/product/${product.slug}`} key={product._id} className="product-card">
              <div className="image-wrapper">
                <Image 
                  src={product.image || "/fallback.png"} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .category-page {
          padding: 140px 6% 100px;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 60px;
          border-bottom: 1px solid rgba(128,128,128,0.2);
          padding-bottom: 20px;
        }

        .label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
          opacity: 0.5;
        }

        .title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -2px;
          margin: 10px 0 0 0;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 40px 25px;
        }

        .product-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: transform 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background: rgba(128,128,128,0.05);
        }

        .product-info h3 {
          font-size: 14px;
          font-weight: 800;
          margin: 0 0 5px 0;
        }

        .product-info p {
          font-size: 13px;
          font-weight: 600;
          opacity: 0.7;
          margin: 0;
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
          background: rgba(128,128,128,0.03);
          border: 1px dashed rgba(128,128,128,0.2);
        }

        .empty-state h2 { font-size: 20px; font-weight: 800; letter-spacing: 2px; }
        .empty-state p { opacity: 0.6; font-size: 14px; margin-bottom: 30px; }

        .btn-return {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--text);
          color: var(--bg);
          padding: 12px 24px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .category-page { padding: 120px 5% 80px; }
          .product-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px 20px; }
        }

        @media (max-width: 600px) {
          .category-page { padding: 100px 5% 60px; }
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 20px 10px; }
          .title { font-size: 2.2rem; }
          .product-info h3 { font-size: 12px; }
          .product-info p { font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
