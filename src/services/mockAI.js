// Mock AI Engine for Threat Detection

export const ThreatTypes = {
  MULTIPLE_LOGIN: 'Multiple Login Attempts',
  RAPID_REQUESTS: 'Rapid Action Detection',
  BOT_SIGNUP: 'Bot Registration',
  FAKE_EMAIL: 'Suspicious Email Pattern',
  SPAM_ACTIVITY: 'Spam Activity',
  UNUSUAL_TIME: 'Unusual Login Time',
};

export const Severities = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Global security rules configuration that can be adjusted at runtime
export const SecurityConfig = {
  failedLoginThreshold: 3,
  botSignupSpeedThreshold: 3000, // 3 seconds
  emailBlocklist: ['test', 'spam', '1234', 'admin', 'tempmail', 'bot', 'fake', 'hacker', 'spammer', 'scammer', 'botnet', 'malware', 'attack', 'phish', 'spoof', 'exploit'],
  rateLimitThreshold: 30, // actions per minute
  otpVerificationActive: false, // 2FA/OTP required
  
  // Rule engines toggle
  bruteForceEnabled: true,
  botSignupEnabled: true,
  spamLimiterEnabled: true,
  suspiciousTimeEnabled: true,
};

export const calculateRiskSeverity = (score) => {
  if (score <= 30) return Severities.LOW;
  if (score <= 60) return Severities.MEDIUM;
  if (score <= 80) return Severities.HIGH;
  return Severities.CRITICAL;
};

// Simulate analyzing an event with customizable rules and detailed forensics
export const analyzeEvent = (event) => {
  const { type, data } = event;
  let scoreIncrease = 0;
  let detectedThreat = null;

  if (type === 'LOGIN_ATTEMPT' && SecurityConfig.bruteForceEnabled) {
    if (data.failedCount >= SecurityConfig.failedLoginThreshold) {
      scoreIncrease += 25 * (data.failedCount - SecurityConfig.failedLoginThreshold + 1);
      detectedThreat = {
        type: ThreatTypes.MULTIPLE_LOGIN,
        severity: scoreIncrease > 75 ? Severities.CRITICAL : Severities.HIGH,
        matchedRule: 'BRUTE_FORCE_LOCKOUT',
        triggerValue: `Failed logins: ${data.failedCount} (Threshold: >= ${SecurityConfig.failedLoginThreshold})`,
        forensicAnalysis: 'Multiple unsuccessful authentications were received in a short time frame. This pattern is characteristic of automated dictionary or credential stuffing attacks attempting to guess passwords.',
        remediation: 'Initiate dynamic IP rate-limiting, issue temporary account lockout, and trigger secondary SMS/email multi-factor authentication check.'
      };
    }
    
    // Simulate unusual time (e.g., 1 AM to 5 AM)
    if (SecurityConfig.suspiciousTimeEnabled) {
      const hour = new Date().getHours();
      if (hour >= 1 && hour <= 5) {
        scoreIncrease += 15;
        detectedThreat = detectedThreat || {
          type: ThreatTypes.UNUSUAL_TIME,
          severity: Severities.LOW,
          matchedRule: 'ANOMALOUS_ACCESS_TIME',
          triggerValue: `Login attempted at ${hour}:00 AM (Unusual Time Range: 1:00 AM - 5:00 AM)`,
          forensicAnalysis: 'The session authentication request originated during historically low activity hours for this user profile. Although credentials were correct, the anomalous hour raises the baseline risk indicator.',
          remediation: 'Flag the session for closer behavior monitoring and trigger a secure login OTP challenge to verify the true identity of the account holder.'
        };
      }
    }
  }

  if (type === 'SIGNUP_ATTEMPT' && SecurityConfig.botSignupEnabled) {
    // Check 1: Multi-Account registration from same device
    if (data.recentRegistrationCount > 2) {
      scoreIncrease += 55;
      detectedThreat = {
        type: 'Multiple Accounts Created',
        severity: Severities.HIGH,
        matchedRule: 'DEVICE_MULTI_ACCOUNT_LIMIT',
        triggerValue: `Registrations: ${data.recentRegistrationCount} within 60s (Limit: 2)`,
        forensicAnalysis: 'Device profiling flagged multiple accounts created rapidly from the same browser fingerprint/IP interface. This pattern is characteristic of spam bots, automated scale operations, or event ticket resellers.',
        remediation: 'Account creation pipeline restricted. Access from this device has been administratively blacklisted. Require admin approval.'
      };
    }

    // Check 2: Bot submission velocity
    else if (data.timeToComplete < SecurityConfig.botSignupSpeedThreshold) { // completed in less than threshold
      scoreIncrease += 45;
      detectedThreat = {
        type: ThreatTypes.BOT_SIGNUP,
        severity: Severities.HIGH,
        matchedRule: 'RAPID_FORM_SUBMISSION',
        triggerValue: `Form filled in ${(data.timeToComplete / 1000).toFixed(2)}s (Threshold: < ${(SecurityConfig.botSignupSpeedThreshold / 1000).toFixed(1)}s)`,
        forensicAnalysis: 'The registration form submission was executed faster than physical human capability (e.g., typing and navigation speed). This indicates the use of headless browsers, browser automation scripts (Puppeteer/Playwright), or API-level bot scripts.',
        remediation: 'Block registration pipeline instantly. Present dynamic reCAPTCHA v3/Turnstile challenge and verify IP reputation score.'
      };
    }

    // Check 3: Disposable/Temporary Email domains
    const emailLower = data.email.toLowerCase();
    const isTempEmail = [
      'tempmail', '10minutemail', '10minute', 'temp', 
      'guerrillamail', 'mailinator', 'yopmail', 'sharklasers', 
      'dispostable', 'getairmail', 'burnmail', 'trashmail'
    ].some(suffix => emailLower.includes(suffix));
    if (isTempEmail) {
      scoreIncrease += 45;
      detectedThreat = detectedThreat || {
        type: 'Bot Registration',
        severity: Severities.HIGH,
        matchedRule: 'TEMP_EMAIL_DISPOSABLE',
        triggerValue: `Disposable email domain detected: "${emailLower}"`,
        forensicAnalysis: 'Heuristics identified a throwaway, temporary, or disposable email service domain. Attackers deploy temporary emails to register hundreds of fake accounts to abuse trial systems, ticket queues, or post scam content.',
        remediation: 'Block account creation. Restrict signups to reputable, fully authenticated primary domain mailboxes.'
      };
    } else {
      const matchedKeyword = SecurityConfig.emailBlocklist.find(p => emailLower.includes(p));
      if (matchedKeyword) {
        scoreIncrease += 35;
        detectedThreat = detectedThreat || {
          type: ThreatTypes.FAKE_EMAIL,
          severity: Severities.MEDIUM,
          matchedRule: 'SUSPICIOUS_EMAIL_PATTERN',
          triggerValue: `Email contains blocked keyword: "${matchedKeyword}"`,
          forensicAnalysis: 'The registered email address matches known temporary mail generators, spam pattern suffixes, or administrative words used to impersonate platform support.',
          remediation: 'Require immediate domain validation and email verification via secure verification link before allowing platform dashboard access.'
        };
      }
    }
  }

  if (type === 'USER_ACTION' && SecurityConfig.spamLimiterEnabled) {
    if (data.actionsPerMinute > SecurityConfig.rateLimitThreshold) {
      scoreIncrease += 40;
      detectedThreat = {
        type: ThreatTypes.RAPID_REQUESTS,
        severity: Severities.HIGH,
        matchedRule: 'RATE_LIMIT_EXCEEDED',
        triggerValue: `Actions/min: ${data.actionsPerMinute} (Threshold: > ${SecurityConfig.rateLimitThreshold})`,
        forensicAnalysis: 'An abnormally high volume of requests was dispatched in a short interval. This indicates suspicious activity, automated data scraping scripts, brute-force form endpoints, or early-stage denial of service attempts.',
        remediation: 'Enforce rate-limiting, display cool-down banners, and temporarily throttle IP request slots.'
      };
    }
  }

  return { scoreIncrease, detectedThreat };
};

