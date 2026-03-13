import { Employee } from "./employee";

export interface MeetingInsight {
  id: string;
  meeting_id: string;
  key_takeaways: string | null;
  action_items: string | null;
  risk_flags: string | null;
  sentiment_score: number;
  created_at: string;
}

export interface Meeting {
  id: string;
  employee_id: string;
  hr_id: string;
  meeting_date: string;
  audio_url: string | null;
  transcript: string | null;
  summary: string | null;
  sentiment: string | null;
  next_followup_date: string | null;
  created_at: string;

  // Relations included in some endpoints
  employee?: Employee;
  insights?: MeetingInsight[];
}

export interface MeetingCreate {
  employee_id: string;
  hr_id: string;
  meeting_date: string;
  audio_url?: string;
  transcript?: string;
  summary?: string;
  sentiment?: string;
  next_followup_date?: string;
}

export interface MeetingUpdate extends Partial<MeetingCreate> {}
