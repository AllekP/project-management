# White Label Development Operations Platform

A modern project management and development operations platform purpose-built for software development companies managing multiple white-label applications and clients.

## Features

- **Multi-Organization Isolation:** Secure data scoping per organization.
- **Agile Project Management:** Kanban boards, issue tracking, and subtasks.
- **Sprint Planning:** Manage active sprints and backlogs.
- **Release Management:** Track software versions across projects.
- **Time & Cost Tracking:** Automated cost calculation based on project hourly rates.
- **DevOps Integration:** Generic webhook receiver for GitHub/GitLab events.
- **Time-Tracking CLI:** A dedicated tool (`wlo`) to track active coding time directly from your IDE.

## Tech Stack

- **Backend:** NestJS, Prisma ORM, MySQL, GraphQL/REST.
- **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui, TanStack Query, Zustand.
- **CLI:** Node.js, Commander, Chokidar.
- **Infrastructure:** Docker, Docker Compose.

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker & Docker Compose
- MySQL (if running locally without Docker)

### Local Development Setup

1. **Install Dependencies:**
   Run from the root directory:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Environment:**
   - Create `.env` in `backend/` with `DATABASE_URL` and `JWT_SECRET`.
   - Create `.env` in `frontend/` with `NEXT_PUBLIC_API_URL=http://localhost:3001`.

3. **Database Migration:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start Development Servers:**
   - **Backend:** `cd backend && npm run start:dev`
   - **Frontend:** `cd frontend && npm run dev`

### Running with Docker

Use the root-level `docker-compose.yml` to spin up the entire stack:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- MySQL: `localhost:3306`

---

## CLI Tool Setup (`wlo`)

The platform includes a CLI tool for automated time tracking.

1. **Build the CLI:**
   ```bash
   cd cli
   npm install
   npm run build
   ```

2. **Link or Run:**
   ```bash
   # Run directly
   node dist/index.js --help
   ```

3. **Usage:**
   ```bash
   # Login
   node dist/index.js login -e your@email.com -p yourpassword

   # Track active coding time in the current directory
   node dist/index.js watch --issue <ISSUE_ID>
   ```
   The `watch` command monitors file changes and automatically syncs active development time to the platform every minute.

---

## Project Structure

```text
├── backend/          # NestJS API
├── frontend/         # Next.js Application
├── cli/              # Time-tracking CLI tool
├── packages/common/  # Shared types and logic
├── docker-compose.yml
└── README.md
```

## Security & Scoping

Data isolation is enforced at the controller level in the backend. Every resource (Project, Issue, Client) is verified against the authenticated user's `organizationId` before access or modification is permitted.
