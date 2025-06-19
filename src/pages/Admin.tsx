
import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardTab from "@/components/admin/DashboardTab";
import RoadmapTab from "@/components/admin/RoadmapTab";
import SuggestionsTab from "@/components/admin/SuggestionsTab";
import ChangelogTab from "@/components/admin/ChangelogTab";
import UsersTab from "@/components/admin/UsersTab";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "roadmap":
        return <RoadmapTab />;
      case "suggestions":
        return <SuggestionsTab />;
      case "changelog":
        return <ChangelogTab />;
      case "users":
        return <UsersTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-4 bg-white dark:bg-gray-900">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
              <h2 className="text-lg font-semibold capitalize flex-1 text-gray-900 dark:text-white">
                {activeTab === "suggestions" ? "Sugestões" : 
                 activeTab === "users" ? "Usuários e Permissões" : 
                 activeTab}
              </h2>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  onClick={handleHomeClick}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <House className="w-4 h-4" />
                  Home
                </Button>
              </div>
            </header>
            <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
              {renderContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
