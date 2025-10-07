import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useOfflineSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('name');

      if (error) throw error;

      setSuggestions((data || []).map(suggestion => suggestion.name));
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSuggestion = async (item: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('suggestions')
        .insert([{ name: item, user_id: user.id }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Esta sugestão já existe');
        }
        throw error;
      }

      await fetchSuggestions();
    } catch (error) {
      console.error('Erro ao adicionar sugestão:', error);
      throw error;
    }
  };

  const removeSuggestion = async (item: string) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('name', item);

      if (error) throw error;

      await fetchSuggestions();
    } catch (error) {
      console.error('Erro ao remover sugestão:', error);
      throw error;
    }
  };

  const filterSuggestions = (query: string): string[] => {
    if (!query.trim()) return [];
    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return suggestions.filter(suggestion => {
      const normalizedSuggestion = suggestion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalizedSuggestion.includes(normalizedQuery);
    });
  };

  return {
    suggestions,
    loading,
    addSuggestion,
    removeSuggestion,
    filterSuggestions,
    fetchSuggestions
  };
}
