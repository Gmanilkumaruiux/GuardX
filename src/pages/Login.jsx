import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThreats } from '../context/ThreatContext';
import { SecurityConfig } from '../services/mockAI';
import { Shield, ShieldAlert, Mail, Lock, AlertTriangle, X, Key, Smartphone, Send, ArrowLeft, CheckCircle2, UserPlus, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [showFraudBlockPrompt, setShowFraudBlockPrompt] = useState(false);
  const [blockedReason, setBlockedReason] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [smsNotification, setSmsNotification] = useState(null);
  const [tempUser, setTempUser] = useState(null);

  const { login } = useAuth();
  const { reportEvent } = useThreats();
  const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Analyze email for spam/bot patterns to block fraud attempts immediately
    const emailLower = email.toLowerCase();
    const isTempEmail = [
      'tempmail', '10minutemail', '10minute', 'temp', 
      'guerrillamail', 'mailinator', 'yopmail', 'sharklasers', 
      'dispostable', 'getairmail', 'burnmail', 'trashmail'
    ].some(suffix => emailLower.includes(suffix));
    
    const matchedKeyword = SecurityConfig.emailBlocklist.find(keyword => emailLower.includes(keyword) && keyword !== 'admin');
    
    if (isTempEmail || matchedKeyword) {
      setIsSubmitting(false);
      
      const reason = isTempEmail 
        ? `Disposable domain usage detected: "${email}"`
        : `Fraud/spam keyword signature matched: "${matchedKeyword}"`;
      
      setBlockedReason(reason);
      setShowFraudBlockPrompt(true);
      
      // Report threat event
      reportEvent({
        type: 'LOGIN_ATTEMPT',
        user: email,
        action: 'Blocked Fraud Email Login',
        data: { failedCount: failedAttempts + 1, reason }
      });
      return;
    }

    try {
      // Perform regular email/password mock auth
      const user = await login(email, password);
      
      // Check if 2FA (OTP) is enabled for this user, globally active, or user is an admin
      const userHasOtp = localStorage.getItem(`guardx_2fa_${email}`) === 'true';
      const globalOtpActive = SecurityConfig.otpVerificationActive;

      if (userHasOtp || globalOtpActive || user.role === 'admin') {
        // Generate a random 6-digit OTP code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setTempUser(user);
        setShowOtpScreen(true);
        setIsSubmitting(false);

        // Simulate sending SMS/Email by sliding in a visual device notification
        setTimeout(() => {
          setSmsNotification({
            sender: 'GuardX SecurGate',
            message: `OTP Code: ${code}. Verify your identity to log in to ECLearnix/All College Event system. Expires in 2 mins.`
          });
        }, 1200);

      } else {
        // No OTP required, log success and redirect
        reportEvent({
          type: 'LOGIN_SUCCESS',
          user: email,
          data: { ip: '192.168.1.1' }
        });
        
        if (user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/user/dashboard');
      }
      
    } catch (err) {
      const nextFailCount = failedAttempts + 1;
      setFailedAttempts(nextFailCount);
      
      if (err.message && err.message.toLowerCase().includes('not registered')) {
        setShowRegisterPrompt(true);
      } else {
        setError(err.message || 'Invalid credentials or access denied.');
      }
      
      // Report brute force attempt to threat AI
      reportEvent({
        type: 'LOGIN_ATTEMPT',
        user: email,
        data: { failedCount: nextFailCount }
      });
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setError('');
    
    if (otpCode === generatedOtp) {
      // Log successful secure login
      reportEvent({
        type: 'LOGIN_SUCCESS',
        user: email,
        action: 'Secure Login (OTP Verified)',
        data: { ip: '192.168.1.1' }
      });
      
      // Hide notifications and redirect
      setSmsNotification(null);
      if (tempUser.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    } else {
      setError('Invalid OTP code. Security attempt has been logged.');
      setOtpCode('');
      
      // Report failed 2FA code entry as suspicious activity
      reportEvent({
        type: 'LOGIN_ATTEMPT',
        user: email,
        action: 'Failed 2FA OTP Code Verification',
        data: { failedCount: failedAttempts + 1 }
      });
    }
  };

  const resendOtp = () => {
    setError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setSmsNotification(null);
    
    setTimeout(() => {
      setSmsNotification({
        sender: 'GuardX SecurGate',
        message: `New OTP Code: ${code}. Valid for 2 mins.`
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Dynamic Slide-Down Mock Phone OTP Notification */}
      {smsNotification && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="bg-slate-900/95 border border-brand-primary/40 rounded-xl p-4 shadow-[0_10px_30px_rgba(0,240,255,0.3)] backdrop-blur-md flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shrink-0">
              <Smartphone className="text-brand-primary" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-brand-primary tracking-wide font-mono uppercase">{smsNotification.sender}</span>
                <span className="text-[10px] text-brand-text-muted">Just now</span>
              </div>
              <p className="text-sm text-white font-medium">{smsNotification.message}</p>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => {
                    setOtpCode(generatedOtp);
                    setSmsNotification(null);
                  }} 
                  className="text-[10px] bg-brand-primary hover:bg-brand-primary-light text-black font-bold px-2 py-1 rounded transition-all"
                >
                  Auto-Fill Code
                </button>
                <button 
                  onClick={() => setSmsNotification(null)} 
                  className="text-[10px] text-brand-text-muted hover:text-white px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card w-full max-w-md p-8 relative z-10 border-t-4 border-t-brand-primary">
        <Link to="/landing" className="absolute top-4 right-4 text-brand-text-muted hover:text-white transition-colors">
          <X size={24} />
        </Link>

        {/* Regular Login Screen */}
        {!showOtpScreen ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-brand-surface border border-brand-primary/30 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Shield className="text-brand-primary" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Secure Login</h2>
              <p className="text-brand-text-muted text-sm">Enter your credentials to access the system</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-brand-danger/10 border border-brand-danger/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-brand-danger shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="text-brand-danger font-medium">{error}</p>
                  {failedAttempts >= 3 && <p className="text-brand-text-muted text-xs mt-1">Warning: Multiple failed attempts. Threat score triggered.</p>}
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-text-muted mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-brand-text-muted" size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text-muted mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-brand-text-muted" size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary hover:bg-brand-primary-light text-black font-bold py-3 rounded-lg transition-all flex justify-center items-center shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] disabled:opacity-70"
              >
                {isSubmitting ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-brand-text-muted text-sm">
                Don't have an account? <Link to="/register" className="text-brand-primary hover:underline">Register here</Link>
              </p>
            </div>
          </>
        ) : (
          /* OTP Code Verification Screen */
          <>
            <div className="text-center mb-8">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/30 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Key className="text-brand-primary" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h2>
              <p className="text-brand-text-muted text-sm">Verification code sent to your registered device</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-brand-danger/10 border border-brand-danger/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-brand-danger shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-brand-danger font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-text-muted mb-2 text-center">
                  Enter 6-Digit Secure OTP
                </label>
                <div className="relative max-w-[200px] mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center bg-brand-surface border border-brand-surface-light rounded-lg py-3 text-2xl tracking-[0.5em] font-mono text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all uppercase"
                    placeholder="••••••"
                    required
                  />
                </div>
                <p className="text-[11px] text-brand-text-muted text-center mt-3">
                  Check your simulated mobile notifications at the top of the screen.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary-light text-black font-bold py-3 rounded-lg transition-all flex justify-center items-center shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              >
                Verify & Continue
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 items-center">
              <button 
                onClick={resendOtp}
                className="text-xs text-brand-primary hover:underline flex items-center gap-1 font-semibold"
              >
                Resend Code
              </button>
              
              <button 
                onClick={() => {
                  setShowOtpScreen(false);
                  setOtpCode('');
                  setError('');
                }}
                className="text-xs text-brand-text-muted hover:text-white flex items-center gap-1 mt-2"
              >
                <ArrowLeft size={12} /> Back to Login
              </button>
            </div>
          </>
        )}
      </div>

      {/* Registration Suggestion Popup Modal */}
      {showRegisterPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 border border-brand-primary/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-center relative">
            <button 
              onClick={() => setShowRegisterPrompt(false)}
              className="absolute top-4 right-4 text-brand-text-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <UserPlus className="text-brand-primary" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 font-heading">Account Not Found</h3>
            <p className="text-brand-text-muted text-sm mb-6 leading-relaxed">
              The email address <span className="text-brand-primary font-bold font-mono bg-brand-surface-light/40 px-2 py-0.5 rounded border border-brand-surface-light/50 break-all">{email}</span> is not registered on our security platform yet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowRegisterPrompt(false)}
                className="flex-1 bg-brand-surface hover:bg-brand-surface-light text-white font-medium py-3 rounded-lg border border-brand-surface-light transition-all text-sm"
              >
                Try Again
              </button>
              <Link 
                to="/register" 
                state={{ email }}
                className="flex-1 bg-brand-primary hover:bg-brand-primary-light text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] text-center text-sm flex items-center justify-center"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Fraud Block Popup Modal */}
      {showFraudBlockPrompt && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 border border-brand-danger/30 shadow-[0_0_50px_rgba(255,0,60,0.25)] text-center relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-danger shrink-0"></div>
            
            <button 
              onClick={() => setShowFraudBlockPrompt(false)}
              className="absolute top-4 right-4 text-brand-text-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-16 h-16 rounded-full bg-brand-danger/10 border border-brand-danger/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(255,0,60,0.15)]">
              <ShieldAlert className="text-brand-danger animate-pulse" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 font-heading">Access Denied: Security Lock</h3>
            <p className="text-brand-text-muted text-sm mb-4 leading-relaxed">
              Login attempt from <span className="text-brand-danger font-bold font-mono bg-brand-surface-light/40 px-2 py-0.5 rounded border border-brand-surface-light/50 break-all">{email}</span> has been administratively **BLOCKED**.
            </p>
            <div className="p-3.5 bg-brand-danger/5 border border-brand-danger/20 rounded-lg text-xs font-mono text-brand-danger mb-6 break-all">
              ⚠️ Reason: {blockedReason}
            </div>
            
            <button 
              onClick={() => setShowFraudBlockPrompt(false)}
              className="w-full bg-brand-danger hover:bg-brand-danger/80 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(255,0,60,0.2)] text-center text-sm"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
