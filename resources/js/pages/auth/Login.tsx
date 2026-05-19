import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, ShieldCheck, Phone, User, Shield, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Login() {
  const [step, setStep] = useState<"role" | "phone" | "otp" | "register">("role");
  const [role, setRole] = useState<"customer" | "admin" | "delivery" | "">("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Registration States
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  
  // Timer State
  const [timer, setTimer] = useState(30);
  
  // Backend integration states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset timer when entering OTP step
  useEffect(() => {
    if (step === "otp") setTimer(30);
  }, [step]);

  const handleRoleSelect = (selectedRole: "customer" | "admin" | "delivery") => {
    setRole(selectedRole);
    setStep("phone");
    setError("");
  };

  // --- Real API Step 1: Request Login OTP from Laravel ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return;
    
    setLoading(true);
    setError("");

    try {
        const response = await axios.post('/api/auth/login/request-otp', {
            phone: phone,
            role: role
        });
        
        setStep("otp");
        toast.success(`OTP sent to +91 ${phone}`);
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to register OTP dispatch. Check number details.";
        setError(errorMsg);
        toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  // --- Real API Step: Register New Customer ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const response = await axios.post('/api/auth/register', {
            name: regName,
            phone: regPhone,
            email: regEmail,
            address: regAddress
        });
        
        const successMsg = response.data.message || "Registration successful! Pending admin approval.";
        setError(successMsg);
        toast.success(successMsg, { duration: 5000 });
        setStep("phone"); // Send back to login step where they can see the message
        
        // Reset form
        setRegName("");
        setRegPhone("");
        setRegEmail("");
        setRegAddress("");
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Registration failed. Please check your details.";
        setError(errorMsg);
        toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  // --- Real API Step 2: Pass Phone + Unified OTP Array to verification endpoint ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const unifiedOtpString = otp.join("");

    try {
        // Step 1: Initialize CSRF protection for Laravel Sanctum session context
        await axios.get('/sanctum/csrf-cookie');

        // Step 2: Post payload mapping exactly to AuthController requirements
        const response = await axios.post('/api/auth/login/verify-otp', {
            phone: phone,
            otp: unifiedOtpString,
            role: role
        });

        // Step 3: Store the token and role globally
        const { token, role: userRole, user } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', userRole);
        localStorage.setItem('user_data', JSON.stringify(user));

        // Configure axios to append this authentication token to headers automatically
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Step 4: Route straight to matching dashboard handles
        if (userRole === 'admin') {
            navigate("/dashboard/admin");
        } else if (userRole === 'delivery_staff' || userRole === 'delivery') {
            navigate("/dashboard/delivery");
        } else {
            navigate("/dashboard/customer");
        }
        toast.success("Successfully verified! Welcome back.");
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Invalid verification pin. Try requesting a new handle code.";
        setError(errorMsg);
        toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus logic (moves to next input automatically)
    if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground/80 hover:text-foreground">
          <ArrowRight className="rotate-180" size={20} />
          <span className="font-medium text-sm">Back to Home</span>
        </Link>

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-orange-500/20">
              <Flame size={28} className="fill-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Access your Amrutha BharatGas portal.</p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"
            >
              <ShieldCheck size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <button
                  onClick={() => handleRoleSelect("customer")}
                  className="w-full flex items-center p-4 rounded-2xl border-2 border-border hover:border-brand-orange-500 hover:bg-brand-orange-50/50 dark:hover:bg-brand-orange-950/20 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Customer Portal</h3>
                    <p className="text-sm text-muted-foreground">Book refills & track deliveries</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleRoleSelect("delivery")}
                  className="w-full flex items-center p-4 rounded-2xl border-2 border-border hover:border-brand-orange-500 hover:bg-brand-orange-50/50 dark:hover:bg-brand-orange-950/20 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Delivery Staff</h3>
                    <p className="text-sm text-muted-foreground">Manage routes & updates</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect("admin")}
                  className="w-full flex items-center p-4 rounded-2xl border-2 border-border hover:border-brand-orange-500 hover:bg-brand-orange-50/50 dark:hover:bg-brand-orange-950/20 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Agency Admin</h3>
                    <p className="text-sm text-muted-foreground">Management dashboard</p>
                  </div>
                </button>
              </motion.div>
            )}

            {step === "phone" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Registered Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 outline-none transition-all font-medium text-lg"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>{'Send OTP'} <ArrowRight size={20} /></>}
                </button>
                <div className="text-center space-y-3">
                  <button type="button" onClick={() => setStep("role")} className="text-sm font-medium text-muted-foreground hover:text-foreground block w-full">Change Role</button>
                  {role === "customer" && (
                    <button type="button" onClick={() => { setStep("register"); setError(""); }} className="text-sm font-medium text-brand-orange-500 hover:text-brand-orange-600 block w-full">
                      Don't have an account? Register here
                    </button>
                  )}
                </div>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Verification Code</label>
                    <button type="button" onClick={() => setStep("phone")} className="text-sm text-brand-orange-500 font-medium hover:underline">Change Number</button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">We've sent a 6-digit code to +91 {phone}</p>
                  
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 outline-none transition-all"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full py-3.5 rounded-xl bg-brand-orange-500 text-white font-bold text-lg hover:bg-brand-orange-600 transition-colors shadow-lg shadow-brand-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      Verify & Secure Login <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
                <div className="text-center text-sm font-medium text-muted-foreground">
                  {timer > 0 ? (
                    <span>Didn't receive the code? Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => {
                        setTimer(30);
                        // Trigger your resend API call here if needed
                      }} 
                      className="text-foreground font-bold hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </motion.form>
            )}

            {step === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 outline-none transition-all font-medium"
                    placeholder="Enter full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 outline-none transition-all font-medium"
                    placeholder="Enter 10-digit number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 outline-none transition-all font-medium"
                    placeholder="Enter email address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Address</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 outline-none transition-all font-medium resize-none"
                    placeholder="Enter complete delivery address"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || regPhone.length < 10 || !regName || !regEmail || !regAddress}
                  className="w-full py-3.5 mt-2 rounded-xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Registration'}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep("phone")} className="text-sm font-medium text-muted-foreground hover:text-foreground block w-full">
                    Already have an account? Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between items-center text-sm text-muted-foreground font-medium">
             <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500" /> 256-bit Encrypted</span>
             <a href="#" className="hover:text-foreground transition-colors">Need Help?</a>
          </div>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-background border-l border-border relative overflow-hidden flex-col justify-center px-12 xl:px-24">
         <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
         <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-orange-500/20 blur-[120px] rounded-full pointer-events-none translate-x-1/2"></div>
         <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="relative z-10">
            <h2 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">Logistics made <br/><span className="text-brand-orange-500">effortless.</span></h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-md">Our advanced dashboard gives you complete control over your LPG deliveries, safety insights, and payment history.</p>
            
            <div className="space-y-6">
                {[
                  { title: "Real-time Delivery Tracking", desc: "Know exactly when your cylinder arrives with live map tracking." },
                  { title: "Instant Subsidy Updates", desc: "Get notified immediately when government subsidies hit your account." },
                  { title: "Automated Resupply", desc: "Our AI predicts when you're running low and prompts a re-order." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-md transition-colors">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-brand-orange-500/10 dark:bg-brand-orange-500/20 flex items-center justify-center text-brand-orange-500 border border-brand-orange-500/20 dark:border-brand-orange-500/30">
                         {i + 1}
                      </div>
                      <div>
                         <h4 className="text-foreground font-bold text-lg">{feature.title}</h4>
                         <p className="text-muted-foreground text-sm mt-1">{feature.desc}</p>
                      </div>
                  </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
}