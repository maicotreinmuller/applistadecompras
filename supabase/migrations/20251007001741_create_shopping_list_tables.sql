/*
  # Criar tabelas da lista de compras

  1. Novas Tabelas
    - `lists` - Listas de compras
      - `id` (uuid, primary key)
      - `name` (text) - Nome da lista
      - `created_at` (timestamptz) - Data de criação
      - `user_id` (uuid) - ID do usuário (opcional para versão offline)
      
    - `items` - Itens das listas
      - `id` (uuid, primary key)
      - `name` (text) - Nome do item
      - `quantity` (integer) - Quantidade
      - `price` (numeric) - Preço
      - `completed` (boolean) - Item marcado como completo
      - `group` (text) - Categoria/grupo do item
      - `list_id` (uuid) - Referência à lista
      - `created_at` (timestamptz) - Data de criação
      
    - `categories` - Categorias de produtos
      - `id` (uuid, primary key)
      - `name` (text) - Nome da categoria
      - `created_at` (timestamptz) - Data de criação
      
    - `suggestions` - Sugestões de itens
      - `id` (uuid, primary key)
      - `name` (text) - Nome do item sugerido
      - `created_at` (timestamptz) - Data de criação

  2. Segurança
    - RLS desabilitado inicialmente para permitir acesso offline
    - Políticas podem ser adicionadas posteriormente se autenticação for implementada
*/

-- Criar tabela de listas
CREATE TABLE IF NOT EXISTS lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

-- Criar tabela de itens
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity integer DEFAULT 1,
  price numeric(10,2) DEFAULT 0,
  completed boolean DEFAULT false,
  "group" text DEFAULT '📦 Outros',
  list_id uuid REFERENCES lists(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de sugestões
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Inserir categorias padrão
INSERT INTO categories (name) VALUES
  ('🥬 Hortifruti'),
  ('🥩 Carnes'),
  ('🥛 Laticínios'),
  ('🥖 Padaria'),
  ('🥫 Mercearia'),
  ('🧃 Bebidas'),
  ('🧹 Limpeza'),
  ('🧴 Higiene'),
  ('🧊 Congelados'),
  ('🥜 Cereais'),
  ('🍝 Massas'),
  ('🥫 Enlatados'),
  ('🧂 Temperos'),
  ('🍬 Doces'),
  ('🐶 Pet Shop'),
  ('📦 Outros')
ON CONFLICT (name) DO NOTHING;

-- Inserir sugestões padrão
INSERT INTO suggestions (name) VALUES
  ('🥬 Alface'),
  ('🥕 Cenoura'),
  ('🍅 Tomate'),
  ('🥔 Batata'),
  ('🧅 Cebola'),
  ('🥩 Carne Moída'),
  ('🍗 Frango'),
  ('🥛 Leite'),
  ('🧀 Queijo'),
  ('🥖 Pão'),
  ('🥚 Ovos'),
  ('🧻 Papel Higiênico'),
  ('🧴 Sabonete'),
  ('🧼 Detergente'),
  ('🧹 Vassoura'),
  ('🧂 Sal'),
  ('🍚 Arroz'),
  ('🫘 Feijão'),
  ('🍝 Macarrão'),
  ('☕ Café'),
  ('🧃 Suco'),
  ('🥤 Refrigerante'),
  ('🍪 Biscoito'),
  ('🧴 Shampoo')
ON CONFLICT (name) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS items_list_id_idx ON items(list_id);
CREATE INDEX IF NOT EXISTS items_group_idx ON items("group");
CREATE INDEX IF NOT EXISTS lists_created_at_idx ON lists(created_at DESC);
