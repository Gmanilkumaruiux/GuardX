import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThreats } from '../context/ThreatContext';
import { Shield, Mail, Lock, User, Activity, X, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: location.state?.email || '', 
    password: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskWarning, setRiskWarning] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register } = useAuth();
  const { reportEvent } = useThreats();
  const navigate = useNavigate();

  const timeStarted = React.useRef(Date.now());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRiskWarning(null);

    const timeToComplete = Date.now() - timeStarted.current;

    // Track fast repeated registrations & multiple accounts from same device
    const now = Date.now();
    const lastRegsStr = localStorage.getItem('guardx_recent_registrations') || '[]';
    let recentRegs = [];
    try {
      recentRegs = JSON.parse(lastRegsStr);
    } catch (err) {
      recentRegs = [];
    }
    // Keep only registration timestamps from the last 60 seconds
    recentRegs = recentRegs.filter(timestamp => now - timestamp < 60000);
    const updatedRegs = [...recentRegs, now];
    localStorage.setItem('guardx_recent_registrations', JSON.stringify(updatedRegs));

    // Report signup attempt to AI engine
    const { detectedThreat } = reportEvent({
      type: 'SIGNUP_ATTEMPT',
      user: formData.email,
      data: { 
        email: formData.email,
        timeToComplete,
        recentRegistrationCount: updatedRegs.length
      }
    });

    if (detectedThreat && detectedThreat.severity === 'High') {
      setRiskWarning('Registration blocked: High-risk activity detected.');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      setIsSubmitting(false);
      setShowSuccessModal(true);
    } catch (err) {
      setRiskWarning('Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="glass-card w-full max-w-md p-8 relative z-10 border-t-4 border-t-brand-primary">
        <Link to="/landing" className="absolute top-4 right-4 text-brand-text-muted hover:text-white transition-colors">
          <X size={24} />
        </Link>
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-brand-surface border border-brand-primary/30 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Activity className="text-brand-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-brand-text-muted text-sm">Join the secure network platform</p>
        </div>

        {riskWarning && (
          <div className="mb-6 p-3 bg-brand-danger/10 border border-brand-danger/30 rounded-lg flex items-start gap-3">
            <Shield className="text-brand-danger shrink-0 mt-0.5" size={18} />
            <p className="text-brand-danger font-medium text-sm">{riskWarning}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-text-muted mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-brand-text-muted" size={18} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-muted mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-brand-text-muted" size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                placeholder="you@example.com"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-brand-text-muted mt-1.5">Password must be at least 8 characters long.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary hover:bg-brand-primary-light text-black font-bold py-3 rounded-lg transition-all flex justify-center items-center shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] disabled:opacity-70"
          >
            {isSubmitting ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-brand-text-muted text-sm">
            Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Registration Success Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 border border-brand-success/30 shadow-[0_0_50px_rgba(0,255,100,0.25)] text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-success shrink-0"></div>
            
            <div className="w-16 h-16 rounded-full bg-brand-success/10 border border-brand-success/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(0,255,100,0.15)] animate-bounce">
              <CheckCircle2 className="text-brand-success" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 font-heading">Registration Successful!</h3>
            <p className="text-brand-text-muted text-sm mb-6 leading-relaxed">
              Your account for <span className="text-brand-success font-bold font-mono bg-brand-surface-light/40 px-2 py-0.5 rounded border border-brand-surface-light/50 break-all">{formData.email}</span> has been securely created.
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-brand-success hover:bg-brand-success/80 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,100,0.2)] text-center text-sm"
            >
              Proceed to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
