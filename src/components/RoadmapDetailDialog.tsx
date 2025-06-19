
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Lightbulb, Rocket, CheckCircle, Calendar } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  product: string;
  reactions: {
    likes: number;
    hearts: number;
    ideas: number;
    userReacted?: string[];
  };
  images?: string[];
  videoUrl?: string;
  estimatedDate?: string;
}

interface RoadmapDetailDialogProps {
  item: RoadmapItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReaction: (id: string, reactionType: 'likes' | 'hearts' | 'ideas') => void;
}

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

const getProductColor = (product: string) => {
  const colors: Record<string, string> = {
    Bot: "bg-purple-50 text-purple-700 border-purple-200",
    Mapa: "bg-blue-50 text-blue-700 border-blue-200", 
    Workspace: "bg-green-50 text-green-700 border-green-200",
    Financeiro: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Fiscal: "bg-red-50 text-red-700 border-red-200",
    SAC: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Agenda: "bg-pink-50 text-pink-700 border-pink-200"
  };
  return colors[product] || "bg-gray-50 text-gray-700 border-gray-200";
};

const RoadmapDetailDialog = ({ item, isOpen, onClose, onReaction }: RoadmapDetailDialogProps) => {
  if (!item) return null;

  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <StatusIcon className="w-5 h-5 text-gray-500" />
                <Badge className={`${statusConfig.color} border`}>
                  {statusConfig.title}
                </Badge>
                <Badge className={`${getProductColor(item.product)} border`}>
                  {item.product}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </DialogTitle>
              {item.estimatedDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Previsão: {item.estimatedDate}</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Descrição</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {item.images && item.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Imagens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {item.videoUrl && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Vídeo</h3>
              <div className="aspect-video w-full">
                <iframe
                  src={item.videoUrl}
                  title={item.title}
                  className="w-full h-full rounded-lg border"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Reações</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onReaction(item.id, 'likes')}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">{item.reactions.likes}</span>
                <span className="text-sm text-gray-500">Curtidas</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onReaction(item.id, 'hearts')}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">{item.reactions.hearts}</span>
                <span className="text-sm text-gray-500">Amei</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onReaction(item.id, 'ideas')}
                className="flex items-center gap-2 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">{item.reactions.ideas}</span>
                <span className="text-sm text-gray-500">Ideias</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoadmapDetailDialog;
