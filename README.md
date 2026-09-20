# 💬 First Next Chat

<p align="center">
  <strong>A modern, full-stack conversational AI platform built with Next.js 16 App Router, React 19, LangChain, Ollama, Prisma ORM 7, PostgreSQL, and NextAuth.js.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-5432-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/LangChain-Integration-orange?style=for-the-badge&logo=langchain" alt="LangChain" />
  <img src="https://img.shields.io/badge/Ollama-Local_LLM-white?style=for-the-badge&logo=ollama" alt="Ollama" />
  <img src="https://img.shields.io/badge/Vitest-4.x-729B1B?style=for-the-badge&logo=vitest" alt="Vitest" />
</p>

---

## 🌟 Overview

**First Next Chat** is a high-performance AI chat web application engineered with modern full-stack best practices. It features local Large Language Model (LLM) inference powered by **Ollama** and orchestrated via **LangChain**, real-time Server-Sent Events (SSE) streaming responses, persistent multi-thread conversations in **PostgreSQL**, secure **NextAuth.js** authentication with bcrypt encryption, and an **Admin Management Portal**.

---

## ✨ Key Features

### 🤖 Intelligent AI Assistant ("Rai")
- **Local LLM Inference**: Direct integration with local Ollama instances (e.g. `llama3`) for fast, private, and offline-capable AI chats.
- **Real-Time Streaming**: Low-latency token streaming using `ReadableStream` and Server-Sent Events (SSE) protocol (`text/event-stream`).
- **Conversational Persona**: Pre-configured system prompt template empowering "Rai" to deliver concise, helpful assistance.
- **Starter Prompt Library**: Quick action cards (Brainstorming, Code & Debug, Content Drafting, Topic Analysis) to kickstart conversations.

### 💬 Rich Chat Experience
- **Multi-Chat Session Management**: Create, switch, rename, and delete conversation threads seamlessly.
- **Auto-Title Generation**: Conversation titles automatically derive from the initial prompt with inline rename capability.
- **Message Action Utilities**:
  - 📋 One-click copy message to clipboard
  - 🔄 Regenerate assistant responses
  - 🔊 Web Speech API Text-to-Speech (TTS) voice playback
  - 👍/👎 User response feedback
- **Adaptive UI**: Auto-resizing input textarea, smooth auto-scrolling, dynamic avatar gradients, relative timestamps, and responsive layout.

### 🔐 Authentication & Security
- **Credentials-Based NextAuth**: JWT session strategy for secure, lightweight token management.
- **Password Protection**: Salty `bcryptjs` (12 rounds) hashing on registration and authentication.
- **User Isolation**: All chat threads and message histories are strictly scoped to authenticated user IDs with route-level authorization guards.

### 📊 Comprehensive Admin Portal (`/admin`)
- **Executive Dashboard**: Real-time KPI statistics (Total Users, Active Chats, Messages Sent Today, Flagged Content).
- **User Management (`/admin/users`)**: Search, filter, and inspect user profiles, roles (`USER` / `ADMIN`), status (`ACTIVE` / `SUSPENDED`), and conversation metrics.
- **Chat Moderation (`/admin/chats`)**: Oversee chat threads, evaluate message density, and monitor flagged interactions.
- **Analytics & Settings (`/admin/analytics`, `/admin/settings`)**: Usage trends, model selection, temperature tuning, and system prompt controls.

---

## 🏗️ Architecture & System Design

