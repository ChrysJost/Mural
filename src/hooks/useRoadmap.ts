
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'baixa' | 'media' | 'alta';
  estimated_date?: string;
  start_date?: string;
  end_date?: string;
  product: string;
  votes: number;
  created_at: string;
  updated_at: string;
  reactions?: {
    likes: number;
    hearts: number;
    ideas: number;
  };
}

interface CreateRoadmapInput {
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_date?: string;
  product: string;
}

export const useRoadmap = () => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoadmapItems = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database status to frontend format
      const transformedData = data?.map(item => ({
        ...item,
        status: item.status === 'planejado' ? 'planned' : 
               item.status === 'em-desenvolvimento' ? 'in-progress' : 'completed',
        reactions: { likes: 0, hearts: 0, ideas: 0 } // Will be populated separately
      })) || [];

      setRoadmapItems(transformedData);
    } catch (error) {
      console.error('Error fetching roadmap items:', error);
      toast({
        title: "Erro ao carregar roadmap",
        description: "Não foi possível carregar os itens do roadmap.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoadmapItem = async (itemData: CreateRoadmapInput) => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert([{
          title: itemData.title,
          description: itemData.description,
          status: itemData.status === 'planned' ? 'planejado' :
                 itemData.status === 'in-progress' ? 'em-desenvolvimento' : 'concluido',
          priority: itemData.priority as 'baixa' | 'media' | 'alta',
          estimated_date: itemData.estimated_date,
          product: itemData.product,
        }])
        .select()
        .single();

      if (error) throw error;

      // Transform back to frontend format
      const transformedItem = {
        ...data,
        status: data.status === 'planejado' ? 'planned' : 
               data.status === 'em-desenvolvimento' ? 'in-progress' : 'completed',
        reactions: { likes: 0, hearts: 0, ideas: 0 }
      };

      setRoadmapItems(prev => [transformedItem, ...prev]);
      
      toast({
        title: "Item criado com sucesso!",
        description: "O novo item do roadmap foi adicionado.",
      });

      return transformedItem;
    } catch (error) {
      console.error('Error creating roadmap item:', error);
      toast({
        title: "Erro ao criar item",
        description: "Não foi possível criar o item do roadmap.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addReaction = async (itemId: string, reactionType: 'likes' | 'hearts' | 'ideas', userEmail: string) => {
    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('roadmap_reactions')
        .select('id')
        .eq('roadmap_item_id', itemId)
        .eq('user_email', userEmail)
        .eq('reaction_type', reactionType)
        .maybeSingle();

      if (!existingReaction) {
        await supabase
          .from('roadmap_reactions')
          .insert([{
            roadmap_item_id: itemId,
            user_email: userEmail,
            reaction_type: reactionType
          }]);

        // Update local state
        setRoadmapItems(prev => 
          prev.map(item => 
            item.id === itemId 
              ? {
                  ...item,
                  reactions: {
                    ...item.reactions,
                    [reactionType]: (item.reactions?.[reactionType] || 0) + 1
                  }
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Erro ao reagir",
        description: "Não foi possível registrar sua reação.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRoadmapItems();
  }, []);

  return {
    roadmapItems,
    loading,
    fetchRoadmapItems,
    createRoadmapItem,
    addReaction,
  };
};
