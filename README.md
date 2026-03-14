# OmniSync

OmniSync is an AI-powered HR Intelligence Platform designed to elevate employee management through data-driven insights, sentiment analysis, and proactive alerts. It serves as a unified workspace for HR professionals to track workforce health, conduct meaningful check-ins, and retain top talent.

## 🌟 Core Features

### 📊 Comprehensive Intelligence Dashboard
*   **Role-Based Views**: Tailored dashboard experiences for Junior HR (Daily Ops Cockpit), Senior HR (Workforce Health), and Admin/CXO (Executive View).
*   **Real-time Analytics**: Visualized metrics using Recharts, including Engagement Trends (line charts), Performance Distributions (bar charts), and Sentiment Analysis (pie charts).
*   **Department Health Radar**: Multi-axis radar charts comparing engagement, performance, satisfaction, and risk across different departments.
*   **At-a-glance KPI Cards**: Top-level metrics tracking total employees, average engagement, average performance, and high-risk employee counts.

### 🤖 AI-Powered Meeting Analysis & Insights
*   **Automated Transcription**: Flow for recording or uploading HR-employee check-in transcripts.
*   **Gemini AI Integration**: Uses `gemini-1.5-flash` to profoundly analyze raw meeting transcripts in real-time.
*   **Structured Output Generation**: Automatically extracts concise **Summaries, Key Takeaways, Action Items, Risk Flags, and Sentiment Scores** from unstructured conversations.
*   **AI Meeting Preparation**: Generates personalized AI briefing notes before a scheduled meeting based on the employee's past performance and institutional memory.

### 🚨 Proactive Risk Detection & Alerts
*   **Rule-Based Alerting Generation**: Automatically flags high-risk situations (e.g., flight risk, burnout) by evaluating both AI-generated sentiment scores and specific conversation keywords.
*   **Severity Categorization**: Alerts classified by severity (low, medium, high, critical) allowing HR teams to triage effectively.
*   **Direct Follow-ups**: Identifies when a check-in is urgently needed and integrates it into the upcoming meetings pipeline.

### 🕰️ Institutional Memory & Employee Timelines
*   **Chronological Tracking**: Maintains a persistent, timeline-based history of significant events, meetings, and HR notes for every individual employee.
*   **Automated Logging**: System automatically creates timeline events whenever a new meeting happens or a major alert is triggered.
*   **Context Preservation**: Ensures that HR context is never lost during handoffs, providing a complete 360-degree view of the employee lifecycle.

### 💬 Context-Aware HR Copilot / AI Assistant
*   **Interactive Chat Panel**: Persistent on-screen AI assistant that HR can interact with for quick queries.
*   **RAG Capabilities**: Chat system designed to understand employee context, allowing queries like "Show high risk employees" or "Summarize my last meeting with John."
*   **Actionable Suggestions**: AI proactively suggests relevant questions and follow-ups based on the specific employee profile before check-ins.

---

## 🏗️ Architecture Stack

OmniSync is built on a modern, decoupled architecture:

### Frontend
*   **Framework**: Next.js (App Router)
*   **Styling**: Tailwind CSS & `shadcn/ui` components
*   **Charts**: Recharts (for engagement trends, performance distributions, radar charts)
*   **State Management**: React Hooks & API client layer (`lib/api.ts`)
*   **Icons**: Lucide React

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: PostgreSQL
*   **ORM**: Prisma Client Python
*   **AI Integration**: Google Generative AI (`gemini-1.5-flash`)
*   **Server**: Uvicorn

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   PostgreSQL running locally or via cloud (e.g., Supabase)
*   Google Gemini API Key

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure environment variables:
    Create a `.env` file based on `.env.example`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/hr_intelligence"
    GEMINI_API_KEY="your_gemini_api_key_here"
    ```
4.  Push the Prisma schema to the database and generate the client:
    ```bash
    prisma db push
    prisma generate
    ```
5.  (Optional) Seed the database with mock data:
    ```bash
    python seed.py
    ```
6.  Start the FastAPI server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    # or yarn install / pnpm install
    ```
