
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Image, Video, FileText } from "lucide-react";

interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  type: "text" | "image" | "video" | "gif";
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  product: string;
  version: string;
  releaseDate: string;
  features: string[];
}

interface ChangelogDetailDialogProps {
  entry: ChangelogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "image":
    case "gif":
      return Image;
    case "video":
      return Video;
    case "text":
      return FileText;
    default:
      return FileText;
  }
};

const ChangelogDetailDialog = ({ entry, isOpen, onClose }: ChangelogDetailDialogProps) => {
  if (!entry) return null;

  const TypeIcon = getTypeIcon(entry.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <TypeIcon className="w-5 h-5 text-gray-500" />
                <Badge className={`${getProductColor(entry.product)} border`}>
                  {entry.product}
                </Badge>
                <Badge variant="outline">
                  {entry.version}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
                {entry.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Lançado em: {new Date(entry.releaseDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Descrição</h3>
            <p className="text-gray-700 leading-relaxed">
              {entry.description}
            </p>
          </div>

          {entry.type === "image" && entry.imageUrl && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Captura de Tela</h3>
              <img 
                src={entry.imageUrl} 
                alt={entry.title}
                className="w-full max-h-96 object-contain rounded-lg border"
              />
            </div>
          )}

          {entry.type === "gif" && entry.imageUrl && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Demonstração</h3>
              <img 
                src={entry.imageUrl} 
                alt={entry.title}
                className="w-full max-h-96 object-contain rounded-lg border"
              />
            </div>
          )}

          {entry.type === "video" && entry.videoUrl && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Vídeo Demonstrativo</h3>
              <div className="aspect-video w-full">
                <iframe
                  src={entry.videoUrl}
                  title={entry.title}
                  className="w-full h-full rounded-lg border"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {entry.type === "text" && entry.content && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Detalhes Técnicos</h3>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Principais Funcionalidades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entry.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogDetailDialog;
