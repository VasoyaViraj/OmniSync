"""
seed.py — Populate the HR Intelligence Dashboard with realistic test data.

Usage:
    python seed.py

Prerequisites:
    - PostgreSQL running & DATABASE_URL configured in .env
    - Prisma client generated (python -m prisma generate)
    - Schema pushed (python -m prisma db push)
"""

import asyncio
from datetime import datetime, timedelta, timezone
from prisma import Prisma

# ─────────────────────────────────────────────────────────────
# Seed Data
# ─────────────────────────────────────────────────────────────

EMPLOYEES = [
    {
        "name": "Priya Sharma",
        "email": "priya.sharma@omnisync.com",
        "department": "Engineering",
        "designation": "Staff Engineer",
        "location": "Bangalore",
        "tenure_years": 6.5,
        "performance_score": 9.1,
        "engagement_score": 8.4,
    },
    {
        "name": "Rahul Menon",
        "email": "rahul.menon@omnisync.com",
        "department": "Engineering",
        "designation": "Senior Developer",
        "location": "Hyderabad",
        "tenure_years": 4.0,
        "performance_score": 7.8,
        "engagement_score": 6.2,
    },
    {
        "name": "Anjali Desai",
        "email": "anjali.desai@omnisync.com",
        "department": "Product",
        "designation": "Product Manager",
        "location": "Mumbai",
        "tenure_years": 3.2,
        "performance_score": 8.5,
        "engagement_score": 7.9,
    },
    {
        "name": "Vikram Patel",
        "email": "vikram.patel@omnisync.com",
        "department": "Sales",
        "designation": "Regional Sales Head",
        "location": "Delhi",
        "tenure_years": 5.0,
        "performance_score": 8.0,
        "engagement_score": 5.5,
    },
    {
        "name": "Sneha Iyer",
        "email": "sneha.iyer@omnisync.com",
        "department": "Marketing",
        "designation": "Marketing Lead",
        "location": "Chennai",
        "tenure_years": 2.8,
        "performance_score": 7.2,
        "engagement_score": 8.1,
    },
    {
        "name": "Arjun Reddy",
        "email": "arjun.reddy@omnisync.com",
        "department": "Engineering",
        "designation": "DevOps Engineer",
        "location": "Bangalore",
        "tenure_years": 1.5,
        "performance_score": 6.9,
        "engagement_score": 7.0,
    },
    {
        "name": "Meera Nair",
        "email": "meera.nair@omnisync.com",
        "department": "HR",
        "designation": "HR Business Partner",
        "location": "Pune",
        "tenure_years": 7.0,
        "performance_score": 8.8,
        "engagement_score": 9.0,
    },
    {
        "name": "Karan Singh",
        "email": "karan.singh@omnisync.com",
        "department": "Sales",
        "designation": "Account Executive",
        "location": "Delhi",
        "tenure_years": 1.0,
        "performance_score": 6.5,
        "engagement_score": 5.0,
    },
    {
        "name": "Divya Kulkarni",
        "email": "divya.kulkarni@omnisync.com",
        "department": "Product",
        "designation": "UX Researcher",
        "location": "Mumbai",
        "tenure_years": 2.0,
        "performance_score": 7.6,
        "engagement_score": 8.3,
    },
    {
        "name": "Rohan Gupta",
        "email": "rohan.gupta@omnisync.com",
        "department": "Marketing",
        "designation": "Content Strategist",
        "location": "Bangalore",
        "tenure_years": 3.5,
        "performance_score": 7.0,
        "engagement_score": 6.8,
    },
]

