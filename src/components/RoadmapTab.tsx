
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ThumbsUp, Lightbulb, Rocket, CheckCircle, Search, BarChart3 } from "lucide-react";
import RoadmapDetailDialog from "./RoadmapDetailDialog";
import RoadmapGanttChart from "./RoadmapGanttChart";
import { useRoadmap } from "@/hooks/useRoadmap";

const products = ["Todos", "Bot", "Mapa", "Workspace", "Financeiro", "Fiscal", "SAC", "Agenda"];

const RoadmapTab = () => {
  const { roadmapItems, loading, addReaction } = useRoadmap();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredItems = roadmapItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = selectedProduct === "Todos" || item.product === selectedProduct;
    return matchesSearch && matchesProduct;
  });

  const handleReaction = async (itemId: string, reactionType: 'likes' | 'hearts' | 'ideas') => {
    // Use a default email for now - in a real app this would come from authentication
    const userEmail = "user@example.com";
    await addReaction(itemId, reactionType, userEmail);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setSelectedItem(null);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "planned":
        return { title: "Planejado", icon: Lightbulb, color: "bg-blue-100 text-blue-700 border-blue-200" };
      case "in-progress":
        return { title: "Em Andamento", icon: Rocket, color: "bg-amber-100 text-amber-700 border-amber-200" };
      case "completed":
        return { title: "Concluído", icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200" };
      default:
        return { title: status, icon: Lightbulb, color: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  };

  const getItemsByStatus = (status: string) => {
    return filteredItems.filter(item => item.status === status);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Roadmap de Desenvolvimento</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Acompanhe o que estamos planejando, desenvolvendo e já entregamos. Reaja às funcionalidades que mais te interessam!
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectValue placeholder="Filtrar por produto" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            {products.map((product) => (
              <SelectItem key={product} value={product} className="text-gray-900 dark:text-white">
                {product}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-white dark:bg-gray-800 border dark:border-gray-700">
          <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="gantt" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Gantt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {["planned", "in-progress", "completed"].map((status) => {
              const statusConfig = getStatusConfig(status);
              const statusItems = getItemsByStatus(status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={status} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <StatusIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {statusConfig.title}
                    </h3>
                    <Badge variant="outline" className="ml-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      {statusItems.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {statusItems.map((item) => (
                      <Card 
                        key={item.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        onClick={() => handleItemClick(item)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base font-semibold line-clamp-2 text-gray-900 dark:text-white">
                              {item.title}
                            </CardTitle>
                            <Badge className={`shrink-0 ${statusConfig.color} border text-xs`}>
                              {item.product}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(item.id, 'likes');
                              }}
                              className="flex items-center gap-1 text-xs hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {item.reactions?.likes || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(item.id, 'hearts');
                              }}
                              className="flex items-center gap-1 text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900"
                            >
                              <Heart className="w-3 h-3" />
                              {item.reactions?.hearts || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(item.id, 'ideas');
                              }}
                              className="flex items-center gap-1 text-xs hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-900"
                            >
                              <Lightbulb className="w-3 h-3" />
                              {item.reactions?.ideas || 0}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {statusItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">Nenhum item encontrado</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="gantt">
          <RoadmapGanttChart 
            items={filteredItems}
            onItemClick={handleItemClick}
          />
        </TabsContent>
      </Tabs>

      <RoadmapDetailDialog
        item={selectedItem}
        isOpen={showDetailDialog}
        onClose={handleCloseDetailDialog}
        onReaction={handleReaction}
      />
    </div>
  );
};

export default RoadmapTab;
