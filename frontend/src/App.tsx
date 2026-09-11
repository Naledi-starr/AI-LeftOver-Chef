/**
 * Root application component.
 *
 * Owns top-level routing. Routes that require a logged-in user go
 * inside the <ProtectedRoute /> element.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PantryPage from "./pages/PantryPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import SavedRecipesPage from "./pages/SavedRecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import NotFoundPage from "./pages/NotFoundPage";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
            <Route path="/recipes" element={<SavedRecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;