# Planora 📐🏛️

> **Autonomous Generative 2D CAD & Construction Feasibility Platform**  
> Turn living requirements and boundary setbacks into deterministic, vector-accurate architectural blueprints and localized construction cost estimates in seconds.

---

## 🌟 Key Highlights & Engineering Features

- **Autonomous Spatial CAD Synthesis**: Transforms plain text room requirements (bedrooms, bathrooms, foyer, kitchen) into bounded, geometric 2D vector layouts with exact $(X, Y, W, H)$ coordinates.
- **Topological Adjacency & Boundary Solving**: Graph-based room connectivity solver enforcing door alignments, window daylight paths, and hard legal setbacks (e.g. municipal water main easements, Texas zoning setbacks).
- **Asynchronous Redis Worker Pipeline**: Decouples heavy generative AI spatial computations into background TSX workers using Redis queues, ensuring zero HTTP thread blocking and sub-3s polling resolution.
- **Deterministic 1:1 Vector SVG Engine**: Interactive CAD canvas (`FloorPlanSvgBox`) featuring real-time scaling ($0.5\times - 2.5\times$), fullscreen inspection, and 1-click raw SVG vector file export for AutoCAD/BIM interoperability.
- **Bill of Quantities (BOQ) & Financial Modeling**: Computes itemized material breakdowns (Plumbing, Electrical, Flooring, Painting, Finishes), labor contracting costs, contingency reserves, and cost-per-sq.ft. metrics.
- **32-Week Phased Construction Roadmap**: Synthesizes sequential multi-phase Gantt execution schedules spanning Foundation, Framing, MEP, and Finishes.
- **Full-Stack Session Guarding**: Hardened with NextAuth JWT authentication, featuring client-side `useSession()` protection and server-side `getServerSession(authOptions)` endpoint authorization.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client["Client Browser (Next.js 16 / React 19)"]
    Auth["NextAuth JWT Session Guard"]
    API["Next.js API Gateway (/api/v1)"]
    RedisQueue["Redis Background Queue (get-draft)"]
    Worker["Standalone TSX Worker"]
    Gemini["Google Gemini AI Spatial Engine"]
    DB[(PostgreSQL via Prisma ORM)]
    SVGCanvas["Interactive CAD Canvas (FloorPlanSvgBox)"]

    Client -->|1. Authenticate| Auth
    Client -->|2. Save Plot & Requirements| API
    API -->|3. Persist Specs| DB
    API -->|4. Push Draft Job| RedisQueue
    RedisQueue -->|5. Ingest Job| Worker
    Worker -->|6. Solve Topology & Constraints| Gemini
    Gemini -->|7. Return 2D SVG & BOQ Specs| Worker
    Worker -->|8. Update Status COMPLETED| DB
    Client -->|9. Poll Status (/api/v1/floor/draft)| API
    API -->|10. Read Active Version| DB
    DB -->|11. Return SVG & Cost Curves| Client
    Client -->|12. Render Vector Blueprint| SVGCanvas
