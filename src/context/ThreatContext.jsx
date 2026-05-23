import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateInitialThreats, generateInitialLogs, analyzeEvent, SecurityConfig } from '../services/mockAI';

const ThreatContext = createContext();

export const useThreats = () => useContext(ThreatContext);

export const ThreatProvider = ({ children }) => {
  const [threats, setThreats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({ ...SecurityConfig });
  const [liveStats, setLiveStats] = useState({
    threatsPrevented: 1420,
    fakeUsersDetected: 384,
    suspiciousLogins: 512,
    activeProtected: 8590
  });

  // Load database from localStorage on startup
  useEffect(() => {
    const savedThreats = localStorage.getItem('guardx_threats_db');
    if (savedThreats) {
      setThreats(JSON.parse(savedThreats));
    } else {
      const initialThreats = generateInitialThreats();
      localStorage.setItem('guardx_threats_db', JSON.stringify(initialThreats));
      setThreats(initialThreats);
    }

    const savedLogs = localStorage.getItem('guardx_logs_db');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      const initialLogs = generateInitialLogs();
      localStorage.setItem('guardx_logs_db', JSON.stringify(initialLogs));
      setLogs(initialLogs);
    }

    const savedSettings = localStorage.getItem('guardx_settings_db');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      Object.assign(SecurityConfig, parsedSettings);
    }

    // Simulate live normal traffic events coming in periodically
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        threatsPrevented: prev.threatsPrevented + Math.floor(Math.random() * 2),
        activeProtected: prev.activeProtected + Math.floor(Math.random() * 3) - 1
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Persist changes to localStorage dynamically
  useEffect(() => {
    if (threats.length > 0) {
      localStorage.setItem('guardx_threats_db', JSON.stringify(threats));
    }
  }, [threats]);

  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem('guardx_logs_db', JSON.stringify(logs));
    }
  }, [logs]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('guardx_settings_db', JSON.stringify(newSettings));
    Object.assign(SecurityConfig, newSettings);
  };

  const reportEvent = (event) => {
    const { scoreIncrease, detectedThreat } = analyzeEvent(event);
    
    // Log the event
    const newLog = {
      id: `l-${Date.now()}`,
      user: event.user || 'Unknown',
      action: event.action || (event.type === 'SIGNUP_ATTEMPT' ? 'Registration Attempt' : event.type === 'LOGIN_ATTEMPT' ? 'Login Attempt' : 'User Action'),
      ip: event.data?.ip || '198.51.100.12', // mock IP
      time: new Date().toISOString()
    };
    
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('guardx_logs_db', JSON.stringify(updatedLogs));

    if (detectedThreat) {
      const newThreat = {
        id: `t-${Date.now()}`,
        type: detectedThreat.type,
        severity: detectedThreat.severity,
        user: event.user || 'Unknown',
        time: new Date().toISOString(),
        status: 'Active',
        riskScore: scoreIncrease,
        matchedRule: detectedThreat.matchedRule,
        triggerValue: detectedThreat.triggerValue,
        forensicAnalysis: detectedThreat.forensicAnalysis,
        remediation: detectedThreat.remediation,
      };
      
      const updatedThreats = [newThreat, ...threats];
      setThreats(updatedThreats);
      localStorage.setItem('guardx_threats_db', JSON.stringify(updatedThreats));
      
      // Update stats based on threat type
      setLiveStats(prev => {
        let f = prev.fakeUsersDetected;
        let s = prev.suspiciousLogins;
        if (detectedThreat.type === 'Bot Registration' || detectedThreat.type === 'Suspicious Email Pattern' || detectedThreat.type === 'Multiple Accounts Created') {
          f += 1;
        } else if (detectedThreat.type === 'Multiple Login Attempts' || detectedThreat.type === 'Unusual Login Time') {
          s += 1;
        }
        return {
          ...prev,
          threatsPrevented: prev.threatsPrevented + 1,
          fakeUsersDetected: f,
          suspiciousLogins: s
        };
      });
    }

    return { scoreIncrease, detectedThreat };
  };

  const resolveThreat = (id) => {
    const updatedThreats = threats.map(t => t.id === id ? { ...t, status: 'Resolved' } : t);
    setThreats(updatedThreats);
    localStorage.setItem('guardx_threats_db', JSON.stringify(updatedThreats));
  };

  // Helper to trigger realistic simulated attacks
  const triggerSimulatedAttack = (attackType) => {
    const time = new Date().toISOString();
    
    if (attackType === 'BOT_SIGNUP') {
      const botId = Math.floor(Math.random() * 900) + 100;
      const botUser = `crawler-bot-${botId}@tempmail.com`;
      reportEvent({
        type: 'SIGNUP_ATTEMPT',
        user: botUser,
        action: 'Bot Signup Blocked',
        data: {
          email: botUser,
          timeToComplete: 420, // 0.42 seconds
          ip: `185.190.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        }
      });
    } 
    
    else if (attackType === 'BRUTE_FORCE') {
      const victimUser = `dean.academics@eclearnix.edu`;
      const ip = `45.89.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      // Push mock failed logs
      const newFailLogs = [
        { id: `l-${Date.now()}-1`, user: victimUser, action: 'Failed Login Attempt', ip, time: new Date(Date.now() - 2000).toISOString() },
        { id: `l-${Date.now()}-2`, user: victimUser, action: 'Failed Login Attempt', ip, time: new Date(Date.now() - 1000).toISOString() },
        ...logs
      ];
      setLogs(newFailLogs);
      localStorage.setItem('guardx_logs_db', JSON.stringify(newFailLogs));

      // Report final login attempt that triggers alert
      reportEvent({
        type: 'LOGIN_ATTEMPT',
        user: victimUser,
        action: 'Account Locked / Brute Force Alert',
        data: {
          failedCount: settings.failedLoginThreshold,
          ip
        }
      });
    } 
    
    else if (attackType === 'SPAM_ACTIVITY') {
      const spamUser = `ticket-scalper@allcollegeevent.com`;
      reportEvent({
        type: 'USER_ACTION',
        user: spamUser,
        action: 'Rate Limit Exceeded',
        data: {
          actionsPerMinute: 84,
          ip: `91.240.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        }
      });
    } 
    
    else if (attackType === 'UNUSUAL_TIME') {
      const timeOwl = `student.coordinator@allcollegeevent.com`;
      const newLog = {
        id: `l-${Date.now()}`,
        user: timeOwl,
        action: 'Anomalous Time Access Granted',
        ip: '172.56.92.14',
        time
      };
      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      localStorage.setItem('guardx_logs_db', JSON.stringify(updatedLogs));

      const newThreat = {
        id: `t-${Date.now()}`,
        type: 'Unusual Login Time',
        severity: 'Low',
        user: timeOwl,
        time,
        status: 'Active',
        riskScore: 25,
        matchedRule: 'ANOMALOUS_ACCESS_TIME',
        triggerValue: 'Login attempted at 3:45 AM (System quiet hours)',
        forensicAnalysis: 'Account credentials matched successfully, but access request was initiated during high-risk late night hours. Baseline indicator flags potential password compromise or unauthorized physical terminal access.',
        remediation: 'Notify account owner, check device metadata fingerprint, and enforce active session log review.'
      };
      
      const updatedThreats = [newThreat, ...threats];
      setThreats(updatedThreats);
      localStorage.setItem('guardx_threats_db', JSON.stringify(updatedThreats));
      
      setLiveStats(prev => ({
        ...prev,
        threatsPrevented: prev.threatsPrevented + 1,
        suspiciousLogins: prev.suspiciousLogins + 1
      }));
    }
  };

  return (
    <ThreatContext.Provider value={{ 
      threats, 
      logs, 
      liveStats, 
      settings, 
      updateSettings, 
      reportEvent, 
      resolveThreat, 
      triggerSimulatedAttack 
    }}>
      {children}
    </ThreatContext.Provider>
  );
};
