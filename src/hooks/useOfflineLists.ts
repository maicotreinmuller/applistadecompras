import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useOfflineLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);

      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (listsError) throw listsError;

      const listsWithItems = await Promise.all(
        (listsData || []).map(async (list) => {
          const { data: items, error: itemsError } = await supabase
            .from('items')
            .select('*')
            .eq('list_id', list.id);

          if (itemsError) throw itemsError;

          return {
            id: list.id,
            nome: list.name,
            dataCriacao: list.created_at,
            items: (items || []).map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              completed: item.completed,
              group: item.group,
              created_at: item.created_at
            }))
          };
        })
      );

      setLists(listsWithItems);
    } catch (error) {
      console.error('Erro ao buscar listas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async (nome: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('lists')
        .insert([{ name: nome, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      await fetchLists();
      return data.id;
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      throw error;
    }
  };

  const deleteList = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchLists();
    } catch (error) {
      console.error('Erro ao deletar lista:', error);
      throw error;
    }
  };

  const duplicateList = async (id: string) => {
    try {
      const { data: originalList, error: listError } = await supabase
        .from('lists')
        .select('*')
        .eq('id', id)
        .single();

      if (listError) throw listError;
      if (!originalList) return;

      if (!user) throw new Error('Usuário não autenticado');

      const { data: newList, error: newListError } = await supabase
        .from('lists')
        .insert([{ name: `${originalList.name} (Cópia)`, user_id: user.id }])
        .select()
        .single();

      if (newListError) throw newListError;

      const { data: originalItems, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('list_id', id);

      if (itemsError) throw itemsError;

      if (originalItems && originalItems.length > 0) {
        const newItems = originalItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          completed: item.completed,
          group: item.group,
          list_id: newList.id
        }));

        const { error: insertError } = await supabase
          .from('items')
          .insert(newItems);

        if (insertError) throw insertError;
      }

      await fetchLists();
      return newList.id;
    } catch (error) {
      console.error('Erro ao duplicar lista:', error);
      throw error;
    }
  };

  const renameList = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('lists')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      await fetchLists();
    } catch (error) {
      console.error('Erro ao renomear lista:', error);
      throw error;
    }
  };

  const clearList = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ quantity: 1, price: 0, completed: false })
        .eq('list_id', id);

      if (error) throw error;

      await fetchLists();
    } catch (error) {
      console.error('Erro ao limpar lista:', error);
      throw error;
    }
  };

  const calculateListTotal = (listId: string): number => {
    const list = lists.find(l => l.id === listId);
    if (!list || !list.items) return 0;

    return list.items.reduce((total: number, item: any) => {
      if (item.completed) {
        return total + (Number(item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const reorderLists = async (newOrder: any[]) => {
    setLists(newOrder);
  };

  return {
    lists,
    loading,
    createList,
    deleteList,
    duplicateList,
    renameList,
    clearList,
    calculateListTotal,
    reorderLists,
    fetchLists
  };
}
