import Dexie, { Table } from 'dexie';

export interface LocalList {
  id: string;
  name: string;
  created_at: string;
  deleted?: boolean;
}

export interface LocalItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  completed: boolean;
  group: string;
  list_id: string;
  created_at: string;
  deleted?: boolean;
}

export interface LocalCategory {
  id: string;
  name: string;
  created_at: string;
  deleted?: boolean;
}

export interface LocalSuggestion {
  id: string;
  name: string;
  created_at: string;
  deleted?: boolean;
}

class OfflineDatabase extends Dexie {
  lists!: Table<LocalList>;
  items!: Table<LocalItem>;
  categories!: Table<LocalCategory>;
  suggestions!: Table<LocalSuggestion>;

  constructor() {
    super('ShoppingListOfflineDB');

    this.version(1).stores({
      lists: 'id, name, created_at, deleted',
      items: 'id, name, list_id, group, created_at, deleted',
      categories: 'id, name, created_at, deleted',
      suggestions: 'id, name, created_at, deleted'
    });
  }
}

export const offlineDB = new OfflineDatabase();

export const generateId = () => {
  return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
