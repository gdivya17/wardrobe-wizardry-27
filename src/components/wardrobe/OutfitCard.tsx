
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Outfit, ClothingItem } from "@/types";
import { useCloset } from "@/context/ClosetContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface OutfitCardProps {
  outfit: Outfit;
  onClick?: () => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onClick }) => {
  const { updateOutfit, getItemById } = useCloset();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/outfit/${outfit.id}`);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateOutfit(outfit.id, { favorite: !outfit.favorite });
  };

  // Get first 3 items from the outfit to display
  const outfitItems = outfit.items
    .slice(0, 3)
    .map((id) => getItemById(id))
    .filter((item): item is ClothingItem => item !== undefined);

  return (
    <Card
      className="overflow-hidden card-shadow cursor-pointer h-56 relative"
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full">
        <div className="grid grid-cols-2 gap-1 h-44">
          {outfitItems.length > 0 ? (
            outfitItems.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "overflow-hidden",
                  index === 0 ? "col-span-2 h-28" : "h-full"
                )}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 h-full bg-gray-100 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No items</p>
            </div>
          )}
          <button
            className="absolute top-2 right-2 p-1 bg-white/70 backdrop-blur-sm rounded-full"
            onClick={toggleFavorite}
          >
            <Heart
              size={20}
              className={cn(
                "transition-colors",
                outfit.favorite ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>
        </div>
        <div className="p-2 bg-white">
          <h3 className="font-medium text-sm line-clamp-1">{outfit.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {outfit.items.length} {outfit.items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
