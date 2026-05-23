import React, { useState } from 'react';
import { useThreats } from '../../context/ThreatContext';
import { Shield, ToggleLeft, ToggleRight, Sliders, Play, Award, Zap, HelpCircle } from 'lucide-react';

const DetectionLogic = () => {
  const { settings, updateSettings } = useThreats();
  const [saveStatus, setSaveStatus] = useState(false);

  const handleToggle = (key) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    updateSettings(nextSettings);
    triggerSaveAlert();
  };

  const handleSliderChange = (key, val) => {
    const nextSettings = { ...settings, [key]: Number(val) };
    updateSettings(nextSettings);
    triggerSaveAlert();
  };

  const triggerSaveAlert = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-wide">AI Security Engine Rules</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Configure threshold metrics and rule engine parameters in real-time.</p>
        </div>
        {saveStatus && (
          <div className="bg-brand-success/15 border border-brand-success/30 text-brand-success px-4 py-2 rounded-lg text-xs font-mono animate-pulse shrink-0">
            ⚡ Config Synced to AI Engine Live
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders and Threshold Toggles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Protection Shields */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="text-brand-primary" size={20} />
              Platform Shield Engines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { label: 'Brute-Force Login Shield', desc: 'Blocks logins after multiple fails.', key: 'bruteForceEnabled' },
                { label: 'Rapid Signup Bot Detection', desc: 'Flags fast submissions (<3s).', key: 'botSignupEnabled' },
                { label: 'Anomaly Rate Limiter', desc: 'Throttles request flooding.', key: 'spamLimiterEnabled' },
                { label: 'Late-Night Access Monitor', desc: 'Flags logins during off-hours.', key: 'suspiciousTimeEnabled' },
              ].map((shield) => (
                <div key={shield.key} className="p-4 rounded-lg bg-brand-surface-light/30 border border-brand-surface-light flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{shield.label}</h4>
                    <p className="text-xs text-brand-text-muted mt-0.5">{shield.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(shield.key)}
                    className="focus:outline-none transition-colors"
                  >
                    {settings[shield.key] ? (
                      <ToggleRight className="text-brand-primary" size={36} />
                    ) : (
                      <ToggleLeft className="text-brand-text-muted/50" size={36} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Core Rule Sliders */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sliders className="text-brand-primary" size={20} />
              AI Threshold Calibration
            </h2>
            
            <div className="space-y-5">
              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">Brute-Force Attempt Threshold</span>
                  <span className="font-mono text-brand-primary font-bold">{settings.failedLoginThreshold} failed attempts</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="8" 
                  value={settings.failedLoginThreshold}
                  onChange={(e) => handleSliderChange('failedLoginThreshold', e.target.value)}
                  className="w-full h-1.5 bg-brand-surface-light rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <p className="text-[10px] text-brand-text-muted">Account lockouts trigger when sequential failures exceed this count.</p>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">Bot Signup Speed Limit</span>
                  <span className="font-mono text-brand-primary font-bold">{(settings.botSignupSpeedThreshold / 1000).toFixed(1)}s completion</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="6000" 
                  step="250"
                  value={settings.botSignupSpeedThreshold}
                  onChange={(e) => handleSliderChange('botSignupSpeedThreshold', e.target.value)}
                  className="w-full h-1.5 bg-brand-surface-light rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <p className="text-[10px] text-brand-text-muted">Form fill velocities faster than this limit are immediately classified as automated scripts.</p>
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">Dashboard Rate Limit</span>
                  <span className="font-mono text-brand-primary font-bold">{settings.rateLimitThreshold} actions/min</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  value={settings.rateLimitThreshold}
                  onChange={(e) => handleSliderChange('rateLimitThreshold', e.target.value)}
                  className="w-full h-1.5 bg-brand-surface-light rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <p className="text-[10px] text-brand-text-muted">Maximum request frequency from a single client header IP before throttle cooling kicks in.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Explanation & Logic Flow */}
        <div className="space-y-6">
          {/* Forensic Flow Explanation */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="text-brand-success" size={20} />
              AI Threat Explainer
            </h2>
            <div className="space-y-4 text-xs leading-relaxed text-brand-text-muted">
              <div className="p-3 bg-brand-surface-light/40 border border-brand-surface-light rounded-lg">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Zap className="text-brand-primary" size={12} />
                  Risk Indexing (0-100)
                </div>
                Every system login or registration action is scored in real-time. If baseline heuristics identify structural anomalies, the threat indicator escalates the user risk index.
              </div>

              <div className="border-l-2 border-brand-primary/30 pl-3 py-1 space-y-3">
                <div>
                  <h4 className="font-bold text-white">Rule 1: Bot Speed Test</h4>
                  <p>Analyzes milliseconds between signup form focus and submit. Humans take 5s+; bots submit in &lt;1.5s.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Rule 2: Impersonator & Temp Email Scanner</h4>
                  <p>Regular expression searches for words like 'test', 'spam', 'admin' or temporary domains in email strings.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Rule 3: Brute-Force Rate Tracker</h4>
                  <p>Tracks sliding failure logs for single accounts. Exceeding thresholds isolates traffic routing instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Threat Pipeline Diagram */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-white mb-4 font-mono">FLOW: EVENT PIPELINE</h2>
            <div className="space-y-2 font-mono text-[10px] bg-slate-950/80 p-4 border border-brand-surface-light rounded-lg text-slate-300">
              <div className="text-brand-primary">INCOMING REQUEST (Login/Signup)</div>
              <div>&nbsp;&nbsp;↓</div>
              <div className="text-brand-warning">1. ACTIVE RULES SCAN</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;[Speed check, Email scan, 2FA status]</div>
              <div>&nbsp;&nbsp;↓</div>
              <div className="text-brand-danger">2. HEURISTIC RISK SCORE</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;[Calculates risk points from 0 to 100]</div>
              <div>&nbsp;&nbsp;↓</div>
              <div>3. MATCHED THREAT FORCED ACTION?</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;├─ YES (High/Crit) → <span className="text-brand-danger font-bold">BLOCK & MITIGATE</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;└─ NO (Low/Med) → <span className="text-brand-success font-bold">GRANT & LOG EVENT</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionLogic;
