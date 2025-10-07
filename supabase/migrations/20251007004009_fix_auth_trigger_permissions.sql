/*
  # Corrigir permissões do trigger de criação de usuário

  ## Mudanças
  
  1. Recriar a função com SET para bypass RLS
  2. Garantir que a função possa inserir dados nas tabelas protegidas por RLS
  
  ## Notas
    - A função precisa rodar como SECURITY DEFINER para poder inserir dados
    - SET para desabilitar as verificações de RLS durante a execução da função
*/

-- Recriar a função com as configurações corretas
CREATE OR REPLACE FUNCTION create_default_data_for_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.categories (name, user_id) VALUES
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

  INSERT INTO public.suggestions (name, user_id) VALUES
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
$$ LANGUAGE plpgsql;

-- Garantir que o trigger está correto
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_data_for_user();
