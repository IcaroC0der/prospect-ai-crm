import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database...');

  await prisma.lead.createMany({
    data: [
      {
        name: 'Clínica Odontológica OralPrime SP',
        contactPerson: 'Dr. Roberto Silva',
        role: 'Sócio-Proprietário',
        phone: '(11) 99887-1122',
        city: 'São Paulo',
        segment: 'Clínicas Odontológicas',
        website: 'https://oralprimesp.com.br',
        instagram: '@oralprime.sp',
        score: 96,
        status: 'new',
        pipelineStage: 'pronto_para_contato',
        summary: 'A empresa possui alta reputação com mais de 300 avaliações 5 estrelas no Google Maps, porém o site atual é antigo, lento e não possui agendamento online via WhatsApp.',
        principalPain: 'Não possui site moderno e perde clientes orgânicos do Google por falta de SEO local e agendamento automático.',
        opportunity: 'Criação de Landing Page de Alta Conversão com botão direto de WhatsApp e SEO para a região de Pinheiros.',
        icebreaker: 'Parabéns pelas mais de 300 avaliações no Google! Notei que a clínica é referência em Pinheiros, mas o agendamento ainda depende 100% de ligação. Foi uma escolha deliberada?',
        suggestedQuestions: JSON.stringify([
          'Qual o canal que mais traz pacientes novos hoje?',
          'Quantos pacientes deixam de agendar por falta de resposta rápida no WhatsApp fora do horário comercial?',
          'Podemos marcar 15 min na quarta-feira para eu te mostrar como captar +20 pacientes/mês via Google?'
        ]),
        probableObjections: JSON.stringify([
          { objection: 'Já temos agendamento pelo Instagram', response: 'Entendo perfeitamente! O Instagram é ótimo para criar autoridade, mas o Google pega quem já está com dor de dente pronto para agendar hoje.' }
        ]),
        conversionChance: 'Alta (88% de chance)',
      },
      {
        name: 'Restaurante Sabor & Arte Moema',
        contactPerson: 'Mariana Costa',
        role: 'Gerente Geral',
        phone: '(11) 97766-3344',
        city: 'São Paulo',
        segment: 'Restaurantes',
        website: null,
        instagram: '@saborearte.moema',
        score: 92,
        status: 'approved',
        pipelineStage: 'contato_iniciado',
        summary: 'Restaurante tradicional de Moema com Instagram super movimentado, mas sem cardápio digital próprio e sem site para reservas.',
        principalPain: 'Depende exclusivamente do iFood (pagando taxas altas) e do Instagram para divulgar o cardápio.',
        opportunity: 'Desenvolvimento de Cardápio Digital próprio integrado ao WhatsApp para pedidos diretos sem taxa.',
        icebreaker: 'Vi os pratos no Instagram de vocês e fiquei impressionado com o engajamento! Vocês já calcularam quanto deixam em taxas para o iFood todo mês por não ter cardápio direto?',
        suggestedQuestions: JSON.stringify([
          'Qual a porcentagem de pedidos que hoje vem do iFood vs WhatsApp?',
          'Se você economizasse 15% das taxas do iFood criando um canal próprio, quanto isso impactaria a margem?'
        ]),
        probableObjections: JSON.stringify([
          { objection: 'O iFood já faz tudo por nós', response: 'Com certeza, mas ter seu próprio canal economiza milhares de reais em comissões no final do ano.' }
        ]),
        conversionChance: 'Alta (82% de chance)',
      }
    ]
  });

  console.log('Seed completo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