# Meeting templates — 2 per employee (index 0 & 1 cycle through these)
MEETING_TEMPLATES = [
    # ── First meeting for each employee ──
    [
        {
            "summary": "Quarterly performance review — high output, discussed promotion path to Staff Engineer.",
            "sentiment": "positive",
            "transcript": "HR: How are you feeling about your role? Priya: Very positive. I've been leading the platform migration and mentoring two juniors...",
        },
        {
            "summary": "Discussed workload concerns. Employee mentioned feeling stretched thin across multiple projects.",
            "sentiment": "neutral",
            "transcript": "HR: Any concerns about bandwidth? Rahul: Honestly, I've been juggling three projects and it's getting tough...",
        },
        {
            "summary": "Product roadmap alignment check-in. Discussed cross-functional collaboration improvements.",
            "sentiment": "positive",
            "transcript": "HR: How's the collaboration with engineering? Anjali: Much better since we introduced sprint planning sync-ups...",
        },
        {
            "summary": "Sales target review. Employee expressed concerns about unrealistic quarterly targets.",
            "sentiment": "negative",
            "transcript": "HR: How do you feel about Q2 targets? Vikram: Frankly, the numbers don't account for the market slowdown...",
        },
        {
            "summary": "Career growth discussion. Employee interested in transitioning to a brand strategy role.",
            "sentiment": "positive",
            "transcript": "HR: Where do you see yourself in two years? Sneha: I'd love to move into brand strategy...",
        },
        {
            "summary": "Onboarding follow-up. Employee settling in well, requested more mentorship opportunities.",
            "sentiment": "positive",
            "transcript": "HR: How has your first year been? Arjun: Great so far, but I'd really benefit from a senior mentor...",
        },
        {
            "summary": "Annual review. Outstanding contributions to employee wellness programs recognized.",
            "sentiment": "positive",
            "transcript": "HR: Your wellness initiative impacted 200+ employees. Meera: I'm glad it resonated. I want to scale it company-wide...",
        },
        {
            "summary": "Probation review. Performance below expectations, discussed improvement plan.",
            "sentiment": "negative",
            "transcript": "HR: Let's talk about your pipeline numbers. Karan: I know they're low. I'm struggling with the CRM tool...",
        },
        {
            "summary": "Mid-year check-in. Employee thriving in research role, presented usability study results.",
            "sentiment": "positive",
            "transcript": "HR: Your usability study was well-received. Divya: Thank you! I'd like to propose a quarterly research cadence...",
        },
        {
            "summary": "Content strategy alignment. Discussed upcoming campaign goals and SEO improvements.",
            "sentiment": "neutral",
            "transcript": "HR: How's the content pipeline? Rohan: Steady, but we need better analytics tools to measure impact...",
        },
    ],
    # ── Second meeting for each employee ──
    [
        {
            "summary": "Follow-up on promotion timeline. Discussed leadership development program enrollment.",
            "sentiment": "positive",
            "transcript": "HR: We've approved your promotion path. Priya: That's wonderful. I'd also like to join the leadership cohort...",
        },
        {
            "summary": "Burnout risk assessment. Employee shows signs of disengagement, recommended time off.",
            "sentiment": "negative",
            "transcript": "HR: You seem a bit withdrawn lately. Rahul: Yeah, I haven't taken leave in months. I'm running on fumes...",
        },
        {
            "summary": "Stakeholder feedback review. Positive feedback from engineering leads on product specs.",
            "sentiment": "positive",
            "transcript": "HR: Engineering gave great feedback on your PRDs. Anjali: That's encouraging. I've been investing time in clearer specs...",
        },
        {
            "summary": "Retention check-in. Employee considering external offers, discussed compensation review.",
            "sentiment": "negative",
            "transcript": "HR: We understand you've received an offer. Vikram: Yes, the comp difference is significant...",
        },
        {
            "summary": "Campaign post-mortem. Successful product launch campaign, discussed learnings.",
            "sentiment": "positive",
            "transcript": "HR: The launch campaign exceeded targets. Sneha: We optimized the funnel mid-campaign which really helped...",
        },
        {
            "summary": "Technical growth plan. Employee wants to learn Kubernetes and cloud architecture.",
            "sentiment": "positive",
            "transcript": "HR: What skills do you want to develop? Arjun: Definitely Kubernetes. I'd like to get certified...",
        },
        {
            "summary": "Team building initiative planning. Employee proposing cross-department mentorship program.",
            "sentiment": "positive",
            "transcript": "HR: Tell me about the mentorship idea. Meera: I want to pair senior ICs with new hires across departments...",
        },
        {
            "summary": "Performance improvement plan review. Slight progress but still below target.",
            "sentiment": "neutral",
            "transcript": "HR: Let's review your PIP progress. Karan: I've improved my cold outreach numbers by 30%, but closings are still low...",
        },
        {
            "summary": "Research methodology workshop feedback. Employee wants to train the wider product team.",
            "sentiment": "positive",
            "transcript": "HR: Your workshop got great reviews. Divya: I'd like to make it a recurring training for new PMs...",
        },
        {
            "summary": "Content ROI discussion. Need for better attribution models and tooling.",
            "sentiment": "neutral",
            "transcript": "HR: How do you measure content success? Rohan: Right now it's mostly pageviews. We need proper attribution...",
        },
    ],
]

