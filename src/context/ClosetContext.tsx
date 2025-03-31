
import React, { createContext, useContext, useState, useEffect } from "react";
import { ClothingItem, Outfit } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ClosetContextType {
  items: ClothingItem[];
  outfits: Outfit[];
  isLoading: boolean;
  addItem: (item: Omit<ClothingItem, "id" | "createdAt">) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  removeItem: (id: string) => void;
  addOutfit: (outfit: Omit<Outfit, "id" | "createdAt">) => void;
  updateOutfit: (id: string, updates: Partial<Outfit>) => void;
  removeOutfit: (id: string) => void;
  getItemById: (id: string) => ClothingItem | undefined;
  getOutfitById: (id: string) => Outfit | undefined;
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

export const useCloset = () => {
  const context = useContext(ClosetContext);
  if (context === undefined) {
    throw new Error("useCloset must be used within a ClosetProvider");
  }
  return context;
};

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setItems([]);
        setOutfits([]);
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, we would fetch from Supabase here
        const storedItems = localStorage.getItem(`items-${user.id}`);
        const storedOutfits = localStorage.getItem(`outfits-${user.id}`);
        
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        } else {
          // Mock data for demo purposes
          setItems(getMockClothingItems());
        }
        
        if (storedOutfits) {
          setOutfits(JSON.parse(storedOutfits));
        } else {
          // Load mock outfits
          setOutfits(getMockOutfits());
        }
      } catch (error) {
        console.error("Failed to load closet data:", error);
        toast({
          title: "Error",
          description: "Failed to load your wardrobe data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  // Save data whenever it changes
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`items-${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  useEffect(() => {
    if (user && outfits.length > 0) {
      localStorage.setItem(`outfits-${user.id}`, JSON.stringify(outfits));
    }
  }, [outfits, user]);

  const addItem = (newItem: Omit<ClothingItem, "id" | "createdAt">) => {
    const item: ClothingItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setItems((prev) => [...prev, item]);
    toast({
      title: "Item Added",
      description: "Successfully added to your wardrobe",
    });
  };

  const updateItem = (id: string, updates: Partial<ClothingItem>) => {
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    toast({
      title: "Item Updated",
      description: "Successfully updated your item",
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // Also remove item from any outfits
    setOutfits((prev) =>
      prev.map((outfit) => ({
        ...outfit,
        items: outfit.items.filter((itemId) => itemId !== id),
      }))
    );
    toast({
      title: "Item Removed",
      description: "Successfully removed from your wardrobe",
    });
  };

  const addOutfit = (newOutfit: Omit<Outfit, "id" | "createdAt">) => {
    const outfit: Outfit = {
      ...newOutfit,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setOutfits((prev) => [...prev, outfit]);
    toast({
      title: "Outfit Created",
      description: "Successfully created a new outfit",
    });
  };

  const updateOutfit = (id: string, updates: Partial<Outfit>) => {
    setOutfits((prev) =>
      prev.map((outfit) =>
        outfit.id === id ? { ...outfit, ...updates } : outfit
      )
    );
    toast({
      title: "Outfit Updated",
      description: "Successfully updated your outfit",
    });
  };

  const removeOutfit = (id: string) => {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
    toast({
      title: "Outfit Removed",
      description: "Successfully removed the outfit",
    });
  };

  const getItemById = (id: string) => {
    return items.find((item) => item.id === id);
  };

  const getOutfitById = (id: string) => {
    return outfits.find((outfit) => outfit.id === id);
  };

  return (
    <ClosetContext.Provider
      value={{
        items,
        outfits,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        addOutfit,
        updateOutfit,
        removeOutfit,
        getItemById,
        getOutfitById,
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
};

// Mock data for development
function getMockClothingItems(): ClothingItem[] {
  return [
    {
      id: "1",
      name: "White T-Shirt",
      description: "Basic cotton t-shirt",
      imageUrl: "/placeholder.svg",
      category: "tops",
      color: "white",
      season: ["spring", "summer", "fall"],
      occasion: ["casual"],
      brand: "Basics Co",
      favorite: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Blue Jeans",
      description: "Classic blue denim jeans",
      imageUrl: "/placeholder.svg",
      category: "bottoms",
      color: "blue",
      season: ["spring", "fall", "winter"],
      occasion: ["casual"],
      brand: "Denim Life",
      favorite: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Black Dress",
      description: "Elegant black dress for formal occasions",
      imageUrl: "/placeholder.svg",
      category: "dresses",
      color: "black",
      season: ["all"],
      occasion: ["formal", "special"],
      brand: "Elegance",
      favorite: false,
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "Brown Leather Jacket",
      description: "Vintage style leather jacket",
      imageUrl: "/placeholder.svg",
      category: "outerwear",
      color: "brown",
      season: ["fall", "winter"],
      occasion: ["casual"],
      brand: "Leather Co",
      favorite: true,
      createdAt: new Date(),
    },
    {
      id: "5",
      name: "Running Shoes",
      description: "Athletic shoes for running",
      imageUrl: "/placeholder.svg",
      category: "shoes",
      color: "multicolor",
      season: ["all"],
      occasion: ["athletic", "casual"],
      brand: "Runner Pro",
      favorite: false,
      createdAt: new Date(),
    },
    {
      id: "6",
      name: "Silver Necklace",
      description: "Simple silver pendant necklace",
      imageUrl: "/placeholder.svg",
      category: "accessories",
      color: "silver",
      season: ["all"],
      occasion: ["casual", "formal"],
      brand: "Silver Crafts",
      favorite: true,
      createdAt: new Date(),
    }
  ];
}

function getMockOutfits(): Outfit[] {
  return [
    {
      id: "1",
      name: "Casual Weekend",
      description: "Comfortable outfit for weekend errands",
      items: ["1", "2", "5"],
      occasion: ["casual"],
      season: ["spring", "fall"],
      favorite: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Night Out",
      description: "Elegant outfit for evening events",
      items: ["3", "6"],
      occasion: ["formal", "special"],
      season: ["all"],
      favorite: false,
      createdAt: new Date(),
    }
  ];
}
