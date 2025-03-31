
import React from "react";
import { useNavigate } from "react-router-dom";
import ItemForm from "@/components/wardrobe/ItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/shared/BottomNavigation";

const AddItemPage: React.FC = () => {
  const navigate = useNavigate();

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
        <h1 className="text-xl font-semibold">Add New Item</h1>
      </header>
      
      <main className="p-4">
        <ItemForm />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AddItemPage;
