
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserIcon, LogOut, History, Settings } from "lucide-react";

const UserAccountMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate("/login")}
          className="text-medical-600 border-medical-600 hover:bg-medical-50"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate("/signup")}
          className="bg-medical-600 hover:bg-medical-700 text-white"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <div className="h-8 w-8 rounded-full bg-medical-100 flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-medical-600" />
        </div>
        <span className="hidden md:inline-block">{user?.name}</span>
      </Button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
          onBlur={() => setShowDropdown(false)}
        >
          <div className="py-1 border-b">
            <div className="px-4 py-2 text-sm text-gray-700">
              Signed in as <span className="font-medium">{user?.email}</span>
            </div>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                navigate("/predictions");
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <History className="mr-2 h-4 w-4" />
              Prediction History
            </button>
            <button
              onClick={() => {
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
          </div>
          <div className="py-1 border-t">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
