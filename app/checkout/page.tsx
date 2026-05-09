"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

// Tells TypeScript that window.Razorpay exists
declare global {
  interface Window {
    Razorpay: any;
  }
}

// 📌 Indian States & Districts Data Mapping
const INDIA_STATES_DATA: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "SAS Nagar", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const [addressType, setAddressType] = useState("Home");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 📌 State hooks for dependent dropdowns
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true); // 🔄 Starts the spinning loader

    const formData = new FormData(e.currentTarget);
    const shippingInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      altPhone: formData.get("altPhone"),
      pinCode: formData.get("pinCode"),
      address: formData.get("address"),
      area: formData.get("area"),
      landmark: formData.get("landmark"),
      city: formData.get("city"), // Automatically picks up the <select name="city">
      state: formData.get("state"), // Automatically picks up the <select name="state">
      addressType: addressType,
    };

    const orderData = {
      userEmail: shippingInfo.email,
      shippingInfo,
      orderItems: cart,
      totalAmount: total,
    };

    try {
      // 1. Send data to backend to create a Pending MongoDB Order & Razorpay ID
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to initialize payment.");
        setIsProcessing(false);
        return;
      }

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_SfR9dfwd9euBsW",
        amount: data.amount,
        currency: "INR",
        name: "GenZonic",
        description: "Premium Artifact Dispatch",
        image: "/favicon.ico", 
        order_id: data.rzpOrderId, 
        
        // 3. User successfully paid! 
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart(); 
              window.location.href = `/checkout/success?orderId=${data.rzpOrderId}`; 
            } else {
              alert("Payment Verification Failed. Contact Support.");
              setIsProcessing(false); 
            }
          } catch (err) {
            alert("Error verifying payment.");
            setIsProcessing(false); 
          }
        },
        
        // 4. FIX: If user closes the modal without paying, stop the spinner!
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#ffc107", 
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed or was cancelled.");
        setIsProcessing(false); // Stops the spinner
      });

    } catch (error) {
      console.error(error);
      setIsProcessing(false); // Stops the spinner
    }
  };

  // 📌 Handle State Change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity(""); // Reset city when state changes
  };

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="checkout-page">
        <h1 className="title">SECURE DISPATCH</h1>

        <div className="checkout-grid">
          <form className="shipping-form" onSubmit={handlePayment}>
            <h2 className="section-label">01 // CONTACT LOGISTICS</h2>
            <div className="grid-inputs">
              <div className="input-group half"><label>FIRST NAME *</label><input name="firstName" type="text" required /></div>
              <div className="input-group half"><label>LAST NAME *</label><input name="lastName" type="text" required /></div>
              <div className="input-group full"><label>EMAIL ADDRESS *</label><input name="email" type="email" required /></div>
              
              <div className="input-group half"><label>MOBILE NUMBER *</label>
                <div className="phone-wrapper"><span className="prefix">+91</span>
                  <input name="phone" type="tel" required maxLength={10} minLength={10} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} />
                </div>
              </div>
              <div className="input-group half"><label>ALTERNATIVE NUMBER</label>
                <div className="phone-wrapper"><span className="prefix">+91</span>
                  <input name="altPhone" type="tel" maxLength={10} minLength={10} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} />
                </div>
              </div>
            </div>

            <h2 className="section-label">02 // SHIPPING DESTINATION</h2>
            <div className="grid-inputs">
              <div className="input-group full"><label>COUNTRY *</label><input type="text" value="INDIA 🇮🇳" disabled className="disabled-input" /></div>
              <div className="input-group full"><label>PIN CODE / POSTAL CODE *</label><input name="pinCode" type="text" required /></div>
              <div className="input-group full"><label>FLAT NO / BUILDING / STREET NAME *</label><input name="address" type="text" required /></div>
              <div className="input-group full"><label>AREA / LOCALITY *</label><input name="area" type="text" required /></div>
              <div className="input-group full"><label>LANDMARK</label><input name="landmark" type="text" /></div>
              
              {/* 📌 Replace Input with Dependent Dropdowns */}
              <div className="input-group half">
                <label>STATE *</label>
                <select 
                  name="state" 
                  required 
                  value={selectedState} 
                  onChange={handleStateChange}
                >
                  <option value="" disabled>Select State</option>
                  {Object.keys(INDIA_STATES_DATA).sort().map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="input-group half">
                <label>DISTRICT / CITY *</label>
                <select 
                  name="city" 
                  required 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="" disabled>Select District</option>
                  {selectedState && INDIA_STATES_DATA[selectedState].sort().map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="input-group full"><label>SAVE ADDRESS AS</label>
                <div className="type-selector">
                  {["Home", "Office", "Other"].map((type) => (
                    <button key={type} type="button" className={`type-btn ${addressType === type ? "active" : ""}`} onClick={() => setAddressType(type)}>{type}</button>
                  ))}
                </div>
              </div>
            </div>
            
            <h2 className="section-label" style={{marginTop: "40px"}}>03 // AUTHORIZATION</h2>
            
            <button type="submit" className="pay-btn" disabled={isProcessing}>
              {isProcessing ? <><Loader2 className="animate-spin" size={20} /> INITIALIZING GATEWAY...</> : `PAY WITH UPI / CARD — ₹${total}`}
            </button>
            
            <p className="notice"><ShieldCheck size={14} color="#22c55e" /> 256-bit SSL Encrypted Transaction</p>
          </form>

          {/* RIGHT: MANIFEST (STICKY) */}
          <div className="order-manifest-wrapper">
            <div className="order-manifest">
              <h2 className="section-label">ORDER MANIFEST</h2>
              <div className="manifest-items">
                {cart.map((item) => (
                  <div key={item.id + item.size} className="mini-card">
                    <div className="img-box"><Image src={item.image} alt="" fill style={{objectFit:"cover"}} /></div>
                    <div className="info"><p className="n">{item.name}</p><p className="s">SIZE: {item.size} / QTY: {item.quantity}</p></div>
                    <p className="p">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="manifest-footer">
                <div className="line"><span>SUBTOTAL</span><span>₹{total}</span></div>
                <div className="line"><span>SHIPPING</span><span className="green">COMPLIMENTARY</span></div>
                <div className="line grand"><span>TOTAL DUE</span><span>₹{total}</span></div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .checkout-page { padding: 140px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; max-width: 1300px; margin: 0 auto; font-family: 'Inter', sans-serif; transition: 0.3s; }
          .title { font-size: clamp(32px, 5vw, 48px); font-weight: 900; letter-spacing: -2px; text-align: center; margin-bottom: 60px; text-transform: uppercase; }
          .checkout-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 60px; align-items: start; }
          
          .section-label { font-size: 12px; font-weight: 900; letter-spacing: 3px; opacity: 0.5; margin-bottom: 25px; margin-top: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 10px; }
          .grid-inputs { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
          .input-group { display: flex; flex-direction: column; gap: 8px; }
          .full { width: 100%; }
          .half { width: calc(50% - 10px); }
          label { font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #888; }
          
          /* 📌 Added select tag to inherit identical styles as input */
          input, select { background: rgba(128,128,128,0.03); border: 1px solid rgba(128,128,128,0.2); padding: 16px; color: var(--text); font-weight: 700; font-size: 13px; outline: none; transition: 0.2s; border-radius: 4px; }
          
          /* Ensures the dropdown arrow renders cleanly and the pointer works on select boxes */
          select { cursor: pointer; appearance: auto; }

          input:focus, select:focus { border-color: var(--text); background: transparent; }
          .disabled-input, select:disabled { background: rgba(128,128,128,0.1); cursor: not-allowed; font-weight: 900; opacity: 0.7; border-color: rgba(128,128,128,0.1); }

          .phone-wrapper { display: flex; align-items: center; background: rgba(128,128,128,0.03); border: 1px solid rgba(128,128,128,0.2); border-radius: 4px; transition: 0.2s; }
          .phone-wrapper:focus-within { border-color: var(--text); background: transparent; }
          .prefix { padding: 16px 0 16px 16px; font-weight: 900; color: #888; font-size: 13px; }
          .phone-wrapper input { border: none; background: transparent; padding-left: 10px; flex: 1; }
          
          .type-selector { display: flex; gap: 10px; }
          .type-btn { flex: 1; padding: 14px; background: transparent; border: 1px solid rgba(128,128,128,0.3); color: var(--text); font-weight: 800; font-size: 12px; cursor: pointer; transition: 0.2s; border-radius: 4px; }
          .type-btn.active { background: #ffc107; color: #0f172a; border-color: #ffc107; }

          .pay-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 24px; background: #ffc107; color: #0f172a; border: none; font-weight: 900; font-size: 16px; letter-spacing: 2px; cursor: pointer; transition: 0.3s; border-radius: 8px; box-shadow: 0 6px 0px rgba(255, 193, 7, 0.4); }
          .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(255, 193, 7, 0.3); background: #ffb300; }
          .pay-btn:disabled { opacity: 0.7; cursor: not-allowed; box-shadow: none; transform: translateY(4px); }
          
          .notice { font-size: 11px; color: #888; text-align: center; margin-top: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; }

          .order-manifest-wrapper { position: relative; height: 100%; }
          .order-manifest { position: sticky; top: 120px; background: var(--bg); padding: 35px; border-radius: 8px; border: 2px solid var(--text); box-shadow: 8px 8px 0px var(--text); }
          :global(.dark) .order-manifest { box-shadow: 6px 6px 0px rgba(255,255,255,0.2); }

          .manifest-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; max-height: 40vh; overflow-y: auto; padding-right: 10px; }
          .manifest-items::-webkit-scrollbar { width: 4px; }
          .manifest-items::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
          .mini-card { display: flex; align-items: center; gap: 15px; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 15px; }
          .img-box { position: relative; width: 55px; height: 75px; background: rgba(128,128,128,0.1); border-radius: 4px; overflow: hidden; flex-shrink: 0; }
          .info { flex: 1; }
          .n { font-size: 13px; font-weight: 800; margin: 0; text-transform: uppercase; line-height: 1.2; }
          .s { font-size: 10px; color: #888; margin: 5px 0 0 0; font-weight: 700; }
          .p { font-weight: 900; font-size: 14px; }
          .manifest-footer { border-top: 1px dashed rgba(128,128,128,0.3); padding-top: 20px; }
          .line { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; margin-bottom: 12px; }
          .green { color: #22c55e; }
          .grand { font-size: 22px; font-weight: 900; margin-top: 20px; border-top: 1px solid rgba(128,128,128,0.1); padding-top: 20px; }

          @media (max-width: 1000px) { 
            .checkout-grid { grid-template-columns: 1fr; } 
            .half { width: 100%; } 
            .order-manifest { position: relative; top: 0; }
          }
        `}</style>
      </div>
    </>
  );
}