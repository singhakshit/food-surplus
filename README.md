# SurplusShare — Food Redistribution Platform

> A full-stack web platform connecting food donors (restaurants, supermarkets, caterers) directly with local shelters and food banks to cut down food waste and combat hunger.

---

## Table of Contents
- [Overview](#overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Key Features](#key-features)
- [System Workflow](#system-workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database & Geospatial Setup](#database--geospatial-setup)
- [API Reference](#api-reference)
- [Resilience & Performance](#resilience--performance)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Every day, vast quantities of edible food are discarded while nearby community kitchens and homeless shelters struggle to meet daily nutritional needs. **SurplusShare** provides a real-time, location-aware bridge between donors with immediate surplus and authorized recipient organizations.

By leveraging **PostGIS spatial indexing** and **WebSocket-based event streaming**, the platform guarantees sub-second donation notifications to recipient shelters within a verified travel radius, closing the collection window before perishables spoil.

---

## Architecture & Tech Stack

### Frontend
- **Framework:** React.js (`.jsx`)
- **Routing & State:** React Context API (`contexts/`) & modular service layer (`services/`)
- **Client Library:** `@supabase/supabase-js` (`lib/supabaseClient.js`)
- **UI & Styling:** Tailwind CSS / CSS Modules with reusable components (`components/ui/`)
- **Real-Time Engine:** Socket.io-client / Supabase Realtime channels

### Backend
- **Runtime & Framework:** Node.js, Express.js
- **Real-Time Engine:** Socket.io (geospatial room-based broadcasts)
- **Authentication & Security:** JWT (JSON Web Tokens), bcrypt, Supabase Auth
- **Middleware:** Express rate-limiting, CORS, error handlers

### Database & Geodata
- **Relational DB:** PostgreSQL (via Supabase)
- **Spatial Extension:** PostGIS (`ST_DWithin`, `ST_MakePoint`, `ST_Distance`) for high-speed radial queries

---

## Key Features

- **PostGIS-Powered Proximity Matching:** Donors list food packages with pickup deadlines; queries return nearby verified shelters sorted by spherical travel distance.
- **Real-Time Claim Broadcasting:** Powered by Socket.io. When a shelter claims a batch, all connected recipient dashboards update immediately to prevent double-claims.
- **Resilient Auth & Verification:** Secure role-based registration and access via Supabase Auth with custom fallback handling to mitigate rate limits.
- **Perishable Expiry Countdown:** Listings track safe-consumption windows so expired packages automatically delist from recipient feeds.

---

## System Workflow

```text
[ Donor ] (Post Surplus Listing + Geolocation + Expiry)
    │
    ▼
[ Express API ] ──► Stores in [ PostgreSQL + PostGIS ]
    │
    ├─► Calculates nearby recipient shelters (`ST_DWithin`)
    │
    ▼
[ Socket.io Server ] ──► Emits `donation:available` event to regional room
    │
    ▼
[ Recipient Dashboard (React) ] ──► Claims listing
    │
    ▼
[ Atomic Transaction ] ──► Status updated to `CLAIMED`
    │
    └─► Real-time broadcast updates all connected dashboards
```

---

## Project Structure

```text
food-redistribution/
├── backend/
│   ├── src/
│   │   ├── config/              # Supabase client & DB pool configs
│   │   ├── controllers/         # Donation, auth, and claim controllers
│   │   ├── middleware/          # JWT auth, validation, rate-limiting
│   │   ├── routes/              # Express API route declarations
│   │   ├── sockets/             # Socket.io event and room handlers
│   │   └── server.js            # Express application entrypoint
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static assets and icons
│   ├── src/
│   │   ├── assets/              # Images, SVGs, and brand media
│   │   ├── components/          # Reusable application components
│   │   │   ├── ui/              # Primitive buttons, modals, badges
│   │   │   ├── Dashboard...     # Dashboard widgets and navigation
│   │   │   ├── donor-form...    # Food listing submission form
│   │   │   ├── footer.jsx       # Global footer
│   │   │   ├── header.jsx       # Global navigation bar
│   │   │   ├── hero-sectio...   # Landing page hero component
│   │   │   ├── impact-stat...   # Food rescue metrics & counter
│   │   │   └── portals-sect...  # Donor & Recipient role switcher
│   │   ├── contexts/            # Global React Context providers (Auth, Socket)
│   │   ├── lib/
│   │   │   ├── supabaseClie...  # Supabase client initialization
│   │   │   └── utils.jsx        # Helper functions & formatters
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Authentication (Donor / Shelter)
│   │   │   └── RecipientDa...   # Shelter discovery & claim dashboard
│   │   ├── services/            # API client and real-time event services
│   │   ├── App.css
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **PostgreSQL**: `v14+` with the **PostGIS** extension (or active Supabase project)
- **npm** or **yarn**

---

### Environment Configuration

#### 1. Backend (`/backend/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL / Supabase
DATABASE_URL=postgresql://postgres:<password>@<host>:5432/<dbname>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_smtp_api_key
EMAIL_FROM=notifications@surplusshare.org
```

#### 2. Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Backend Setup

```bash
cd backend
npm install

# Start development server
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```

The application will run at `http://localhost:5173`.

---

### Database & Geospatial Setup

Enable PostGIS in your PostgreSQL instance (or via Supabase SQL Editor):

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Example: Donations table with spatial geometry
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quantity_kg NUMERIC(6, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'CLAIMED', 'COLLECTED', 'EXPIRED'
    location GEOMETRY(Point, 4326) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Geospatial GIST index for fast radial queries
CREATE INDEX idx_donations_location ON donations USING GIST(location);
```

**Radial Search Query (Find donations within `X` meters of shelter):**
```sql
SELECT id, title, quantity_kg, expires_at,
       ST_Distance(location::geography, ST_MakePoint($shelter_lng, $shelter_lat)::geography) / 1000 AS distance_km
FROM donations
WHERE status = 'AVAILABLE'
  AND ST_DWithin(location::geography, ST_MakePoint($shelter_lng, $shelter_lat)::geography, $radius_meters)
ORDER BY distance_km ASC;
```

---

## API Reference

### Authentication & Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register donor or shelter | Public |
| `POST` | `/api/auth/login` | Authenticate user & return token | Public |

### Donations
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/donations/nearby?lat=...&lng=...&radius=10000` | Fetch available donations within radius | Authenticated |
| `POST` | `/api/donations` | Post new food donation batch | Donor |
| `PUT` | `/api/donations/:id/claim` | Atomic claim transaction | Recipient |
| `PUT` | `/api/donations/:id/complete` | Confirm physical handoff | Donor / Recipient |

---

## Resilience & Performance

1. **Geospatial Indexing:** Uses PostGIS GiST spatial indexing on point coordinates, guaranteeing sub-second response times on radial distance searches.
2. **Atomic Status Mutation:** Prevents race conditions during simultaneous claims through transactional status updates (`AVAILABLE` -> `CLAIMED`).
3. **Resilient Auth Pipeline:** Incorporates rate-governed dispatching and fallback handling for authentication tokens and transactional verification emails.

---

## Roadmap

- [ ] Implement Redis-backed queue and virtual waiting room for high-concurrency surge events.
- [ ] Automated route optimization for multi-stop volunteer pickups.
- [ ] Donor impact analytics dashboard (calculated carbon offset & total meals provided).
- [ ] Offline-first mobile companion app with QR handoff confirmation.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'Add NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## License

Distributed under the **MIT License**. See `LICENSE` for details.