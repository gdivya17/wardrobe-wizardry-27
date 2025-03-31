
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
};

export type ClothingCategory = 
  | "tops" 
  | "bottoms" 
  | "outerwear" 
  | "dresses" 
  | "shoes" 
  | "accessories";

export type ClothingColor = 
  | "black" 
  | "white" 
  | "red" 
  | "blue" 
  | "green" 
  | "yellow" 
  | "purple" 
  | "pink" 
  | "brown" 
  | "gray" 
  | "multicolor" 
  | "other";

export type ClothingSeason = 
  | "spring" 
  | "summer" 
  | "fall" 
  | "winter" 
  | "all";

export type ClothingOccasion = 
  | "casual" 
  | "formal" 
  | "business" 
  | "athletic" 
  | "special" 
  | "other";

export interface ClothingItem {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  category: ClothingCategory;
  color: ClothingColor;
  season: ClothingSeason[];
  occasion: ClothingOccasion[];
  brand?: string;
  favorite: boolean;
  lastWorn?: Date;
  createdAt: Date;
}

export interface Outfit {
  id: string;
  name: string;
  description?: string;
  items: string[]; // Array of ClothingItem IDs
  occasion: ClothingOccasion[];
  season: ClothingSeason[];
  favorite: boolean;
  lastWorn?: Date;
  createdAt: Date;
}
