
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemForm from "@/components/wardrobe/ItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCloset } from "@/context/ClosetContext";
import BottomNavigation from "@/components/shared/BottomNavigation";

const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById } = useCloset();
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
        <h1 className="text-xl font-semibold">Edit Item</h1>
      </header>
      
      <main className="p-4">
        <ItemForm existingItem={item} />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default EditItemPage;
