# LamHyStore - E-commerce Kiotviet Integration Platform

https://github.com/user-attachments/assets/96b939dd-3320-4f0f-8de3-d2f0b074a334

LamHyStore is an e-commerce website that connects directly to KiotViet. It automatically updates your products, orders, and store data in real-time.

This repository is structured as a **Monorepo** containing three core components:

1. **Backend API (Root)**: An ASP.NET Core API built with Clean Architecture.
2. **[Frontend Application](./frontend)**: A Next.js application for customers and admins.
3. **[Chrome Extension](./chrome-extension)**: A browser extension to streamline syncing products from KiotViet.

<p align="center">
  <img src="https://github.com/user-attachments/assets/e2adae83-27ed-4f58-bdbf-8ef696ce0342" alt="LamHyStore Logo" />
</p>

---

## Backend API (ASP.NET Core)

The root of this repository contains the C# backend API.

### Features & Integrations
- **KiotViet POS:** Automatically connects to KiotViet to sync products, store branches, and orders.
- **VNPay Payments:** Allows customers to pay securely online using VNPay.
- **Google Sheets Export:** Automatically saves order and product data straight into Google Sheets.
- **Email Notifications:** Automatically sends out email receipts and alerts to users.
- **Livestream Shopping:** Built-in features to manage shopping carts and products during a livestream.
- **Secure Authentication:** JWT-based secure login.

### Architecture (Clean Architecture)
- `LamHyStore.Entities`: Basic data models.
- `LamHyStore.Repository`: Database reading and writing (Entity Framework Core / SQL Server).
- `LamHyStore.Shared`: Data transfer objects (DTOs).
- `LamHyStore.Service`: Core business rules.
- `LamHyStore.Presentation`: Web API Controllers.
- **External Services:** KioVietService, GoogleSheetService, VNpayService, EmailService.

---

## Frontend Application (Next.js)

The customer-facing website and admin dashboard are located in the `frontend` directory. 

👉 **[Read the Frontend Documentation here](./frontend/README.md)**

---

## Chrome Extension (KiotViet Sync)

A productivity extension for store administrators to inject KiotViet products directly into the website's sections.

👉 **[Read the Chrome Extension Documentation here](./chrome-extension/README.md)**
