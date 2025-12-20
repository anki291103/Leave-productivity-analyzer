Leave & Productivity Analyzer (Full Stack)

A full-stack web application that analyzes employee attendance, leave usage, and productivity using uploaded Excel attendance data.
This project was developed as part of the NMIMS Intern Technical Assignment – Kenmark ITan Solutions.

🧾 Project Overview

The Leave & Productivity Analyzer is designed to help organizations track employee attendance, calculate leave usage, and measure productivity on a monthly basis.

The system allows HR teams or managers to upload Excel-based attendance records, automatically applies predefined business rules, stores processed data in a database, and presents insights through a clean, interactive dashboard.

The project focuses on:

Accurate data processing

Strict business rule enforcement

Professional UI/UX

End-to-end system integration

🎯 Key Objectives

Parse and normalize Excel attendance data

Automatically calculate worked hours and leaves

Compute monthly productivity based on expected working hours

Provide a visually clear and responsive dashboard for analysis

✨ Features
📂 Excel Attendance Upload

Supports .xlsx files

Columns supported:

Employee Name

Date

In-Time

Out-Time

Handles:

Missing in-time / out-time

Excel serial dates

Excel numeric time values

🕒 Business Rule Enforcement
Working Hours

Monday – Friday: 8.5 hours (10:00 AM – 6:30 PM)

Saturday: 4 hours (10:00 AM – 2:00 PM)

Sunday: Off (no expected hours)

Leave Policy

Each employee is allowed 2 leaves per month

Missing attendance on a working day (Mon–Sat) is treated as a leave

Leave overuse is clearly highlighted in the dashboard

📊 Productivity Calculation
Productivity (%) = (Actual Worked Hours / Expected Working Hours) × 100


Expected hours are calculated dynamically based on the selected month and working days.

📈 Interactive Dashboard

The dashboard provides:
Total Expected Working Hours
Total Actual Worked Hours
Leaves Used (out of allowed 2)
Productivity Percentage
Daily Attendance Breakdown
UI/UX Enhancements

Skeleton loading for better perceived performance

Animated stat cards

Status badges (Present / Leave)

Productivity progress bar

Responsive dark-themed design

🛠 Tech Stack
Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

Framer Motion (animations)

Backend

Next.js API Routes

Prisma ORM

MongoDB Atlas

Utilities

xlsx library for Excel parsing

🏗 Architecture Overview
Excel File (.xlsx)
        ↓
API Route (/api/upload)
        ↓
Data Normalization & Business Logic
        ↓
MongoDB (via Prisma ORM)
        ↓
API Route (/api/summary)
        ↓
Dashboard (Next.js + Tailwind)

▶️ How to Run the Project Locally
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/leave-productivity-analyzer.git
cd leave-productivity-analyzer

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the project root:

DATABASE_URL="your_mongodb_connection_string"


Note: Use a MongoDB Atlas connection string.

4️⃣ Setup Database
npx prisma db push

5️⃣ Run the Application
npm run dev


Open in browser:

http://localhost:3000

📄 Sample Excel Format

The application accepts Excel files with the following structure:

Employee Name	Date	In-Time	Out-Time
John Doe	2024-01-01	10:00	18:30
John Doe	2024-01-02
John Doe	2024-01-06	10:00	14:00
Notes

Missing In-Time or Out-Time → treated as Leave

Saturdays → Half-day

Sundays → Off

A multi-month sample Excel file is included in the /sample folder for testing.

📊 Evaluation Highlights

Accurate implementation of all business rules

Clean, modular, and maintainable codebase

Real-world data handling and normalization

Professional UI/UX with animations and loading states

End-to-end full-stack integration

🚀 Deployment

The application is deployed on Vercel.

Environment variables configured on Vercel:

DATABASE_URL

Live Demo URL:

https://<your-vercel-app-url>

 Deliverables Checklist

 Public GitHub Repository
 Live Deployed Application (Vercel)
 Sample Excel File Included
 Detailed README Documentation

👩‍💻 Author

Ankita Jha
B.Tech – Information Technology
Full-Stack Developer


This project was developed with a focus on accuracy, scalability, and user experience, simulating a real-world HR analytics tool rather than a basic academic submission.