# Insight templates — 1 per meeting, indexed same as meetings
INSIGHT_TEMPLATES = [
    # ── Insights for first meetings ──
    [
        {"key_takeaways": "High performer, ready for Staff Engineer promotion.", "action_items": "Submit promotion packet by Q3. Enroll in leadership program.", "risk_flags": None, "sentiment_score": 0.9},
        {"key_takeaways": "Workload imbalance across projects.", "action_items": "Reassign one project to another engineer. Schedule follow-up in 2 weeks.", "risk_flags": "Burnout risk — monitor closely", "sentiment_score": 0.3},
        {"key_takeaways": "Strong cross-functional collaboration. Product-engineering alignment improving.", "action_items": "Continue sprint sync-ups. Share feedback with engineering leads.", "risk_flags": None, "sentiment_score": 0.8},
        {"key_takeaways": "Targets perceived as unrealistic. Potential flight risk.", "action_items": "Review Q2 targets with sales leadership. Schedule compensation discussion.", "risk_flags": "Flight risk — external market pull", "sentiment_score": -0.4},
        {"key_takeaways": "Interested in brand strategy transition.", "action_items": "Create IDP for brand strategy skills. Connect with VP Marketing.", "risk_flags": None, "sentiment_score": 0.7},
        {"key_takeaways": "Good onboarding experience. Seeks mentorship.", "action_items": "Assign senior mentor from platform team. Check in after 30 days.", "risk_flags": None, "sentiment_score": 0.6},
        {"key_takeaways": "Exceptional impact on wellness programs.", "action_items": "Approve company-wide wellness initiative budget. Nominate for HR Excellence award.", "risk_flags": None, "sentiment_score": 0.95},
        {"key_takeaways": "Below-target performance. Tool familiarity gap.", "action_items": "Provide CRM training sessions. Pair with senior account exec for shadowing.", "risk_flags": "Performance risk — may not clear probation", "sentiment_score": -0.5},
        {"key_takeaways": "Strong research output. Proposed quarterly cadence.", "action_items": "Approve quarterly research calendar. Allocate budget for user testing sessions.", "risk_flags": None, "sentiment_score": 0.8},
        {"key_takeaways": "Content pipeline steady but lacks impact measurement.", "action_items": "Evaluate and procure analytics tooling. Define content KPIs.", "risk_flags": None, "sentiment_score": 0.4},
    ],
    # ── Insights for second meetings ──
    [
        {"key_takeaways": "Promotion approved. Leadership development interest.", "action_items": "Finalize promotion effective date. Register for leadership cohort Q4.", "risk_flags": None, "sentiment_score": 0.92},
        {"key_takeaways": "Burnout confirmed. Needs mandatory time off.", "action_items": "Enforce 1-week leave. Redistribute sprint tasks. Follow up post-leave.", "risk_flags": "Active burnout — immediate intervention required", "sentiment_score": -0.7},
        {"key_takeaways": "Positive stakeholder feedback. PRD quality improving.", "action_items": "Share feedback in product all-hands. Consider for PM lead role.", "risk_flags": None, "sentiment_score": 0.85},
        {"key_takeaways": "Retention risk — external offer on table.", "action_items": "Fast-track compensation review. Arrange meeting with VP Sales.", "risk_flags": "High flight risk — offer in hand", "sentiment_score": -0.6},
        {"key_takeaways": "Successful campaign execution.", "action_items": "Document campaign playbook. Share learnings at marketing all-hands.", "risk_flags": None, "sentiment_score": 0.88},
        {"key_takeaways": "Clear growth direction. Kubernetes certification interest.", "action_items": "Approve certification budget. Assign cloud architecture project.", "risk_flags": None, "sentiment_score": 0.7},
        {"key_takeaways": "Cross-department mentorship proposal.", "action_items": "Draft mentorship program proposal. Get budget approval from CHRO.", "risk_flags": None, "sentiment_score": 0.9},
        {"key_takeaways": "Marginal PIP progress. Cold outreach improved but closings lagging.", "action_items": "Extend PIP by 30 days. Provide closing techniques training.", "risk_flags": "Still at risk of termination", "sentiment_score": -0.3},
        {"key_takeaways": "Workshop well-received. Training potential for product team.", "action_items": "Schedule recurring PM training. Allocate training budget.", "risk_flags": None, "sentiment_score": 0.82},
        {"key_takeaways": "Attribution gap in content measurement.", "action_items": "Pilot content attribution tool. Define quarterly ROI targets.", "risk_flags": None, "sentiment_score": 0.35},
    ],
]

