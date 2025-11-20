## System Architecture Explanation – *Campus Events & Ticketing System*

### **Overview**

This architecture diagram represents the **Campus Event Management System**, which allows **students**, **organizers**, and **administrators** to interact through a unified platform. The system is divided into **Frontend**, **Backend**, **Database**, and **External Services** layers, all communicating through a REST API.

### **1. Users (Top Layer)**

There are **three primary user roles** in the system:

* **Student:**
  Students browse, search, and register for events. They can save events to their calendar, claim tickets, and receive QR-coded digital passes.

* **Organizer:**
  Organizers create and manage events. They can view event analytics (tickets issued, attendance rates, capacity) and validate tickets during entry.

* **Admin:**
  Administrators moderate the system. They approve organizer accounts, manage event listings, and oversee platform analytics and policies.

### **2. Frontend Layer (Blue Box)**

This is the **user interface** of the system, built using **React.js** and styled with tools like **Tailwind CSS** or CSS modules.
It ensures an intuitive and responsive design accessible from both desktop and mobile devices.

#### Components:

* **Event Discovery:**
  Enables students to search and filter events by date, category, or organization.

* **Event Creation:**
  Allows organizers to input event details (title, date, time, location, ticket type, etc.) and publish events.

* **Dashboard & Moderate:**
  Provides admins with controls to approve organizers, manage events, and monitor system activity.

#### Communication:

* The frontend communicates with the backend via **REST API** calls (HTTP requests).

### **3. Backend Layer (Green Box)**

The **backend** handles business logic, data processing, and system operations. It is implemented using **Node.js (Express)** and connects directly with MongoDB.

#### Core Modules:

* **Event Management:**
  Handles CRUD operations for event data — creation, modification, and deletion.

* **Validation:**
  Manages ticket verification, input validation, and QR code validation logic.

* **Analytics:**
  Gathers and computes statistics for events, such as tickets sold, attendance trends, and user engagement.

* **Email Service:**
  Sends automatic email confirmations and QR ticket attachments using **Nodemailer**.

### **4. Database Layer (Yellow Box)**

The system uses **MongoDB** as its database.

#### Functions:

* Stores event information, user profiles, ticket data, and organizer details.
* Maintains relationships between users, events, and transactions.
* Connects to the backend via the **MongoDB connection** driver.

### **5. External Services**

* **QR Code Service:**
  A microservice or integrated module responsible for generating and verifying QR codes for tickets.
  It interacts with both the **Validation module** and **MongoDB** to confirm event and ticket authenticity.

### **6. Overall Flow**

1. **User Interaction:**
   Students, organizers, or admins access the frontend interface.
2. **API Request:**
   The frontend sends REST API calls to the backend.
3. **Backend Processing:**
   Backend modules (Event Management, Validation, etc.) handle the logic.
4. **Database Operations:**
   MongoDB stores or retrieves data as requested.
5. **External Service Integration:**
   The QR Code Service generates or validates ticket codes.
6. **Email Notification:**
   The Email Service sends confirmation and ticket details.
7. **Response Returned:**
   The backend sends processed data or success messages back to the frontend.

### **7. Key Strengths**

✅ Modular design — each component can be developed and tested independently.
✅ Scalability — MongoDB supports dynamic event and user data growth.
✅ Security — Validation ensures data integrity and safe ticketing.
✅ Extensibility — Future features like payment integration and analytics dashboards can be added easily.
