
import React, { useState } from "react";
import { useCloset } from "@/context/ClosetContext";
import BottomNavigation from "@/components/shared/BottomNavigation";
import OutfitCard from "@/components/wardrobe/OutfitCard";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OutfitsPage: React.FC = () => {
  const { outfits, isLoading } = useCloset();
  const navigate = useNavigate();
  
  const favoriteOutfits = outfits.filter(outfit => outfit.favorite);
  const recentOutfits = [...outfits].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your outfits...</div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Outfits</h1>
          <Button 
            onClick={() => navigate("/create-outfit")}
            className="btn-primary"
          >
            <Plus size={18} className="mr-1" />
            New
          </Button>
        </div>
        <p className="text-muted-foreground">
          {outfits.length} {outfits.length === 1 ? "outfit" : "outfits"} in your collection
        </p>
      </header>
      
      <main className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart size={16} className="mr-1" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock size={16} className="mr-1" />
              Recent
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {outfits.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {outfits.map((outfit) => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No outfits yet" 
                subMessage="Create your first outfit to see it here"
                onButtonClick={() => navigate("/create-outfit")}
              />
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            {favoriteOutfits.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {favoriteOutfits.map((outfit) => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No favorite outfits" 
                subMessage="Mark outfits as favorites to see them here"
              />
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            {recentOutfits.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {recentOutfits.map((outfit) => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No recent outfits" 
                subMessage="Create outfits to see them here"
                onButtonClick={() => navigate("/create-outfit")}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

interface EmptyStateProps {
  message: string;
  subMessage: string;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  subMessage,
  onButtonClick
}) => {
  return (
    <div className="text-center py-8">
      <p className="text-lg font-medium">{message}</p>
      <p className="text-muted-foreground mt-1 mb-4">{subMessage}</p>
      {onButtonClick && (
        <Button onClick={onButtonClick} className="btn-primary">
          <Plus size={18} className="mr-1" />
          Create Outfit
        </Button>
      )}
    </div>
  );
};

export default OutfitsPage;
