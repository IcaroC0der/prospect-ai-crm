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
  'Estética e Salões de Beleza',
  'Fisioterapia e Pilates',
  'Construtoras e Reformas',
  'Lojas de Autopeças',
  'Escolas Particulares e Cursos'
];

const BRAZILIAN_CITIES = [
  'São Paulo', 'Campinas', 'Guarulhos', 'Ribeirão Preto', 'Sorocaba', 
  'São José dos Campos', 'Santos', 'Santo André', 'Osasco', 'Belo Horizonte', 
  'Curitiba', 'Porto Alegre', 'Florianópolis', 'Goiânia', 'Salvador', 'Recife'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const stage = searchParams.get('stage');

  try {
    const where: any = {};
    if (status) where.status = status;
    if (stage) where.pipelineStage = stage;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { calls: true },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Se o body solicitar uma geração em lote por IA
    if (body.action === 'generate_batch') {
      const count = body.count || 3;

      const createdLeads = [];
      // Sorteia nichos e cidades a cada iteração para máxima variabilidade em produção
      const shuffledSegments = [...DEFAULT_SEGMENTS].sort(() => 0.5 - Math.random());
      const shuffledCities = [...BRAZILIAN_CITIES].sort(() => 0.5 - Math.random());

      for (let i = 0; i < count; i++) {
        const segment = shuffledSegments[i % shuffledSegments.length];
        const city = body.cityCustomized ? body.city : shuffledCities[i % shuffledCities.length];

        // Dispara a busca real no Google Maps + Serper + Groq AI
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

      return NextResponse.json({ success: true, count: createdLeads.length, leads: createdLeads });
    }

    // Se for criação manual de lead
    const lead = await prisma.lead.create({
      data: body,
    });
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Erro ao processar lead:', error);
    return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
  }
}
