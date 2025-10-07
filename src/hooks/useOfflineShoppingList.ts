import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Item } from '../types/Item';

export function useOfflineShoppingList(listId?: string | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listId) {
      fetchItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [listId]);

  const fetchItems = async () => {
    if (!listId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('list_id', listId);

      if (error) throw error;

      setItems((data || []).map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantity,
        valor: Number(item.price),
        completo: item.completed,
        grupo: item.group
      })));
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = async (nome: string, grupo: string) => {
    if (!listId) return;

    try {
      const { error } = await supabase
        .from('items')
        .insert([{
          name: nome,
          group: grupo,
          list_id: listId,
          quantity: 1,
          price: 0,
          completed: false
        }]);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  };

  const toggleItem = async (id: number | string) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('items')
        .update({ completed: !item.completo })
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    }
  };

  const atualizarQuantidade = async (id: number | string, quantidade: number) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ quantity: quantidade })
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  };

  const atualizarValor = async (id: number | string, valor: number) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ price: valor })
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
      throw error;
    }
  };

  const excluirItem = async (id: number | string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      throw error;
    }
  };

  const limparTudo = async () => {
    if (!listId) return;

    try {
      const { error } = await supabase
        .from('items')
        .update({ quantity: 1, price: 0, completed: false })
        .eq('list_id', listId);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error('Erro ao limpar lista:', error);
      throw error;
    }
  };

  const calcularTotal = () => {
    return items
      .filter((item) => item.completo)
      .reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  };

  const agruparItens = () => {
    return items.reduce((grupos, item) => {
      const grupo = item.grupo;
      if (!grupos[grupo]) {
        grupos[grupo] = [];
      }
      grupos[grupo].push(item);
      return grupos;
    }, {} as Record<string, Item[]>);
  };

  return {
    items,
    loading,
    adicionarItem,
    toggleItem,
    atualizarQuantidade,
    atualizarValor,
    excluirItem,
    limparTudo,
    calcularTotal,
    agruparItens,
  };
}
