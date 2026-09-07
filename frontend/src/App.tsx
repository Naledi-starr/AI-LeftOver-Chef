/**
 * Main application component for AI Leftover Chef.
 *
 * This component demonstrates communication between the React frontend
 * and the FastAPI backend.
 */

import { useEffect, useState } from "react";

import { checkBackendHealth } from "./services/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    checkBackendHealth()
      .then((data) => {
        setBackendStatus(`${data.application} is ${data.status}`);
      })
      .catch(() => {
        setBackendStatus("Backend unavailable");
      });
  }, []);

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <section className="text-center px-6">
        <h1 className="text-5xl font-bold text-green-700">
          AI Leftover Chef 🍳
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          Turn your leftovers into delicious recipes.
        </p>

        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <p className="font-medium">
            Backend: {backendStatus}
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;