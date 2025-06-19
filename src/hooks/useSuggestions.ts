
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  module: string;
  email: string;
  youtube_url?: string;
  is_public: boolean;
  status: string;
  priority: string;
  votes: number;
  comments_count: number;
  admin_response?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface SuggestionInput {
  title: string;
  description: string;
  module: string;
  email: string;
  youtubeUrl?: string;
  isPublic: boolean;
}

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSuggestions = async (includePrivate = false) => {
    try {
      let query = supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includePrivate) {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Erro ao carregar sugestões",
        description: "Não foi possível carregar as sugestões.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSuggestion = async (suggestionData: SuggestionInput) => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .insert([{
          title: suggestionData.title,
          description: suggestionData.description,
          module: suggestionData.module,
          email: suggestionData.email,
          youtube_url: suggestionData.youtubeUrl,
          is_public: suggestionData.isPublic,
        }])
        .select()
        .single();

      if (error) throw error;

      setSuggestions(prev => [data, ...prev]);
      
      toast({
        title: "Sugestão criada com sucesso!",
        description: "Sua sugestão foi enviada e está sendo analisada.",
      });

      return data;
    } catch (error) {
      console.error('Error creating suggestion:', error);
      toast({
        title: "Erro ao criar sugestão",
        description: "Não foi possível enviar sua sugestão.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSuggestionStatus = async (suggestionId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .update({ status: newStatus })
        .eq('id', suggestionId)
        .select()
        .single();

      if (error) throw error;

      setSuggestions(prev => 
        prev.map(suggestion => 
          suggestion.id === suggestionId 
            ? { ...suggestion, status: newStatus }
            : suggestion
        )
      );

      toast({
        title: "Status atualizado",
        description: "O status da sugestão foi atualizado com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Error updating suggestion status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da sugestão.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const voteSuggestion = async (suggestionId: string, userEmail: string) => {
    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('suggestion_votes')
        .select('id')
        .eq('suggestion_id', suggestionId)
        .eq('user_email', userEmail)
        .maybeSingle();

      if (existingVote) {
        // Remove vote
        await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', suggestionId)
          .eq('user_email', userEmail);

        // Update vote count
        await supabase.rpc('decrement_suggestion_votes', { suggestion_id: suggestionId });
      } else {
        // Add vote
        await supabase
          .from('suggestion_votes')
          .insert([{
            suggestion_id: suggestionId,
            user_email: userEmail
          }]);

        // Update vote count
        await supabase.rpc('increment_suggestion_votes', { suggestion_id: suggestionId });
      }

      // Refresh suggestions
      await fetchSuggestions();
    } catch (error) {
      console.error('Error voting suggestion:', error);
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return {
    suggestions,
    loading,
    fetchSuggestions,
    createSuggestion,
    updateSuggestionStatus,
    voteSuggestion,
  };
};
