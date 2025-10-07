import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useOfflineGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setGroups((data || []).map(category => category.name));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };


  const addGroup = async (group: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('categories')
        .insert([{ name: group, user_id: user.id }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Esta categoria já existe');
        }
        throw error;
      }

      await fetchGroups();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  const removeGroup = async (group: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', group);

      if (error) throw error;

      await fetchGroups();
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      throw error;
    }
  };

  return {
    groups,
    loading,
    addGroup,
    removeGroup,
    fetchGroups
  };
}
