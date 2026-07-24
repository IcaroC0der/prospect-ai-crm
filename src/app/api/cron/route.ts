import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeLeadWithAI } from '@/lib/groq';

const DEFAULT_SEGMENTS = [
  'Clínicas Odontológicas',
  'Restaurantes e Bares',
  'Oficinas Mecânicas',
  'Contabilidades',
  'Academias e Crossfit',
  'Advogados e Escritórios',
  'Imobiliárias e Corretores',
  'Pet Shops e Veterinárias',
  'Clínicas Médicas e Dermatologia',
  'Estética e Salões de Beleza'
];

const BRAZILIAN_CITIES = [
  'São Paulo', 'Campinas', 'Guarulhos', 'Ribeirão Preto', 'Sorocaba', 
  'São José dos Campos', 'Santos', 'Santo André', 'Osasco', 'Belo Horizonte', 
  'Curitiba', 'Porto Alegre', 'Florianópolis', 'Goiânia'
];

export async function GET(request: Request) {
  // Autenticação de segurança opcional do Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const today = new Date().getDay();
    // 1=Segunda, 2=Terça, 4=Quinta, 5=Sexta
    if (![1, 2, 4, 5].includes(today)) {
      return NextResponse.json({ message: 'Hoje não é dia de pesquisa automática (apenas Seg, Ter, Qui, Sex).' });
    }

    const createdLeads = [];
    const count = 15; // Meta diária oficial de 15 empresas

    const shuffledSegments = [...DEFAULT_SEGMENTS].sort(() => 0.5 - Math.random());
    const shuffledCities = [...BRAZILIAN_CITIES].sort(() => 0.5 - Math.random());

    for (let i = 0; i < count; i++) {
      const segment = shuffledSegments[i % shuffledSegments.length];
      const city = shuffledCities[i % shuffledCities.length];

      const aiAnalysis = await analyzeLeadWithAI({ city, segment });

      const lead = await prisma.lead.create({
        data: {
          name: aiAnalysis.name,
          contactPerson: aiAnalysis.contactPerson,
          role: aiAnalysis.role,
          phone: aiAnalysis.phone || '(11) 98765-4321',
          city: aiAnalysis.city || city,
          segment: aiAnalysis.segment || segment,
          website: aiAnalysis.website,
          instagram: aiAnalysis.instagram,
          googleMaps: aiAnalysis.googleMaps,
          googleRating: aiAnalysis.googleRating || 4.8,
          googleReviewsCount: aiAnalysis.googleReviewsCount || 120,
          score: aiAnalysis.score || 90,
          summary: aiAnalysis.summary,
          principalPain: aiAnalysis.principalPain,
          opportunity: aiAnalysis.opportunity,
          icebreaker: aiAnalysis.icebreaker,
          suggestedQuestions: JSON.stringify(aiAnalysis.suggestedQuestions),
          probableObjections: JSON.stringify(aiAnalysis.probableObjections),
          conversionChance: aiAnalysis.conversionChance,
          status: 'new',
          pipelineStage: 'pronto_para_contato',
        },
      });
      createdLeads.push(lead);
    }

    return NextResponse.json({ success: true, message: 'Cron das 06:00 AM executado com sucesso!', count: createdLeads.length });
  } catch (error) {
    console.error('Erro na execução do Cron Handler das 06h:', error);
    return NextResponse.json({ error: 'Erro ao executar rotina do Cron' }, { status: 500 });
  }
}
