
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Eye } from "lucide-react";
import { RoadmapFormDialog } from "./RoadmapFormDialog";
import { RoadmapDetailDialog } from "./RoadmapDetailDialog";
import { useRoadmap } from "@/hooks/useRoadmap";

const RoadmapTab = () => {
  const { roadmapItems, loading, createRoadmapItem } = useRoadmap();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      "planned": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };
    return colors[status as keyof typeof colors];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      "baixa": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      "media": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "alta": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      "planned": "Planejado",
      "in-progress": "Em Desenvolvimento", 
      "completed": "Concluído"
    };
    return labels[status as keyof typeof labels];
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleCreateItem = async (itemData: any) => {
    try {
      await createRoadmapItem(itemData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating roadmap item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Roadmap</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          Novo Item
        </Button>
      </div>

      <div className="grid gap-6">
        {roadmapItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{item.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(item.status)} variant="secondary">
                      {getStatusLabel(item.status)}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)} variant="secondary">
                      Prioridade {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </Badge>
                    <Badge variant="outline">{item.product}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {item.votes} votos
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item)}
                    className="flex items-center gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
              {item.estimated_date && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Previsão: {new Date(item.estimated_date).toLocaleDateString('pt-BR')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {roadmapItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum item no roadmap ainda.</p>
        </div>
      )}

      <RoadmapFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateItem}
      />

      <RoadmapDetailDialog
        item={selectedItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default RoadmapTab;
