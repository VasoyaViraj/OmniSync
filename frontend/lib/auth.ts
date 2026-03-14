export type UserRole = "junior" | "senior" | "admin";

export const HR_ACCOUNTS: { email: string; password: string; role: UserRole }[] = [
  // Junior HR (operational)
  { email: "junior.hr@omnisync.com", password: "password123", role: "junior" },
  // Senior HR (strategic)
  { email: "senior.hr@omnisync.com", password: "password123", role: "senior" },
  // Admin / Business Owner (CXO)
  { email: "admin.hr@omnisync.com", password: "password123", role: "admin" },
];

const SESSION_KEY = "omnisync_session";
const ROLE_KEY = "omnisync_role";

export function getSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === "true";
}

export function getRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ROLE_KEY) as UserRole | null;
  if (raw === "junior" || raw === "senior" || raw === "admin") return raw;
  return null;
}

export function setSession(role: UserRole) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ROLE_KEY);
  }
}
