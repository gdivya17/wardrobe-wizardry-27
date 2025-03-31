
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ClothingCategory, ClothingColor, ClothingSeason, ClothingOccasion, ClothingItem } from "@/types";
import { useCloset } from "@/context/ClosetContext";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

interface ItemFormProps {
  existingItem?: ClothingItem;
}

const ItemForm: React.FC<ItemFormProps> = ({ existingItem }) => {
  const [name, setName] = useState(existingItem?.name || "");
  const [description, setDescription] = useState(existingItem?.description || "");
  const [category, setCategory] = useState<ClothingCategory>(existingItem?.category || "tops");
  const [color, setColor] = useState<ClothingColor>(existingItem?.color || "black");
  const [brand, setBrand] = useState(existingItem?.brand || "");
  const [selectedSeasons, setSelectedSeasons] = useState<ClothingSeason[]>(existingItem?.season || []);
  const [selectedOccasions, setSelectedOccasions] = useState<ClothingOccasion[]>(existingItem?.occasion || []);
  const [imageUrl, setImageUrl] = useState(existingItem?.imageUrl || "/placeholder.svg");
  
  const { addItem, updateItem } = useCloset();
  const navigate = useNavigate();
  
  const isEditing = !!existingItem;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      name,
      description,
      category,
      color,
      brand,
      season: selectedSeasons,
      occasion: selectedOccasions,
      imageUrl,
      favorite: existingItem?.favorite || false,
    };
    
    if (isEditing && existingItem) {
      updateItem(existingItem.id, itemData);
      navigate(`/item/${existingItem.id}`);
    } else {
      addItem(itemData);
      navigate("/");
    }
  };

  const handleSeasonToggle = (season: ClothingSeason) => {
    setSelectedSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season) 
        : [...prev, season]
    );
  };

  const handleOccasionToggle = (occasion: ClothingOccasion) => {
    setSelectedOccasions(prev => 
      prev.includes(occasion) 
        ? prev.filter(o => o !== occasion) 
        : [...prev, occasion]
    );
  };
  
  const handleImageUpload = () => {
    // In a real app, we'd handle file uploads
    // For now, we're using placeholder images
    alert("Image upload would be implemented with Supabase Storage in a real app");
  };

  const categories: ClothingCategory[] = ["tops", "bottoms", "outerwear", "dresses", "shoes", "accessories"];
  const colors: ClothingColor[] = ["black", "white", "red", "blue", "green", "yellow", "purple", "pink", "brown", "gray", "multicolor", "other"];
  const seasons: ClothingSeason[] = ["spring", "summer", "fall", "winter", "all"];
  const occasions: ClothingOccasion[] = ["casual", "formal", "business", "athletic", "special", "other"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-center mb-4">
          <div 
            className="relative w-40 h-40 bg-gray-100 rounded-lg overflow-hidden"
            onClick={handleImageUpload}
          >
            <img 
              src={imageUrl} 
              alt="Clothing preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white hover:bg-black/50 transition-colors cursor-pointer">
              <Upload size={24} />
              <span className="ml-2">Upload Image</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Item Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="White T-Shirt"
          required
          className="input-field"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="100% cotton basic tee"
          className="min-h-[80px] input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as ClothingCategory)}
            required
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color *</Label>
          <Select 
            value={color} 
            onValueChange={(value) => setColor(value as ClothingColor)}
            required
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map(col => (
                <SelectItem key={col} value={col} className="capitalize">
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand name"
          className="input-field"
        />
      </div>

      <div className="space-y-2">
        <Label>Seasons</Label>
        <div className="flex flex-wrap gap-2">
          {seasons.map(season => (
            <div key={season} className="flex items-center space-x-2">
              <Checkbox 
                id={`season-${season}`}
                checked={selectedSeasons.includes(season)}
                onCheckedChange={() => handleSeasonToggle(season)}
              />
              <label
                htmlFor={`season-${season}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {season}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Occasions</Label>
        <div className="flex flex-wrap gap-2">
          {occasions.map(occasion => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox 
                id={`occasion-${occasion}`}
                checked={selectedOccasions.includes(occasion)}
                onCheckedChange={() => handleOccasionToggle(occasion)}
              />
              <label
                htmlFor={`occasion-${occasion}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {occasion}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full btn-primary">
        {isEditing ? "Update Item" : "Add to Wardrobe"}
      </Button>
    </form>
  );
};

export default ItemForm;
