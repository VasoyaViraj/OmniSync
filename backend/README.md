# HR Intelligence Dashboard — Backend API

AI-powered REST API for managing employees, meetings, insights, alerts, notes, and institutional memory.

## Tech Stack

| Layer        | Technology            |
|-------------|----------------------|
| Framework   | FastAPI              |
| Database    | PostgreSQL           |
| ORM         | Prisma (Python)      |
| Validation  | Pydantic v2          |
| Server      | Uvicorn              |

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── app/
│   ├── main.py                # FastAPI entry point
│   ├── database.py            # Prisma client singleton
│   ├── response.py            # JSON response helpers
│   ├── schemas/               # Pydantic validation models
│   │   ├── employee.py
│   │   ├── meeting.py
│   │   ├── insight.py
│   │   ├── alert.py
│   │   ├── note.py
│   │   └── memory.py
│   └── routes/                # FastAPI route handlers
│       ├── employees.py
│       ├── meetings.py
│       ├── insights.py
│       ├── alerts.py
│       ├── notes.py
│       ├── memory.py
│       └── dashboard.py
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Generate Prisma Client & Push Schema

```bash
python -m prisma generate
python -m prisma db push
```

### 4. Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

Open **http://localhost:8000/docs** for interactive Swagger UI.

---

## API Endpoints

### Employees

| Method   | Endpoint                          | Description                         |
|----------|-----------------------------------|-------------------------------------|
| `GET`    | `/api/employees`                  | List all employees                  |
| `GET`    | `/api/employees/{id}`             | Full profile + relations            |
| `POST`   | `/api/employees`                  | Create employee                     |
| `PUT`    | `/api/employees/{id}`             | Update employee                     |
| `DELETE` | `/api/employees/{id}`             | Delete employee                     |

### Meetings

| Method   | Endpoint                          | Description                         |
|----------|-----------------------------------|-------------------------------------|
| `GET`    | `/api/meetings`                   | List all meetings                   |
| `GET`    | `/api/meetings/{id}`              | Meeting details + insights          |
| `POST`   | `/api/meetings`                   | Create meeting (auto-timeline)      |
| `PUT`    | `/api/meetings/{id}`              | Update meeting                      |
| `DELETE` | `/api/meetings/{id}`              | Delete meeting                      |
| `GET`    | `/api/employees/{id}/meetings`    | Employee's meetings                 |

### Meeting Insights

| Method   | Endpoint                          | Description                         |
|----------|-----------------------------------|-------------------------------------|
| `GET`    | `/api/insights/{meeting_id}`      | Insights for a meeting              |
| `POST`   | `/api/insights`                   | Create insight                      |
| `PUT`    | `/api/insights/{id}`              | Update insight                      |
| `DELETE` | `/api/insights/{id}`              | Delete insight                      |

### Employee Alerts

| Method   | Endpoint                          | Description                         |
|----------|-----------------------------------|-------------------------------------|
| `GET`    | `/api/alerts`                     | List all alerts                     |
| `GET`    | `/api/employees/{id}/alerts`      | Employee's alerts                   |
| `POST`   | `/api/alerts`                     | Create alert                        |
| `DELETE` | `/api/alerts/{id}`                | Delete alert                        |

### Employee Notes

| Method   | Endpoint                          | Description                         |
|----------|-----------------------------------|-------------------------------------|
| `GET`    | `/api/employees/{id}/notes`       | Employee's notes                    |
| `POST`   | `/api/notes`                      | Create note                         |
| `PUT`    | `/api/notes/{id}`                 | Update note                         |
| `DELETE` | `/api/notes/{id}`                 | Delete note                         |

### Institutional Memory

| Method   | Endpoint                          | Description                         |
|----------|-----------------------------------|-------------------------------------|
| `GET`    | `/api/employees/{id}/timeline`    | Employee timeline                   |
| `POST`   | `/api/memory`                     | Create memory event                 |
| `DELETE` | `/api/memory/{id}`                | Delete memory event                 |

### Dashboard

| Method   | Endpoint         | Description                              |
|----------|------------------|------------------------------------------|
| `GET`    | `/api/dashboard`  | Upcoming check-ins + latest alerts       |

---

## Example Requests

### Create Employee

```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "email": "priya.sharma@company.com",
    "department": "Engineering",
    "designation": "Senior Developer",
    "location": "Bangalore",
    "tenure_years": 3.5,
    "performance_score": 8.5,
    "engagement_score": 7.2
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Priya Sharma",
    "email": "priya.sharma@company.com",
    "department": "Engineering",
    "designation": "Senior Developer",
    "location": "Bangalore",
    "manager_id": null,
    "tenure_years": 3.5,
    "performance_score": 8.5,
    "engagement_score": 7.2,
    "created_at": "2026-03-13T18:00:00.000Z"
  }
}
```

### Create Meeting (auto-creates timeline event)

```bash
curl -X POST http://localhost:8000/api/meetings \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "<employee-uuid>",
    "hr_id": "hr-001",
    "meeting_date": "2026-03-13T10:00:00Z",
    "summary": "Quarterly performance review — satisfied with role, wants mentorship",
    "sentiment": "positive",
    "next_followup_date": "2026-04-13T10:00:00Z"
  }'
```

### Get Employee Full Profile

```bash
curl http://localhost:8000/api/employees/<employee-uuid>
```

**Response includes:** employee details + meetings + alerts + notes + institutional memory timeline.

### Get Dashboard

```bash
curl http://localhost:8000/api/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "upcoming_checkins": [...],
    "latest_alerts": [...]
  }
}
```

### Error Response Example

```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## Business Logic

1. **Auto Timeline**: Creating a meeting automatically records an institutional memory event (`event_type: "meeting"`, `title: "Employee Check-in"`)
2. **Enriched Profile**: `GET /api/employees/{id}` includes all related meetings, alerts, notes, and timeline
3. **Dashboard**: Aggregates upcoming check-ins and latest alerts across all employees

## Response Format

All responses follow a consistent envelope:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
```
