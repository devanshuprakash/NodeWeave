# NodeWeave — AI Workflow Automation Engine

A full-stack MERN application that automates document processing, finance approvals, and email-based workflows using a **graph-based DAG execution system** with AI-powered decision nodes.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)

---

## 🚀 Features

- **Visual Workflow Builder** — Drag-and-drop DAG editor using React Flow
- **DAG Execution Engine** — Graph validation, topological sorting, sequential node execution
- **5 Node Types** — Document Upload, AI Processing, Conditional, Email, Log
- **Async Job Processing** — BullMQ + Redis workers with retry & backoff
- **AI Integration** — OpenAI-powered invoice extraction, email classification, text summarization
- **JWT Authentication** — Role-based access (User, Admin, Finance Manager)
- **Execution Monitoring** — Real-time status tracking with per-node logs & timeline view

---

## 🏗️ Architecture

```
┌──────────┐     ┌──────────┐     ┌────────────────┐     ┌───────┐
│  React   │────▶│ Express  │────▶│  Execution     │────▶│ Redis │
│ Frontend │     │   API    │     │  Engine (DAG)  │     │ Queue │
└──────────┘     └──────────┘     └────────────────┘     └───────┘
                      │                    │                   │
                      ▼                    ▼                   ▼
                 ┌──────────┐     ┌────────────────┐    ┌──────────┐
                 │ MongoDB  │     │ Node Executors │    │  Worker  │
                 │          │     │ (Strategy)     │    │ Process  │
                 └──────────┘     └────────────────┘    └──────────┘
```

### Design Patterns
- **Strategy Pattern** → Node execution logic (each node type has its own executor)
- **Factory Pattern** → `NodeExecutorFactory` maps type → executor
- **State Pattern** → Workflow execution lifecycle (CREATED → QUEUED → RUNNING → COMPLETED/FAILED)
- **Repository Pattern** → Service layer abstracts database operations

---

## 📁 Project Structure

```
NodeWeave/
├── server/
│   └── src/
│       ├── config/          # DB, Redis, Queue, Env config
│       ├── middleware/       # Auth (JWT), Error handler
│       ├── models/          # User, Workflow, Node, Edge, Document, Execution, ExecutionLog
│       ├── controllers/     # Auth, Workflow, Execution controllers
│       ├── services/        # Auth, Workflow, AI, Email services
│       ├── engine/          # Graph validator, Topological sort, Execution engine
│       ├── nodeExecutors/   # Base, DocumentUpload, AI, Conditional, Email, Log, Factory
│       ├── workers/         # BullMQ execution worker
│       └── app.js           # Express entry point
├── client/
│   └── src/
│       ├── components/      # Navbar, ProtectedRoute
│       ├── pages/           # Login, Register, Dashboard, Workflows, Builder, Executions
│       ├── context/         # AuthContext (JWT state)
│       ├── services/        # API (Axios + interceptors)
│       └── App.jsx          # Router
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional — falls back to sync execution)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/NodeWeave.git
cd NodeWeave

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nodeweave
JWT_SECRET=your_secret_here
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_key     # Optional: enables AI features
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev

# Terminal 3 — Worker (optional, requires Redis)
cd server && npm run worker
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get profile |
| GET | `/api/v1/workflows` | List workflows |
| POST | `/api/v1/workflows` | Create workflow |
| GET | `/api/v1/workflows/:id` | Get workflow + nodes + edges |
| PUT | `/api/v1/workflows/:id` | Update workflow |
| DELETE | `/api/v1/workflows/:id` | Delete workflow |
| POST | `/api/v1/executions/:workflowId/execute` | Execute workflow |
| GET | `/api/v1/executions` | List executions |
| GET | `/api/v1/executions/:id` | Get execution + logs |

---

## 🧠 Node Types

| Type | Purpose | Config |
|------|---------|--------|
| **Document Upload** | Store files/invoices | `{ fileName, fileUrl, mimeType }` |
| **AI Processing** | Extract/classify/summarize | `{ action: 'extract_invoice' \| 'classify_email' \| 'summarize', text }` |
| **Conditional** | Branch logic | `{ field, operator, value }` |
| **Email** | Send notifications | `{ to, subject, body }` |
| **Log** | Audit trail | `{ message, level }` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Flow, React Router, Axios |
| Backend | Express.js, Mongoose, JWT, BullMQ |
| Database | MongoDB |
| Queue | Redis + BullMQ |
| AI | OpenAI API |
| Email | Nodemailer |

---

## 📄 License

ISC
