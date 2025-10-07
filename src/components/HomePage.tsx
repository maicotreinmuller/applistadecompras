import React, { useState } from 'react';
import {
  RiDeleteBin7Line,
  RiEditLine,
  RiBrushLine,
  RiDragMove2Line,
} from 'react-icons/ri';
import { useOfflineLists } from '../hooks/useOfflineLists';
import { formatarMoeda } from '../utils/formatters';
import { useOfflineShoppingList } from '../hooks/useOfflineShoppingList';
import { FloatingTaskbar } from './FloatingTaskbar';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableListItem } from './SortableListItem';
import { notify } from '../utils/notifications';

interface HomePageProps {
  onBack: () => void;
  onSelectList: (listId: string) => void;
  onNavigateToManagement: () => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

export function HomePage({
  onBack,
  onSelectList,
  onNavigateToManagement,
  showCreateModal,
  setShowCreateModal,
}: HomePageProps) {
  const {
    lists,
    createList,
    deleteList,
    duplicateList,
    clearList,
    renameList,
    calculateListTotal,
    reorderLists,
    fetchLists,
  } = useOfflineLists();
  
  const [newListName, setNewListName] = useState('');
  const [showRenameModal, setShowRenameModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lists.findIndex((list) => list.id === active.id);
      const newIndex = lists.findIndex((list) => list.id === over.id);
      reorderLists(arrayMove(lists, oldIndex, newIndex));
    }
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim()).then(() => {
        fetchLists();
      });
      setNewListName('');
      setShowCreateModal(false);
    }
  };

  const handleRenameList = (e: React.FormEvent) => {
    e.preventDefault();
    if (showRenameModal !== null && newListName.trim()) {
      renameList(showRenameModal, newListName.trim()).then(() => {
        fetchLists();
      });
      setNewListName('');
      setShowRenameModal(null);
    }
  };

  const handleDeleteList = (id: string) => {
    deleteList(id).then(() => {
      fetchLists();
    });
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 hide-scrollbar">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lists.map((list) => list.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {lists.map((list) => (
                <SortableListItem
                  key={list.id}
                  list={list}
                  total={calculateListTotal(list.id)}
                  onSelect={() => onSelectList(list.id)}
                  onRename={() => {
                    setNewListName(list.nome);
                    setShowRenameModal(list.id);
                  }}
                  onDuplicate={() => duplicateList(list.id)}
                  onClear={() => clearList(list.id)}
                  onDelete={() => setShowDeleteConfirm(list.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {lists.length === 0 && (
          <div className="text-center text-gray-500 mt-6">
            <p>Nenhuma lista criada</p>
            <p className="text-sm">Clique no botão + para criar uma nova lista</p>
          </div>
        )}
      </div>

      <FloatingTaskbar
        onNavigateToHome={() => {}}
        onNavigateToManagement={onNavigateToManagement}
        onCreateList={() => setShowCreateModal(true)}
      />

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Nova Lista</h2>

            <form onSubmit={handleCreateList}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nome da lista"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border-0 focus:ring-2 focus:ring-violet-500 outline-none mb-4"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  disabled={!newListName.trim()}
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRenameModal !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowRenameModal(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Renomear Lista</h2>

            <form onSubmit={handleRenameList}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Novo nome da lista"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border-0 focus:ring-2 focus:ring-violet-500 outline-none mb-4"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(null)}
                  className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  disabled={!newListName.trim()}
                >
                  Renomear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-25"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg">
            <button
              onClick={() => handleDeleteList(showDeleteConfirm)}
              className="w-full p-4 text-center text-red-600 text-base font-medium hover:bg-red-50 active:bg-red-100"
            >
              Excluir Lista
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="w-full p-4 text-center text-gray-500 text-base hover:bg-gray-50 active:bg-gray-100 border-t border-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}