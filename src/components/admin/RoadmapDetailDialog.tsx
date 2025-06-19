
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Edit } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planejado" | "em-desenvolvimento" | "concluido";
  priority: "baixa" | "media" | "alta";
  estimatedDate: string;
  votes: number;
}

interface RoadmapDetailDialogProps {
  item: RoadmapItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RoadmapDetailDialog = ({ item, open, onOpenChange }: RoadmapDetailDialogProps) => {
  if (!item) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      "planejado": "bg-blue-100 text-blue-800",
      "em-desenvolvimento": "bg-yellow-100 text-yellow-800",
      "concluido": "bg-green-100 text-green-800"
    };
    return colors[status as keyof typeof colors];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      "baixa": "bg-gray-100 text-gray-800",
      "media": "bg-orange-100 text-orange-800",
      "alta": "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{item.title}</DialogTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex gap-2">
            <Badge className={getStatusColor(item.status)} variant="secondary">
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            <Badge className={getPriorityColor(item.priority)} variant="secondary">
              Prioridade {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Data Estimada:</span>
              <span className="font-medium">
                {new Date(item.estimatedDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Votos:</span>
              <span className="font-medium">{item.votes}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Comentários Recentes</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">João Silva</span>
                  <span className="text-xs text-gray-500">há 2 dias</span>
                </div>
                <p className="text-sm text-gray-600">Esta funcionalidade seria muito útil para nossa equipe de atendimento!</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">Maria Santos</span>
                  <span className="text-xs text-gray-500">há 1 semana</span>
                </div>
                <p className="text-sm text-gray-600">Quando vocês estimam que isso ficará pronto? Estamos ansiosos!</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