// Initial mock data for the dashboard with rich forensics
export const generateInitialThreats = () => {
  return [
    {
      id: 't-1001',
      type: ThreatTypes.BOT_SIGNUP,
      severity: Severities.HIGH,
      user: 'bot-attacker-99@tempmail.com',
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'Active',
      riskScore: 75,
      matchedRule: 'RAPID_FORM_SUBMISSION',
      triggerValue: 'Form filled in 0.85s (Threshold: < 3.0s)',
      forensicAnalysis: 'The signup page was loaded and submitted in under a second. No human mouse movement or keypress delays were detected in UI telemetry, confirming headless automation.',
      remediation: 'Registration blocked. IP submitted to Cloudflare blocklist. ReCAPTCHA verification forced.'
    },
    {
      id: 't-1002',
      type: ThreatTypes.MULTIPLE_LOGIN,
      severity: Severities.MEDIUM,
      user: 'john.doe@example.com',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'Resolved',
      riskScore: 45,
      matchedRule: 'BRUTE_FORCE_LOCKOUT',
      triggerValue: 'Failed logins: 4 (Threshold: >= 3)',
      forensicAnalysis: 'Authentication endpoint received 4 consecutive invalid passwords from IP 203.0.113.5 targeting user john.doe@example.com within a 45-second window.',
      remediation: 'Account locked for 15 minutes. OTP security verification email dispatched to john.doe@example.com.'
    },
    {
      id: 't-1003',
      type: ThreatTypes.RAPID_REQUESTS,
      severity: Severities.CRITICAL,
      user: 'spammer-bot@hacker.io',
      time: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      status: 'Active',
      riskScore: 85,
      matchedRule: 'RATE_LIMIT_EXCEEDED',
      triggerValue: 'Actions/min: 94 (Threshold: > 30)',
      forensicAnalysis: 'The threat user dispatched 94 dashboard API calls in 60 seconds, attempting to brute-force mock telemetry feeds or scrape system metrics.',
      remediation: 'IP address temporarily banned. Rate limiter restricted client headers and rejected incoming API tokens.'
    }
  ];
};

export const generateInitialLogs = () => {
  return [
    { id: 'l-1', user: 'admin@guardx.com', action: 'System Config Update', ip: '192.168.1.1', time: new Date(Date.now() - 100000).toISOString() },
    { id: 'l-2', user: 'john.doe@example.com', action: 'Failed Login Attempt', ip: '203.0.113.5', time: new Date(Date.now() - 500000).toISOString() },
    { id: 'l-3', user: 'bot-attacker-99@tempmail.com', action: 'Bot Signup Blocked', ip: '45.22.11.9', time: new Date(Date.now() - 300000).toISOString() },
    { id: 'l-4', user: 'guest@allcollegeevent.com', action: 'Event Signup Success', ip: '142.250.190.46', time: new Date(Date.now() - 600000).toISOString() },
    { id: 'l-5', user: 'student@eclearnix.edu', action: 'LMS Course Access', ip: '8.8.8.8', time: new Date(Date.now() - 800000).toISOString() },
  ];
};
