import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronUp, MessageCircle, Calendar, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  module: string;
  status: string;
  votes: number;
  hasVoted: boolean;
  createdAt: string;
  email: string;
  comments: number;
  adminResponse?: string;
  isPinned?: boolean;
}

interface SuggestionDetailDialogProps {
  suggestion: Suggestion | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Recebido": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Em análise": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Em desenvolvimento": return "bg-green-100 text-green-700 border-green-200";
    case "Concluído": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Rejeitado": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getModuleColor = (module: string) => {
  const colors: Record<string, string> = {
    Bot: "bg-purple-50 text-purple-700 border-purple-200",
    Mapa: "bg-blue-50 text-blue-700 border-blue-200",
    Workspace: "bg-green-50 text-green-700 border-green-200",
    Financeiro: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Fiscal: "bg-red-50 text-red-700 border-red-200",
    SAC: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Agenda: "bg-pink-50 text-pink-700 border-pink-200",
    Outro: "bg-gray-50 text-gray-700 border-gray-200"
  };
  return colors[module] || "bg-gray-50 text-gray-700 border-gray-200";
};

// Mock comments data - in a real app this would come from props or API
const getMockComments = (suggestionId: string): Comment[] => {
  return [
    {
      id: "1",
      author: "João Silva",
      content: "Excelente ideia! Isso facilitaria muito nosso trabalho diário.",
      createdAt: "2024-01-20",
      isAdmin: false
    },
    {
      id: "2",
      author: "Equipe MK",
      content: "Obrigado pela sugestão! Estamos analisando a viabilidade técnica desta implementação.",
      createdAt: "2024-01-21",
      isAdmin: true
    },
    {
      id: "3",
      author: "Maria Santos",
      content: "Concordo totalmente! Seria muito útil ter essa funcionalidade.",
      createdAt: "2024-01-22",
      isAdmin: false
    }
  ];
};

const SuggestionDetailDialog = ({ suggestion, isOpen, onClose, onVote }: SuggestionDetailDialogProps) => {
  if (!suggestion) return null;

  const comments = getMockComments(suggestion.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
            {suggestion.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status e Módulo */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            <Badge className={cn("border font-medium px-4 py-2", getStatusColor(suggestion.status))}>
              {suggestion.status}
            </Badge>
            <Badge className={cn("border font-medium px-4 py-2", getModuleColor(suggestion.module))}>
              {suggestion.module}
            </Badge>
          </div>

          {/* Informações da sugestão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {suggestion.description}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border">
                <button
                  onClick={() => onVote(suggestion.id)}
                  className={cn(
                    "flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                    suggestion.hasVoted 
                      ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600" 
                      : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                  )}
                >
                  <ChevronUp className="w-5 h-5 mb-1" />
                  <span className="text-lg font-bold mb-0.5">
                    {suggestion.votes}
                  </span>
                  <span className="text-xs">votos</span>
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em {suggestion.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{suggestion.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments.length} comentários</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resposta da equipe */}
          {suggestion.adminResponse && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Resposta da Equipe MK
              </h4>
              <p className="text-blue-800">{suggestion.adminResponse}</p>
            </div>
          )}

          {/* Comentários */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comentários ({comments.length})
            </h3>
            
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className={cn(
                  "p-4 rounded-lg border",
                  comment.isAdmin ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                )}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={cn(
                        "text-xs font-semibold",
                        comment.isAdmin ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                      )}>
                        {comment.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "font-semibold text-sm",
                          comment.isAdmin ? "text-blue-900" : "text-gray-900"
                        )}>
                          {comment.author}
                        </span>
                        {comment.isAdmin && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5">
                            Equipe MK
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {comment.createdAt}
                        </div>
                      </div>
                      <p className={cn(
                        "text-sm",
                        comment.isAdmin ? "text-blue-800" : "text-gray-700"
                      )}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionDetailDialog;
