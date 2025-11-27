# USER MANUAL — Campus Events & Ticketing System
SOEN 341 — Fall 2025 Project

Team: PROJ-SOEN341_Project_F25

## 1. Overview

The Campus Events & Ticketing System is a web application designed to help students discover campus events, claim tickets, and check in using QR codes.
It also provides dedicated interfaces for Organizers and Administrators to manage events and oversee platform activity.

This manual explains:

✔ How to install and run the system
✔ How each user role works (Student, Organizer, Admin)
✔ How to use all major features, including the extra Chat feature

## 2. System Requirements
Hardware

Any modern laptop or desktop

8 GB RAM recommended

Software

Node.js v18+

npm v9+

MongoDB Community Server (local)

Git

Web Browser (Chrome recommended)

## 3. Installation Guide

Follow these steps to install and run the system locally.

### 3.1. Clone the Repository
git clone https://github.com/M1nha5/PROJ-SOEN341_Project_F25.git
cd PROJ-SOEN341_Project_F25

### 3.2. Install Backend (API)
cd api
npm install


Create a .env file inside /api:

MONGO_URI=mongodb://localhost:27017/studentevent
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=app_password_here
PORT=5000


Run the backend:

npm run dev


The backend is now live at:

http://localhost:5001

### 3.3 Install Frontend (Client)

In a new terminal:

cd client
npm install
npm start


The frontend is now live at:

http://localhost:3000

## 4. First-Time Setup
### 4.1 Creating Admin and Organizer Accounts

You must manually add:

Admin account

Insert via Mongo shell:

db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "<hashed_pass>",
  role: "admin",
  status: "approved"
})

Organizer account

Organizers self-register, but Admins must approve them from the Admin Dashboard.

## 5. User Role Guide

The system has three separate dashboards:

Student Dashboard

Organizer Dashboard

Admin Dashboard

Each role sees different features.

## 6. Student User Guide
### 6.1 Login / Register

Students create an account and log in at:

/login

### 6.2 Browse Events

Students can:

✔ Search by title or category
✔ Filter by date
✔ View event details
✔ View event capacity
✔ Check organizer name

Click any event → opens the Event Details modal

### 6.3 Claim Ticket

Inside the modal:

Click Claim Ticket

If successful → student receives a QR code

Ticket appears under My Tickets

Students can claim only 1 ticket per event.

### 6.4 QR Code Check-In

At the entrance:

Show your QR code

Organizer scans it with the built-in scanner

Status becomes Checked-in

### 6.5 Event Chat (Extra Feature)

Inside an event's modal → go to Chat tab

Students can:

✔ Send messages
✔ Ask questions
✔ See organizer announcements
✔ View time-stamped conversation
✔ Messages saved locally (even after refresh)

## 7. Organizer User Guide
### 7.1 Dashboard

After admin approval, an organizer can:

Create events

Manage existing events

Track ticket issuance

View attendance numbers

### 7.2 Create Event

Required fields:

Title

Description

Date & Time

Location

Ticket Type (free or paid)

Capacity

Events appear immediately in the Student view.

### 7.3 Validate Tickets

Organizers can:

Open QR Scanner

Scan student tickets

Mark them as Checked-in

See total attendance

### 7.4 Export Attendee List

Open an event

Click Export CSV

Download full list of students

### 7.5 Chat Moderation (Extra Feature)

Organizers can:

✔ Send highlighted “Organizer Messages”
✔ Clear chat history
✔ Moderate inappropriate messages

## 8. Admin User Guide
### 8.1 Approve Organizers

Admins see all pending organizer requests.

Options:

Approve

Reject

View details

### 8.2 Moderate Events

Admins can:

Remove inappropriate events

Cancel events (with reason)

System emails all attendees automatically

### 8.3 Platform Analytics

Admins can view:

Total events

Total tickets issued

Most active organizers

Trends in participation

## 9. Known Limitations

⚠ Payment system is mocked
⚠ Chat is stored locally (not in DB)
⚠ No real-time WebSockets
⚠ Not mobile-app ready
⚠ No session persistence (JWT only)

## 10. Troubleshooting
Client fails to start
react-scripts: command not found


➡ Run:

npm install

API cannot connect to MongoDB

Check if Mongo is running:

mongod

Organizer cannot create event

Admin must approve account first.

## 11. Support

For questions or bug reports:

Contact project maintainer: Jawad Al-Aqlani
GitHub Issues:
https://github.com/M1nha5/PROJ-SOEN341_Project_F25/issues
