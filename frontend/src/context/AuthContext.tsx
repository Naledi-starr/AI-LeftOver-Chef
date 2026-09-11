/**
 * Authentication context.
 *
 * Owns the current JWT access token and user profile, persists the
 * token to localStorage, and exposes login/register/logout actions.
 */

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, loginUser, registerUser } from "../services/api";
import type { User } from "../types/auth";
import { AuthContext } from "./AuthContextDefinition";

const TOKEN_STORAGE_KEY = "leftover_chef_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function resolveSession() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(token);

        if (!isCancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!isCancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    resolveSession();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  async function login(email: string, password: string) {
    const { access_token } = await loginUser(email, password);

    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
  }

  async function register(email: string, password: string) {
    await registerUser(email, password);

    // Registration does not return a token,
    // so log the user in immediately afterwards.
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}