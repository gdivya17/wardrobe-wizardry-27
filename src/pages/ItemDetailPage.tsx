
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCloset } from "@/context/ClosetContext";
import { Button } from "@/components/ui/button";
import { Heart, Edit, Trash, ArrowLeft } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import BottomNavigation from "@/components/shared/BottomNavigation";
import { ClothingItem } from "@/types";
import { cn } from "@/lib/utils";

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById, updateItem, removeItem } = useCloset();
  const navigate = useNavigate();
  
  const item = getItemById(id || "");
  
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Item not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  const handleToggleFavorite = () => {
    updateItem(item.id, { favorite: !item.favorite });
  };
  
  const handleDelete = () => {
    removeItem(item.id);
    navigate("/");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="pb-20">
      <header className="p-4 flex items-center border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Item Details</h1>
      </header>
      
      <main className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm"
              onClick={handleToggleFavorite}
            >
              <Heart
                size={24}
                className={cn(
                  "transition-colors",
                  item.favorite ? "fill-red-500 text-red-500" : "text-gray-400"
                )}
              />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{item.name}</h2>
              {item.brand && (
                <p className="text-muted-foreground">{item.brand}</p>
              )}
            </div>
            
            {item.description && (
              <p className="text-sm">{item.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <DetailCard label="Category" value={capitalizeFirstLetter(item.category)} />
              <DetailCard label="Color" value={capitalizeFirstLetter(item.color)} />
              <DetailCard 
                label="Seasons" 
                value={item.season.map(capitalizeFirstLetter).join(", ")} 
              />
              <DetailCard 
                label="Occasions" 
                value={item.occasion.map(capitalizeFirstLetter).join(", ")} 
              />
              <DetailCard label="Last Worn" value={formatDate(item.lastWorn)} />
              <DetailCard label="Added On" value={formatDate(item.createdAt)} />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                className="flex-1 btn-primary"
                onClick={() => navigate(`/edit-item/${item.id}`)}
              >
                <Edit size={18} className="mr-2" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1 text-destructive border-destructive">
                    <Trash size={18} className="mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this item from your wardrobe. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

interface DetailCardProps {
  label: string;
  value: string;
}

const DetailCard = ({ label, value }: DetailCardProps) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ItemDetailPage;
