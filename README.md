# Abu Ahmed Collection — Royal Saree E-Commerce Platform

A luxury, high-conversion Bangladeshi Saree E-Commerce platform and administrative management system.

**Brand Identity**: Abu Ahmed Collection (`#0B0B0B` Royal Black & `#D4AF37` Antique Gold branding).  
**Tech Stack**: React (Vite + Tailwind CSS + Lucide Icons) & Node.js (Express + Mongoose + Multer + Nodemailer).

---

## 🌟 Key Features

### 1. Customer Web Storefront (`client/`)
- **Royal Design**: Inspired by heritage Dhakai Jamdani and the Abu Ahmed Collection crown emblem.
- **Dual-Image Hover Interaction**: Automatically swaps to the secondary saree drape angle on hover.
- **Product Catalog & Filters**: Filter by saree category (Jamdani, Silk, Katan, Cotton, Muslin) and price.
- **Product Detail Page**: Multi-thumbnail zoom gallery, blouse piece indicator, and fabric details.
- **Dual Ordering System**:
  - **Slide-out Bag Drawer**: Live subtotal and dynamic free-delivery progress goal.
  - **Express 1-Click "Buy Now"**: Place an order in under 30 seconds with Cash on Delivery (COD) or mobile banking.
- **Customer Accounts & Profile**:
  - Registration & Login with **password show/hide toggle**.
  - Customer Profile dashboard with delivery address settings and full **"My Orders"** history.
- **Dedicated Public Order Tracking (`/track-order`)**:
  - Real-time step-by-step order progress timeline:
    `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`

### 2. Admin Management Dashboard (`/admin`)
- **Secure Authentication**: JWT-based login (`admin@abuahmedcollection.com`).
- **Overview & Analytics**: Live revenue, order counts, pending orders, and out-of-stock saree counts.
- **Orders Pipeline**: View full customer details, update order status with timestamped notes, and generate one-click WhatsApp invoices.
- **Product Management**: Create, edit, and delete sarees with multi-image uploads (Multer) and stock toggle.
- **Dynamic Delivery Charges**: Edit Inside Dhaka, Outside Dhaka fees, and free-shipping thresholds dynamically without modifying code.
- **Payment Methods Manager**: Create, edit, and toggle payment options (COD, bKash, Nagad, Rocket, Bank Transfer).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)

### Setup & Installation

```bash
# 1. Install Server Dependencies
cd server
npm install

# 2. Seed Database with Initial Sarees & Admin Credentials
npm run seed

# 3. Start Backend Server (runs on http://localhost:5000)
npm run dev

# 4. In a separate terminal, install and run Frontend
cd ../client
npm install
npm run dev
# Accessible at http://localhost:3000
```

### Default Credentials
- **Admin Portal**: `http://localhost:3000/admin`
  - Email: `admin@abuahmedcollection.com`
  - Password: `admin12345`
- **Demo Customer Account**: `http://localhost:3000/login`
  - Email: `customer@example.com`
  - Password: `customer123`
