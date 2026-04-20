# 🇩🇪 Germany Assist

**Germany Assist** is a high-performance platform designed to streamline relocation and service management. This monolithic repository integrates a **React (Vite)** frontend with an **Express (Node.js)** backend, supported by a fully containerized infrastructure.

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Sequelize ORM)
- **Caching:** Redis (BullMQ/Caching)
- **Cloud Simulation:** LocalStack (AWS S3)
- **Orchestration:** Docker Compose

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher recommended)
- **Docker & Docker Compose**
- **npm** (v9 or higher)

---

## 🚀 Getting Started

### 1. Installation

From the root directory, install dependencies for both the frontend and backend simultaneously:

```bash
npm run install-all
```

### 2. Infrastructure Setup

Start the required persistent services (PostgreSQL, Redis, and LocalStack) in detached mode:c

```bash
docker compose up -d
```

- ### Exposed services
  - PostgreSQL: 5432
  - Redis: 6378 (Auth: redis123)
  - LocalStack (S3): 4565

### 3. Environment Configuration

Create a .env file in both the client/ and server/ directories

**please make sure you read the env files examples first**.

### 4. Database setup

inside the server folder run

```bash
npm run dbInit
```

this will create the tables and the required minimum data please note that this is temporary and will be changed.

### 5. Future Steps

- Fully CI/CD deployment for the new repo.
- Enhanced scripts and testing for the new repo.

### 6. Notes

- Some Features like stripe requires manual installation and configuration for stripe cli.
