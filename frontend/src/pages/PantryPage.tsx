/**
 * Pantry page.
 *
 * Lets the user add, edit, and remove pantry items. Reuses a single
 * form for both adding a new item and editing an existing one.
 */

import { useEffect, useState, type FormEvent } from "react";
import { Trash2, Pencil, X } from "lucide-react";

import AppHeader from "../components/layout/AppHeader";
import { useAuth } from "../hooks/useAuth";
import {
  ApiError,
  createPantryItem,
  deletePantryItem,
  listPantryItems,
  updatePantryItem,
} from "../services/api";
import type { PantryItem, PantryItemInput } from "../types/pantry";

const CATEGORY_SUGGESTIONS = [
  "produce",
  "dairy",
  "protein",
  "pantry",
  "frozen",
  "bakery",
  "condiments",
];

const EMPTY_FORM: PantryItemInput = {
  name: "",
  quantity: 1,
  unit: "",
  category: "",
  expiry_date: "",
};

const EXPIRY_BADGE_STYLES: Record<string, string> = {
  expired: "bg-tomato/10 text-tomato",
  expiring_soon: "bg-gold/30 text-forest",
  fresh: "bg-leaf/10 text-leaf",
};

const EXPIRY_LABELS: Record<string, string> = {
  expired: "Expired",
  expiring_soon: "Expiring soon",
  fresh: "Fresh",
};

function PantryPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<PantryItemInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    listPantryItems(token)
      .then(setItems)
      .catch(() => setError("We couldn't load your pantry."))
      .finally(() => setIsLoading(false));
  }, [token]);

  function startEdit(item: PantryItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit ?? "",
      category: item.category ?? "",
      expiry_date: item.expiry_date ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setIsSubmitting(true);

    const payload: PantryItemInput = {
      name: form.name,
      quantity: form.quantity,
      unit: form.unit || null,
      category: form.category || null,
      expiry_date: form.expiry_date || null,
    };

    try {
      if (editingId) {
        const updated = await updatePantryItem(token, editingId, payload);
        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item)),
        );
        cancelEdit();
      } else {
        const created = await createPantryItem(token, payload);
        setItems((prev) => [...prev, created]);
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "We couldn't save that item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;

    try {
      await deletePantryItem(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) cancelEdit();
    } catch {
      setError("We couldn't remove that item.");
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="mt-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
            Pantry
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-forest sm:text-5xl">
            What's in your kitchen.
          </h1>
        </section>

        {/* Add / edit form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-3xl border border-forest/10 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-forest">
              Item name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Carrots"
              className="w-full rounded-xl border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-forest">
              Quantity
            </label>
            <input
              required
              type="number"
              min="0.01"
              step="any"
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
              }
              className="w-full rounded-xl border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-forest">
              Unit
            </label>
            <input
              value={form.unit ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              placeholder="kg, ml…"
              className="w-full rounded-xl border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-forest">
              Category
            </label>
            <input
              list="pantry-categories"
              value={form.category ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              placeholder="produce…"
              className="w-full rounded-xl border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
            <datalist id="pantry-categories">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="flex items-end gap-2 lg:col-span-1">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-forest">
                Expiry date
              </label>
              <input
                type="date"
                value={form.expiry_date ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiry_date: e.target.value }))
                }
                className="w-full rounded-xl border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add to pantry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1.5 rounded-full border border-forest/20 px-5 py-3 text-sm font-semibold text-forest"
              >
                <X size={15} /> Cancel
              </button>
            )}
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-tomato/10 px-4 py-3 text-sm font-medium text-tomato"
          >
            {error}
          </p>
        )}

        {/* Item list */}
        <section className="mt-8">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading your pantry…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Your pantry is empty. Add your first item above.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest/10 bg-white px-5 py-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-forest">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                    {item.category && (
                      <span className="rounded-full bg-forest/5 px-3 py-1 text-xs font-medium text-forest/70">
                        {item.category}
                      </span>
                    )}
                    {item.expiry_status && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${EXPIRY_BADGE_STYLES[item.expiry_status]}`}
                      >
                        {EXPIRY_LABELS[item.expiry_status]}
                        {item.expiry_date ? ` · ${item.expiry_date}` : ""}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      aria-label={`Edit ${item.name}`}
                      className="rounded-full p-2 text-forest/60 transition hover:bg-forest/10 hover:text-forest"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="rounded-full p-2 text-tomato/60 transition hover:bg-tomato/10 hover:text-tomato"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default PantryPage;