```mermaid
flowchart TD
    User([Client / Browser]) <-->|HTTP / UI| NextApp[Next.js 16 App Router]
    
    subgraph Frontend [Presentation Layer]
        NextApp --> Landing[Landing Page /]
        NextApp --> AuthPages[Auth /login & /signup]
        NextApp --> ChatUI[Chat Interface /chat]
        NextApp --> AdminUI[Admin Portal /admin]
    end

    subgraph Backend [Server & API Layer]
        ChatUI <-->|SSE Stream / JSON| ChatAPI["/api/chat & /api/chat/[chatId]"]
        AdminUI <-->|JSON API| AdminAPI["/api/admin/users"]
        AuthPages <-->|NextAuth Handler| AuthAPI["/api/auth & /api/signup"]
    end

    subgraph Agent [AI Engine]
        ChatAPI --> LangChain["@langchain/ollama Agent (invokeRai)"]
        LangChain <-->|HTTP Stream| Ollama[Local Ollama LLM Server]
    end

    subgraph Database [Persistence Layer]
        Backend <-->|Prisma Pg Adapter| Prisma[Prisma ORM 7]
        Prisma <-->|SQL| Postgres[(PostgreSQL Database)]
    end
```

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.3](https://nextjs.org/) (App Router, Server Components & Route Handlers) |
| **UI Library** | [React 19.2](https://react.dev/) |
| **Styling** | Vanilla CSS Modules (`chat.module.css`, `admin.module.css`, `auth.module.css`), Tailwind CSS v4 |
| **Typography** | Google Fonts ([Syne](https://fonts.google.com/specimen/Syne), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Geist](https://vercel.com/font)) |
| **AI / Orchestration** | [LangChain](https://js.langchain.com/), `@langchain/ollama`, `@langchain/langgraph` |
| **LLM Provider** | [Ollama](https://ollama.com/) (`llama3`, `mistral`, or any custom model) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/), [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Testing** | [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/), JSDOM |
| **Language & Tooling** | TypeScript 5, ESLint 9, PostCSS |

---

## 📁 Directory Structure

```text
first-next-chat/
├── app/
│   ├── admin/                    # Admin Portal routes
│   │   ├── analytics/            # Admin analytics views
│   │   ├── chats/                # Chat moderation interface
│   │   ├── settings/             # System and model configuration
│   │   ├── users/                # User management table & controls
│   │   ├── admin-sidebar.tsx     # Admin navigation sidebar
│   │   ├── admin.module.css      # Admin styling
│   │   ├── layout.tsx            # Admin dashboard layout
│   │   └── page.tsx              # Admin overview dashboard
│   ├── api/                      # Next.js Route Handlers
│   │   ├── admin/users/          # Admin user list & chat count API
│   │   ├── auth/[...nextauth]/   # NextAuth authentication endpoints
│   │   ├── chat/                 # Chat creation & list API
│   │   │   └── [chatId]/         # Message streaming (GET, POST, PATCH, DELETE)
│   │   └── signup/               # User registration API
│   ├── chat/                     # Main AI Chat Application page
│   │   ├── chat.module.css       # Chat UI styling
│   │   └── page.tsx              # Interactive chat screen & sidebar
│   ├── components/               # Shared reusable components
│   │   ├── chat-interface.tsx    # Standalone chat interface component
│   │   └── site-header.tsx       # Universal navigation header
│   ├── login/                    # Login page & tests
│   ├── signup/                   # Registration page & tests
│   ├── auth-providers.tsx        # NextAuth SessionProvider wrapper
│   ├── globals.css               # Global theme variables and base styles
│   ├── layout.tsx                # Root HTML layout with providers & fonts
│   └── page.tsx                  # Showcase landing page
├── lib/
│   ├── agent/                    # AI Agent and LangChain configuration
│   │   ├── llm.ts                # Ollama direct fetch client
│   │   ├── ollama.ts             # LangChain ChatOllama streaming invoker (invokeRai)
│   │   └── prompts.ts            # System prompt templates
│   ├── auth.ts                   # NextAuth options & credential verification
│   └── prisma.ts                 # Prisma Client instance with Postgres adapter
├── prisma/
│   ├── migrations/               # Database migration history
│   ├── schema.prisma             # Prisma data schema (User, Chat, Message)
│   └── prisma.config.ts          # Prisma v7 environment & CLI configuration
├── types/
│   └── next-auth.d.ts            # Custom NextAuth session & user typings
├── vitest.config.ts              # Vitest test runner configuration
├── vitest.setup.ts               # Testing library setup
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript compiler options
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM:

```prisma
enum Role {
  USER
  ADMIN
}

enum Status {
  ACTIVE
  SUSPENDED
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  chats     Chat[]
  role      Role     @default(USER)
  status    Status   @default(ACTIVE)
}

model Chat {
  id        String    @id @default(cuid())
  title     String?
  createdAt DateTime  @default(now())
  user      User?     @relation(fields: [userId], references: [id])
  userId    String?
  message   Message[]
}

model Message {
  id        String   @id @default(cuid())
  content   String
  isUser    Boolean
  createdAt DateTime @default(now())
  chat      Chat?    @relation(fields: [chatId], references: [id])
  chatId    String?
}
```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication & Users
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/signup` | Register a new user account with hashed password | No |
| `GET/POST`| `/api/auth/[...nextauth]` | NextAuth authentication handlers (sign-in, session, sign-out) | No |
| `GET` | `/api/admin/users` | Retrieve all users with active conversation counts | Yes (Admin) |

### 💬 Chat Management
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat` | List all conversation threads for authenticated user | Yes |
| `POST` | `/api/chat` | Initialize a new empty chat conversation | Yes |
| `GET` | `/api/chat/:chatId` | Fetch message history for a specific conversation | Yes |
| `POST` | `/api/chat/:chatId` | Send user message and stream back AI response (SSE) | Yes |
| `PATCH` | `/api/chat/:chatId` | Update conversation title | Yes |
| `DELETE`| `/api/chat/:chatId` | Delete conversation thread and its messages | Yes |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v18.18+` or `v20+`
- **PostgreSQL**: Running locally or a hosted instance
- **Ollama**: Download and install from [ollama.com](https://ollama.com/)

### 2. Install & Start Ollama
1. Start the Ollama server:
   ```bash
   ollama serve
   ```
2. Pull your preferred model (default configured is `llama3`):
   ```bash
   ollama pull llama3
   ```

### 3. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd first-next-chat
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or update the existing one):

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/FirstNextChat"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-random-key"
NEXTAUTH_URL="http://localhost:3000"

# Ollama LLM Configuration
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama3"

# Optional: OpenAI API Key (if switching to OpenAI provider)
OPENAI_API_KEY=""
```

> **Tip:** You can generate a random secret for `NEXTAUTH_SECRET` using:
> ```bash
> openssl rand -base64 32
> ```

### 5. Initialize the Database
Run Prisma migrations to create the database tables:

```bash
# Push schema to database
npx prisma db push

# Or run Prisma migrations
npx prisma migrate dev --name init
```

*(Optional)* Open Prisma Studio to explore your data:
```bash
npx prisma studio
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** for fast unit and component testing.

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run
```

---

## 📜 Available NPM Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000` |
| `npm run build` | Compiles the production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to verify code quality |
| `npm run test` | Launches Vitest test runner in watch mode |
| `npm run test:run`| Executes Vitest tests in single-run CI mode |

---

## 🛡️ License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for your own projects.
