import type { Recipe, RecipeRequest } from "../types/recipe";
import type { TokenResponse, User } from "../types/auth";

/**
 * API service for communicating with the AI Leftover Chef backend.
 *
 * All HTTP communication with the FastAPI backend should be centralised
 * in this module. This prevents API URLs and request logic from being
 * duplicated throughout the frontend application.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

/**
 * Error thrown when the backend responds with a non-2xx status.
 * Carries the human-readable detail message from the API, if present.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Performs a fetch against the backend and normalizes error handling.
 *
 * On a non-2xx response, attempts to extract FastAPI's `{ "detail": "..." }`
 * error shape and throws an ApiError with that message. Returns undefined
 * for 204 No Content responses.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") {
        message = body.detail;
      }
    } catch {
      // Response body wasn't JSON; fall back to the generic message.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Checks whether the backend API is available.
 *
 * @returns A promise containing the backend health response.
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  application: string;
}> {
  return apiFetch("/");
}

export async function generateRecipe(request: RecipeRequest): Promise<Recipe> {
  return apiFetch("/api/recipes/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

// --- Authentication API functions ---

/**
 * Registers a new user account.
 */
export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Logs a user in and returns a JWT access token.
 *
 * Uses the OAuth2 password flow expected by the backend, which requires
 * a form-encoded body rather than JSON.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  return apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

/**
 * Fetches the profile of the currently authenticated user.
 */
export async function fetchCurrentUser(token: string): Promise<User> {
  return apiFetch("/users/me", {}, token);
}