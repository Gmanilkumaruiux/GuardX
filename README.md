# GuardX - AI-Powered Cybersecurity Monitoring System

GuardX is a modern, intelligent cybersecurity monitoring web application designed specifically for educational and event platforms (like ECLearnix and AllCollegeEvent). It provides real-time threat detection, secure authentication, and an advanced administrative dashboard to monitor and protect user data.

## Hackathon Features Overview

This prototype fulfills all hackathon requirements:
1. **Working Prototype**: A fully responsive, interactive React.js application with a dark futuristic UI.
2. **3+ Security Features**:
   - Fake User/Bot Registration Detection
   - Brute Force Login Protection & Login Alerts
   - Real-time Threat Activity Feed
3. **Admin Dashboard**: A comprehensive command center to monitor live stats, view threat alerts, and manage user access.
4. **Basic Log Tracking**: Tracks user activity, login times, IP addresses, and suspicious behaviors in real time.
5. **Detection Engine**: Built-in mock AI engine that identifies unusual activities and assigns risk scores.

---

## 🧠 How Our System Identifies Threats (Detection Logic)

Our AI-powered Threat Detection Engine analyzes user behavior in real-time and calculates a **Dynamic Risk Score** (0-100). If a user's score exceeds a certain threshold, the system automatically flags the activity, generates a threat alert, and can block the user.

### 1. Bot Registration & Fake User Detection
* **Speed Analysis**: If a signup form is completed in less than 3 seconds, the system flags it as an automated script/bot (`+40 Risk Score`).
* **Email Pattern Matching**: The system scans emails against a database of known spam or temporary email patterns (e.g., `tempmail.com`, `test`, `spam`). Matches instantly raise the risk score (`+30 Risk Score`).

### 2. Brute Force Login Protection
* **Failed Attempt Tracking**: The system monitors consecutive failed logins. If a user fails more than 3 times, a `Medium Severity` threat is generated, and a warning is displayed (`+20 Risk Score`).
* **Unusual Time Detection**: Logging in during unusual hours (e.g., 1 AM - 5 AM) for the target timezone adds a slight risk increase (`+15 Risk Score`).

### 3. Rapid Action & Spam Detection
* **Action Velocity**: The engine monitors "actions per minute." If a user triggers more than 50 actions in under a minute, the system flags a `High Severity` rapid-request attack, simulating protection against DDoS or spam clicking (`+40 Risk Score`).

### Risk Scoring Thresholds:
* **0 - 30 (Low Risk)**: Normal user behavior.
* **31 - 60 (Medium Risk)**: Suspicious activity; generates a warning.
* **61 - 80 (High Risk)**: Severe threat; flags account for admin review.
* **81+ (Critical Risk)**: Account is blocked immediately to protect the platform.

---

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion
- **Icons & Charts**: Lucide React, Recharts
- **State Management**: React Context API
- **Backend Reference**: Mongoose Schemas & Express.js architecture included in `backend-reference/`

## Running Locally

```bash
npm install
npm run dev
```

*Note: Use `admin@guardx.com` to access the Admin Dashboard.*
