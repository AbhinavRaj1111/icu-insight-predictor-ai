
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, FileInput, Info, Home, BarChart2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAccountMenu from "@/components/UserAccountMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Input Data", href: "/input-data", icon: FileInput },
    { name: "Predictions", href: "/predictions", icon: BarChart2 },
    { name: "Model Info", href: "/model-info", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="medical-container">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-medical-600" />
                <span className="font-bold text-xl text-gray-900">ICU Insight</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-medical-500 hover:text-gray-700"
                >
                  <item.icon className="mr-1 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <UserAccountMenu />
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-medical-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-medical-500 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <UserAccountMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
