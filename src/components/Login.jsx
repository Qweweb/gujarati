import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Capacitor } from '@capacitor/core';

const Login = ({ onLogin }) => {
  const [step, setStep] = useState('phone'); // phone, otp, profiles
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [showReviewerLogin, setShowReviewerLogin] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const redirectUrl = Capacitor.isNativePlatform()
        ? 'gujaratiapp://login'
        : window.location.origin;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Google લોગિનમાં સમસ્યા આવી: " + err.message);
    }
  };

  const handlePhoneChange = (e) => {
    setError("");
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handlePhoneSubmit = () => {
    if (phone === "9999999999") {
        setStep('otp');
    } else {
        setError("કૃપા કરી સાચો ટેસ્ટ નંબર (9999999999) દાખલ કરો.");
    }
  };

  const handleOtpChange = (index, value) => {
    setError("");
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (phone === "9999999999" && enteredOtp === "0000") {
        setStep('profiles');
    } else {
        setError("OTP ખોટો છે. (Test OTP: 0000)");
    }
  };

  const MirrorWork = ({ className }) => (
    <div className={`h-6 w-6 rounded-full bg-white shadow-inner flex items-center justify-center border-2 border-primary/20 ${className}`}>
        <div className="h-3 w-3 rounded-full bg-gradient-to-tr from-stone-200 to-white shadow-sm"></div>
    </div>
  );

  const Header = () => (
    <div className="w-full h-[35vh] bg-gradient-to-b from-[#e67e22] to-[#d35400] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 w-full flex justify-between px-12 opacity-50">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className={`h-${16 + i * 4} w-0.5 bg-yellow-400`}></div>
                    <MirrorWork />
                </div>
            ))}
        </div>
        <div className="relative z-10 flex flex-col items-center mt-[-20px]">
             <span className="material-symbols-outlined text-white text-[100px] font-thin drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 100" }}>temple_hindu</span>
        </div>
        <div className="absolute bottom-0 w-full h-12 bg-[#F5EEDC] dark:bg-dark-bg rounded-t-[3rem]"></div>
    </div>
  );

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-[#F5EEDC] dark:bg-dark-bg flex flex-col items-center justify-start animate-fade-in relative overflow-x-hidden">
        <Header />
        <div className="w-full max-w-sm px-6 -mt-8 relative z-20 space-y-8 text-center">
            <h1 className="font-gujarati font-black text-4xl text-[#4A0E0E] dark:text-dark-accent select-none">Gujarati App</h1>
            <div className="text-center space-y-1">
                <h2 onClick={() => setShowReviewerLogin(prev => !prev)} className="font-gujarati font-bold text-2xl text-[#1f1b16] dark:text-dark-text cursor-pointer select-none">લોગિન</h2>
                {showReviewerLogin && <p className="font-gujarati text-lg text-outline">ટેસ્ટ નંબર: 9999999999</p>}
            </div>
            <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 shadow-2xl space-y-6 border-t-8 border-[#d35400] relative animate-slide-up">
                <MirrorWork className="absolute -top-4 -left-2" />
                <MirrorWork className="absolute -top-4 -right-2" />
                
                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-4 px-6 rounded-2xl bg-[#d35400] dark:bg-[#d35400] hover:bg-[#b34700] text-white font-gujarati font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 py-5"
                >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.23 0-5.857-2.627-5.857-5.857s2.627-5.857 5.857-5.857c1.46 0 2.784.537 3.816 1.417l3.056-3.056C18.91 3.23 15.82 2 12.24 2 6.584 2 2 6.584 2 12.24s4.584 10.24 10.24 10.24c5.795 0 10.24-4.15 10.24-10.24 0-.64-.067-1.285-.19-1.955H12.24z"/>
                    </svg>
                    Google થી લોગિન કરો
                </button>

                {error && <p className="text-error font-gujarati text-sm font-bold">{error}</p>}

                {/* Backdoor for Google Play reviewer/test number login */}
                {showReviewerLogin && (
                  <div className="space-y-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 bg-[#F5EEDC]/40 dark:bg-dark-bg p-4 rounded-2xl border-2 border-primary/5 focus-within:border-[#d35400] transition-all">
                        <span className="font-headline font-black text-lg text-primary">+91</span>
                        <input type="tel" maxLength="10" placeholder="નંબર લખો" value={phone} onChange={handlePhoneChange} className="w-full bg-transparent border-none outline-none font-headline font-black text-xl text-[#d35400]" />
                    </div>
                    <button onClick={handlePhoneSubmit} disabled={phone.length < 10} className={`w-full py-5 rounded-2xl font-gujarati font-black text-2xl shadow-xl transition-all ${phone.length === 10 ? 'bg-[#d35400] text-white' : 'bg-stone-200 text-stone-400'}`}>OTP મેળવો</button>
                  </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-[#F5EEDC] dark:bg-dark-bg flex flex-col items-center justify-start animate-fade-in relative overflow-x-hidden">
        <Header />
        <div className="w-full max-w-sm px-6 -mt-8 relative z-20 space-y-8 text-center text-on-surface dark:text-dark-text">
            <h1 className="font-gujarati font-black text-4xl">Gujarati App</h1>
            <div className="space-y-1">
                <h2 className="font-gujarati font-bold text-2xl">OTP વેરિફિકેશન</h2>
                <p className="font-gujarati text-lg opacity-60">મોકલેલ કોડ: 0000</p>
            </div>
            <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 shadow-2xl space-y-8 border-t-8 border-[#d35400] relative">
                <MirrorWork className="absolute -top-4 -left-2" />
                <MirrorWork className="absolute -top-4 -right-2" />
                <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                        <input key={idx} ref={otpRefs[idx]} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(idx, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(idx, e)} className="w-16 h-20 bg-[#F5EEDC]/40 dark:bg-dark-bg rounded-2xl text-center font-headline font-black text-4xl border-2 border-primary/5 focus:border-[#d35400] outline-none text-[#d35400]" />
                    ))}
                </div>
                {error && <p className="text-error font-gujarati text-sm font-bold">{error}</p>}
                <button onClick={handleVerifyOtp} disabled={otp.some(d => !d)} className={`w-full py-5 rounded-2xl font-gujarati font-black text-2xl shadow-xl transition-all ${!otp.some(d => !d) ? 'bg-[#d35400] text-white' : 'bg-stone-200 text-stone-400'}`}>ખાતરી કરો</button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EEDC] dark:bg-dark-bg flex flex-col items-center justify-center p-8 animate-fade-in text-on-surface dark:text-dark-text">
        <div className="max-w-4xl w-full space-y-12">
            <h2 className="font-gujarati font-black text-5xl text-center">કોણ જોઈ રહ્યું છે?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
                {[
                  { name: "દાદાજી", role: "વડીલ", icon: "elderly", color: "bg-orange-100" },
                  { name: "બા", role: "વડીલ", icon: "elderly_woman", color: "bg-rose-100" },
                  { name: "ચિન્ટુ", role: "બાળક", icon: "child_care", color: "bg-blue-100" }
                ].map((p, idx) => (
                    <div key={idx} onClick={onLogin} className="bg-white dark:bg-dark-surface rounded-[3rem] p-10 shadow-xl flex flex-col items-center gap-6 border-4 border-transparent hover:border-primary transition-all cursor-pointer">
                        <div className={`h-32 w-32 ${p.color} dark:bg-dark-bg rounded-full flex items-center justify-center text-primary dark:text-dark-accent p-4`}><span className="material-symbols-outlined text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span></div>
                        <div className="text-center"><h4 className="font-gujarati font-black text-3xl mb-1">{p.name}</h4><span className="bg-primary/10 px-4 py-1 rounded-full font-gujarati font-bold text-xs">{p.role}</span></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Login;
