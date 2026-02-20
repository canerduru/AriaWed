# AriaWed - Technical Architecture

**Platform Overview:** AriaWed is an end-to-end wedding planning platform featuring vendor bidding, separate guest list management, and Aria - an AI wedding assistant.

## Phase 3 Update: Comprehensive Budget Management System

Implementation of advanced financial tracking tools designed for the Turkish wedding market context.

### 1. Database Schema Additions

```prisma
// New Models for Budgeting

model BudgetCategory {
  id        String   @id @default(uuid())
  weddingId String
  wedding   Wedding  @relation(fields: [weddingId], references: [id])
  name      String   // e.g., "Venue (Mekan)"
  allocated Int      // Budgeted amount in cents/lowest currency unit
  spent     Int      // Actual spent amount
  notes     String?
  isPaid    Boolean  @default(false)
}

model VendorPayment {
  id        String   @id @default(uuid())
  weddingId String
  wedding   Wedding  @relation(fields: [weddingId], references: [id])
  vendorId  String?  // Optional link to actual vendor user
  vendorName String  // Text fallback if vendor not on platform
  category  String
  amount    Int
  dueDate   DateTime
  status    PaymentStatus @default(PENDING)
  type      PaymentType   @default(DEPOSIT)
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
}

enum PaymentType {
  DEPOSIT
  FINAL
  INSTALLMENT
}
```

### 2. API Endpoints for Budget Module

*   `GET /api/budget/:weddingId` - Returns comprehensive dashboard data (Categories, Totals, Alerts).
*   `PUT /api/budget/category/:id` - Update allocation for a specific category.
*   `POST /api/budget/payment` - Log a new payment.
*   `GET /api/budget/scenario` - Calculate hypothetical costs based on parameters (guest count).
    *   *Query Params:* `currentGuests`, `newGuests`

### 3. Features Implemented

*   **Market Averages:** Auto-population of budget categories based on standard Turkish wedding cost percentages (e.g., Venue ~22%).
*   **Real-time Dashboard:** Visuals using Recharts (Bar/Pie) to show planned vs. actual.
*   **What-If Engine:** Calculates impact of guest count changes on variable costs (Catering, Stationery).
*   **Alert System:** Frontend notifications for categories exceeding 90% or 100% of allocation.
*   **Hidden Costs:** Watchlist for often forgotten expenses (Service charges, vendor meals).

## Phase 2 Update: Authentication & Onboarding Architecture
[... Existing Phase 2 content ...]

## 1. Tech Stack Recommendation (Phase 1)
[... Existing Phase 1 content ...]
