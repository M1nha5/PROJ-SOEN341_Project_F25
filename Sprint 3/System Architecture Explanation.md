System Architecture Explanation – Campus Events & Ticketing System
Overview

This document explains the high-level architecture of the Campus Events & Ticketing System.
The system uses a layered architecture with Frontend, API Layer, Business Logic, Database, and External Services, all communicating through a REST API.

1. Presentation Tier – Web Client (React SPAs)

The system provides three React Single-Page Applications (SPAs) — one for each user role:

Student SPA

Event discovery & search

Ticket claiming & QR viewing

Event chat participation

Organizer SPA

Create & edit events

Attendance dashboard

Chat moderation

Admin SPA

Approve organizer accounts

Platform analytics

Event moderation

All SPAs communicate with the backend using HTTPS + JSON.

2. API Layer – Express Routing & Middleware

All client requests pass through the Node.js / Express API Layer.

Responsibilities

Routing for /auth, /events, /tickets, /admin, /chat

Request validation

JWT authentication

Role-Based Access Control (RBAC) for student / organizer / admin

This layer ensures secure and role-appropriate access to all features.

3. Business Logic Layer – Core Services

This layer contains all application logic, organized into backend services:

EventService

Create / update / cancel events

Enforce capacity rules

Event listings & filters

TicketService

Claim / unclaim tickets

Prevent duplicates & over-capacity

QR generation & validation

AdminService

Approve / reject organizers

Global statistics

Event moderation

ChatService (Mock)

Chat threads per event

Organizer-tagged messages

Structure prepared for future DB storage

AnalyticsService

Ticket & attendance statistics

Dashboard metrics

This structure keeps logic modular, testable, and maintainable.

4. Data Access Layer – Mongoose Repositories

The backend uses Mongoose repositories following the Repository Pattern:

UserRepository

EventRepository

TicketRepository

OrganizationRepository

ChatRepository (future)

Responsibilities

Clean database queries

Data formatting & normalization

Enforcing consistency

This layer isolates database logic from business logic.

5. Data Tier – MongoDB

MongoDB stores all persistent domain data:

Users

Events

Organizations

Tickets + QR tokens

(Future) Chat messages

MongoDB was chosen for its flexible schema and excellent Node.js integration.

6. External Services
Email Service

Built with Nodemailer + Gmail SMTP

Sends cancellation emails & organizer approval notifications

QR Code Service

Generates QR codes for tickets

Decodes & validates QR content during check-in

7. Architectural Benefits

Scalable: clean separation of concerns

Secure: JWT, RBAC, validated API requests

Maintainable: modular services + repository pattern

Extensible: features like Chat integrate seamlessly

Conclusion

This layered architecture is secure, scalable, and future-ready.
It supports enhancements such as real-time chat, payments, and advanced analytics without needing major redesign.