# Alerts — for employees at index 1, 3, 5, 7
ALERT_DATA = [
    {"employee_idx": 1, "alert_type": "burnout_risk", "description": "Employee showing signs of burnout — hasn't taken leave in 5 months, declining engagement scores.", "severity": "high"},
    {"employee_idx": 3, "alert_type": "flight_risk", "description": "Employee has received a competing offer. Retention conversation needed urgently.", "severity": "critical"},
    {"employee_idx": 5, "alert_type": "skill_gap", "description": "Employee needs Kubernetes certification to meet role expectations within 6 months.", "severity": "medium"},
    {"employee_idx": 7, "alert_type": "performance_warning", "description": "Employee on PIP — probation period ending in 30 days with insufficient progress.", "severity": "high"},
]

# Notes — 2 per employee
NOTE_TEMPLATES = [
    [
        "Priya is a strong candidate for the Staff Engineer promotion. She has consistently delivered high-impact projects and mentors junior engineers.",
        "Discussed leadership development program. Priya expressed strong interest in the Q4 cohort. Recommend fast-tracking enrollment.",
    ],
    [
        "Rahul seems overwhelmed with multiple project assignments. Consider redistributing workload before burnout escalates.",
        "Recommended mandatory time off. Rahul hasn't used any PTO in 5 months. HR should monitor engagement score trend.",
    ],
    [
        "Anjali has improved cross-functional communication significantly. Engineering leads are giving positive feedback on her product specs.",
        "Potential candidate for PM Lead role in Q4. Her stakeholder feedback scores are consistently above 8.5.",
    ],
    [
        "Vikram raised concerns about Q2 sales targets. Market conditions suggest targets may need adjustment.",
        "Retention risk flagged — Vikram has an external offer. Compensation review meeting scheduled with VP Sales.",
    ],
    [
        "Sneha expressed interest in transitioning from marketing execution to brand strategy. Created an individual development plan.",
        "Product launch campaign led by Sneha exceeded KPIs by 22%. Recommend recognition at next all-hands.",
    ],
    [
        "Arjun is settling into the DevOps role well. Requested mentorship from a senior platform engineer.",
        "Arjun wants to pursue Kubernetes certification. Approved training budget and assigned a cloud project for hands-on experience.",
    ],
    [
        "Meera's employee wellness initiative reached 200+ employees. Significant positive impact on company culture metrics.",
        "Meera proposed a cross-department mentorship program. The concept is strong — recommending budget approval from CHRO.",
    ],
    [
        "Karan is struggling with CRM tooling and cold outreach techniques. Paired with a senior account exec for shadowing.",
        "PIP update: Karan improved cold outreach by 30% but closing rate remains below target. Extended PIP by 30 days.",
    ],
    [
        "Divya's usability study on the onboarding flow was well-received by the product and design teams.",
        "Divya ran a successful research methodology workshop. Proposing a recurring training for new PMs.",
    ],
    [
        "Rohan's content pipeline is steady but lacks robust impact measurement. Evaluating analytics tools.",
        "Discussed content ROI attribution gaps. Rohan will pilot a new attribution tool and define quarterly KPIs.",
    ],
]

