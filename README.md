# 📈 Roti's Conta - Simplified Accountancy

> Open-source accounting management platform for Romanian PFA businesses

[![Nuxt JS](https://img.shields.io/badge/Nuxt-002E3B?style=flat-square&logo=nuxt&logoColor=#00DC82)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=flat-square&logo=vuedotjs&logoColor=%234FC08D)](https://vuejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

<img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767290063/Copy_of_Untitled_Design_xgawf7.png" alt="Roti's Conta Banner" width="100%">

## Overview

**Roti's Conta** is a web application designed to simplify accounting management for independent professionals (PFA) in Romania. It provides essential tools for fiscal record-keeping, document management, and automatic tax calculations compliant with Romanian legislation.

**Built for:** Personal use, but open-sourced for the Romanian PFA community.

## Features

### Core Functionality

- **Income & Expense Register** - Complete tracking with monthly/annual reports
- **In/Out Document Register** - Correspondence and official document management
- **Inventory Register** - Asset tracking and valuation
- **Tax Calculator** - Automatic calculation of CAS (25%), CASS (10%), and Income Tax (10%) based on legal thresholds
- **Document Management** - Upload and organize contracts, invoices, declarations, and miscellaneous documents
- **Dashboard** - Visual statistics and quick access to common operations

### Technical Highlights

- JWT-based authentication with httpOnly cookies
- Secure file storage with Vercel Blob
- Input validation using Zod schemas
- Data sanitization to prevent NoSQL injection
- CSV export for all registers

## Preview

<div align="center">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288749/rotis-conta.vercel.app_registre_incasari-plati_krbkw7.png" alt="Dashboard Page" width="49%">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288749/rotis-conta.vercel.app_calculator_2_zz1okp.png" alt="Register Page" width="49%">
</div>

<div align="center">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288749/rotis-conta.vercel.app_calculator_t1xtsz.png" alt="Calculator Page" width="49%">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288748/rotis-conta.vercel.app_facturi_emise_uoxvqm.png" alt="Invoices Page" width="49%">
</div>

## Tech Stack

**Frontend:**

- Nuxt.js 4
- TypeScript
- TailwindCSS
- Pinia (state management)

**Backend:**

- Nuxt server routes
- MongoDB with Mongoose ODM
- Vercel Blob (file storage)

## Prerequisites

- Node.js 18+
- MongoDB 5.0+
- pnpm (recommended) or npm

## Installation

### Local Development

```bash
# Clone repository
git clone https://github.com/Rotis-Web/rotis-conta.git
cd rotis-conta

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Docker Deployment

```bash
# Development environment
docker-compose --profile dev up

# Production environment
docker-compose --profile prod up -d
```

**Services:**

- **App (dev):** `http://localhost:3000` + Hot reload on `http://localhost:24678`
- **App (prod):** `http://localhost:3000`
- **MongoDB:** `localhost:27017`
- **Mongo Express:** `http://localhost:8081` (dev/tools profile)

## Environment Configuration

Create a `.env` file in the project root:

```bash
# Database
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/rotis-conta_app?authSource=admin

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_min_32_characters

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# API
API_BASE_URL="http://localhost:3000/api"

# Environment
NODE_ENV=development
```

**For production:** Use strong secrets and secure database credentials.

## Project Structure

```
rotis-conta/
├── server/
│   ├── api/              # API routes
│   ├── models/           # MongoDB schemas
│   ├── middleware/       # Auth & validation
│   ├── plugins/          # Database connection
│   └── utils/            # JWT, validation helpers
├── app/
│   ├── components/           # Vue components
│   ├── composables/          # Reusable logic
│   ├── middleware/           # Auth & guest handling
│   ├── layouts/              # Application layouts
│   ├── pages/                # Application routes
├── stores/               # Pinia state management
├── types/                # TypeScript definitions
├── Dockerfile            # Multi-stage build
└── docker-compose.yml    # Development & production
```

## Mobile Responsive Design

<div align="center">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288748/rotis-conta.vercel.app_facturi_emise_iPhone_12_Pro_io1avp.png" alt="Mobile Dashboard" width="32%">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288748/rotis-conta.vercel.app_facturi_emise_iPhone_12_Pro_2_e03953.png" alt="Mobile Register" width="32%">
  <img src="https://res.cloudinary.com/dqyq1oiwi/image/upload/v1767288748/rotis-conta.vercel.app_facturi_emise_iPhone_12_Pro_1_wxnxa2.png" alt="Mobile Invoices" width="32%">
</div>

## Usage

1. **Register/Login** - Create account with email and password
2. **Configure PFA Data** - Settings → PFA Data (name, CUI, bank details)
3. **Add Entries** - Navigate to registers and add income/expense records
4. **Calculate Taxes** - Calculator → Select year → Calculate from registry or manual input
5. **Upload Documents** - Documents section → Select category → Upload files
6. **Export Data** - Each register has CSV export functionality

## Security

- Passwords hashed via bcrypt
- JWT access tokens (15min expiry)
- Input validation and sanitization on all routes
- Rate limiting on every endpoint
- CSP headers and XSS protection
- **No browser storage APIs** - All state managed in-memory or server-side

## Disclaimer

This software is provided for informational purposes. Tax calculations are estimates based on Romanian legislation at the time of development. **Always consult with a certified accountant** for official tax obligations and declarations.

---

<div align="center">
  <p>Built to simplify accounting management</p>
  
  [![Nuxt JS](https://img.shields.io/badge/Nuxt-002E3B?style=flat-square&logo=nuxt&logoColor=#00DC82)](https://nuxt.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=flat-square&logo=vuedotjs&logoColor=%234FC08D)](https://vuejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
  
  <p><strong>License:</strong> MIT | <strong>Developer:</strong> Alexandru Rotar</p>
</div>
