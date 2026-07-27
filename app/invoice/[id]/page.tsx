import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import PrintButton from "./PrintButton"; // 🔥 ADD THIS LINE

// 🔥 NEXT.JS 16 REQUIRED: Await params
export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // 1. Securely fetch the exact order from MongoDB
  await connectDB();
  const order = await Order.findById(orderId).lean() as any;

  if (!order) {
    return <div className="error-screen"><h2>ARTIFACT NOT FOUND</h2></div>;
  }

  // 2. Format the date to look professional
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  }).toUpperCase();

  return (
    <div className="invoice-wrapper">
      
      {/* THIS BAR DISAPPEARS WHEN PRINTING */}
      <div className="no-print action-bar">
        <p>Press the button to print or save this document as a PDF.</p>
        <PrintButton /> {/* 🔥 REPLACED WITH NEW COMPONENT */}
      </div>

      {/* THE ACTUAL A4 INVOICE SHEET */}
      <div className="invoice-sheet">
        
        {/* HEADER */}
        <div className="inv-header">
          <div className="brand-info">
            <h1>GENZONIC</h1>
            <p>Pimpri-Chinchwad, Maharashtra, India</p>
            <p>support@genzonic.shop</p>
            <p>GSTIN: 27CPEPC1309H1ZC</p>
          </div>
          <div className="inv-details">
            <h2>TAX INVOICE</h2>
            <p><strong>MANIFEST:</strong> {order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>DATE:</strong> {formattedDate}</p>
            <p><strong>STATUS:</strong> {order.isPaid ? "PAID VIA RAZORPAY" : "PENDING"}</p>
          </div>
        </div>

        <hr className="divider" />

        {/* BILLING INFO */}
        <div className="inv-bill-to">
          <h3>BILL TO / SHIP TO:</h3>
          <p className="c-name"><strong>{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</strong></p>
          <p>{order.shippingInfo?.address}, {order.shippingInfo?.area}</p>
          {order.shippingInfo?.landmark && <p>Landmark: {order.shippingInfo?.landmark}</p>}
          <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}</p>
          <p className="c-contact">Email: {order.userEmail || order.shippingInfo?.email}</p>
          <p className="c-contact">Phone: +91 {order.shippingInfo?.phone}</p>
        </div>

        {/* ITEMS TABLE */}
        <table className="inv-table">
          <thead>
            <tr>
              <th>ITEM DESCRIPTION</th>
              <th className="center">SIZE</th>
              <th className="center">QTY</th>
              <th className="right">PRICE</th>
              <th className="right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item: any, i: number) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td className="center">{item.size}</td>
                <td className="center">{item.quantity}</td>
                <td className="right">₹{item.price}</td>
                <td className="right">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS CALCULATION */}
        <div className="inv-totals-box">
          <div className="total-row">
            <span>SUBTOTAL</span>
            <span>₹{order.subtotal || order.totalAmount}</span>
          </div>
          <div className="total-row">
            <span>GST (5%)</span>
            <span>₹{order.gstAmount || 0}</span>
          </div>
          <div className="total-row">
            <span>SHIPPING</span>
            <span>{order.deliveryCharge ? `₹${order.deliveryCharge}` : "Free"}</span>
          </div>
          <div className="total-row grand-total">
            <span>GRAND TOTAL</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="inv-footer">
          <p className="computer-gen">This is a computer generated invoice and does not require a physical signature.</p>
          <h3>THANK YOU FOR TAPPING INTO EVOLUTION.</h3>
        </div>
      </div>

      {/* THE STYLING ENGINE */}
      <style>{`
        /* Web View Background */
        .invoice-wrapper {
          background: #f4f4f5;
          min-height: 100vh;
          padding: 140px 20px 40px; /* 🔥 Increased top padding to 140px */
          font-family: 'Inter', sans-serif;
          color: #000;
        }

        .error-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; letter-spacing: 2px;}

        /* The Action Bar (Only visible on screen) */
        .action-bar {
          max-width: 800px;
          margin: 0 auto 20px;
          background: #18181b;
          color: #fff;
          padding: 15px 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .print-btn {
          background: #fff;
          color: #000;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 1px;
          transition: 0.2s;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
        }
        .print-btn:hover { background: #e4e4e7; }

        /* The Actual Paper Sheet */
        .invoice-sheet {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          padding: 60px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .inv-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .brand-info h1 { margin: 0 0 5px 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; }
        .brand-info p { margin: 3px 0; font-size: 12px; color: #555; font-weight: 500; }

        .inv-details { text-align: right; }
        .inv-details h2 { margin: 0 0 15px 0; font-size: 24px; color: #a1a1aa; letter-spacing: 2px; }
        .inv-details p { margin: 4px 0; font-size: 12px; }
        .inv-details strong { font-weight: 800; }

        .divider { border: 0; height: 1px; background: #e4e4e7; margin: 30px 0; }

        .inv-bill-to h3 { font-size: 14px; font-weight: 800; color: #a1a1aa; margin-bottom: 10px; letter-spacing: 1px; }
        .inv-bill-to p { margin: 4px 0; font-size: 13px; color: #27272a; }
        .inv-bill-to .c-name { font-size: 16px; margin-bottom: 8px; }
        .inv-bill-to .c-contact { color: #555; margin-top: 5px; font-size: 12px; }

        .inv-table {
          width: 100%;
          border-collapse: collapse;
          margin: 40px 0;
        }
        .inv-table th {
          background: #f4f4f5;
          padding: 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-align: left;
          color: #555;
          border-bottom: 2px solid #000;
        }
        .inv-table td {
          padding: 15px 12px;
          font-size: 13px;
          border-bottom: 1px solid #e4e4e7;
          font-weight: 500;
        }
        
        .center { text-align: center !important; }
        .right { text-align: right !important; }

        .inv-totals-box {
          width: 300px;
          margin-left: auto;
          background: #fafafa;
          padding: 20px;
          border-radius: 4px;
        }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; font-weight: 600; color: #555; }
        .grand-total { border-top: 2px solid #000; padding-top: 15px; margin-top: 10px; font-size: 18px; font-weight: 900; color: #000; }

        .inv-footer {
          margin-top: 60px;
          text-align: center;
          border-top: 1px solid #e4e4e7;
          padding-top: 30px;
        }
        .computer-gen { font-size: 10px; color: #a1a1aa; font-style: italic; margin-bottom: 15px; }
        .inv-footer h3 { font-size: 12px; font-weight: 800; letter-spacing: 2px; color: #000; }

        /* 🔥 THE MAGIC CSS: Isolates the invoice perfectly onto 1 page 🔥 */
        @media print {
          /* 1. Remove browser default headers/footers (URL, Date, Page Numbers) */
          @page {
            margin: 0; 
          }

          /* 2. Force the website to be exactly 1 page long by cutting off invisible space */
          html, body {
            height: 100vh;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          /* 3. Hide absolutely everything on the entire website */
          body * {
            visibility: hidden;
          }
          
          /* 4. Make ONLY the white invoice sheet and its text visible */
          .invoice-sheet, .invoice-sheet * {
            visibility: visible;
          }
          
          /* 5. Pin the invoice to the paper and add safe print margins */
          .invoice-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 40px !important; /* Adds professional borders back inside the paper */
            box-shadow: none !important;
            background: #fff !important;
          }

          /* 6. Lock the logo size so it doesn't scale up */
          .brand-info h1 {
            font-size: 32px !important;
            line-height: 1 !important;
            margin: 0 0 5px 0 !important;
          }

          /* 7. Completely destroy the dark action bar */
          .no-print {
            display: none !important;
          }
          
          /* 8. Tell the printer to print background colors perfectly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}