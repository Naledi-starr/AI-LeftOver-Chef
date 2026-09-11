export type ExpiryStatus = "expired" | "expiring_soon" | "fresh" | null;

export interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  expiry_date: string | null;
  expiry_status: ExpiryStatus;
  created_at: string;
  updated_at: string;
}

export interface PantryItemInput {
  name: string;
  quantity: number;
  unit?: string | null;
  category?: string | null;
  expiry_date?: string | null;
}