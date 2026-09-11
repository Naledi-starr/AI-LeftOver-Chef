/**
 * Shopping list page.
 */

import { useEffect, useState, type FormEvent } from "react";
import { Trash2, ArrowRightCircle } from "lucide-react";

import AppHeader from "../components/layout/AppHeader";
import { useAuth } from "../hooks/useAuth";
import {
  ApiError,
  createShoppingListItem,
  deleteShoppingListItem,
  listShoppingListItems,
  movePurchasedItemsToPantry,
  updateShoppingListItem,
} from "../services/api";
import type { ShoppingListItem, ShoppingListItemInput } from "../types/shoppingList";

const EMPTY_FORM: ShoppingListItemInput = {
  name: "",
  quantity: 1,
  unit: "",
  category: "",
};

function ShoppingListPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<ShoppingListItemInput>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (!token) return;

    listShoppingListItems(token)
      .then(setItems)
      .catch(() => setError("We couldn't load your shopping list."))
      .finally(() => setIsLoading(false));
  }, [token]);

  const purchasedCount = items.filter((item) => item.is_purchased).length;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const created = await createShoppingListItem(token, {
        name: form.name,
        quantity: form.quantity,
        unit: form.unit || null,
        category: form.category || null,
      });
      setItems((prev) => [...prev, created]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "We couldn't add that item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function togglePurchased(item: ShoppingListItem) {
    if (!token) return;

    try {
      const updated = await updateShoppingListItem(token, item.id, {
        is_purchased: !item.is_purchased,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch {
      setError("We couldn't update that item.");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;

    try {
      await deleteShoppingListItem(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("We couldn't remove that item.");
    }
  }

  async function handleMoveToPantry() {
    if (!token) return;

    setError(null);
    setIsMoving(true);
    try {
      const movedItems = await movePurchasedItemsToPantry(token);
      setItems((prev) => prev.filter((item) => !item.is_purchased));
      setNotice(
        `Moved ${movedItems.length} item${movedItems.length === 1 ? "" : "s"} into your pantry.`,
      );
    } catch {
      setError("We couldn't move those items to your pantry.");
    } finally {
      setIsMoving(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <AppHeader />

        <section className="mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
              Shopping list
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-forest sm:text-5xl">
              What to pick up.
            </h1>
          </div>

          {purchasedCount > 0 && (
            <button
              type="button"
              onClick={handleMoveToPantry}
              disabled={isMoving}
              className="flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowRightCircle size={16} />
              {isMoving
                ? "Moving…"
                : `Move ${purchasedCount} purchased item${purchasedCount === 1 ? "" : "s"} to pantry`}
            </button>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-3xl border border-forest/10 bg-white p-6 shadow-sm sm:grid-cols-4"
        >
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-forest">
              Item name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Olive oil"
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
              placeholder="l, pcs…"
              className="w-full rounded-xl border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add item
            </button>
          </div>
        </form>

        {notice && (
          <p className="mt-4 rounded-xl bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
            {notice}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-tomato/10 px-4 py-3 text-sm font-medium text-tomato"
          >
            {error}
          </p>
        )}

        <section className="mt-8">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading your list…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Your shopping list is empty.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 transition ${
                    item.is_purchased
                      ? "border-forest/5 bg-white/50"
                      : "border-forest/10 bg-white"
                  }`}
                >
                  <label className="flex flex-1 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.is_purchased}
                      onChange={() => togglePurchased(item)}
                      className="h-5 w-5 rounded border-forest/30 text-forest focus:ring-forest/30"
                    />
                    <span
                      className={`font-semibold ${
                        item.is_purchased
                          ? "text-gray-400 line-through"
                          : "text-forest"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded-full p-2 text-tomato/60 transition hover:bg-tomato/10 hover:text-tomato"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default ShoppingListPage;