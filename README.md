# CodeSense AI

**Understand Any Codebase Like a Senior Engineer**

## Abstract

CodeSense AI is an AI-powered code comprehension platform that enables developers to gain deep understanding of unfamiliar codebases through natural language interaction. Users can upload software projects — via GitHub URL or ZIP archive — and engage in context-aware, conversational Q&A sessions powered by Google's Gemini large language model. The system automatically ingests, indexes, and analyzes source code, enabling it to provide accurate, contextual explanations of project architecture, functionality, and implementation details.

## Problem Statement

Understanding large, undocumented, or unfamiliar codebases is one of the most time-consuming challenges in software engineering. Developers joining new teams, contributing to open-source projects, or auditing third-party code often spend significant time manually tracing control flows, deciphering architectural decisions, and understanding domain-specific patterns. CodeSense AI addresses this problem by providing an intelligent assistant that can reason about an entire codebase and answer questions in natural language.

## Key Features

- **Multi-Source Project Ingestion** — Import codebases from GitHub repositories (via URL) or local ZIP file uploads.
- **Automated Code Indexing** — Asynchronous pipeline that downloads, extracts, and stores source files with support for 35+ programming languages and file formats.
- **AI-Powered Conversational Chat** — Context-aware Q&A using Google Gemini API with intelligent file relevance scoring (keyword-based ranking to select the most relevant source files per query).
- **Project Management Dashboard** — Centralized interface to manage multiple projects, track ingestion status, view file statistics, and monitor storage usage.
- **Secure Authentication System** — JWT-based authentication with access/refresh token flow, email verification, and password reset capabilities.
- **Session Management & Audit Logging** — Tracks user sessions and maintains audit logs for accountability.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)         │
│         Vite · React Router · TanStack Query · Zustand  │
├─────────────────────────────────────────────────────────┤
│                         REST API                        │
├─────────────────────────────────────────────────────────┤
│               Backend (Spring Boot 3.3 / Java 21)       │
│     Auth · Projects · Chat · Dashboard · GitHub Clone   │
├──────────┬──────────┬──────────────┬────────────────────┤
│ PostgreSQL│  Redis   │    Qdrant    │   Gemini API       │
│ (Data)    │ (Cache)  │  (Vectors)   │  (LLM Inference)   │
└──────────┴──────────┴──────────────┴────────────────────┘
```

### Backend Architecture

| Layer | Components |
|-------|-----------|
| **API Layer** | `AuthController`, `ProjectController`, `DashboardController`, `UserController` |
| **Service Layer** | `AuthService`, `ProjectService`, `GitHubCloneService`, `DashboardService`, `EmailService`, `UserService` |
| **Domain Layer** | `User`, `Project`, `ProjectFile`, `EmbeddingMetadata`, `Chat`, `Message`, `Session`, `AuditLog` |
| **Security** | JWT authentication, Spring Security filter chain, role-based access control |
| **Persistence** | Flyway-managed PostgreSQL schema with 8 versioned migrations |

### AI Chat Pipeline

1. **Query Reception** — User sends a natural language question about a project.
2. **File Relevance Scoring** — The system scores all project files against the query using keyword-based ranking (file path matching weighted 10x, content matching weighted 1x).
3. **Context Assembly** — The top 3 most relevant files (up to 25,000 characters) are assembled into a context window.
4. **LLM Inference** — The context and query are sent to Google Gemini via the OpenAI-compatible chat completions endpoint.
5. **Response Delivery** — The AI response is parsed and returned to the user in formatted markdown.

## Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 21 | Core language |
| Spring Boot 3.3 | Application framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA + Hibernate | ORM & data access |
| Flyway | Database schema migration |
| JJWT 0.12 | JWT token generation & validation |
| PostgreSQL 16 | Primary relational database |
| Redis 7 | Caching & session storage |
| Qdrant | Vector database for code embeddings |
| Google Gemini API | LLM inference for conversational AI |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| TypeScript 6 | Type-safe JavaScript |
| Vite 8 | Build tool & dev server |
| React Router 7 | Client-side routing |
| TanStack Query 5 | Server state management |
| Zustand 5 | Client state management |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion 12 | Animations & transitions |
| Chart.js | Data visualization |
| Lucide React | Icon library |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker Compose | Container orchestration for services |
| Maven | Backend build & dependency management |
| npm | Frontend package management |

## Database Schema

The application uses 8 Flyway-managed migration scripts:

| Migration | Table | Description |
|-----------|-------|-------------|
| V1 | `users` | User accounts with email verification and role management |
| V2 | `projects` | Project metadata, source type (GitHub/ZIP), and processing status |
| V3 | `project_files` | Indexed source files with path, content, language, and size |
| V4 | `embedding_metadata` | Vector embedding references linking to Qdrant point IDs |
| V5 | `chats` | Chat session records tied to users and projects |
| V6 | `messages` | Individual chat messages (user queries and AI responses) |
| V7 | `audit_logs` | System audit trail for user actions |
| V8 | `sessions` | Active user session tracking |

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose

### Setup

1. **Start infrastructure services:**
   ```bash
   docker-compose up -d
   ```

2. **Configure environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your Gemini API key and other credentials
   ```

3. **Start the backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`
   - API Documentation: `http://localhost:8080/swagger-ui.html`

## API Documentation

Interactive API documentation is available via SpringDoc/Swagger UI at `/swagger-ui.html` when the backend is running.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/projects/github` | Create project from GitHub URL |
| `POST` | `/api/projects/zip` | Create project from ZIP upload |
| `POST` | `/api/projects/{id}/chat` | Send chat message to AI |
| `GET`  | `/api/projects` | List user projects |
| `GET`  | `/api/dashboard/stats` | Get dashboard statistics |

## License

This project was developed as a Final Year Academic Project.
