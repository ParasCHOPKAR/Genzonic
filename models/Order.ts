import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Link to the registered user (optional, so guest checkout still works)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    userEmail: { type: String, required: true },

    // Merged Shipping Details (Matches your new Checkout UI perfectly)
    shippingInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String },
      address: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      addressType: { type: String, default: "Home" },
    },

    // Cart Items
    orderItems: [
      {
        id: { type: String }, // Your cart item ID
        name: { type: String, required: true },
        quantity: { type: Number, required: true }, // Matches your cart store
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
      },
    ],

    // Payment & Status Info (Ready for Razorpay!)
    paymentMethod: { type: String, required: true, default: "Razorpay" },
    paymentResult: {
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature: { type: String },
    },
    subtotal: { type: Number, required: true, default: 0 },
    gstAmount: { type: Number, required: true, default: 0 },
    deliveryCharge: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    
    // 🔥 ORDER TRACKING & STATUS 🔥
    status: { type: String, default: "Processing" }, // Processing, Shipped, Delivered, Cancelled
    paymentStatus: { type: String, default: "Pending" }, // Pending, Paid, Failed
    trackingUrl: { type: String, default: "" }, // Delhivery/BlueDart Link
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;