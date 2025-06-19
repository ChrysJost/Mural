
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuggestionCard from "@/components/SuggestionCard";
import SuggestionDetailDialog from "@/components/SuggestionDetailDialog";
import SuggestionFormDialog from "@/components/SuggestionFormDialog";
import FilterBar from "@/components/FilterBar";
import Header from "@/components/Header";
import SuggestionTable from "@/components/SuggestionTable";
import RoadmapTab from "@/components/RoadmapTab";
import ChangelogTab from "@/components/ChangelogTab";
import { useSuggestions } from "@/hooks/useSuggestions";

interface TransformedSuggestion {
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
  isPinned: boolean;
  isPublic: boolean;
}

const Index = () => {
  const { suggestions, loading, createSuggestion, voteSuggestion } = useSuggestions();
  const [filteredSuggestions, setFilteredSuggestions] = useState<TransformedSuggestion[]>([]);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Transform database suggestions to component format
  const transformedSuggestions: TransformedSuggestion[] = suggestions.map(suggestion => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description,
    module: suggestion.module,
    status: suggestion.status === 'recebido' ? 'Recebido' :
           suggestion.status === 'em-analise' ? 'Em análise' :
           suggestion.status === 'aprovada' ? 'Aprovada' :
           suggestion.status === 'rejeitada' ? 'Rejeitada' :
           suggestion.status === 'implementada' ? 'Implementada' : 'Recebido',
    votes: suggestion.votes,
    hasVoted: false, // TODO: Check if current user voted
    createdAt: new Date(suggestion.created_at).toLocaleDateString('pt-BR'),
    email: suggestion.email,
    comments: suggestion.comments_count,
    adminResponse: suggestion.admin_response,
    isPinned: suggestion.is_pinned,
    isPublic: suggestion.is_public
  }));

  // Filter only public suggestions for public view
  const publicSuggestions = transformedSuggestions.filter(suggestion => suggestion.isPublic !== false);

  // Update filtered suggestions when public suggestions change
  useEffect(() => {
    setFilteredSuggestions(publicSuggestions);
  }, [suggestions]);

  const handleVote = async (id: string) => {
    // Use a default email for now - in a real app this would come from authentication
    const userEmail = "user@example.com";
    await voteSuggestion(id, userEmail);
  };

  const handleAddSuggestion = async (newSuggestion: any) => {
    try {
      await createSuggestion({
        title: newSuggestion.title,
        description: newSuggestion.description,
        module: newSuggestion.module,
        email: newSuggestion.email,
        youtubeUrl: newSuggestion.youtubeUrl,
        isPublic: newSuggestion.isPublic
      });
    } catch (error) {
      console.error('Error creating suggestion:', error);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setShowDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setSelectedSuggestion(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header onCreateSuggestion={() => setShowFormDialog(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Mural de Sugestões MK Solutions
          </h1>
          
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-white dark:bg-gray-800 border dark:border-gray-700">
              <TabsTrigger value="roadmap" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">Roadmap</TabsTrigger>
              <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">Sugestões</TabsTrigger>
              <TabsTrigger value="changelog" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">Changelog</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roadmap" className="mt-6">
              <RoadmapTab />
            </TabsContent>
            
            <TabsContent value="suggestions" className="mt-6">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Ajude-nos a melhorar nossos produtos! Compartilhe suas ideias, vote nas sugestões e acompanhe o desenvolvimento.
                </p>
              </div>

              <FilterBar 
                suggestions={publicSuggestions}
                onFilter={(filtered) => setFilteredSuggestions(filtered)}
              />

              <Tabs defaultValue="cards" className="mt-8">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-white dark:bg-gray-800 border dark:border-gray-700">
                  <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">Visualização em Cards</TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">Lista Detalhada</TabsTrigger>
                  <TabsTrigger value="table" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600">Lista Simples</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cards" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onVote={handleVote}
                        onClick={handleSuggestionClick}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="list" className="mt-6">
                  <div className="space-y-4">
                    {filteredSuggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onVote={handleVote}
                        onClick={handleSuggestionClick}
                        layout="list"
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="table" className="mt-6">
                  <SuggestionTable
                    suggestions={filteredSuggestions}
                    onVote={handleVote}
                    onClick={handleSuggestionClick}
                  />
                </TabsContent>
              </Tabs>

              {filteredSuggestions.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma sugestão encontrada com os filtros aplicados.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="changelog" className="mt-6">
              <ChangelogTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SuggestionDetailDialog
        suggestion={selectedSuggestion}
        isOpen={showDetailDialog}
        onClose={handleCloseDetailDialog}
        onVote={handleVote}
      />

      <SuggestionFormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        onSubmit={handleAddSuggestion}
      />
    </div>
  );
};

export default Index;
