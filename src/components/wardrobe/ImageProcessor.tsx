
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ImageProcessorProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ 
  imageUrl, 
  onImageChange,
  className = ""
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      onImageChange(previewUrl);
      
      // Process the image if user is logged in
      if (user) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch("http://localhost:8000/images/remove-background/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error("Failed to process image");
        }
        
        const data = await response.json();
        
        // Create a data URL from the base64 string
        const processedImageUrl = `data:image/png;base64,${data.base64_image}`;
        onImageChange(processedImageUrl);
        toast.success("Background removed successfully!");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemoveImage = () => {
    onImageChange("/placeholder.svg");
  };
  
  return (
    <div 
      className={`relative w-40 h-40 bg-gray-100 rounded-lg overflow-hidden ${className}`}
    >
      <img 
        src={imageUrl} 
        alt="Clothing preview" 
        className="w-full h-full object-cover"
      />
      
      {isProcessing ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Processing...</span>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity">
          <label className="cursor-pointer flex flex-col items-center justify-center p-2">
            <Upload size={24} />
            <span className="text-sm mt-1">Upload Image</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
            />
          </label>
          
          {imageUrl !== "/placeholder.svg" && (
            <Button 
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={handleRemoveImage}
            >
              <Trash2 size={16} className="mr-1" />
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;
