import api from "./axiosInstance";

/**
 * POST /auth/login
 * Authenticates the user and stores the access token + user object in localStorage.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ accessToken: string, user: object }>}
 */
export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  const { accessToken, user } = response.data;

  // STRICT ROLE CHECK: Only allow HODs to login
  if (user.role !== "HOD") {
    throw new Error("Access Denied: Only HODs are allowed to access this portal.");
  }

  // Persist session only if they are an HOD
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { accessToken, user };
}

/**
 * Clears the local session (use on explicit logout).
 */
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

/**
 * Returns the currently stored user object, or null if not logged in.
 * @returns {object|null}
 */
export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

/**
 * Returns true if a session token exists.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return Boolean(localStorage.getItem("accessToken"));
}
