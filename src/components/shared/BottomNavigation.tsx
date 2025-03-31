
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Plus, Heart, User } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 flex justify-around items-center z-10">
      <NavItem 
        icon={<Home size={24} />} 
        label="Home" 
        isActive={activeTab === "/"} 
        onClick={() => handleNavigation("/")} 
      />
      <NavItem 
        icon={<Search size={24} />} 
        label="Search" 
        isActive={activeTab === "/search"} 
        onClick={() => handleNavigation("/search")} 
      />
      <NavItem 
        icon={<Plus size={28} />} 
        label="Add" 
        isActive={activeTab === "/add-item"} 
        onClick={() => handleNavigation("/add-item")} 
        isPrimary
      />
      <NavItem 
        icon={<Heart size={24} />} 
        label="Outfits" 
        isActive={activeTab === "/outfits"} 
        onClick={() => handleNavigation("/outfits")} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Profile" 
        isActive={activeTab === "/profile"} 
        onClick={() => handleNavigation("/profile")} 
      />
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isPrimary?: boolean;
}

const NavItem = ({ icon, label, isActive, onClick, isPrimary = false }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${
        isPrimary 
          ? "text-white bg-closet-purple rounded-full p-2 -mt-6 shadow-lg" 
          : `text-${isActive ? "closet-purple" : "closet-charcoal"}`
      }`}
    >
      <div className="text-current">{icon}</div>
      <span className={`text-xs mt-1 ${isPrimary ? "text-closet-purple" : ""}`}>
        {label}
      </span>
    </button>
  );
};

export default BottomNavigation;
