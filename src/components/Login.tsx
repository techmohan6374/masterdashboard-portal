import { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { loginSuperAdmin } from '../services/api';
import { saveSession } from '../utils/auth';
import appLogo from '../assets/app-logo.png';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [emailOrCode, setEmailOrCode] = useState('sysadmin@maitriser.com');
  const [password, setPassword] = useState('Admin@123#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!emailOrCode.trim() || !password.trim()) {
      setErrorMsg('Please enter both username/email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await loginSuperAdmin(emailOrCode, password);

      // Save credentials if login succeeds
      saveSession({
        token: response.tokenData.token,
        refreshToken: response.tokenData.refreshToken,
        tokenExpiry: response.tokenData.tokenExpiry,
        userCode: response.userCode,
        firstName: response.firstName,
        lastName: response.lastName
      });

      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials and network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfbf9] p-4 md:p-6 lg:p-8 select-none relative overflow-hidden">
      
      {/* Soft Background Glowing Light Leaks (Orbs) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-login-gold/5 blur-[120px] pointer-events-none select-none translate-x-24 -translate-y-24" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none select-none -translate-x-24 translate-y-24" />

      {/* Abstract Modern Concentric Tech Rings - Top Right */}
      <div className="absolute top-0 right-0 w-96 h-96 text-login-gold/10 pointer-events-none transform translate-x-24 -translate-y-24 select-none">
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="55" />
          <circle cx="100" cy="100" r="35" strokeDasharray="1 5" strokeWidth="2" />
          <line x1="100" y1="5" x2="100" y2="195" strokeDasharray="2 4" />
          <line x1="5" y1="100" x2="195" y2="100" strokeDasharray="2 4" />
        </svg>
      </div>

      {/* Abstract Modern Concentric Tech Rings - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-96 h-96 text-login-gold/10 pointer-events-none transform -translate-x-24 translate-y-24 select-none">
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="55" />
          <circle cx="100" cy="100" r="35" strokeDasharray="1 5" strokeWidth="2" />
          <line x1="100" y1="5" x2="100" y2="195" strokeDasharray="2 4" />
          <line x1="5" y1="100" x2="195" y2="100" strokeDasharray="2 4" />
        </svg>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-premium overflow-hidden flex flex-col md:flex-row min-h-[680px] z-10">

        {/* Left Side: Premium Brand Branding Card */}
        <div className="w-full md:w-5/12 bg-login-green text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[400px] md:min-h-[auto]">
          {/* Decorative shapes background */}
          <div className="absolute inset-0 bg-radial-at-t from-[#0e543b]/40 to-transparent pointer-events-none" />

          <div className="z-10 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-login-gold" />
            <span className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">Secure & Protected</span>
          </div>

          <div className="z-10 text-center">
            {/* Symmetrical Knot Gold Logo Emblem */}
            <div className="relative inline-block mb-6">
              <img
                src={appLogo}
                alt="App Logo"
                className="w-[150px] h-[150px] object-contain mx-auto"
              />
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-wider text-white uppercase mb-1">
              MAITRISER ZONE
            </h1>
            <div className="w-32 h-[1px] bg-login-gold mx-auto mb-2 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-login-gold" />
            </div>
            <p className="text-login-gold font-medium text-sm lg:text-base tracking-wide mb-6">
              Super Admin Dashboard
            </p>
            <p className="text-emerald-100/70 text-xs lg:text-sm max-w-[280px] mx-auto leading-relaxed">
              Secure access to your administration panel and verify user identities.
            </p>
          </div>

          {/* Curved lines SVG overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full text-login-gold" viewBox="0 0 400 100" fill="none" stroke="currentColor">
              <path d="M 0 60 Q 200 110 400 60" strokeWidth="1.5" />
              <path d="M 0 75 Q 200 125 400 75" strokeWidth="1" />
              <path d="M 0 90 Q 200 140 400 90" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="z-10 text-[10px] text-emerald-100/50 flex justify-between items-center">
            <span>Powered by Maitriser</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3
            </span>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white relative">

          {/* Header spacer */}
          <div className="h-6 mb-6" />

          {/* Form container */}
          <div className="my-auto max-w-md w-full mx-auto">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm">
                Sign in to continue to your admin dashboard
              </p>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3 text-rose-800 text-xs leading-relaxed animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="font-bold">Access Denied:</span> {errorMsg}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Email Address / User Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrCode}
                    onChange={(e) => setEmailOrCode(e.target.value)}
                    placeholder="Enter your email or user code"
                    className="block w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-login-green focus:ring-1 focus:ring-login-green text-sm transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-12 py-3.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-login-green focus:ring-1 focus:ring-login-green text-sm transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2.5 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-login-green focus:ring-login-green w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Please contact the head office administrator to reset your password.'); }}
                  className="font-bold text-login-green hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-login-green hover:bg-[#094d35] active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-75 disabled:cursor-wait mt-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative px-4 text-xs font-semibold text-slate-400 bg-white uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Social Logins - Google Only */}
            <button
              type="button"
              onClick={() => alert('SSO with Google is not configured for this admin panel.')}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer shadow-sm font-bold text-slate-700 text-sm bg-white"
            >
              <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.07-1.4-.19-2.07H12v3.9h6.69a5.59 5.59 0 0 1-2.42 3.66v2.96h3.89c2.28-2.1 3.58-5.18 3.58-8.45Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-2.96c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.06C3.26 21.35 7.37 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.33A7.18 7.18 0 0 1 4.9 12c0-.81.14-1.6.37-2.33V6.61H1.29A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.29 5.39l3.98-3.06Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.37 0 3.26 2.65 1.29 6.61l3.98 3.06c.95-2.85 3.6-4.92 6.73-4.92Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer Copyright */}
          <div className="text-center text-xs text-slate-400 mt-8">
            © 2026 Maitriser Zone. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
