export type Lead = {
  id: string;
  name: string;
  segment: string;
  city: string;
  phone: string;
  website?: string;
  score: number;
  status: 'new' | 'approved' | 'following_up' | 'archived';
  icebreaker: string;
  summary: string;
  principalPain: string;
  opportunity: string;
};

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "Sorrisos & Cia Odontologia",
    segment: "Clínica Odontológica",
    city: "São Paulo, SP",
    phone: "(11) 98888-7777",
    website: "www.sorrisosecia.com.br",
    score: 96,
    status: 'new',
    icebreaker: "Vi que vocês possuem mais de 400 avaliações no Google. Parabéns! Fiquei curioso... Foi uma escolha trabalhar apenas pelas redes sociais?",
    summary: "A empresa demonstra excelente reputação online, possui Instagram ativo, forte presença local e elevada quantidade de avaliações positivas, porém depende exclusivamente das redes sociais para aquisição de clientes.",
    principalPain: "Falta de previsibilidade na captação de pacientes e dependência do Instagram.",
    opportunity: "Criação de Landing Page com agendamento online e funil de captura via SEO local.",
  },
  {
    id: "2",
    name: "Bistrô do Chef",
    segment: "Restaurante",
    city: "Rio de Janeiro, RJ",
    phone: "(21) 99999-5555",
    score: 85,
    status: 'approved',
    icebreaker: "Notei que as avaliações sobre o cardápio são fantásticas, mas o site de vocês está fora do ar. Isso tem atrapalhado reservas?",
    summary: "Restaurante premium com ótima avaliação, porém sem presença digital própria e sistema de reservas engessado.",
    principalPain: "Perda de reservas para concorrentes com melhor experiência digital.",
    opportunity: "Website focado em experiência com sistema de reservas integrado e cardápio digital luxuoso.",
  },
  {
    id: "3",
    name: "Automecânica Precisão",
    segment: "Oficina",
    city: "Curitiba, PR",
    phone: "(41) 97777-4444",
    website: "www.precisaoauto.com",
    score: 72,
    status: 'following_up',
    icebreaker: "Vi que vocês têm um ótimo espaço e muitos clientes fiéis. Como vocês fazem para os clientes mais novos acharem a oficina quando precisam de guincho?",
    summary: "Oficina tradicional, bom atendimento, porém site extremamente lento e sem otimização para mobile.",
    principalPain: "Site muito lento e sem versão para celular, perdendo clientes de emergência.",
    opportunity: "Refazer site otimizado para velocidade (mobile-first) e integrar botão flutuante de WhatsApp.",
  }
];

export const MOCK_DASHBOARD = {
  leadsEncontradosHoje: 30,
  leadsNovos: 15,
  ligacoesPendentes: 8,
  reunioesAgendadas: 2,
  conversaoSemanal: "18%",
  melhorSegmento: "Clínicas Odontológicas",
};
