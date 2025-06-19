
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onCreateSuggestion: () => void;
}

const Header = ({ onCreateSuggestion }: HeaderProps) => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/placeholder.svg" 
              alt="MK Solutions" 
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MK Solutions
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              onClick={onCreateSuggestion}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
            >
              Nova Sugestão
            </Button>
            <Button
              onClick={handleAdminClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
