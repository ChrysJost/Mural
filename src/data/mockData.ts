
// Mock data with database-compatible structure
export const mockSuggestions = [
  {
    id: "1",
    title: "Adicionar filtro avançado no relatório financeiro",
    description: "Gostaria de poder filtrar os relatórios por período personalizado, tipo de transação e status de pagamento simultaneamente para ter uma visão mais detalhada dos dados financeiros.",
    module: "Financeiro",
    status: "Em análise",
    votes: 23,
    hasVoted: false,
    createdAt: "2024-01-15",
    email: "carlos@empresa.com",
    comments: 5,
    adminResponse: "Estamos analisando a viabilidade técnica desta funcionalidade.",
    isPinned: false,
    isPublic: true
  },
  {
    id: "2", 
    title: "Integração com Slack para notificações",
    description: "Seria muito útil receber notificações importantes diretamente no Slack da equipe quando houver atualizações críticas no sistema.",
    module: "Workspace",
    status: "Recebido",
    votes: 18,
    hasVoted: false,
    createdAt: "2024-01-18",
    email: "ana@empresa.com",
    comments: 3,
    adminResponse: null,
    isPinned: false,
    isPublic: true
  },
  {
    id: "3",
    title: "Modo escuro para toda a plataforma",
    description: "Implementar tema escuro em todas as páginas para melhorar a experiência durante o uso noturno e reduzir o cansaço visual.",
    module: "Bot",
    status: "Aprovada",
    votes: 45,
    hasVoted: true,
    createdAt: "2024-01-20",
    email: "pedro@empresa.com",
    comments: 12,
    adminResponse: "Aprovada! Será implementada na próxima versão.",
    isPinned: true,
    isPublic: true
  },
  {
    id: "4",
    title: "Exportar dados do mapa em formato Excel", 
    description: "Possibilidade de exportar todos os dados visualizados no mapa diretamente para planilhas Excel para análise offline.",
    module: "Mapa",
    status: "Implementada",
    votes: 31,
    hasVoted: false,
    createdAt: "2024-01-10",
    email: "lucia@empresa.com",
    comments: 8,
    adminResponse: "Funcionalidade implementada com sucesso!",
    isPinned: false,
    isPublic: true
  },
  {
    id: "5",
    title: "Sugestão privada para testes",
    description: "Esta é uma sugestão privada que não deve aparecer no mural público.",
    module: "Outro",
    status: "Recebido",
    votes: 2,
    hasVoted: false,
    createdAt: "2024-01-22",
    email: "interno@mksolution.com",
    comments: 1,
    adminResponse: null,
    isPinned: false,
    isPublic: false
  }
];
