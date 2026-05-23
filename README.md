# GuardX - AI-Powered Cybersecurity Monitoring System

GuardX is an AI-Powered Cybersecurity & Forensic Monitoring System designed to protect educational and event platforms from fake registrations, suspicious logins, spam activities, and unauthorized access. It provides real-time threat detection, secure authentication, risk analysis, and an advanced admin dashboard for monitoring platform security.

## Hackathon Features Overview

### Security Features
- Fake User / Bot Registration Detection
- Brute Force Login Protection
- Real-Time Threat Monitoring
- Suspicious Activity Detection
- Risk Score Calculation
- Login Alerts & User Blocking

## Threat Detection Logic

### Fake User Detection
- Temporary email detection (`tempmail`, `mailinator`, etc.)
- Fast signup detection
- Spam pattern identification

### Login Protection
- Failed login tracking
- Brute force detection
- Unusual login monitoring

### Activity Monitoring
- Rapid requests detection
- User behavior analysis
- Threat scoring engine

### Risk Levels
- 0–30 → Low Risk
- 31–60 → Medium Risk
- 61–80 → High Risk
- 81+ → Critical Risk

## Tech Stack

Frontend:
- React.js
- Vite
- Tailwind CSS
- Framer Motion

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Charts & UI:
- Recharts
- Lucide React

## Run Locally

```bash
npm install
npm run dev