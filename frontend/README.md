<p align="center">
  <img src="https://github.com/user-attachments/assets/e2adae83-27ed-4f58-bdbf-8ef696ce0342" width="200" alt="LamHyStore Logo" />
</p>

# LamHyStore - Frontend Application

https://github.com/user-attachments/assets/96b939dd-3320-4f0f-8de3-d2f0b074a334

This is the customer-facing e-commerce storefront and admin dashboard for LamHyStore, built using **Next.js**.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **State Management:** Redux Toolkit
- **Styling:** React Bootstrap / Custom CSS
- **Forms:** React Hook Form
- **Formatting:** Prettier

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file (`.env.local`):
   ```env
   # API URL mapping to your .NET backend
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Frontend Domain
   NEXT_PUBLIC_DOMAIN_URL=http://localhost:3000
   
   # Delivery APIs
   GHTK_API_TOKEN=your_token_here
   ```

### Running the Development Server

Start the local development server with Hot-Module Replacement:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Contains the App Router pages (`(ecommerce)` for customer views, `admin` for the admin dashboard).
- `src/components`: Reusable UI components (e.g., Headers, Footers, Product Cards).
- `src/slices`: Redux slices for global state management (Authentication, Cart, Orders).
- `src/models`: TypeScript interfaces for the data structures.
- `src/utils`: Helper functions, hooks, and API endpoint maps (`api-links.ts`).

