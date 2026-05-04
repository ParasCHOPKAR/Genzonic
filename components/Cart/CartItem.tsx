"use client";

import styles from "./cart.module.css";
import Image from "next/image";

export default function CartItem({ item, updateQty, removeFromCart }: any) {
  return (
    <div className={styles.cartItem}>
      <Image src={item.image} alt={item.name} width={100} height={100} />

      <div className={styles.details}>
        <h3>{item.name}</h3>
        <p className={styles.meta}>
          Size: {item.size || "M"} | Color: {item.color || "Black"}
        </p>
        <p className={styles.price}>₹{item.price}</p>

        <div className={styles.qtyControls}>
          <button onClick={() => updateQty(item._id, item.qty - 1)}>
            -
          </button>
          <span>{item.qty}</span>
          <button onClick={() => updateQty(item._id, item.qty + 1)}>
            +
          </button>
        </div>
      </div>

      <button
        className={styles.removeBtn}
        onClick={() => removeFromCart(item._id)}
      >
        ✕
      </button>
    </div>
  );
}