# Institutional Memory — 3 entries per employee (meeting record + milestone/event)
MEMORY_TEMPLATES = [
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Quarterly performance review — promotion path discussed.", "source": "meeting transcript"},
        {"event_type": "promotion", "title": "Promoted to Staff Engineer", "description": "Promotion effective Q3. Recognized for platform migration leadership.", "source": "hr_records"},
        {"event_type": "achievement", "title": "Completed Platform Migration", "description": "Led migration of legacy monolith to microservices architecture.", "source": "project_tracker"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Discussed workload concerns and burnout risk.", "source": "meeting transcript"},
        {"event_type": "alert", "title": "Burnout Risk Flagged", "description": "HR flagged burnout risk after 5 months without PTO.", "source": "hr_system"},
        {"event_type": "intervention", "title": "Mandatory Leave Enforced", "description": "1-week mandatory leave ordered. Sprint tasks redistributed.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Product roadmap alignment and cross-functional improvements.", "source": "meeting transcript"},
        {"event_type": "recognition", "title": "Positive Stakeholder Feedback", "description": "Engineering leads praised PRD quality improvements.", "source": "feedback_system"},
        {"event_type": "milestone", "title": "3 Years at OmniSync", "description": "Completed 3 years. Tenure milestone celebration.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Sales target review — targets perceived as unrealistic.", "source": "meeting transcript"},
        {"event_type": "alert", "title": "Flight Risk Detected", "description": "Employee received competing external offer.", "source": "hr_system"},
        {"event_type": "retention", "title": "Compensation Review Initiated", "description": "Fast-tracked comp review after external offer disclosed.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Career growth — brand strategy transition interest.", "source": "meeting transcript"},
        {"event_type": "achievement", "title": "Product Launch Campaign Success", "description": "Campaign exceeded KPIs by 22%. Recognized at all-hands.", "source": "project_tracker"},
        {"event_type": "development", "title": "IDP Created for Brand Strategy", "description": "Individual development plan drafted for brand strategy transition.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Onboarding follow-up — mentorship requested.", "source": "meeting transcript"},
        {"event_type": "onboarding", "title": "Completed Onboarding Program", "description": "Successfully completed 90-day onboarding program.", "source": "hr_records"},
        {"event_type": "development", "title": "Kubernetes Certification Approved", "description": "Training budget approved for Kubernetes certification.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Annual review — wellness program impact recognized.", "source": "meeting transcript"},
        {"event_type": "achievement", "title": "Wellness Program Launched", "description": "Employee wellness initiative reached 200+ people.", "source": "project_tracker"},
        {"event_type": "milestone", "title": "7 Years at OmniSync", "description": "Long-tenure milestone. Nominated for HR Excellence award.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Probation review — below expectations.", "source": "meeting transcript"},
        {"event_type": "alert", "title": "PIP Initiated", "description": "Performance improvement plan started — 60-day window.", "source": "hr_system"},
        {"event_type": "training", "title": "CRM Training Assigned", "description": "Enrolled in CRM tool training and sales shadowing program.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Mid-year check-in — strong research output.", "source": "meeting transcript"},
        {"event_type": "achievement", "title": "Usability Study Published", "description": "Onboarding flow usability study adopted by design team.", "source": "project_tracker"},
        {"event_type": "development", "title": "Research Workshop Delivered", "description": "Led research methodology workshop for product team.", "source": "hr_records"},
    ],
    [
        {"event_type": "meeting", "title": "Employee Check-in", "description": "Content strategy alignment and ROI discussion.", "source": "meeting transcript"},
        {"event_type": "milestone", "title": "3 Years at OmniSync", "description": "Completed 3 years. Tenure milestone.", "source": "hr_records"},
        {"event_type": "development", "title": "Analytics Tool Pilot", "description": "Piloting content attribution tool for ROI measurement.", "source": "project_tracker"},
    ],
]


# ─────────────────────────────────────────────────────────────
# Seed Logic
# ─────────────────────────────────────────────────────────────

