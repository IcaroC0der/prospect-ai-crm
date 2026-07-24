import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedResult {
  title: string;
  link: string;
  snippet: string;
  phone?: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
}

/**
 * Realiza busca de empresas via Serper.dev (Google Maps API) se a chave existir,
 * ou faz fallback automático para o Web Scraper gratuito de HTML.
 */
export async function scrapeWebResults(query: string): Promise<ScrapedResult[]> {
  const serperApiKey = process.env.SERPER_API_KEY;

  // 1. Se a chave do Serper.dev estiver configurada, usa a API oficial do Google Maps/Search (Ultra Precisa)
  if (serperApiKey) {
    try {
      const response = await axios.post(
        'https://google.serper.dev/places',
        { q: query, gl: 'br', hl: 'pt-br' },
        {
          headers: {
            'X-API-KEY': serperApiKey,
            'Content-Type': 'application/json',
          },
          timeout: 8000,
        }
      );

      const places = response.data.places || [];
      return places.slice(0, 5).map((place: any) => ({
        title: place.title,
        link: place.website || '',
        snippet: `Categoria: ${place.category || ''}. Endereço: ${place.address || ''}. Nota no Google: ${place.rating || 'N/A'} (${place.ratingCount || 0} avaliações).`,
        phone: place.phoneNumber,
        rating: place.rating,
        reviewsCount: place.ratingCount,
        address: place.address,
      }));
    } catch (error) {
      console.error('Erro na API Serper.dev, caindo para o scraper fallback:', error);
    }
  }

  // 2. Fallback Gratuito sem API (DuckDuckGo HTML Scraping)
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 8000,
    });

    const $ = cheerio.load(response.data);
    const results: ScrapedResult[] = [];

    $('.result').each((_, element) => {
      const title = $(element).find('.result__title a').text().trim();
      const rawLink = $(element).find('.result__title a').attr('href') || '';
      const snippet = $(element).find('.result__snippet').text().trim();

      let link = rawLink;
      if (rawLink.includes('uddg=')) {
        const match = rawLink.match(/uddg=([^&]+)/);
        if (match && match[1]) {
          link = decodeURIComponent(match[1]);
        }
      }

      if (title && link && !link.includes('duckduckgo.com')) {
        results.push({ title, link, snippet });
      }
    });

    return results.slice(0, 8);
  } catch (error) {
    console.error('Erro no Web Scraper fallback:', error);
    return [];
  }
}
