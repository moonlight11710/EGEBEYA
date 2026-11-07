# GlobalImport Hub | Import-on-Demand E-Commerce & Sourcing Platform

A full-stack web application built with **Node.js + Express.js REST API** and **React (Vite) + Tailwind CSS** designed for an **Import-on-Demand** business selling **Electronics** (MacBooks, iPhones, Gaming PCs) and **Clothing & Raw Materials** (Turkish Cotton rolls, Selvedge Denim by the meter, wholesale hoodie blanks).

---

## 🚀 Key Features

### 1. Hybrid Pre-Order & Sourcing Workflow
- **Catalog Pre-Orders:** Browse products with category-specific attributes (Condition, RAM, Storage for Electronics; Unit Type, Minimum Order Quantity (MOQ), and Material Composition for Raw Materials).
- **Automated MOQ Enforcement:** The platform prevents customers from requesting quantities below supplier minimum order quantities (e.g. 2 rolls or 10 meters).
- **Custom Sourcing Requests (`/custom-request`):** Customers looking for an unlisted laptop configuration, phone, or bulk textile can submit a custom sourcing inquiry.

### 2. Database + Instant Messaging Handoff
- Every pre-order or custom sourcing request is saved in the database with a unique Reference Code (`IMP-XXXX` or `REQ-XXXX`).
- An immediate post-submit screen provides **1-click WhatsApp and Telegram action buttons** that pre-fill the reference code, item details, specs, customer name, phone, and delivery destination so the store owner can confirm current forex rates, deposit terms, and delivery timelines.

### 3. Real-Time Shipment Tracker (`/track`)
- Track any order (`IMP-XXXX`) or custom request (`REQ-XXXX`).
- Visual **5-Step progress timeline** indicating order progress:
  1. Pre-Order Received (`pending_confirmation`)
  2. Deposit Paid & Sourced (`deposit_paid`)
  3. In International Freight (`in_transit`)
  4. Arrived at Local Customs / Hub (`arrived`)
  5. Delivered / Handed Over (`delivered`)

### 4. Zero-Crash Data Layer Fallback
- If `MONGODB_URI` is not provided in `.env`, the Express server automatically falls back to an **In-Memory JSON Store** pre-seeded with 6 realistic products, 3 sample orders, 2 custom requests, and store settings.
- If `MONGODB_URI` is provided, Mongoose connects and seeds the MongoDB collections automatically.

### 5. Mobile-First Admin Dashboard (`/admin`)
- **Login Gate:** Secure password authentication (default: `admin123`).
- **Overview Cards:** Total products, pending pre-orders, orders in transit, and custom inquiries.
- **Product Manager:** Add/edit products with dynamic attribute forms (switches between Electronics specs and Raw Material specs with MOQ).
- **Order Manager:** Change order statuses via dropdown and tap to Call (`tel:`) or WhatsApp chat (`wa.me`) directly with the buyer.
- **Custom Requests:** Review inquiries and quote prices.
- **Settings Tab:** Edit store WhatsApp, Telegram username, currency (`ETB`), and store name.

---

## 🛠️ Technology Stack

- **Backend (`/server`):**
  - Node.js & Express.js
  - Mongoose & MongoDB with in-memory zero-crash fallback
  - CORS, Dotenv, modular controller-route architecture
- **Frontend (`/client`):**
  - React 19 (Vite)
  - React Router DOM v7
  - Tailwind CSS + Lucide React Icons
  - Mobile-responsive navigation and modals

---

## 🏁 Quick Start Instructions

### 1. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```
*(Or navigate into `/server` and `/client` and run `npm install` in each).*

### 1. Start Both Backend & Frontend Simultaneously (Recommended)
From the root project directory:
```bash
npm run dev
```
*(Runs both the Express backend on `http://localhost:5000` and the React Vite client on `http://localhost:3000` concurrently with live proxying).*

### 2. Or Start Separately
- **Backend:** `cd server && npm run dev` (starts on port 5000)
- **Frontend:** `cd client && npm run dev` (starts on port 3000)

### 3. Light & Dark Mode
- Full system with theme persistence in `localStorage`.
- Toggle between Light and Dark mode using the Sun/Moon button on the navigation bar.

---

## 🧪 Testing the API
To run the automated backend test suite (testing seed data, MOQ enforcement, order creation, tracking, and admin auth):
```bash
cd server
npm test
```

---

## 🔑 Default Credentials & Test Data

- **Admin Password:** `admin123` (configurable via `ADMIN_PASSWORD` in `.env`)
- **Sample Tracking Codes for Quick Testing:**
  - `IMP-1024` — iPhone 15 Pro Max (In Transit)
  - `IMP-1025` — Premium Turkish Cotton Fabric (Deposit Paid)
  - `IMP-1026` — MacBook Pro M3 (Pending Confirmation)
  - `REQ-5012` — Framework Laptop 16 (Quoted)
  - `REQ-5013` — Organic Bamboo Silk Fabric (New)

