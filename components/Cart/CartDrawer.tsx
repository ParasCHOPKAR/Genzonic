"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartDrawer({ open }: any) {
  const { cart, removeFromCart } = useCartStore();
  const router = useRouter();

  return (
    <div className={`drawer ${open ? "show" : ""}`}>
      <div className="content">
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            {cart.map((item: any) => (
              <div key={item._id} className="item">
                <p>{item.name}</p>
                <span>₹{item.price}</span>
                <button onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            ))}

            <button
              className="checkout"
              onClick={() => router.push("/cart")}
            >
              View Cart
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .drawer {
          position: fixed;
          right: -400px;
          top: 0;
          width: 350px;
          height: 100%;
          background: white;
          transition: 0.3s;
          box-shadow: -5px 0 20px rgba(0,0,0,0.1);
          z-index: 999;
        }

        .show {
          right: 0;
        }

        .content {
          padding: 20px;
        }

        .item {
          margin-bottom: 15px;
        }

        .checkout {
          width: 100%;
          padding: 12px;
          background: #f58220;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}