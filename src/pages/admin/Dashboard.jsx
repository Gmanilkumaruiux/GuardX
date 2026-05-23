import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThreats } from '../../context/ThreatContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, ShieldAlert, Users, Activity, CheckCircle, AlertTriangle, ExternalLink, X, Terminal, ArrowRight, Server } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="glass-card p-5 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-brand-text-muted text-[11px] uppercase tracking-wider font-semibold font-mono">{title}</p>
        <h3 className="text-2xl font-extrabold font-mono mt-1.5 text-white">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass} bg-opacity-10 border border-current border-opacity-20`}>
        <Icon className={colorClass} size={20} />
      </div>
    </div>
    <div className="flex items-center text-xs">
      <span className={trend > 0 ? 'text-brand-danger' : 'text-brand-success'}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
      <span className="text-brand-text-muted ml-2 font-mono">from last hour</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { liveStats, threats, logs, triggerSimulatedAttack } = useThreats();
  const { usersDb } = useAuth();
  const [selectedThreat, setSelectedThreat] = useState(null);

  const activeThreats = threats.filter(t => t.status === 'Active').length;

  // Dynamic calculations based on live local storage database
  const totalUsers = usersDb.length;
  const activeUsers = usersDb.filter(u => u.status === 'Active').length;
  const suspiciousUsers = usersDb.filter(u => u.riskScore > 30).length;
  const blockedUsers = usersDb.filter(u => u.status === 'Blocked' || u.status === 'Suspended').length;

  // Calculate total logins from live activity logs
  const loginAttemptsCount = logs.filter(l => 
    l.action.toLowerCase().includes('login') || 
    l.action.toLowerCase().includes('auth')
  ).length + 248; // Baseline for visual realism

  // Parse registered users and threats for temporary/suspicious domains
  const getFakeEmailStats = () => {
    const counts = {
      'tempmail.com': 0,
      '10minutemail.com': 0,
      'hacker.io': 0,
      'spamdomain.net': 0,
      'disposable.co': 0
    };
    
    // Scan users
    usersDb.forEach(u => {
      const email = u.email.toLowerCase();
      Object.keys(counts).forEach(domain => {
        const keyword = domain.split('.')[0];
        if (email.includes(keyword)) {
          counts[domain] += 1;
        }
      });
    });

    // Scan threats
    threats.forEach(t => {
      const email = t.user.toLowerCase();
      Object.keys(counts).forEach(domain => {
        const keyword = domain.split('.')[0];
        if (email.includes(keyword)) {
          counts[domain] += 1;
        }
      });
    });

    return Object.entries(counts).map(([domain, count]) => ({ domain, count }));
  };

  const fakeEmailStats = getFakeEmailStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-heading tracking-wide">System Command Center</h1>
        <div className="bg-brand-surface-light px-4 py-2 rounded-lg text-xs font-mono border border-brand-surface-light flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
          </span>
          Live Monitoring Active
        </div>
      </div>

      {/* Cyber Threat Simulator Console */}
      <div className="glass-card p-6 border-brand-primary/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 font-heading tracking-wide">
              <ShieldAlert className="text-brand-primary animate-pulse" size={22} />
              AI Threat Simulation Console
            </h2>
            <p className="text-xs text-brand-text-muted mt-1 max-w-xl">
              Trigger simulated cybersecurity incidents in real-time to test GuardX's advanced bot detection, brute force lockout, and anomalous activity tracking systems.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full lg:w-auto">
            <button 
              onClick={() => triggerSimulatedAttack('BOT_SIGNUP')}
              className="text-xs font-bold bg-brand-warning/10 border border-brand-warning/30 hover:border-brand-warning hover:bg-brand-warning/20 text-brand-warning px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              🤖 Bot Signup
            </button>
            <button 
              onClick={() => triggerSimulatedAttack('BRUTE_FORCE')}
              className="text-xs font-bold bg-brand-danger/10 border border-brand-danger/30 hover:border-brand-danger hover:bg-brand-danger/20 text-brand-danger px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              💥 Brute-Force
            </button>
            <button 
              onClick={() => triggerSimulatedAttack('SPAM_ACTIVITY')}
              className="text-xs font-bold bg-orange-500/10 border border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/20 text-orange-400 px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              ⚡ Rate Limit
            </button>
            <button 
              onClick={() => triggerSimulatedAttack('UNUSUAL_TIME')}
              className="text-xs font-bold bg-blue-500/10 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/20 text-blue-400 px-3 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              🌙 Night Login
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Users" 
          value={totalUsers} 
          icon={Users} 
          trend={4.8} 
          colorClass="text-indigo-400" 
        />
        <StatCard 
          title="Active Users" 
          value={activeUsers} 
          icon={CheckCircle} 
          trend={2.4} 
          colorClass="text-brand-success" 
        />
        <StatCard 
          title="Suspicious Users" 
          value={suspiciousUsers} 
          icon={Activity} 
          trend={15.2} 
          colorClass="text-brand-warning" 
        />
        <StatCard 
          title="Blocked Users" 
          value={blockedUsers} 
          icon={ShieldAlert} 
          trend={8.2} 
          colorClass="text-brand-danger" 
        />
        <StatCard 
          title="Login Attempts" 
          value={loginAttemptsCount} 
          icon={Shield} 
          trend={11.1} 
          colorClass="text-brand-primary" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts Feed */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Live Threat Intelligence Feed</h2>
              <p className="text-xs text-brand-text-muted mt-0.5">Click on any threat alert card to perform AI Forensic Analysis.</p>
            </div>
            <Link to="/admin/alerts" className="text-sm text-brand-primary hover:underline flex items-center gap-1 font-semibold">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {threats.slice(0, 5).map(threat => (
              <div 
                key={threat.id} 
                onClick={() => setSelectedThreat(threat)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-brand-surface-light/20 border border-brand-surface-light rounded-lg hover:border-brand-primary/45 cursor-pointer transition-all hover:translate-x-1 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-1.5 h-12 rounded-full shrink-0 ${threat.status === 'Resolved' ? 'bg-brand-success' : threat.severity === 'Critical' ? 'bg-brand-danger animate-pulse' : threat.severity === 'High' ? 'bg-brand-danger' : 'bg-brand-warning'}`}></div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-brand-primary transition-colors flex flex-wrap items-center gap-2 text-sm md:text-base">
                      {threat.type}
                      {threat.status === 'Resolved' && (
                        <span className="text-[10px] bg-brand-success/10 border border-brand-success/20 text-brand-success px-1.5 py-0.5 rounded font-mono shrink-0">RESOLVED</span>
                      )}
                    </h4>
                    <p className="text-xs text-brand-text-muted mt-1 font-mono truncate">Target: {threat.user}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex sm:flex-row items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-brand-surface-light/40 pt-2 sm:pt-0">
                  <div>
                    <div className="text-xs font-mono text-brand-text-muted">Score: <span className="text-white font-bold">{threat.riskScore}</span></div>
                    <div className="text-[10px] text-brand-text-muted mt-1">{new Date(threat.time).toLocaleTimeString()}</div>
                  </div>
                  <button className="text-brand-primary opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
            {threats.length === 0 && <div className="text-center text-brand-text-muted py-8 font-medium">No active threats detected.</div>}
          </div>
        </div>

        {/* Right side panels: Fake Domain Monitor + Live Logs */}
        <div className="flex flex-col gap-6">
          {/* Fake Email Domains Side Panel */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold text-white">Fake/Temp Domain Monitor</h2>
              <span className="text-[9px] bg-brand-danger/10 border border-brand-danger/30 text-brand-danger px-2 py-0.5 rounded font-mono uppercase font-bold">SHIELD ACTIVE</span>
            </div>
            <p className="text-xs text-brand-text-muted mb-4">Detected disposable suffix frequencies in registrations & attempts.</p>
            <div className="space-y-3">
              {fakeEmailStats.map(({ domain, count }) => (
                <div key={domain} className="p-3 bg-brand-surface-light/20 border border-brand-surface-light rounded-lg">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-mono text-white font-semibold">{domain}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${count > 0 ? 'bg-brand-danger/10 border border-brand-danger/25 text-brand-danger' : 'bg-brand-surface-light text-brand-text-muted'}`}>
                      {count} flagged
                    </span>
                  </div>
                  <div className="w-full bg-brand-surface-light/40 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${count > 2 ? 'bg-brand-danger' : count > 0 ? 'bg-brand-warning' : 'bg-brand-success'}`}
                      style={{ width: `${Math.min(100, Math.max(count * 20, count > 0 ? 10 : 0))}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Live Activity Logs</h2>
            <p className="text-xs text-brand-text-muted mb-6">Real-time authentication and actions telemetry.</p>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {logs.slice(0, 10).map(log => (
                <div key={log.id} className="p-3 rounded-lg bg-brand-surface-light/30 border border-brand-surface-light/50 flex flex-col gap-1 hover:border-brand-primary/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      log.action.includes('Blocked') || log.action.includes('Locked') || log.action.includes('Failed')
                        ? 'bg-brand-danger/10 text-brand-danger border border-brand-danger/25'
                        : 'bg-brand-success/10 text-brand-success border border-brand-success/25'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-brand-text-muted">{new Date(log.time).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-white font-mono break-all mt-1">{log.user}</p>
                  <div className="flex justify-between items-center text-[10px] text-brand-text-muted font-mono mt-1 pt-1 border-t border-brand-surface-light/50">
                    <span>IP: {log.ip}</span>
                    <span>Port: 443</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Report Analyzer Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card w-full max-w-2xl border border-brand-primary/30 p-6 relative overflow-hidden flex flex-col max-h-[85vh] shadow-[0_0_50px_rgba(0,240,255,0.25)] animate-in fade-in zoom-in-95 duration-200">
            {/* Hologram top stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-blue-500 to-brand-danger shrink-0"></div>
            
            <button 
              onClick={() => setSelectedThreat(null)}
              className="absolute top-4 right-4 text-brand-text-muted hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6 shrink-0 pr-6">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center">
                <Terminal className="text-brand-primary animate-pulse" size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white font-heading truncate">AI Forensic Investigation Report</h3>
                <p className="text-xs text-brand-text-muted font-mono truncate">Incident ID: {selectedThreat.id} • Rule: {selectedThreat.matchedRule || 'SYSTEM_ANOMALY'}</p>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {/* Core Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-surface-light/40 p-4 border border-brand-surface-light rounded-lg">
                <div>
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Threat Classification</span>
                  <span className="text-xs font-semibold text-white mt-1 block truncate">{selectedThreat.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Threat Severity</span>
                  <span className={`text-xs font-bold mt-1 block ${
                    selectedThreat.severity === 'Critical' ? 'text-brand-danger' : selectedThreat.severity === 'High' ? 'text-brand-danger font-extrabold' : 'text-brand-warning'
                  }`}>{selectedThreat.severity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Calculated Risk Index</span>
                  <span className="text-xs font-bold text-white font-mono mt-1 block">{selectedThreat.riskScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Remediation Status</span>
                  <span className={`text-xs font-semibold mt-1 inline-flex items-center gap-1.5 ${
                    selectedThreat.status === 'Resolved' ? 'text-brand-success' : 'text-brand-danger'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${selectedThreat.status === 'Resolved' ? 'bg-brand-success' : 'bg-brand-danger animate-pulse'}`}></span>
                    {selectedThreat.status}
                  </span>
                </div>
              </div>

              {/* Trigger Values */}
              <div className="p-3 bg-brand-danger/5 border border-brand-danger/20 rounded-lg">
                <span className="text-xs font-bold text-brand-danger flex items-center gap-1.5 font-mono">
                  <AlertTriangle size={14} /> Rule Trigger telemetry:
                </span>
                <p className="text-xs font-mono text-white mt-1 ml-5">{selectedThreat.triggerValue || 'Suspicious payload match.'}</p>
              </div>

              {/* forensic Analysis */}
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase font-mono flex items-center gap-1.5 mb-1.5">
                  <Server size={14} /> AI Engine Detection Logic Explainer
                </span>
                <p className="text-xs text-brand-text-muted leading-relaxed pl-4 border-l border-brand-primary/20">
                  {selectedThreat.forensicAnalysis || 'Dynamic heuristic scanning flagged a structural pattern anomaly. The client payload deviates from normal human navigational behavior profiles.'}
                </p>
              </div>

              {/* forensic Remediation */}
              <div>
                <span className="text-xs font-bold text-brand-success uppercase font-mono flex items-center gap-1.5 mb-1.5">
                  <CheckCircle size={14} /> Automatic Mitigation Protocol (Neutered)
                </span>
                <p className="text-xs text-brand-text-muted leading-relaxed pl-4 border-l border-brand-success/20">
                  {selectedThreat.remediation || 'The system deployed instant pipeline containment blocks, logged client parameters, and forced MFA validations on downstream routers.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-surface-light flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedThreat(null)}
                className="text-xs bg-brand-surface-light border border-brand-surface-light hover:border-white px-4 py-2 rounded-lg text-white transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
