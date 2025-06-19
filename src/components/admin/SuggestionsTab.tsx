
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, MessageSquare } from "lucide-react";
import { SuggestionDetailDialog } from "./SuggestionDetailDialog";
import AdminSuggestionTable from "./AdminSuggestionTable";
import { useSuggestions } from "@/hooks/useSuggestions";

const SuggestionsTab = () => {
  const { suggestions, loading, updateSuggestionStatus, fetchSuggestions } = useSuggestions();
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Load all suggestions including private ones for admin
  useState(() => {
    fetchSuggestions(true);
  });

  const getStatusColor = (status: string) => {
    const colors = {
      "recebido": "bg-yellow-100 text-yellow-800",
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

  const getStatusLabel = (status: string) => {
    const labels = {
      "recebido": "Recebido",
      "em-analise": "Em Análise",
      "aprovada": "Aprovada",
      "rejeitada": "Rejeitada",
      "implementada": "Implementada"
    };
    return labels[status as keyof typeof labels];
  };

  const handleStatusChange = async (suggestionId: string, newStatus: string) => {
    await updateSuggestionStatus(suggestionId, newStatus);
  };

  const handleViewDetails = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setIsDetailOpen(true);
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || suggestion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Transform suggestions for the table component
  const transformedSuggestions = filteredSuggestions.map(suggestion => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description,
    author: suggestion.email,
    product: suggestion.module,
    status: suggestion.status as "pendente" | "em-analise" | "aprovada" | "rejeitada" | "implementada",
    priority: suggestion.priority as "baixa" | "media" | "alta",
    votes: suggestion.votes,
    createdAt: suggestion.created_at,
    comments: suggestion.comments_count,
    isPublic: suggestion.is_public
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Sugestões</h2>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar sugestões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="recebido">Recebido</SelectItem>
            <SelectItem value="em-analise">Em Análise</SelectItem>
            <SelectItem value="aprovada">Aprovada</SelectItem>
            <SelectItem value="rejeitada">Rejeitada</SelectItem>
            <SelectItem value="implementada">Implementada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Abas de visualização */}
      <Tabs defaultValue="cards" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="cards">Card</TabsTrigger>
          <TabsTrigger value="listing">Listagem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="mt-6">
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{suggestion.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getStatusColor(suggestion.status)} variant="secondary">
                          {getStatusLabel(suggestion.status)}
                        </Badge>
                        <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                          {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                        </Badge>
                        <Badge variant="outline">{suggestion.module}</Badge>
                        {!suggestion.is_public && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Privada
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right text-sm text-gray-600">
                        <div>{suggestion.votes} votos</div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {suggestion.comments_count}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Select
                          value={suggestion.status}
                          onValueChange={(value) => handleStatusChange(suggestion.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recebido">Recebido</SelectItem>
                            <SelectItem value="em-analise">Em Análise</SelectItem>
                            <SelectItem value="aprovada">Aprovada</SelectItem>
                            <SelectItem value="rejeitada">Rejeitada</SelectItem>
                            <SelectItem value="implementada">Implementada</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(suggestion)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Por {suggestion.email}</span>
                    <span>{new Date(suggestion.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="listing" className="mt-6">
          <AdminSuggestionTable
            suggestions={transformedSuggestions}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma sugestão encontrada.</p>
        </div>
      )}

      <SuggestionDetailDialog
        suggestion={selectedSuggestion}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default SuggestionsTab;
