import axios from 'axios';

async function testSerper() {
  const serperApiKey = '895d24b3835d0fa8f09409b5ed549415e2be0471';
  try {
    const response = await axios.post(
      'https://google.serper.dev/places',
      { q: 'Clínicas Odontológicas em São Paulo', gl: 'br', hl: 'pt-br' },
      {
        headers: {
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ SERPER API WORKS! Places found:', response.data.places?.length || 0);
    if (response.data.places?.[0]) {
      console.log('Sample Place:', response.data.places[0].title);
    }
  } catch (err: any) {
    console.error('❌ SERPER API ERROR:', err?.response?.data || err?.message || err);
  }
}

testSerper();
