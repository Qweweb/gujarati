import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Capacitor } from '@capacitor/core';
import { useTheme } from '../context/ThemeContext';

const Login = ({ onLogin }) => {
  const { activeTheme } = useTheme();
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
        onLogin();
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
    <div style={{ background: activeTheme.heroGradient || activeTheme.gradient }} className="w-full h-[35vh] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 w-full flex justify-between px-12 opacity-50">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="h-16 w-0.5 bg-yellow-400"></div>
                    <MirrorWork />
                </div>
            ))}
        </div>
        <div className="relative z-10 flex flex-col items-center mt-[-20px]">
             <span className="material-symbols-outlined text-white text-[100px] font-thin drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 100" }}>temple_hindu</span>
        </div>
        <div className="absolute bottom-0 w-full h-12 bg-surface dark:bg-dark-bg rounded-t-[3rem]"></div>
    </div>
  );

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-600/10 dark:bg-brand-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
            
            {/* Logo/Icon */}
            <div className="h-24 w-24 bg-white/60 dark:bg-stone-800/60 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center border border-primary/30 mb-8 transform hover:scale-105 transition-transform duration-500 overflow-hidden">
                <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>

            <div className="text-center space-y-3 mb-10">
                <h1 style={{ fontFamily: '"Palash", "Playfair Display", "Noto Serif Gujarati", serif' }} className="font-black text-4xl text-brand-600 dark:text-primary tracking-tight">Gujarati App</h1>
                <h2 onClick={() => setShowReviewerLogin(prev => !prev)} style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-bold text-lg text-on-surface dark:text-dark-text cursor-pointer select-none">
                    સ્વાગત છે, લોગિન કરો
                </h2>
                {showReviewerLogin && <p className="font-gujarati text-xs text-primary font-bold tracking-widest mt-2 uppercase">Developer Mode</p>}
            </div>

            {/* Main Login Card */}
            <div className="w-full bg-surface dark:bg-stone-900 rounded-[2rem] p-8 shadow-sm border border-outline dark:border-stone-800 space-y-6">
                
                {/* Google Login Button (Modern) */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full group relative flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 rounded-xl bg-background dark:bg-stone-800 text-brand-600 dark:text-stone-100 font-gujarati font-bold text-base sm:text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 border border-primary/30 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-brand-600/5 dark:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 relative z-10" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="relative z-10 whitespace-nowrap flex items-baseline gap-1.5">
                        <span className="font-headline font-black text-[1.1em]">Google</span>
                        <span style={{ fontFamily: '"Noto Serif Gujarati", serif' }}>થી લોગિન કરો</span>
                    </span>
                </button>

                {error && <p className="text-error font-gujarati text-sm font-bold text-center py-2">{error}</p>}

                {/* Backdoor for Google Play reviewer/test number login */}
                {showReviewerLogin && (
                  <div className="space-y-4 pt-6 mt-6 border-t border-stone-200 dark:border-stone-700/50">
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
                        <span className="font-headline font-black text-stone-400">+91</span>
                        <input type="tel" maxLength="10" placeholder="નંબર લખો" value={phone} onChange={handlePhoneChange} className="w-full bg-transparent border-none outline-none font-headline font-black text-xl text-stone-800 dark:text-stone-100 placeholder:text-stone-300" />
                    </div>
                    <button onClick={handlePhoneSubmit} disabled={phone.length < 10} style={{ background: phone.length === 10 ? activeTheme.gradient : undefined }} className={`w-full py-4 rounded-2xl font-gujarati font-black text-lg transition-all duration-300 ${phone.length === 10 ? 'text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-stone-200 dark:bg-stone-800 text-stone-400'}`}>OTP મેળવો</button>
                  </div>
                )}
            </div>
            
            <p className="font-gujarati text-xs text-stone-400 dark:text-stone-500 mt-8 text-center max-w-[280px]">
                લોગિન કરીને તમે અમારી નિયમો અને શરતો સાથે સહમત થાઓ છો.
            </p>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-600/10 dark:bg-brand-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
            
            {/* Logo/Icon */}
            <div className="h-20 w-20 bg-white/60 dark:bg-stone-800/60 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center border border-primary/30 mb-6 overflow-hidden">
                <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>

            <div className="text-center space-y-1 mb-8">
                <h2 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-3xl text-brand-600 dark:text-primary">OTP વેરિફિકેશન</h2>
                <p className="font-gujarati text-on-surface dark:text-[#E8E6E3]">મોકલેલ કોડ: <span className="font-headline font-bold text-primary">0000</span></p>
            </div>

            <div className="w-full bg-surface dark:bg-stone-900 rounded-[2rem] p-8 shadow-sm border border-outline dark:border-stone-800 space-y-8">
                <div className="flex justify-center gap-4">
                    {otp.map((digit, idx) => (
                        <input key={idx} ref={otpRefs[idx]} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(idx, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(idx, e)} className="w-14 h-16 bg-background dark:bg-stone-800 rounded-xl text-center font-headline font-black text-3xl border border-primary/30 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none text-brand-600 shadow-sm transition-all" />
                    ))}
                </div>
                {error && <p className="text-error font-gujarati text-sm font-bold text-center py-2">{error}</p>}
                
                <button onClick={handleVerifyOtp} disabled={otp.some(d => !d)} style={{ background: !otp.some(d => !d) ? activeTheme.gradient : undefined }} className={`w-full py-4 rounded-xl font-gujarati font-bold text-lg transition-all duration-300 border ${!otp.some(d => !d) ? 'text-white border-transparent shadow-md hover:-translate-y-0.5' : 'bg-stone-200 dark:bg-stone-800 text-stone-500 border-transparent'}`}>ખાતરી કરો</button>
            </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;
