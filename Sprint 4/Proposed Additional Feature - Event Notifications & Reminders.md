## Proposed Additional Feature: **Event Notifications & Reminders**

### **Feature Description**

Allow users (students and organizers) to **receive real-time notifications** or **email reminders** about upcoming events they registered for or created.
This enhances engagement and user satisfaction, reducing missed events and helping organizers track attendance.

## User Stories

### **User Story 1: Student Event Reminder**

**As a student**, I want to receive an email reminder 24 hours before an event I registered for so that I don’t forget to attend.

* **Acceptance Criteria:**

  * The system sends an email reminder with the event’s title, date/time, and location.
  * The email is sent exactly 24 hours before the event’s start time.
  * The student can unsubscribe from event reminders.

### **User Story 2: Organizer Event Updates**

**As an organizer**, I want to send event updates (like venue change or cancellation) to all registered attendees so that they stay informed.

* **Acceptance Criteria:**

  * The organizer can send updates through their dashboard.
  * All attendees receive the notification within 1 minute of sending.
  * The notification includes event name and change details.

### **User Story 3: Admin Oversight on Notifications**

**As an admin**, I want to view logs of all notifications sent through the system so that I can ensure proper communication and detect spam or errors.

* **Acceptance Criteria:**

  * Admin dashboard shows a list of sent notifications.
  * Each log entry includes sender (organizer), recipient count, and timestamp.

## Implementation Tasks

| # | Task                       | Description                                                                                    | Assigned To | Status    |
| - | -------------------------- | ---------------------------------------------------------------------------------------------- | ----------- | --------- |
| 1 | Setup Notification Schema  | Create `Notification` model with `type`, `message`, `recipientId`, `eventId`, and `timestamp`. | Backend     |  Pending |
| 2 | Integrate Nodemailer       | Configure SMTP or use existing mail setup to send email reminders.                             | Backend     |  Pending |
| 3 | Schedule Reminders         | Use Node cron job (`node-cron`) to trigger reminders 24 hours before event time.               | Backend     |  Pending |
| 4 | Organizer Dashboard Button | Add UI option to “Send Update” for an event.                                                   | Frontend    |  Pending |
| 5 | Admin Logs Page            | Display all notifications with filters (by date or sender).                                    | Frontend    |  Pending |
| 6 | Testing                    | Write Jest + Supertest integration tests for reminder scheduling and notification APIs.        | QA          |  Pending |

## Risk Analysis

| Risk                                 | Impact | Probability | Mitigation                                               |
| ------------------------------------ | ------ | ----------- | -------------------------------------------------------- |
| Cron jobs fail to trigger            | High   | Medium      | Use GitHub Actions or hosted schedulers for reliability. |
| Email delivery delays                | Medium | Medium      | Implement retry logic and logs.                          |
| Users overwhelmed with notifications | Low    | Low         | Add user control (unsubscribe toggle).                   |

## Story Points & Priority

| User Story              | Story Points | Priority | Rationale                         |
| ----------------------- | ------------ | -------- | --------------------------------- |
| Student Reminder Email  | 5            | High     | Improves core student experience. |
| Organizer Event Updates | 3            | Medium   | Useful but not critical for MVP.  |
| Admin Notification Logs | 2            | Medium   | Enhances platform transparency.   |

**Total:** 10 Story Points
**Sprint 4 Goal:** Finalize this feature and ensure all notifications are reliable and test-covered.

## Sprint 4 Milestone

> **Milestone:** “Notification System Completion and Integration”
> * Finish implementation of the event notification and reminder feature.
> * Conduct end-to-end testing (organizer → student → admin log).
> * Prepare deployment-ready build demonstrating full system functionality (event creation → ticketing → reminders).
