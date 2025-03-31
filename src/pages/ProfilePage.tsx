
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useCloset } from "@/context/ClosetContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Heart, Clock, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/shared/BottomNavigation";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { items, outfits } = useCloset();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };
  
  const favoriteItems = items.filter(item => item.favorite);
  const favoriteOutfits = outfits.filter(outfit => outfit.favorite);
  
  return (
    <div className="pb-20">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </header>
      
      <main className="p-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 py-2">
              <div className="bg-closet-purple/20 p-3 rounded-full">
                <User size={24} className="text-closet-purple" />
              </div>
              <div>
                <p className="font-medium">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Wardrobe Stats</CardTitle>
            <CardDescription>Your closet at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={<Shirt size={20} className="text-closet-purple" />}
                label="Items" 
                value={items.length.toString()} 
              />
              <StatCard 
                icon={<Clock size={20} className="text-closet-purple" />}
                label="Outfits" 
                value={outfits.length.toString()} 
              />
              <StatCard 
                icon={<Heart size={20} className="text-closet-purple" />}
                label="Favorite Items" 
                value={favoriteItems.length.toString()} 
              />
              <StatCard 
                icon={<Heart size={20} className="text-closet-purple" />}
                label="Favorite Outfits" 
                value={favoriteOutfits.length.toString()} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Separator />
        
        <Button 
          variant="outline" 
          className="w-full text-destructive" 
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center space-x-2 mb-1">
      {icon}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default ProfilePage;