3.  Configure environment variables (optional, defaults to `http://localhost:8000`):
    ```env
    NEXT_PUBLIC_API_URL="http://localhost:8000"
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## 🗄️ Database Schema (Prisma)

The application revolves around these core models:

*   **Employee**: Core profile data, engagement/performance scores, department, and reporting lines.
*   **Meeting**: Records of HR-Employee check-ins, including transcripts, audio URLs, and follow-up dates.
*   **MeetingInsight**: AI-generated structured data extracted from meetings (action items, risk flags, sentiment).
*   **EmployeeAlert**: System-generated or manual warnings regarding employee status (e.g., flight risk).
*   **EmployeeNote**: Manual notes added by HR professionals.
*   **InstitutionalMemory**: A chronological timeline of events related to an employee.

---

## 🔌 API Endpoints (FastAPI)

The backend provides a comprehensive REST API. Base URL: `http://localhost:8000/api`

### Employees (`/api/employees`)
*   `GET /`: List all employees.
*   `GET /{id}`: Get full employee profile including meetings, alerts, notes, and timeline.
*   `POST /`: Create a new employee.
*   `PUT /{id}`, `DELETE /{id}`: Update or delete an employee.

### Meetings (`/api/meetings`)
*   `GET /`: List all meetings.
*   `GET /{id}`: Details of a specific meeting with its AI insights.
*   `POST /`: Create a new meeting (automatically generates an Institutional Memory event).
*   `GET /employees/{id}/meetings`: Get all meetings for a specific employee.

### AI Capabilities (`/api/ai`)
*   `POST /analyze-meeting`: Takes a transcript and uses Gemini to generate summary, takeaways, action items, risk flags, and sentiment score.
*   `POST /generate-alert`: Evaluates summary and sentiment to rule-generate alerts (e.g., "High Risk: Burnout").
*   `POST /meeting-prep`: Generates AI preparation notes before a scheduled meeting.
*   `POST /chat`: RAG-powered endpoint to ask questions about an employee's history.
*   `POST /transcribe`: Stub endpoint simulating audio-to-text transcription.

### Other Entities
*   **Dashboard** (`/api/dashboard`): Fetch upcoming check-ins, latest alerts, and total counts.
*   **Insights** (`/api/insights`): CRUD operations for meeting insights.
*   **Alerts** (`/api/alerts`): CRUD for employee alerts.
*   **Notes** (`/api/notes`): CRUD for manual HR notes.
*   **Memory** (`/api/memory`): Create/Get/Delete institutional memory timeline events.

---

## 🎨 Frontend Features & Flows

### Dashboard (`/dashboard`)
Displays high-level KPI metrics, Recharts components (Engagement Trends, Performance Distributions, Sentiment Pie, Department Radar), upcoming meetings list, and high-risk employees. Includes a mock AI Assistant chat panel for quick queries.

### Employee Directory (`/dashboard/employees`)
Tabular view of all employees with quick indicators for risk, department, and engagement scores.

### Meeting Analysis (`/dashboard/meetings/create`)
The core transcription and AI flow:
1.  **Recording/Input**: Enter or mock-record a transcript.
2.  **AI Analysis**: Calls `/api/ai/analyze-meeting`.
3.  **Review**: Presents the structured insights (Summary, Key Takeaways, Action Items, Risk Flags) for HR to review or modify.
4.  **Save**: Persists the `Meeting`, `MeetingInsight`, and automatically evaluates if a `EmployeeAlert` or `InstitutionalMemory` event should be spawned.

---

## 🛠️ Built For The Future

OmniSync is designed to be easily extensible. Customizing the AI prompts, adding new webhook triggers for Zoom/Teams integration, or expanding the granular permissions can all be done natively within the provided architecture.
