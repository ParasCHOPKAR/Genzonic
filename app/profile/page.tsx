"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, MapPin, Plus, Trash2, Star, CheckCircle2, Loader2 } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

type Address = {
  fullName: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
  streetAddress: string;
  isDefault: boolean;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState<Address>({
    fullName: "", phone: "", pinCode: "", city: "", state: "Maharashtra", streetAddress: "", isDefault: false
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/user/profile");
          const data = await res.json();
          if (data.success && data.profile?.addresses) {
            setAddresses(data.profile.addresses);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    if (name === "phone") {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    if (name === "pinCode") {
      value = value.replace(/\D/g, '').slice(0, 6);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isDefault: e.target.checked });
  };

  const saveToDatabase = async (updatedAddresses: Address[]) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.profile.addresses);
        setMessage("Address book updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        setShowForm(false);
      }
    } catch (error) {
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newAddresses = [...addresses];
    
    if (formData.isDefault || addresses.length === 0) {
      formData.isDefault = true;
      newAddresses = newAddresses.map(addr => ({ ...addr, isDefault: false }));
    }
    
    newAddresses.push(formData);
    saveToDatabase(newAddresses);
  };

  const deleteAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    if (newAddresses.length > 0 && addresses[index].isDefault) {
      newAddresses[0].isDefault = true;
    }
    saveToDatabase(newAddresses);
  };

  const setAsDefault = (index: number) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    saveToDatabase(newAddresses);
  };

  if (status === "loading" || loading) {
    return (
      <div className="profile-loading">
        <Loader2 size={40} className="spinner" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className={`profile-page ${isDark ? 'dark-mode' : ''}`}>
      <div className="profile-container">
        
        <div className="header-section">
          <h1 className="main-title">My Profile</h1>
          <p className="sub-title">Manage your account details and address book.</p>
        </div>

        <div className="user-card">
          <div className="user-card-inner">
            <div className="user-avatar">
              {session?.user?.email?.charAt(0).toUpperCase() || <User />}
            </div>
            <div>
              <p className="logged-in-label">Logged in as</p>
              <p className="user-email">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="success-message">
            <CheckCircle2 size={20} className="success-icon" />
            <span>{message}</span>
          </div>
        )}

        <div className="address-header">
          <h2 className="section-title">
            <MapPin className="pin-icon" size={24} /> Saved Addresses
          </h2>
          {!showForm && (
            <button onClick={() => {
              setFormData({ fullName: "", phone: "", pinCode: "", city: "", state: "Maharashtra", streetAddress: "", isDefault: false });
              setShowForm(true);
            }} className="add-btn">
              <Plus size={16} /> Add New
            </button>
          )}
        </div>

        {/* LIST OF ADDRESSES */}
        {!showForm && addresses.length > 0 && (
          <div className="address-grid">
            {addresses.map((addr, index) => (
              <div key={index} className={`address-card ${addr.isDefault ? 'is-default' : ''}`}>
                {addr.isDefault && (
                  <span className="default-badge">
                    <Star size={10} /> Default
                  </span>
                )}
                <p className="addr-name">{addr.fullName}</p>
                <p className="addr-text">{addr.streetAddress}</p>
                <p className="addr-text">{addr.city}, {addr.state} - {addr.pinCode}</p>
                <p className="addr-phone">Phone: {addr.phone}</p>
                
                <div className="addr-actions">
                  {!addr.isDefault && (
                    <button onClick={() => setAsDefault(index)} className="set-default-btn">Set as Default</button>
                  )}
                  <button onClick={() => deleteAddress(index)} className="delete-btn">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm && addresses.length === 0 && (
          <div className="empty-state">
            You haven't saved any addresses yet.
          </div>
        )}

        {/* ADD NEW FORM */}
        {showForm && (
          <form onSubmit={handleSubmit} className="address-form">
            <h3 className="form-title">Enter Address Details</h3>
            
            <div className="form-grid-2">
              <div className="input-group">
                <label>Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength={10} title="Please enter a valid 10-digit phone number" />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="input-group">
                <label>PIN Code</label>
                <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} pattern="[0-9]{6}" maxLength={6} title="Please enter a valid 6-digit PIN code" />
              </div>
              <div className="input-group">
                <label>City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="input-group col-span-mobile">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange}>
                  <option>Maharashtra</option><option>Gujarat</option><option>Karnataka</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Complete Street Address</label>
              <input required type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="House/Flat No., Building Name, Street" />
            </div>

            <label className="checkbox-group">
              <input type="checkbox" checked={formData.isDefault || addresses.length === 0} onChange={handleCheckbox} disabled={addresses.length === 0} />
              <span>Make this my default shipping address</span>
            </label>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
              <button type="submit" disabled={saving} className="save-btn">
                {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />} Save Address
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 60px 0;
          color: #0f1b2e;
          font-family: inherit;
        }
        
        .profile-page.dark-mode {
          background: #0a0a0a;
          color: #fff;
        }

        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .header-section { margin-bottom: 40px; }
        .main-title { font-size: 36px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
        .sub-title { color: #888; font-weight: 500; }

        .user-card {
          background: #fff;
          border-radius: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid #eaeaea;
          overflow: hidden;
          margin-bottom: 32px;
        }
        .dark-mode .user-card { background: #111; border-color: #333; box-shadow: none; }

        .user-card-inner {
          background: rgba(0,0,0,0.02);
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .dark-mode .user-card-inner { background: rgba(255,255,255,0.02); }

        .user-avatar {
          width: 64px; height: 64px;
          background: #0f1b2e;
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: bold;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .dark-mode .user-avatar { background: #fff; color: #000; }

        .logged-in-label { font-size: 11px; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .user-email { font-size: 18px; font-weight: 800; }

        .success-message {
          margin-bottom: 24px; padding: 16px;
          background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
          border-radius: 12px; display: flex; align-items: center; gap: 12px; font-weight: bold; font-size: 14px;
        }
        .dark-mode .success-message { background: rgba(21, 128, 61, 0.1); border-color: rgba(21, 128, 61, 0.3); color: #4ade80; }

        .address-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
        }
        .section-title { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; }
        .pin-icon { color: #FF3E00; }
        .add-btn {
          display: flex; align-items: center; gap: 8px;
          background: #000; color: #fff;
          padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;
          border: none; cursor: pointer; transition: opacity 0.2s;
        }
        .dark-mode .add-btn { background: #fff; color: #000; }
        .add-btn:hover { opacity: 0.8; }

        .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) { .address-grid { grid-template-columns: 1fr; } }

        .address-card {
          padding: 24px; border-radius: 24px;
          border: 1px solid #eaeaea; background: #fff; position: relative;
        }
        .dark-mode .address-card { background: #111; border-color: #333; }
        .address-card.is-default { border-color: #FF3E00; background: rgba(255,62,0,0.02); }

        .default-badge {
          position: absolute; top: 16px; right: 16px;
          background: #FF3E00; color: #fff; font-size: 10px; font-weight: 800; text-transform: uppercase;
          padding: 4px 8px; border-radius: 20px; display: flex; align-items: center; gap: 4px;
        }

        .addr-name { font-weight: 800; font-size: 18px; margin-bottom: 4px; }
        .addr-text { font-size: 14px; color: #666; margin-bottom: 4px; }
        .dark-mode .addr-text { color: #aaa; }
        .addr-phone { font-size: 14px; color: #666; font-weight: 600; margin-bottom: 24px; }

        .addr-actions {
          display: flex; align-items: center; gap: 12px;
          border-top: 1px solid #eaeaea; padding-top: 16px;
        }
        .dark-mode .addr-actions { border-color: #333; }

        .set-default-btn { font-size: 12px; font-weight: 800; color: #FF3E00; background: none; border: none; cursor: pointer; padding: 0; }
        .set-default-btn:hover { text-decoration: underline; }
        .delete-btn { font-size: 12px; font-weight: 800; color: #ef4444; background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px; margin-left: auto; }
        .delete-btn:hover { text-decoration: underline; }

        .empty-state {
          background: #fff; border-radius: 24px; padding: 32px; text-align: center; color: #888;
          border: 1px solid #eaeaea; font-weight: 500;
        }
        .dark-mode .empty-state { background: #111; border-color: #333; }

        .address-form {
          background: #fff; padding: 32px; border-radius: 24px; border: 1px solid #eaeaea;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          display: flex; flex-direction: column; gap: 24px;
        }
        .dark-mode .address-form { background: #111; border-color: #333; }

        .form-title { font-weight: 800; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 16px; margin: 0; }
        .dark-mode .form-title { border-color: #333; }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) {
          .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
        }

        .input-group label { display: block; font-size: 13px; font-weight: 800; margin-bottom: 8px; }
        .input-group input, .input-group select {
          width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #eaeaea;
          background: #f9f9f9; font-family: inherit; font-size: 14px; color: #000;
          outline: none; transition: border-color 0.2s;
        }
        .input-group input:focus, .input-group select:focus { border-color: #FF3E00; }
        .dark-mode .input-group input, .dark-mode .input-group select {
          background: #222; border-color: #333; color: #fff;
        }

        .checkbox-group { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 800; }
        .checkbox-group input { width: 20px; height: 20px; accent-color: #FF3E00; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #eaeaea; padding-top: 24px; }
        .dark-mode .form-actions { border-color: #333; }
        
        .cancel-btn { padding: 12px 24px; background: transparent; border: 1px solid #eaeaea; border-radius: 12px; font-weight: bold; cursor: pointer; color: inherit; }
        .dark-mode .cancel-btn { border-color: #333; }
        .save-btn { padding: 12px 24px; background: #000; color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .dark-mode .save-btn { background: #fff; color: #000; }

        .profile-loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
        .spinner { animation: spin 1s linear infinite; color: #FF3E00; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}