```

---

## 🛠️ Technology Stack

| Layer                       | Technologies                                                                                      |
| :-------------------------- | :------------------------------------------------------------------------------------------------ |
| **Frontend**                | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Shadcn UI / Base UI |
| **State & Forms**           | React Hook Form, Zod Schema Validation, Axios                                                     |
| **Vector Engine**           | Native 2D SVG Vector Canvas, Coordinate Transformations, Pan & Zoom                               |
| **AI / Spatial Reasoning**  | Google Gemini Generative AI SDK (`@google/genai`)                                                 |
| **Queue & Background Jobs** | Redis (`redis: ^6.2.1`), TSX background worker scripts (`tsx watch src/workers/index.ts`)         |
| **Database & ORM**          | PostgreSQL, Prisma ORM 5.21 (`@prisma/client`)                                                    |
| **Authentication**          | NextAuth.js 4.24 (`CredentialsProvider`, JWT Strategy, bcryptjs)                                  |
| **Quality & Hooks**         | Husky 9, lint-staged, ESLint 9, Prettier                                                          |

---

## 📁 Project Structure

```text
planora/
├── prisma/
│   └── schema.prisma                  # PostgreSQL schema (User, Project, PlotConfig, Floor, FloorPlan, Rooms, BOQ)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── sign-in/               # NextAuth credentials authentication
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth handler route
│   │   │   └── v1/
│   │   │       ├── user/              # User project hierarchy (GET session-scoped projects)
│   │   │       ├── project/           # Project & Plot Configuration (POST / GET)
│   │   │       │   └── total-floor/   # Level count resolver
│   │   │       └── floor/             # Floor requirements & metadata (POST / GET)
│   │   │           ├── get-draft/     # Redis job dispatch endpoint
│   │   │           └── draft/         # Polling endpoint for generated SVG & status
│   │   ├── about/                     # Architectural mission & technical pillars
│   │   ├── how-it-works/              # 4-stage computational pipeline walkthrough
│   │   ├── projects/                  # Protected project dashboard & floor explorer
│   │   ├── floor/[id]/                # Deep-dive blueprint viewer, room matrix & BOQ
│   │   ├── layout.tsx                 # Root layout with SessionProvider & Navbar
│   │   └── provider.tsx               # Client session context provider
│   ├── components/
│   │   ├── floor/
│   │   │   ├── accordionFloorForm.tsx # Dynamic floor specs form with CUID2 & drafting
│   │   │   ├── floorPlanSvgBox.tsx    # Reusable CAD vector canvas (Zoom, Fullscreen, SVG export)
│   │   │   └── getParticularFloorAllData.tsx # Floor details matrix, rooms & financial tabs
│   │   ├── project/
│   │   │   └── userProjectsAccordion.tsx # Expandable projects accordion & floor routing
│   │   ├── ui/
│   │   │   ├── not-authenticated.tsx  # High-tech CAD unauthorized access guard screen
│   │   │   ├── accordion.tsx          # Accessible Radix/Shadcn accordion
│   │   │   └── button.tsx             # Planaora custom-themed button primitives
│   │   └── navbar/                    # Navigation header with session status
│   ├── lib/
│   │   ├── auth.ts                    # NextAuth options, JWT callbacks & credentials validation
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   └── redis.ts                   # Redis client & job queue dispatch helpers
│   ├── schema/                        # Zod runtime validation contracts
│   └── workers/
│       └── index.ts                   # Background worker consuming drafting queue
└── package.json
```

---

## 📡 API Reference

All `/api/v1/*` endpoints are secured via **NextAuth JWT session validation**:

### 1. User & Projects

- `GET /api/v1/user`
  - Retrieves all projects owned by the currently authenticated user session.
  - _Status_: `200 OK` | `401 Unauthorized`

- `POST /api/v1/project`
  - Validates plot dimensions, orientation (North-facing, Corner lot), and creates the project.
  - _Body_: `{ title, description, width, height, totalFloors, shapeType, ... }`

- `GET /api/v1/project?projectId={id}`
  - Fetches project metadata, plot configuration, setbacks, and floor list.

### 2. Floors & Drafting Engine

- `POST /api/v1/floor`
  - Registers room requirements (bedrooms, bathrooms, kitchen, living, setbacks, notes).
  - Automatically generates compliant 24-character CUID2 `versionId`.

- `POST /api/v1/floor/get-draft`
  - Dispatches floor requirements to the Redis worker queue.
  - Returns: `{ data: { jobId: "..." } }`

- `GET /api/v1/floor/draft?floorId={id}`
  - Polling endpoint returning generation status (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
  - When `COMPLETED`: delivers full raw SVG vector blueprint.

- `GET /api/v1/floor?floorId={id}`
  - Returns complete architectural room matrix, doors/windows orientations, Bill of Quantities (BOQ), and construction phasing schedule.

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** 20.x or higher
- **pnpm** (preferred) or npm
- **PostgreSQL** instance
- **Redis** server running locally (`localhost:6379`) or hosted

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/planora?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"

# Google Gemini API
GEMINI_API_KEY="your-google-gemini-api-key"

# Redis
REDIS_URL="redis://localhost:6379"
```

### 3. Installation & Database Setup

```bash
# Install dependencies
pnpm install

# Push Prisma schema to your database
pnpm prisma db push

# (Optional) Open Prisma Studio to inspect records
pnpm prisma studio
```

### 4. Running the Development Environment

Run both the Next.js frontend server and the background queue worker concurrently:

```bash
# Starts both Next.js app and the Redis TSX worker
pnpm run dev:all
```

Or run them in separate terminal instances:

```bash
# Terminal 1: Next.js App
pnpm dev

# Terminal 2: Redis AI Worker
pnpm run worker:dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security & Authentication

- **Session Handling**: Protected via `useSession()` on client pages and `getServerSession(authOptions)` across API routes.
- **Unauthorized Screen**: When an unauthenticated user navigates to protected CAD features, Planora renders the `<NotAuthenticated />` UI component with 1-click credential sign-in.
- **CUID2 Verification**: Custom collision-resistant identifier generation preventing database constraint injection.

---

## 📜 License

Distributed under the MIT License. Built with ❤️ for architects, engineers, and builders.
