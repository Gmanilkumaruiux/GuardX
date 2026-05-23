import React, { useState } from 'react';
import { useThreats } from '../../context/ThreatContext';
import { ShieldAlert, CheckCircle, Search, Filter, AlertTriangle, X, Terminal, Server, Activity } from 'lucide-react';

const ThreatAlerts = () => {
  const { threats, resolveThreat } = useThreats();
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-brand-danger bg-brand-danger/10 border-brand-danger/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-brand-warning bg-brand-warning/10 border-brand-warning/20';
      case 'Low': return 'text-brand-success bg-brand-success/10 border-brand-success/20';
      default: return 'text-brand-text bg-brand-surface-light border-brand-surface-light';
    }
  };

  const filteredThreats = threats.filter(t => {
    const matchesSearch = t.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.matchedRule && t.matchedRule.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'All' || t.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Threat Intelligence Center</h1>
          <p className="text-brand-text-muted mt-1">Audit, analyze, and mitigate detected platform anomalies.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search threats by user, type, or rule..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-surface border border-brand-surface-light rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                severityFilter === sev
                  ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                  : 'bg-brand-surface border-brand-surface-light text-brand-text-muted hover:text-white hover:border-brand-primary/45'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-surface-light/50 border-b border-brand-surface-light">
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm whitespace-nowrap">Threat Type</th>
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm whitespace-nowrap">Severity</th>
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm whitespace-nowrap">Target User</th>
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm whitespace-nowrap">Detection Time</th>
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm whitespace-nowrap">Risk Index</th>
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm whitespace-nowrap">Status</th>
                <th className="py-4 px-6 font-medium text-brand-text-muted text-sm text-right whitespace-nowrap">Forensics & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-surface-light">
              {filteredThreats.map(threat => (
                <tr key={threat.id} className="hover:bg-brand-surface-light/20 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className={getSeverityColor(threat.severity).split(' ')[0]} size={18} />
                      <span className="font-semibold text-white">{threat.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-brand-text-muted whitespace-nowrap">{threat.user}</td>
                  <td className="py-4 px-6 text-xs text-brand-text-muted whitespace-nowrap">{new Date(threat.time).toLocaleString()}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[60px] bg-brand-surface-light h-1.5 rounded-full overflow-hidden">
                        <div 
                           className={`h-full ${threat.riskScore > 75 ? 'bg-brand-danger' : threat.riskScore > 50 ? 'bg-orange-500' : 'bg-brand-warning'}`}
                          style={{ width: `${threat.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-white font-bold">{threat.riskScore}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${threat.status === 'Active' ? 'text-brand-danger' : 'text-brand-success'}`}>
                      {threat.status === 'Active' ? <span className="w-2 h-2 rounded-full bg-brand-danger animate-pulse" /> : <CheckCircle size={12} />}
                      {threat.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedThreat(threat)}
                        className="text-xs font-bold text-brand-primary border border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/10 px-2.5 py-1.5 rounded transition-colors"
                      >
                        Analyze
                      </button>
                      {threat.status === 'Active' && (
                        <button 
                          onClick={() => resolveThreat(threat.id)}
                          className="text-xs font-bold text-brand-success border border-brand-success/30 hover:border-brand-success hover:bg-brand-success/10 px-2.5 py-1.5 rounded transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredThreats.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-brand-text-muted text-sm">No threats match current query rules.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredThreats.map(threat => (
          <div key={threat.id} className="glass-card p-5 space-y-4 hover:border-brand-primary/45 transition-all duration-300">
            {/* Header: Threat Type & Severity */}
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={getSeverityColor(threat.severity).split(' ')[0]} size={16} className="shrink-0" />
                  <h3 className="font-bold text-white text-sm truncate">{threat.type}</h3>
                </div>
                <p className="text-[10px] text-brand-text-muted mt-1 font-mono truncate">Target: {threat.user}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getSeverityColor(threat.severity)}`}>
                {threat.severity}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-surface-light/40 text-xs">
              <div>
                <span className="text-[9px] text-brand-text-muted uppercase tracking-wider block font-semibold mb-1">Risk Score</span>
                <span className="text-xs font-mono text-white font-bold">{threat.riskScore}/100</span>
              </div>
              <div>
                <span className="text-[9px] text-brand-text-muted uppercase tracking-wider block font-semibold mb-1">Status</span>
                <span className={`flex items-center gap-1 text-xs font-semibold ${threat.status === 'Active' ? 'text-brand-danger' : 'text-brand-success'}`}>
                  {threat.status === 'Active' ? <span className="w-1.5 h-1.5 rounded-full bg-brand-danger animate-pulse" /> : <CheckCircle size={10} />}
                  {threat.status}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1 bg-brand-surface-light/20 p-2.5 rounded-lg border border-brand-surface-light/30">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-brand-text-muted">Detection Time:</span>
                <span className="text-white">{new Date(threat.time).toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-brand-surface-light/40 flex gap-2 justify-end">
              <button 
                onClick={() => setSelectedThreat(threat)}
                className="flex-1 text-xs font-bold text-brand-primary border border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/10 py-2 rounded-lg transition-colors text-center"
              >
                Analyze
              </button>
              {threat.status === 'Active' && (
                <button 
                  onClick={() => resolveThreat(threat.id)}
                  className="flex-1 text-xs font-bold text-brand-success border border-brand-success/30 hover:border-brand-success hover:bg-brand-success/10 py-2 rounded-lg transition-colors text-center"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredThreats.length === 0 && (
          <div className="glass-card py-8 text-center text-brand-text-muted text-sm italic">
            No threats match current query rules.
          </div>
        )}
      </div>

      {/* Forensic Report Analyzer Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card w-full max-w-2xl border border-brand-primary/30 p-6 relative overflow-hidden flex flex-col max-h-[85vh] shadow-[0_0_50px_rgba(0,240,255,0.25)] animate-in fade-in zoom-in-95 duration-200">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-surface-light/40 p-4 border border-brand-surface-light rounded-lg">
                <div>
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Threat Classification</span>
                  <span className="text-xs font-semibold text-white mt-1 block truncate">{selectedThreat.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-text-muted uppercase font-mono block">Threat Severity</span>
                  <span className={`text-xs font-bold mt-1 block ${
                    selectedThreat.severity === 'Critical' ? 'text-brand-danger' : selectedThreat.severity === 'High' ? 'text-orange-500' : 'text-brand-warning'
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
 
              <div className="p-3 bg-brand-danger/5 border border-brand-danger/20 rounded-lg">
                <span className="text-xs font-bold text-brand-danger flex items-center gap-1.5 font-mono">
                  <AlertTriangle size={14} /> Rule Trigger telemetry:
                </span>
                <p className="text-xs font-mono text-white mt-1 ml-5">{selectedThreat.triggerValue || 'Suspicious payload match.'}</p>
              </div>
 
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase font-mono flex items-center gap-1.5 mb-1.5">
                  <Server size={14} /> AI Engine Detection Logic Explainer
                </span>
                <p className="text-xs text-brand-text-muted leading-relaxed pl-4 border-l border-brand-primary/20">
                  {selectedThreat.forensicAnalysis || 'Dynamic heuristic scanning flagged a structural pattern anomaly. The client payload deviates from normal human navigational behavior profiles.'}
                </p>
              </div>
 
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

export default ThreatAlerts;
