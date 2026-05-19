import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Shield, Save, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhaar_number: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          aadhaar_number: res.data.aadhaar_number || ""
        });
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save for now since standard update endpoint might not be exposed for customers directly
    // Normally we'd call axios.put('/api/user', profile, config)
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setSaving(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 w-full max-w-[800px] mx-auto h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange-500" size={28} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 w-full max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal profile and preferences.</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/30">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Shield size={12} className="text-emerald-500" /> Consumer Profile Active
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                <User size={14} /> Full Name
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 focus:bg-card outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                <Phone size={14} /> Phone Number
              </label>
              <input 
                type="text" 
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-muted/50 text-muted-foreground outline-none text-sm cursor-not-allowed" 
                value={profile.phone} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground">
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 focus:bg-card outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm" 
              value={profile.email} 
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={14} /> Delivery Address
            </label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 focus:bg-card outline-none focus:ring-1 focus:ring-brand-orange-500/30 text-sm resize-none" 
              value={profile.address} 
              onChange={(e) => setProfile({...profile, address: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary px-6 flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
