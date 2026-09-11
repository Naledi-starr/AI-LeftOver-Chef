/**
 * Registration page.
 */

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";

const MIN_PASSWORD_LENGTH = 8;

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn't create your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-white/80 p-8 shadow-xl backdrop-blur-sm sm:p-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-3 text-lg font-bold text-forest"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-black text-forest">
            AL
          </span>
          <span>leftover chef</span>
        </Link>

        <h1 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
          Create your account.
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Save recipes, track your pantry, and build shopping lists.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-forest"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-forest"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              At least {MIN_PASSWORD_LENGTH} characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-forest"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-tomato/10 px-4 py-3 text-sm font-medium text-tomato"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-forest px-6 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-forest underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;