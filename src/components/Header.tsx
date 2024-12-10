import React, { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Header() {
  const cookies = new Cookies();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout();
    cookies.set("authToken", null);
    localStorage.setItem("isAuth", "false");
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/settings");
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-6 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {/* <span className="font-medium text-gray-700">{user?.name}</span> */}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
              <button
                onClick={handleSettings}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
