# Astro Motors (CRM) - Advanced Car Rental Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Deployment-Docker-blue)](https://www.docker.com/)

A comprehensive, full-stack open-source solution for managing car rental fleets, customer relationships, and business operations. Astro Motors (CRM) integrates real-time fleet tracking, rental flows, accounting, and workshop management into a single, high-performance platform.

## Key Features

- **Fleet Management:** Complete vehicle lifecycle tracking, maintenance logs, and real-time status updates.
- **Customer CRM:** Comprehensive profiles with rental history, payment records, and personalized management.
- **Rental Flow Operations:** End-to-end booking management, automated invoice generation, and status tracking.
- **Accounting & POS:** Integrated point-of-sale for services, real-time financial tracking, and detailed reporting.
- **Inventory & Workshop:** Manage spare parts inventory and schedule workshop appointments for fleet maintenance.
- **Analytics Dashboard:** Data-driven insights into business performance and operational efficiency.


## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Security:** JWT Authentication, Helmet (Security Headers), Express Rate Limit, Mongo Sanitize.
- **Utilities:** Multer (File Upload), Cloudinary (Image Hosting), Nodemailer (Emails), Node-cron (Scheduled Tasks).

## Architecture Diagram 
<img width="1408" height="768" alt="architecture_diagram" src="https://github.com/user-attachments/assets/be39c985-d131-476d-aa03-43764c209b9e" />

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
Code released under the MIT License.
