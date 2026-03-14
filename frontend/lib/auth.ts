export const HR_ACCOUNTS = [
  { email: "hr1@omnisync.com", password: "password123" },
  { email: "hr2@omnisync.com", password: "password123" },
  { email: "hr3@omnisync.com", password: "password123" },
];

export function getSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("omnisync_session") === "true";
}

export function setSession() {
  if (typeof window !== "undefined") {
    localStorage.setItem("omnisync_session", "true");
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("omnisync_session");
  }
}
