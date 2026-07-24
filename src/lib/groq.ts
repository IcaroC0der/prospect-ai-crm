import Groq from 'groq-sdk';
import { scrapeWebResults, ScrapedResult } from './scraper';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface ProspectAnalysis {
  name: string;
  contactPerson?: string;
  role?: string;
  phone?: string;
  city: string;
  segment: string;
  website?: string;
  instagram?: string;
  googleMaps?: string;
  googleRating?: number;
  googleReviewsCount?: number;
  score: number;
  summary: string;
  principalPain: string;
  opportunity: string;
  icebreaker: string;
  suggestedQuestions: string[];
  probableObjections: Array<{ objection: string; response: string }>;
  conversionChance: string;
}

export async function analyzeLeadWithAI(query: { companyName?: string; city: string; segment: string }): Promise<ProspectAnalysis> {
  const searchQuery = query.companyName 
    ? `"${query.companyName}" "${query.city}" site instagram` 
    : `"${query.segment}" "${query.city}" site instagram telefone`;

  // 1. Executa o Web Scraping real da internet (Google Maps/Places via Serper ou HTML Scraper)
  const scrapedData: ScrapedResult[] = await scrapeWebResults(searchQuery);

  const rawScrapedText = scrapedData.map((res, i) => `[Resultado ${i+1}] Título: ${res.title}\nLink: ${res.link}\nResumo: ${res.snippet}`).join('\n\n');

  // 2. Alimenta a IA da Groq com instruções RÍGIDAS de qualificação de sites
  const prompt = `Você é o qualificador de leads especialista do CRM "ProspectAI".
Sua empresa vende CRIAÇÃO DE SITES MODERNOS, LANDING PAGES DE ALTA CONVERSÃO E MARKETING B2B.

--- DADOS RASPADOS DO GOOGLE MAPS & WEB (WEB SCRAPING REAL) ---
${rawScrapedText || 'Nenhum resultado direto encontrado. Utilize inteligência de mercado para sintetizar com dados da cidade.'}
---------------------------------------------------------------

CRITÉRIOS ESTRITOS DE PONTUAÇÃO (SCORE 0 A 100):
1. **SE A EMPRESA NÃO TEM SITE (ou só tem Instagram/Google Maps):**
   -> SCORE ALTÍSSIMO (90 a 98). Dor principal: "Depende 100% de redes sociais/Maps sem canal próprio de conversão".

2. **SE A EMPRESA TEM SITE:**
   Analise o link e o resumo do site:
   - Se for um site ULTRAPASSADO, antigo, feito em plataformas amadoras (Wix, Weebly, Google Sites, WordPress genérico), lento ou sem WhatsApp:
     -> SCORE ALTO (80 a 89). Dor principal: "Site desatualizado em plataforma amadora (Wix/Google Sites), não passa autoridade nem converte móvel".
   - Se o site for MODERNO, profissional, rápido e estruturado:
     -> SCORE BAIXO (30 a 50). Esta empresa NÃO é um bom lead para vender sites.

3. **BOA REPUTAÇÃO É FUNDAMENTAL:**
   Empresas com muitas avaliações (>50) no Google Maps ou com Instagram ativo são MUITO valiosas porque provam que o negócio fatura e tem dinheiro para investir em um site novo.

Com base nisso, analise e monte a ficha em formato JSON válido:
{
  "name": "Nome real da empresa identificada",
  "contactPerson": "Nome provável do proprietário/decisor",
  "role": "Sócio-Proprietário",
  "phone": "(11) 98765-4321",
  "city": "${query.city}",
  "segment": "${query.segment}",
  "website": "URL do site se existir (ou null se não tiver)",
  "instagram": "Instagram se encontrado",
  "googleMaps": "Link do perfil no Google Maps",
  "googleRating": 4.8,
  "googleReviewsCount": 110,
  "score": 94,
  "summary": "Análise crítica do site e presença digital. Especifique se o site é amador (Wix/Google Sites/Wordpress antigo) ou inexistente.",
  "principalPain": "Dor exata: (ex: Não possui site / Site antigo feito em Wix desatualizado sem conversão)",
  "opportunity": "Proposta comercial exata: (ex: Reconstrução de site moderno com Landing Page de alta velocidade e agendamento via WhatsApp)",
  "icebreaker": "Quebra-gelo exclusivo focado no site amador ou na falta dele, citando a boa reputação da empresa.",
  "suggestedQuestions": [
    "Pergunta 1 sobre o site atual ou falta dele",
    "Pergunta 2 sobre perda de clientes para concorrentes com site moderno",
    "Pergunta 3 para agendar reunião de 15 minutos"
  ],
  "probableObjections": [
    { "objection": "Já temos o site em Wix e achamos suficiente", "response": "Explique com consultoria a perda de velocidade, SEO e conversão do Wix frente a uma Landing Page profissional." }
  ],
  "conversionChance": "Alta (85%)"
}

Responda SOMENTE o JSON puro.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return parsed as ProspectAnalysis;
  } catch (error) {
    console.error('Erro no cruzamento de Web Scraping + Groq AI:', error);
    throw error;
  }
}
