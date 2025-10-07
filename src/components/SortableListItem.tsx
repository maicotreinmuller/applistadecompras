import React from 'react';
import {
  RiDeleteBin7Line,
  RiEditLine,
  RiBrushLine,
  RiDragMove2Line,
  RiWhatsappLine,
  RiFileCopyLine,
} from 'react-icons/ri';
import { formatarMoeda } from '../utils/formatters';
import { List } from '../types/List';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { offlineDB } from '../lib/offlineStorage';

interface SortableListItemProps {
  list: List;
  total: number;
  onSelect: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onClear: () => void;
  onDelete: () => void;
}

export function SortableListItem({
  list,
  total,
  onSelect,
  onRename,
  onDuplicate,
  onClear,
  onDelete,
}: SortableListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const removeEmojis = (text: string) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, 
      ''
    ).trim();
  };

  const handleShare = async () => {
    const items = await offlineDB.items
      .where('list_id')
      .equals(String(list.id))
      .and(item => !item.deleted)
      .toArray();

    if (!items || items.length === 0) return;

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
      const cleanGroup = removeEmojis(item.group);
      if (!acc[cleanGroup]) {
        acc[cleanGroup] = [];
      }
      acc[cleanGroup].push({
        ...item,
        name: removeEmojis(item.name)
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Create formatted message
    let message = `${removeEmojis(list.nome)}\n`;
    message += `Data: ${formatDate(list.dataCriacao)}\n`;
    message += `Total: ${formatarMoeda(total)}\n\n`;

    // Add items by group
    Object.entries(groupedItems).forEach(([group, items]) => {
      const groupTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      message += `*${group} (${formatarMoeda(groupTotal)})*\n`;
      items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.quantity}x ${item.name} = ${formatarMoeda(itemTotal)}\n`;
      });
      message += '\n';
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 touch-pan-y"
      onClick={onSelect}
      {...attributes}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-medium dark:text-white">{list.nome}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(list.dataCriacao)}
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
          {formatarMoeda(total)}
        </span>
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleShare}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
          title="Compartilhar no WhatsApp"
        >
          <RiWhatsappLine size={20} />
        </button>

        <button
          onClick={onRename}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
          title="Renomear lista"
        >
          <RiEditLine size={20} />
        </button>

        <button
          onClick={onDuplicate}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
          title="Duplicar lista"
        >
          <RiFileCopyLine size={20} />
        </button>

        <button
          onClick={onClear}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
          title="Limpar dados"
        >
          <RiBrushLine size={20} />
        </button>

        <button
          {...listeners}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg cursor-grab active:cursor-grabbing touch-none"
          title="Mover lista"
        >
          <RiDragMove2Line size={20} />
        </button>

        <button
          onClick={onDelete}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          title="Excluir lista"
        >
          <RiDeleteBin7Line size={20} />
        </button>
      </div>
    </div>
  );
}
