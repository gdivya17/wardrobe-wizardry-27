
import React, { createContext, useContext, useState, useEffect } from "react";
import { ClothingItem, Outfit } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

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

// API base URL - change this to your Python backend URL
const API_URL = "http://localhost:8000";

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Load data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setItems([]);
        setOutfits([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch items
        const itemsResponse = await fetch(`${API_URL}/items`, {
          headers: getAuthHeaders()
        });
        
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch items');
        }
        
        const itemsData = await itemsResponse.json();
        const parsedItems = itemsData.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          lastWorn: item.lastWorn ? new Date(item.lastWorn) : undefined
        }));
        setItems(parsedItems);
        
        // Fetch outfits
        const outfitsResponse = await fetch(`${API_URL}/outfits`, {
          headers: getAuthHeaders()
        });
        
        if (!outfitsResponse.ok) {
          throw new Error('Failed to fetch outfits');
        }
        
        const outfitsData = await outfitsResponse.json();
        const parsedOutfits = outfitsData.map((outfit: any) => ({
          ...outfit,
          createdAt: new Date(outfit.createdAt),
          lastWorn: outfit.lastWorn ? new Date(outfit.lastWorn) : undefined
        }));
        setOutfits(parsedOutfits);
      } catch (error) {
        console.error("Failed to load closet data:", error);
        toast.error("Failed to load your wardrobe data");
        
        // Use mock data if API fails (for development)
        setItems(getMockClothingItems());
        setOutfits(getMockOutfits());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const addItem = async (newItem: Omit<ClothingItem, "id" | "createdAt">) => {
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      
      const addedItem = await response.json();
      const parsedItem: ClothingItem = {
        ...addedItem,
        createdAt: new Date(addedItem.createdAt),
        lastWorn: addedItem.lastWorn ? new Date(addedItem.lastWorn) : undefined
      };
      
      setItems((prev) => [...prev, parsedItem]);
      toast.success("Item added to your wardrobe");
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to add item to your wardrobe");
    }
  };

  const updateItem = async (id: string, updates: Partial<ClothingItem>) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      
      const updatedItem = await response.json();
      const parsedItem: ClothingItem = {
        ...updatedItem,
        createdAt: new Date(updatedItem.createdAt),
        lastWorn: updatedItem.lastWorn ? new Date(updatedItem.lastWorn) : undefined
      };
      
      setItems((prev) => 
        prev.map((item) => 
          item.id === id ? parsedItem : item
        )
      );
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed from your wardrobe");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
  };

  const addOutfit = async (newOutfit: Omit<Outfit, "id" | "createdAt">) => {
    try {
      const response = await fetch(`${API_URL}/outfits`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newOutfit)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add outfit');
      }
      
      const addedOutfit = await response.json();
      const parsedOutfit: Outfit = {
        ...addedOutfit,
        createdAt: new Date(addedOutfit.createdAt),
        lastWorn: addedOutfit.lastWorn ? new Date(addedOutfit.lastWorn) : undefined
      };
      
      setOutfits((prev) => [...prev, parsedOutfit]);
      toast.success("Outfit created successfully");
    } catch (error) {
      console.error("Failed to add outfit:", error);
      toast.error("Failed to create outfit");
    }
  };

  const updateOutfit = async (id: string, updates: Partial<Outfit>) => {
    try {
      const response = await fetch(`${API_URL}/outfits/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update outfit');
      }
      
      const updatedOutfit = await response.json();
      const parsedOutfit: Outfit = {
        ...updatedOutfit,
        createdAt: new Date(updatedOutfit.createdAt),
        lastWorn: updatedOutfit.lastWorn ? new Date(updatedOutfit.lastWorn) : undefined
      };
      
      setOutfits((prev) =>
        prev.map((outfit) =>
          outfit.id === id ? parsedOutfit : outfit
        )
      );
      toast.success("Outfit updated successfully");
    } catch (error) {
      console.error("Failed to update outfit:", error);
      toast.error("Failed to update outfit");
    }
  };

  const removeOutfit = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/outfits/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete outfit');
      }
      
      setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
      toast.success("Outfit removed successfully");
    } catch (error) {
      console.error("Failed to remove outfit:", error);
      toast.error("Failed to remove outfit");
    }
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
