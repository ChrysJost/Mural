
-- Criar enum para status das sugestões
CREATE TYPE public.suggestion_status AS ENUM ('recebido', 'em-analise', 'aprovada', 'rejeitada', 'implementada');

-- Criar enum para prioridade
CREATE TYPE public.priority_level AS ENUM ('baixa', 'media', 'alta');

-- Criar enum para status do roadmap
CREATE TYPE public.roadmap_status AS ENUM ('planejado', 'em-desenvolvimento', 'concluido');

-- Criar enum para tipo de changelog
CREATE TYPE public.changelog_type AS ENUM ('feature', 'improvement', 'bugfix', 'breaking');

-- Criar enum para tipo de conteúdo do changelog
CREATE TYPE public.changelog_content_type AS ENUM ('text', 'image', 'video', 'gif');

-- Criar enum para permissões de usuários
CREATE TYPE public.user_permission AS ENUM ('admin', 'moderator', 'user');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  permission user_permission NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de sugestões
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  module TEXT NOT NULL,
  email TEXT NOT NULL,
  youtube_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  status suggestion_status NOT NULL DEFAULT 'recebido',
  priority priority_level NOT NULL DEFAULT 'media',
  votes INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  admin_response TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de votos das sugestões
CREATE TABLE public.suggestion_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID REFERENCES public.suggestions(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(suggestion_id, user_email)
);

-- Tabela de roadmap
CREATE TABLE public.roadmap_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status roadmap_status NOT NULL DEFAULT 'planejado',
  priority priority_level NOT NULL DEFAULT 'media',
  estimated_date DATE,
  start_date DATE,
  end_date DATE,
  product TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de reações do roadmap
CREATE TABLE public.roadmap_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_item_id UUID REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('likes', 'hearts', 'ideas')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roadmap_item_id, user_email, reaction_type)
);

-- Tabela de changelog
CREATE TABLE public.changelog_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type changelog_type NOT NULL DEFAULT 'feature',
  content_type changelog_content_type NOT NULL DEFAULT 'text',
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  product TEXT NOT NULL,
  release_date DATE NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;

-- Policies para profiles (apenas admins podem gerenciar)
CREATE POLICY "Profiles são visíveis para todos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND permission = 'admin')
);

-- Policies para suggestions (públicas para leitura, qualquer um pode criar)
CREATE POLICY "Sugestões públicas são visíveis" ON public.suggestions FOR SELECT USING (is_public = true);
CREATE POLICY "Qualquer um pode criar sugestões" ON public.suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem gerenciar sugestões" ON public.suggestions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND permission IN ('admin', 'moderator'))
);

-- Policies para suggestion_votes
CREATE POLICY "Votos são visíveis para todos" ON public.suggestion_votes FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode votar" ON public.suggestion_votes FOR INSERT WITH CHECK (true);

-- Policies para roadmap_items (visível para todos, apenas admins editam)
CREATE POLICY "Roadmap é visível para todos" ON public.roadmap_items FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar roadmap" ON public.roadmap_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND permission IN ('admin', 'moderator'))
);

-- Policies para roadmap_reactions
CREATE POLICY "Reações do roadmap são visíveis" ON public.roadmap_reactions FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode reagir ao roadmap" ON public.roadmap_reactions FOR INSERT WITH CHECK (true);

-- Policies para changelog_entries (visível para todos, apenas admins editam)
CREATE POLICY "Changelog é visível para todos" ON public.changelog_entries FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar changelog" ON public.changelog_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND permission IN ('admin', 'moderator'))
);

-- Inserir dados de exemplo
INSERT INTO public.suggestions (title, description, module, email, status, priority, votes, is_public) VALUES
('Adicionar filtro avançado no relatório financeiro', 'Gostaria de poder filtrar os relatórios por período personalizado, tipo de transação e status de pagamento simultaneamente.', 'Financeiro', 'carlos@empresa.com', 'em-analise', 'alta', 23, true),
('Integração com Slack para notificações', 'Seria muito útil receber notificações importantes diretamente no Slack da equipe quando houver atualizações críticas.', 'Workspace', 'ana@empresa.com', 'recebido', 'media', 18, true),
('Modo escuro para toda a plataforma', 'Implementar tema escuro em todas as páginas para melhorar a experiência durante o uso noturno.', 'Bot', 'pedro@empresa.com', 'aprovada', 'baixa', 45, true),
('Exportar dados do mapa em formato Excel', 'Possibilidade de exportar todos os dados visualizados no mapa diretamente para planilhas Excel.', 'Mapa', 'lucia@empresa.com', 'implementada', 'media', 31, true);

INSERT INTO public.roadmap_items (title, description, status, priority, estimated_date, product, votes) VALUES
('Dashboard Analítico Avançado', 'Implementação de dashboards com métricas em tempo real e relatórios customizáveis', 'planejado', 'alta', '2024-04-30', 'Bot', 15),
('Integração com WhatsApp Business', 'Conectar o bot diretamente com a API oficial do WhatsApp Business', 'em-desenvolvimento', 'alta', '2024-03-30', 'Bot', 23),
('Sistema de Backup Automático', 'Backup automático diário de todos os dados com recuperação em 1 clique', 'concluido', 'media', '2024-01-15', 'Workspace', 31),
('Relatórios Fiscais Automatizados', 'Geração automática de relatórios fiscais mensais', 'planejado', 'media', '2024-05-15', 'Fiscal', 19),
('App Mobile para Agenda', 'Aplicativo mobile dedicado para gestão de agenda', 'em-desenvolvimento', 'alta', '2024-06-30', 'Agenda', 28);

INSERT INTO public.changelog_entries (version, title, description, type, content_type, product, release_date, features) VALUES
('v2.3.0', 'Sistema de Notificações Push', 'Implementamos um sistema completo de notificações em tempo real para manter você sempre atualizado.', 'feature', 'image', 'Bot', '2024-01-15', ARRAY['Notificações em tempo real', 'Configurações personalizáveis', 'Histórico de notificações', 'Integração com email']),
('v2.2.5', 'Nova Interface do Dashboard', 'Redesenhamos completamente o dashboard para uma experiência mais intuitiva e moderna.', 'feature', 'video', 'Workspace', '2024-01-10', ARRAY['Design responsivo', 'Tema escuro/claro', 'Widgets personalizáveis', 'Performance otimizada']),
('v2.2.0', 'Integração com APIs Externas', 'Agora você pode conectar facilmente com serviços externos através de nossa nova API unificada.', 'feature', 'text', 'Mapa', '2024-01-05', ARRAY['Mais de 50 integrações disponíveis', 'Sistema de autenticação OAuth2', 'Rate limiting inteligente', 'Documentação completa da API']),
('v2.1.8', 'Relatórios Financeiros Automatizados', 'Geração automática de relatórios financeiros com gráficos interativos e exportação para múltiplos formatos.', 'feature', 'image', 'Financeiro', '2023-12-28', ARRAY['Gráficos interativos', 'Exportação PDF/Excel', 'Agendamento automático', 'Filtros avançados']);
