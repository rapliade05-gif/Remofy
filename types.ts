
export interface StoreDetails {
  name: string;
  address: string;
  rating?: number;
  user_ratings_total?: number;
  phone?: string;
  website?: string;
  opening_hours?: string[];
  reviews?: Array<{author: string; text: string; rating: number}>;
  summary: string;
  category: string;
  mapUri: string;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  store: StoreDetails | null;
}