async def main():
    db = Prisma()
    await db.connect()

    print("🗑️  Clearing existing data...")

    # Delete in child → parent order to respect FK constraints
    await db.institutionalmemory.delete_many()
    await db.employeenote.delete_many()
    await db.employeealert.delete_many()
    await db.meetinginsight.delete_many()
    await db.meeting.delete_many()
    await db.employee.delete_many()

    print("✅  Existing data cleared.\n")

    # ── 1. Create Employees ──────────────────────────────────

    print("👥  Creating employees...")
    employee_ids: list[str] = []

    for emp_data in EMPLOYEES:
        employee = await db.employee.create(data=emp_data)
        employee_ids.append(employee.id)
        print(f"   ✓ {employee.name} ({employee.department})")

    # Set up manager hierarchy: first employee (Priya) manages engineers
    # Meera (HR) manages non-engineering staff
    manager_assignments = {
        1: 0,   # Rahul → Priya
        5: 0,   # Arjun → Priya
        2: 6,   # Anjali → Meera
        3: 6,   # Vikram → Meera
        4: 6,   # Sneha → Meera
        7: 6,   # Karan → Meera (via Vikram's team conceptually)
        8: 2,   # Divya → Anjali
        9: 4,   # Rohan → Sneha
    }

    for emp_idx, mgr_idx in manager_assignments.items():
        await db.employee.update(
            where={"id": employee_ids[emp_idx]},
            data={"manager_id": employee_ids[mgr_idx]},
        )

    print(f"   ✓ Manager hierarchy established\n")

    # ── 2. Create Meetings (2 per employee) ──────────────────

    print("📅  Creating meetings...")
    meeting_ids: list[list[str]] = []  # meeting_ids[emp_idx] = [meeting1_id, meeting2_id]
    now = datetime.now(timezone.utc)

    for emp_idx, emp_id in enumerate(employee_ids):
        emp_meeting_ids: list[str] = []
        for m_idx in range(2):
            template = MEETING_TEMPLATES[m_idx][emp_idx]
            days_ago = 60 - (m_idx * 30)  # First meeting ~60 days ago, second ~30 days ago
            meeting_date = now - timedelta(days=days_ago)
            followup_date = now + timedelta(days=15 + (m_idx * 15))

            meeting = await db.meeting.create(
                data={
                    "employee_id": emp_id,
                    "hr_id": "hr-meera-nair",
                    "meeting_date": meeting_date,
                    "audio_url": f"https://storage.omnisync.com/meetings/{emp_id}/session-{m_idx + 1}.mp3",
                    "transcript": template["transcript"],
                    "summary": template["summary"],
                    "sentiment": template["sentiment"],
                    "next_followup_date": followup_date,
                }
            )
            emp_meeting_ids.append(meeting.id)

        meeting_ids.append(emp_meeting_ids)
        print(f"   ✓ 2 meetings for {EMPLOYEES[emp_idx]['name']}")

    print()

    # ── 3. Create Meeting Insights (1 per meeting) ───────────

    print("💡  Creating meeting insights...")
    for emp_idx in range(len(employee_ids)):
        for m_idx in range(2):
            template = INSIGHT_TEMPLATES[m_idx][emp_idx]
            await db.meetinginsight.create(
                data={
                    "meeting_id": meeting_ids[emp_idx][m_idx],
                    **template,
                }
            )

    print(f"   ✓ 20 insights created (1 per meeting)\n")

    # ── 4. Create Employee Alerts ────────────────────────────

    print("🚨  Creating employee alerts...")
    for alert in ALERT_DATA:
        emp_idx = alert["employee_idx"]
        await db.employeealert.create(
            data={
                "employee_id": employee_ids[emp_idx],
                "alert_type": alert["alert_type"],
                "description": alert["description"],
                "severity": alert["severity"],
            }
        )
        print(f"   ✓ {alert['alert_type']} alert for {EMPLOYEES[emp_idx]['name']} ({alert['severity']})")

    print()

    # ── 5. Create Employee Notes (2 per employee) ────────────

    print("📝  Creating employee notes...")
    for emp_idx, emp_id in enumerate(employee_ids):
        for note_text in NOTE_TEMPLATES[emp_idx]:
            await db.employeenote.create(
                data={
                    "employee_id": emp_id,
                    "note": note_text,
                    "created_by": "Meera Nair (HRBP)",
                }
            )

    print(f"   ✓ 20 notes created (2 per employee)\n")

    # ── 6. Create Institutional Memory (3 per employee) ──────

    print("🧠  Creating institutional memory timeline...")
    for emp_idx, emp_id in enumerate(employee_ids):
        for entry in MEMORY_TEMPLATES[emp_idx]:
            await db.institutionalmemory.create(
                data={
                    "employee_id": emp_id,
                    **entry,
                }
            )

    print(f"   ✓ 30 timeline events created (3 per employee)\n")

    # ── Summary ──────────────────────────────────────────────

    await db.disconnect()

    print("=" * 55)
    print("✅  Database seeded successfully!")
    print("=" * 55)
    print()
    print("  Employees:            10")
    print("  Meetings:             20  (2 per employee)")
    print("  Meeting Insights:     20  (1 per meeting)")
    print("  Employee Alerts:       4  (burnout, flight risk, skill gap, PIP)")
    print("  Employee Notes:       20  (2 per employee)")
    print("  Institutional Memory: 30  (3 per employee)")
    print("  ─────────────────────────")
    print("  Total records:       104")
    print()


if __name__ == "__main__":
    asyncio.run(main())
