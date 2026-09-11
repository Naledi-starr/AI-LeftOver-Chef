export interface ShoppingListItem {
  id: number;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  is_purchased: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItemInput {
  name: string;
  quantity: number;
  unit?: string | null;
  category?: string | null;
}