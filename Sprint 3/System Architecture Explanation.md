System Architecture Explanation – Campus Events & Ticketing System

This document explains the architecture represented in the provided diagram. The system follows a three-tier web architecture with clearly separated concerns, enabling scalability, security, and maintainability.

1. Presentation Tier – Client (React SPAs)

The system provides three dedicated Single Page Applications (SPAs), each built with React:

1. Student SPA

Event discovery & search

Ticket claiming & QR viewing

Event chat participation

2. Organizer SPA

Event creation & editing

Attendance dashboard

Moderating chat messages

3. Admin SPA

Approving organizer accounts

Global platform analytics

Event moderation

All SPAs communicate with the backend exclusively through HTTPS + JSON.
Authentication tokens and role-based access rules determine what each user type can access.

2. API Layer – Express Routing & Middleware

Incoming HTTP requests are handled by the API Layer, built with Node.js + Express.

Responsibilities of this layer:

Routing requests to /auth, /events, /tickets, /admin, /chat

Input validation (ensuring proper params, data formats, and types)

Authorization Middleware:

JWT validation

Role-Based Access Control (RBAC): student, organizer, admin

Sanitizing incoming data and preventing common API-level vulnerabilities

This layer serves as the gateway between the React SPAs and the core backend logic.

3. Business Logic Layer – Application Services

This layer contains the core functionality of the system and encapsulates all business rules.
Each key feature is implemented as its own independent service.

EventService

Create, edit, cancel events

Enforce capacity rules and scheduling constraints

Provide filtered event listings

TicketService

Claim and unclaim tickets

Prevent overbooking and duplicates

Handle QR generation and validation

Manage check-in workflow

AdminService

Approve or reject new organizer requests

Compute global platform analytics

Moderate events

ChatService (Mock Implementation)

Manage text threads per event

Support future upgrade to database-backed persistence

Provide organizer-tagged messages

AnalyticsService

Aggregate statistics

Track ticket counts, events, trends

Power admin dashboards

By separating these into modular services, the system remains easier to maintain and extend.

4. Data Access Layer – Repositories (Mongoose)

To interact with the MongoDB database cleanly, we use the Repository Pattern through Mongoose models.

Repositories include:

UserRepository

EventRepository

TicketRepository

OrganizationRepository

ChatRepository (future)

Responsibilities:

Executing clean database queries

Converting MongoDB documents into application-friendly objects

Ensuring data consistency

This separation ensures the Business Logic Layer does not deal directly with database syntax.

5. Data Tier – MongoDB & External Services
MongoDB (studentevent)

Stores all persistent data:

Users & roles

Events

Organizations

Tickets & QR tokens

Chat threads (future expansion)

MongoDB was chosen for:

Easy schema evolution

Fast document-based queries

Seamless integration with Node.js through Mongoose

6. External Services
1. Email Service

Built using Nodemailer + Gmail SMTP

Sends cancellation emails and approval notifications

2. QR Code Service

Generates unique ticket QR codes

Validates QR contents during check-in

These external services keep core logic minimal and offload specialized features.

7. Architectural Benefits
Scalability

Clear separation between frontend, backend, services, repositories

Easy to introduce microservices later (e.g., real-time chat)

Security

JWT authentication

Role-based permission checks

Sanitized input through the API layer

Maintainability

Modular service decomposition

Repository pattern isolates DB logic

Clear boundaries enable easier team collaboration

Extensibility

New features (e.g., real-time chat, push notifications) fit naturally into Business Logic → Repository → API workflow.

Conclusion

The architecture provides a clean, layered, and industry-standard foundation for the Campus Events & Ticketing System. The separation of responsibilities ensures that each module—frontend, backend, business services, data layer, and external integrations—can evolve independently while keeping the system stable, secure, and easy to maintain.
