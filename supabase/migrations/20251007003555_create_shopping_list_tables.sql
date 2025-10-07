/*
  # Criar tabelas da lista de compras

  1. Novas Tabelas
    - `lists` - Listas de compras
      - `id` (uuid, primary key)
      - `name` (text) - Nome da lista
      - `created_at` (timestamptz) - Data de criação
      - `user_id` (uuid) - ID do usuário
      
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
      - `user_id` (uuid) - ID do usuário
      - `created_at` (timestamptz) - Data de criação
      
    - `suggestions` - Sugestões de itens
      - `id` (uuid, primary key)
      - `name` (text) - Nome do item sugerido
      - `user_id` (uuid) - ID do usuário
      - `created_at` (timestamptz) - Data de criação

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para que cada usuário veja apenas seus dados
    - Função trigger para criar categorias e sugestões padrão para novos usuários
*/

-- Criar tabela de listas
CREATE TABLE IF NOT EXISTS lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
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
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Criar tabela de sugestões
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS items_list_id_idx ON items(list_id);
CREATE INDEX IF NOT EXISTS items_group_idx ON items("group");
CREATE INDEX IF NOT EXISTS lists_created_at_idx ON lists(created_at DESC);
CREATE INDEX IF NOT EXISTS lists_user_id_idx ON lists(user_id);
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON categories(user_id);
CREATE INDEX IF NOT EXISTS suggestions_user_id_idx ON suggestions(user_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela lists
CREATE POLICY "Users can view own lists"
  ON lists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lists"
  ON lists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists"
  ON lists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists"
  ON lists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para a tabela items
CREATE POLICY "Users can view own items"
  ON items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = items.list_id
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = items.list_id
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own items"
  ON items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = items.list_id
      AND lists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = items.list_id
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own items"
  ON items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lists
      WHERE lists.id = items.list_id
      AND lists.user_id = auth.uid()
    )
  );

-- Políticas para a tabela categories
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para a tabela suggestions
CREATE POLICY "Users can view own suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own suggestions"
  ON suggestions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions"
  ON suggestions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own suggestions"
  ON suggestions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Função para criar categorias e sugestões padrão para novos usuários
CREATE OR REPLACE FUNCTION create_default_data_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (name, user_id) VALUES
    ('🥬 Hortifruti', NEW.id),
    ('🥩 Carnes', NEW.id),
    ('🥛 Laticínios', NEW.id),
    ('🥖 Padaria', NEW.id),
    ('🥫 Mercearia', NEW.id),
    ('🧃 Bebidas', NEW.id),
    ('🧹 Limpeza', NEW.id),
    ('🧴 Higiene', NEW.id),
    ('🧊 Congelados', NEW.id),
    ('🥜 Cereais', NEW.id),
    ('🍝 Massas', NEW.id),
    ('🥫 Enlatados', NEW.id),
    ('🧂 Temperos', NEW.id),
    ('🍬 Doces', NEW.id),
    ('🐶 Pet Shop', NEW.id),
    ('📦 Outros', NEW.id)
  ON CONFLICT (name, user_id) DO NOTHING;

  INSERT INTO suggestions (name, user_id) VALUES
    ('🥬 Alface', NEW.id),
    ('🥕 Cenoura', NEW.id),
    ('🍅 Tomate', NEW.id),
    ('🥔 Batata', NEW.id),
    ('🧅 Cebola', NEW.id),
    ('🥩 Carne Moída', NEW.id),
    ('🍗 Frango', NEW.id),
    ('🥛 Leite', NEW.id),
    ('🧀 Queijo', NEW.id),
    ('🥖 Pão', NEW.id),
    ('🥚 Ovos', NEW.id),
    ('🧻 Papel Higiênico', NEW.id),
    ('🧴 Sabonete', NEW.id),
    ('🧼 Detergente', NEW.id),
    ('🧹 Vassoura', NEW.id),
    ('🧂 Sal', NEW.id),
    ('🍚 Arroz', NEW.id),
    ('🫘 Feijão', NEW.id),
    ('🍝 Macarrão', NEW.id),
    ('☕ Café', NEW.id),
    ('🧃 Suco', NEW.id),
    ('🥤 Refrigerante', NEW.id),
    ('🍪 Biscoito', NEW.id),
    ('🧴 Shampoo', NEW.id)
  ON CONFLICT (name, user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar dados padrão quando um novo usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_data_for_user();
