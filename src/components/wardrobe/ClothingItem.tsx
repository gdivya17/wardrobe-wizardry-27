
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { ClothingItem as ClothingItemType } from "@/types";
import { useCloset } from "@/context/ClosetContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ClothingItemCardProps {
  item: ClothingItemType;
  onClick?: () => void;
}

const ClothingItemCard: React.FC<ClothingItemCardProps> = ({
  item,
  onClick,
}) => {
  const { updateItem } = useCloset();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/item/${item.id}`);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateItem(item.id, { favorite: !item.favorite });
  };

  return (
    <Card
      className="overflow-hidden card-shadow cursor-pointer h-56 relative"
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full">
        <div className="relative h-44">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            className="absolute top-2 right-2 p-1 bg-white/70 backdrop-blur-sm rounded-full"
            onClick={toggleFavorite}
          >
            <Heart
              size={20}
              className={cn(
                "transition-colors",
                item.favorite ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>
        </div>
        <div className="p-2 bg-white">
          <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClothingItemCard;
