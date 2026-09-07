/**
 * API service for communicating with the AI Leftover Chef backend.
 *
 * All HTTP communication with the FastAPI backend should be centralised
 * in this module. This prevents API URLs and request logic from being
 * duplicated throughout the frontend application.
 */

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Checks whether the backend API is available.
 *
 * @returns A promise containing the backend health response.
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  application: string;
}> {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error("Backend API is unavailable.");
  }

  return response.json();
}