"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all products from the API
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loader2 className="spin" size={32} />
        <p>LOADING INVENTORY...</p>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <div>
          <h1 className="title">INVENTORY ARCHIVE</h1>
          <p className="subtitle">Manage all active GenZonic artifacts.</p>
        </div>
        <Link href="/admin/products/add" className="add-btn">
          <Plus size={18} /> ADD NEW ARTIFACT
        </Link>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">No artifacts found in the archive.</td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id}>
                  <td>
                    <div className="img-box">
                      <Image 
                        src={product.image || "/fallback.png"} 
                        alt={product.name} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                  </td>
                  <td className="bold">{product.name}</td>
                  <td className="uppercase">{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="action-buttons">
                      {/* Link to the Edit page we fixed earlier! */}
                      <Link href={`/admin/products/edit/${product._id}`} className="edit-btn">
                        <Edit size={16} />
                      </Link>
                      <button className="delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-wrapper {
          padding: 40px;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
        }

        .loading-state {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 12px;
          letter-spacing: 2px;
          gap: 15px;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 30px;
        }

        .title {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #f8fafc;
          margin: 0 0 5px 0;
        }

        .subtitle { font-size: 13px; color: #94a3b8; margin: 0; }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ff3e00;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          transition: 0.3s;
        }

        .add-btn:hover { background: #e63800; transform: translateY(-2px); }

        .table-container {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          overflow: hidden;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .products-table th {
          background: #020617;
          padding: 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #94a3b8;
          border-bottom: 1px solid #1e293b;
        }

        .products-table td {
          padding: 15px 20px;
          border-bottom: 1px solid #1e293b;
          font-size: 14px;
        }

        .img-box {
          position: relative;
          width: 40px;
          height: 50px;
          border-radius: 4px;
          overflow: hidden;
          background: #1e293b;
        }

        .bold { font-weight: 700; color: #f8fafc; }
        .uppercase { text-transform: uppercase; font-size: 12px; color: #94a3b8; }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .edit-btn, .delete-btn {
          background: transparent;
          border: 1px solid #334155;
          padding: 8px;
          border-radius: 4px;
          color: #94a3b8;
          cursor: pointer;
          transition: 0.2s;
        }

        .edit-btn:hover { color: #50e3c2; border-color: #50e3c2; }
        .delete-btn:hover { color: #ff3333; border-color: #ff3333; }
        
        .empty-state { text-align: center; padding: 40px !important; color: #94a3b8; }
      `}</style>
    </div>
  );
}