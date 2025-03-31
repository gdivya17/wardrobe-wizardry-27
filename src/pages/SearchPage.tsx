
import React, { useState, useEffect } from "react";
import { useCloset } from "@/context/ClosetContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClothingItemCard from "@/components/wardrobe/ClothingItem";
import OutfitCard from "@/components/wardrobe/OutfitCard";
import BottomNavigation from "@/components/shared/BottomNavigation";
import { Search as SearchIcon, X } from "lucide-react";
import { ClothingItem, Outfit } from "@/types";

const SearchPage: React.FC = () => {
  const { items, outfits } = useCloset();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems([]);
      setFilteredOutfits([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Filter items
    const matchingItems = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.description?.toLowerCase().includes(query)) ||
      (item.brand?.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query) ||
      item.color.toLowerCase().includes(query) ||
      item.season.some(season => season.toLowerCase().includes(query)) ||
      item.occasion.some(occasion => occasion.toLowerCase().includes(query))
    );
    
    setFilteredItems(matchingItems);
    
    // Filter outfits
    const matchingOutfits = outfits.filter(outfit => 
      outfit.name.toLowerCase().includes(query) ||
      (outfit.description?.toLowerCase().includes(query)) ||
      outfit.season.some(season => season.toLowerCase().includes(query)) ||
      outfit.occasion.some(occasion => occasion.toLowerCase().includes(query))
    );
    
    setFilteredOutfits(matchingOutfits);
    
  }, [searchQuery, items, outfits]);
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  const hasResults = filteredItems.length > 0 || filteredOutfits.length > 0;
  const isSearching = searchQuery.trim() !== "";

  return (
    <div className="pb-20">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <div className="flex items-center relative">
          <SearchIcon 
            size={18} 
            className="absolute left-3 text-muted-foreground pointer-events-none" 
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your wardrobe..."
            className="pl-10 pr-10 py-6 input-field"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2"
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </header>
      
      <main className="p-4">
        {isSearching ? (
          hasResults ? (
            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="items">
                  Items ({filteredItems.length})
                </TabsTrigger>
                <TabsTrigger value="outfits">
                  Outfits ({filteredOutfits.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="items" className="mt-0">
                <div className="grid grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <ClothingItemCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="outfits" className="mt-0">
                <div className="grid grid-cols-2 gap-4">
                  {filteredOutfits.map((outfit) => (
                    <OutfitCard key={outfit.id} outfit={outfit} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-muted-foreground mt-1">
                Try different keywords or filters
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <SearchIcon size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Search your wardrobe</p>
            <p className="text-muted-foreground mt-1">
              Find items by name, color, category, or occasion
            </p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
