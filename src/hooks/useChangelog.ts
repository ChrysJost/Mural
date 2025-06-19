
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'breaking';
  content_type: 'text' | 'image' | 'video' | 'gif';
  content?: string;
  image_url?: string;
  video_url?: string;
  product: string;
  release_date: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

interface CreateChangelogInput {
  version: string;
  title: string;
  description: string;
  type: string;
  content_type?: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  product: string;
  release_date: string;
  features: string[];
}

export const useChangelog = () => {
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChangelogEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('changelog_entries')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) throw error;

      setChangelogEntries(data || []);
    } catch (error) {
      console.error('Error fetching changelog entries:', error);
      toast({
        title: "Erro ao carregar changelog",
        description: "Não foi possível carregar o histórico de mudanças.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createChangelogEntry = async (entryData: CreateChangelogInput) => {
    try {
      const { data, error } = await supabase
        .from('changelog_entries')
        .insert([{
          version: entryData.version,
          title: entryData.title,
          description: entryData.description,
          type: entryData.type as 'feature' | 'improvement' | 'bugfix' | 'breaking',
          content_type: (entryData.content_type || 'text') as 'text' | 'image' | 'video' | 'gif',
          content: entryData.content,
          image_url: entryData.image_url,
          video_url: entryData.video_url,
          product: entryData.product,
          release_date: entryData.release_date,
          features: entryData.features,
        }])
        .select()
        .single();

      if (error) throw error;

      setChangelogEntries(prev => [data, ...prev]);
      
      toast({
        title: "Changelog criado com sucesso!",
        description: "A nova entrada do changelog foi adicionada.",
      });

      return data;
    } catch (error) {
      console.error('Error creating changelog entry:', error);
      toast({
        title: "Erro ao criar changelog",
        description: "Não foi possível criar a entrada do changelog.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchChangelogEntries();
  }, []);

  return {
    changelogEntries,
    loading,
    fetchChangelogEntries,
    createChangelogEntry,
  };
};
