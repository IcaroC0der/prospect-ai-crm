import fs from 'fs';
import path from 'path';

// Parse .env.local manually
try {
  const envConfig = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
} catch (e) {}

import { analyzeLeadWithAI } from '../src/lib/groq';

async function testGenerate() {
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Present (' + process.env.GROQ_API_KEY.slice(0, 8) + '...)' : 'MISSING');
  console.log('SERPER_API_KEY:', process.env.SERPER_API_KEY ? 'Present (' + process.env.SERPER_API_KEY.slice(0, 8) + '...)' : 'MISSING');

  try {
    const result = await analyzeLeadWithAI({
      city: 'São Paulo',
      segment: 'Clínicas Odontológicas'
    });
    console.log('✅ AI GENERATION SUCCESSFUL:');
    console.log('Name:', result.name);
    console.log('Score:', result.score);
    console.log('Pain:', result.principalPain);
  } catch (err: any) {
    console.error('❌ AI GENERATION FAILED DETAILED ERROR:', err?.message || err);
  }
}

testGenerate();
