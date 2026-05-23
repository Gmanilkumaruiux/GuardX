import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Lock, Users, ChevronRight, Globe, Zap, CheckCircle2, GraduationCap, Calendar, Server, BellRing } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-brand-background text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[800px] z-0 overflow-hidden opacity-30 pointer-events-none">
        <img src="/cyber_hero_bg.png" alt="Cyber Background" className="w-full h-full object-cover mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-background"></div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="text-brand-primary animate-pulse" size={28} />
          <span className="text-2xl font-bold font-heading tracking-wider">Guard<span className="text-brand-primary">X</span></span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-brand-text-muted hover:text-white transition-colors text-sm font-medium hidden sm:inline-block">Features</a>
          <a href="#case-studies" className="text-brand-text-muted hover:text-white transition-colors text-sm font-medium hidden sm:inline-block">Case Studies</a>
          <Link to="/login" className="text-brand-text-muted hover:text-white transition-colors text-sm font-medium">Login</Link>
          <Link to="/register" className="bg-brand-primary/10 border border-brand-primary/50 text-brand-primary px-4 py-2 rounded-lg hover:bg-brand-primary/20 transition-all text-sm font-bold tracking-wide">Launch App</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-mono mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            Platform Protection Active
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
            AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-500 font-extrabold drop-shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              Cybersecurity
            </span>
            <br />& Forensics Shield
          </h1>
          
          <p className="text-base text-brand-text-muted mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Advanced real-time threat detection and activity auditing tailored for educational networks and high-traffic event platforms. Defend against fake users, credentials brute-force, and registration spam.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              Launch Demo Registry <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        {/* Hero Visual Live Map Simulation */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="glass-card p-6 border-brand-primary/30 relative">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-danger animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-brand-warning animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-brand-success animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6 border-b border-brand-surface-light pb-4">
              <Globe className="text-brand-primary animate-spin-slow" size={32} />
              <div>
                <h3 className="font-mono text-sm text-brand-primary flex items-center gap-1.5">
                  <BellRing size={14} className="animate-bounce" />
                  GUARDX AI INCIDENT TELEMETRY
                </h3>
                <p className="text-xs text-brand-text-muted">Filtering fake logins and automated registrations...</p>
              </div>
            </div>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-brand-surface-light/40 p-2.5 rounded border border-brand-surface-light/30">
                <span className="text-brand-success">[SHIELD] Normal User login verified (IP 192.168.1.5)</span>
                <span className="text-[10px] text-brand-text-muted">Just now</span>
              </div>
              <div className="flex justify-between items-center bg-brand-danger/10 p-2.5 rounded border border-brand-danger/20">
                <span className="text-brand-danger font-bold">[BLOCKED] Bot Registration attempt (Score: 85)</span>
                <span className="text-[10px] text-brand-text-muted">4s ago</span>
              </div>
              <div className="flex justify-between items-center bg-brand-warning/10 p-2.5 rounded border border-brand-warning/20">
                <span className="text-brand-warning">[WARN] Suspicious tempmail syntax from spammer@x.com</span>
                <span className="text-[10px] text-brand-text-muted">12s ago</span>
              </div>
              <div className="flex justify-between items-center bg-brand-surface-light/40 p-2.5 rounded border border-brand-surface-light/30">
                <span className="text-brand-success">[MFA] Secure login verified via OTP (IP 142.25.1.9)</span>
                <span className="text-[10px] text-brand-text-muted">30s ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Target Platforms Integration Cases */}
      <section id="case-studies" className="bg-brand-surface py-20 relative z-10 border-t border-brand-surface-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">Reference Integrations</h2>
            <p className="text-brand-text-muted max-w-2xl mx-auto">See how GuardX deploys custom defensive configurations to secure our target challenge platforms.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Case Study 1: ECLearnix */}
            <div className="glass-card p-8 border-brand-primary/20 relative overflow-hidden group hover:border-brand-primary/45 transition-all">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-all"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/30 rounded-xl flex items-center justify-center text-brand-primary">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">ECLearnix LMS Shield</h3>
                  <p className="text-xs text-brand-primary font-mono tracking-wider">EDUCATION PLATFORM PROTECTION</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-brand-text-muted leading-relaxed">
                <p>
                  As an online LMS with thousands of students, **ECLearnix** faces database spam from fake registrations and bulk scraping of premium course materials by scraper bots.
                </p>
                <div className="bg-brand-surface-light/30 border border-brand-surface-light rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-primary" /> Active Mitigations
                  </h4>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>**Form Completion Velocity Checks**: Instantly tags bulk crawler signups.</li>
                    <li>**OTP Course Gateways**: Secures administrative grades and exams page.</li>
                    <li>**Anomalous Login Alarms**: Blocks credential stuffing from suspicious ISPs.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Case Study 2: All College Event */}
            <div className="glass-card p-8 border-brand-primary/20 relative overflow-hidden group hover:border-brand-primary/45 transition-all">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-success/5 rounded-full blur-2xl group-hover:bg-brand-success/10 transition-all"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-success/10 border border-brand-success/30 rounded-xl flex items-center justify-center text-brand-success">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">All College Event Defend</h3>
                  <p className="text-xs text-brand-success font-mono tracking-wider">HIGH-TRAFFIC BOOKING PROTECTION</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-brand-text-muted leading-relaxed">
                <p>
                  College festivals and fests experience extreme ticketing rushes, making **All College Event** vulnerable to automated ticket scalper bots and fake RSVP bookings.
                </p>
                <div className="bg-brand-surface-light/30 border border-brand-surface-light rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-success" /> Active Mitigations
                  </h4>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>**Rate Limiters**: Prevents scalper script API floods during booking rushes.</li>
                    <li>**Temporary Domain Blocker**: Prevents bogus registrations using fake tempmails.</li>
                    <li>**Forensic Map**: Enables coordinators to locate and blackhole bot rings.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10 border-t border-brand-surface-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 font-heading">Enterprise-Grade Protection</h2>
            <p className="text-brand-text-muted max-w-2xl mx-auto">Intelligent security features designed specifically for modern high-performance web platforms.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Bot Registration Filter', desc: 'Checks fill velocity and pattern matching to weed out bulk bot registrations.', color: 'text-brand-primary' },
              { icon: Zap, title: 'Real-Time Threat Console', desc: 'Get live telemetry and instant mitigation responses during active campaigns.', color: 'text-brand-warning' },
              { icon: Shield, title: 'AI Forensic Reports', desc: 'Deep details detailing why each incident matches threat signatures.', color: 'text-brand-danger' },
              { icon: Activity, title: 'Dynamic Risk Engine', desc: 'Behavior checks calculating a composite anomaly score from 0 to 100.', color: 'text-brand-success' },
              { icon: Lock, title: 'Secure Login & OTP', desc: 'Includes simulated 2FA SMS/Email code checks to securely authenticate users.', color: 'text-blue-400' },
              { icon: Server, title: 'Calibrator Dashboard', desc: 'Admins can dynamically alter thresholds and toggle platform shields live.', color: 'text-purple-400' },
            ].map((feat, idx) => (
              <div key={idx} className="glass-card p-6 glass-card-hover group">
                <feat.icon className={`${feat.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
                <p className="text-brand-text-muted text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-brand-surface/85 border-t border-brand-surface-light relative z-10 py-12 mt-16 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <Shield className="text-brand-primary" size={24} />
              <span className="text-xl font-bold font-heading tracking-wider">Guard<span className="text-brand-primary">X</span></span>
            </div>
            <p className="text-xs text-brand-text-muted leading-relaxed max-w-sm">
              GuardX is a next-generation AI-powered cybersecurity platform that offers real-time bot filtering, brute-force shielding, and deep security audit telemetry.
            </p>
            <div className="flex gap-3 text-brand-text-muted text-[10px] sm:text-xs">
              <span className="px-2 py-1 rounded bg-brand-surface-light border border-brand-surface-light font-mono">v2.4.0-Live</span>
              <span className="px-2 py-1 rounded bg-brand-success/15 border border-brand-success/30 text-brand-success font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-ping"></span>
                All Shields Active
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-brand-text-muted">
              <li><a href="#features" className="hover:text-brand-primary transition-colors">Platform Features</a></li>
              <li><a href="#case-studies" className="hover:text-brand-primary transition-colors">Case Studies</a></li>
              <li><Link to="/login" className="hover:text-brand-primary transition-colors">Administrator Portal</Link></li>
              <li><Link to="/register" className="hover:text-brand-primary transition-colors">Demo Signup Registry</Link></li>
            </ul>
          </div>

          {/* Security Node Telemetry */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Engine Status</h4>
            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="flex justify-between border-b border-brand-surface-light pb-1">
                <span className="text-brand-text-muted">Global Node Status:</span>
                <span className="text-brand-success font-bold">OPTIMAL</span>
              </div>
              <div className="flex justify-between border-b border-brand-surface-light pb-1">
                <span className="text-brand-text-muted">Security Uptime:</span>
                <span className="text-white">99.998%</span>
              </div>
              <div className="flex justify-between border-b border-brand-surface-light pb-1">
                <span className="text-brand-text-muted">Threat Mitigation:</span>
                <span className="text-brand-primary font-bold">AUTOMATED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and compliance */}
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-brand-surface-light/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-brand-text-muted">
          <span>© 2026 GuardX Cybernetics. All rights secured.</span>
          <span className="text-right italic">Proof of Concept Simulation Platform for Hackathon Judges</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
