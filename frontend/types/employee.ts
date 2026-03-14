export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  engagementScore: number; // 0-100
  performanceScore: number; // 0-100
  avatar?: string;
}
