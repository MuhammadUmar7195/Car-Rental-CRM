# Astro Motors (CRM)

A comprehensive, full-stack solution for managing car rental fleets, customer relationships, and business operations. This system integrates real-time fleet tracking, rental flows, accounting, and workshop management into a single platform.


## Project Scope & Overview

The **Astro Motors (CRM)** is designed to streamline the operations of car rental businesses. It provides a centralized dashboard for administrators to oversee the entire lifecycle of a rental—from fleet acquisition and maintenance to customer booking, payment processing, and service history.

### Key Modules
- **Fleet Management:** Track vehicle status, maintenance history, and detailed specifications.
- **Customer Management:** Maintain comprehensive customer profiles, including rental history and payment records.
- **Rental Operations:** Manage the entire rental flow, including bookings, status tracking, and automated invoice generation.
- **Accounting & POS:** Real-time point-of-sale for services, payment tracking, and financial reporting.
- **Inventory & Service:** Manage spare parts inventory and workshop appointments for fleet maintenance.
- **Reporting & Analytics:** Integrated logging and history tracking for all system activities.


## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Security:** JWT Authentication, Helmet (Security Headers), Express Rate Limit, Mongo Sanitize.
- **Utilities:** Multer (File Upload), Cloudinary (Image Hosting), Nodemailer (Emails), Node-cron (Scheduled Tasks).


## Getting Started

### Prerequisites
- **Docker** and **Docker Compose** installed on your system.
- Alternatively, **Node.js** (v18+) and **npm** for manual setup.

### Option 1: Using Docker (Recommended)
This will spin up both the client and server containers automatically.

1.  Clone the repository.
2.  Navigate to the root folder.
3.  Run the following command:
    ```bash
    docker-compose up --build
    ```
4.  Access the application:
    - **Frontend:** `http://localhost:4000`
    - **Backend API:** `http://localhost:8000`

### Option 2: Manual Setup (Development)
To run the services separately on your local machine:

#### 1. Server Setup
```bash
cd server
npm install
npm run dev
```
*Note: Ensure your `.env` file is configured with your MongoDB URI and API keys.*

#### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
*The client will be available at `http://localhost:5173` (or your Vite default).*



## Logging & Monitoring
The system includes a custom logging middleware.
- **Console Logs:** Real-time request/response tracking with color-coded status.
- **File Logs:** Persistent logs are stored in `server/.server.log` and are automatically rotated every 10 days via a cron job.


## License
No license.
