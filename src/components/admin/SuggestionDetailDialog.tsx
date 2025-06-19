
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThumbsUp, MessageSquare, Calendar, User, Send, Edit } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  product: string;
  status: "pendente" | "em-analise" | "aprovada" | "rejeitada" | "implementada";
  priority: "baixa" | "media" | "alta";
  votes: number;
  createdAt: string;
  comments: number;
}

interface SuggestionDetailDialogProps {
  suggestion: Suggestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuggestionDetailDialog = ({ suggestion, open, onOpenChange }: SuggestionDetailDialogProps) => {
  const [adminResponse, setAdminResponse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  if (!suggestion) return null;

  // Comentários mockados
  const comments = [
    {
      id: "1",
      author: "João Silva",
      content: "Essa funcionalidade seria muito útil para nosso time!",
      createdAt: "2024-01-16",
      isAdmin: false
    },
    {
      id: "2",
      author: "Admin",
      content: "Obrigado pela sugestão! Estamos analisando a viabilidade técnica.",
      createdAt: "2024-01-17",
      isAdmin: true
    },
    {
      id: "3",
      author: "Maria Santos",
      content: "Concordo completamente, votei a favor!",
      createdAt: "2024-01-18",
      isAdmin: false
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      "pendente": "bg-yellow-100 text-yellow-800",
      "em-analise": "bg-blue-100 text-blue-800",
      "aprovada": "bg-green-100 text-green-800",
      "rejeitada": "bg-red-100 text-red-800",
      "implementada": "bg-purple-100 text-purple-800"
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

  const handleSendResponse = () => {
    if (adminResponse.trim()) {
      console.log("Enviando resposta do admin:", adminResponse);
      // Aqui seria feita a integração com a API
      setAdminResponse("");
    }
  };

  const handleUpdateSuggestion = () => {
    const updates = {
      status: selectedStatus || suggestion.status,
      priority: selectedPriority || suggestion.priority
    };
    console.log("Atualizando sugestão:", suggestion.id, updates);
    // Aqui seria feita a integração com a API
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{suggestion.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações principais */}
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge className={getStatusColor(suggestion.status)} variant="secondary">
                {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
              </Badge>
              <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                Prioridade {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
              </Badge>
              <Badge variant="outline">{suggestion.product}</Badge>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{suggestion.description}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Por {suggestion.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(suggestion.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{suggestion.votes} votos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de Edição do Admin */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Painel Administrativo
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alterar Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={suggestion.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em-analise">Em Análise</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="rejeitada">Rejeitada</SelectItem>
                    <SelectItem value="implementada">Implementada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alterar Prioridade</label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder={suggestion.priority} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleUpdateSuggestion}
              className="w-full"
              disabled={!selectedStatus && !selectedPriority}
            >
              Salvar Alterações
            </Button>
          </div>

          {/* Comentários */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comentários ({comments.length})
            </h3>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className={`p-3 rounded-lg ${
                    comment.isAdmin ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium text-sm ${
                      comment.isAdmin ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {comment.author}
                      {comment.isAdmin && (
                        <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Resposta do Admin */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Resposta do Administrador</label>
              <Textarea
                placeholder="Digite sua resposta para o usuário..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="min-h-[80px]"
              />
              <Button 
                onClick={handleSendResponse}
                disabled={!adminResponse.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Resposta
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
