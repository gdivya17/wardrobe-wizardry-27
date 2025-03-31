
import React, { useState } from "react";
import { useCloset } from "@/context/ClosetContext";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClothingItemCard from "@/components/wardrobe/ClothingItem";
import OutfitCard from "@/components/wardrobe/OutfitCard";
import BottomNavigation from "@/components/shared/BottomNavigation";
import { ClothingCategory } from "@/types";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { items, outfits, isLoading } = useCloset();
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | "all">("all");
  
  const categories: (ClothingCategory | "all")[] = ["all", "tops", "bottoms", "outerwear", "dresses", "shoes", "accessories"];
  
  const filteredItems = activeCategory === "all" 
    ? items 
    : items.filter(item => item.category === activeCategory);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your wardrobe...</div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || "Fashionista"}</h1>
        <p className="text-muted-foreground">Your personal wardrobe assistant</p>
      </header>
      
      <main className="p-4">
        <Tabs defaultValue="wardrobe" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="wardrobe">My Wardrobe</TabsTrigger>
            <TabsTrigger value="outfits">My Outfits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wardrobe" className="mt-0">
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex space-x-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-closet-purple text-closet-dark font-medium"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <ClothingItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items found in this category.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="outfits" className="mt-0">
            {outfits.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {outfits.map((outfit) => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't created any outfits yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
