/**
 * Bookiry Cloudflare Worker - AI Sparks Generator & Edge Proxy
 * 
 * Provides zero-configuration, keyless Socratic questioning for end readers.
 * Keeps the master Gemini Flash API key securely in Cloudflare Environment Secrets.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // 2. Health check route
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'Bookiry AI Edge Worker' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // Diagnostic route to list all allowed models
    if (url.pathname === '/models') {
      const apiKey = env.GEMINI_API_KEY;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // 3. Sparks Generation Endpoint: POST /api/sparks
    if (url.pathname === '/api/sparks' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { title, author, synopsis, compass, customIntent } = body;

        if (!title) {
          return new Response(JSON.stringify({ error: 'Title is required' }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ 
            error: 'Server configuration error: GEMINI_API_KEY secret is not set in Cloudflare Worker.' 
          }), {
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const sparks = await generateSparksWithGemini(title, author, synopsis, compass, customIntent, apiKey);

        return new Response(JSON.stringify({ success: true, sparks }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Failed to generate sparks' }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Call Gemini Flash API with structured JSON output
 */
async function generateSparksWithGemini(title, author, synopsis, compass, customIntent, apiKey) {
  const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  const prompt = `You are the master curator of Bookiry (Intentional 1:1 Reading Compass).
A reader is about to open the book "${title}" by ${author || 'Unknown Author'}.

Context Synopsis / Themes of this specific book:
"""
${(synopsis || 'Global classical literature or modern non-fiction masterpiece.').slice(0, 1500)}
"""

The reader's current emotional state / reading compass: "${compass || 'healing'}"
Reader's custom intention or inquiry: "${customIntent || 'Read deeply with lasting clarity'}"

Generate 4 deeply catalytic, tailored Socratic questions following the Bookiry framework.
DO NOT provide generic reading questions. Ground them firmly in this book's distinct concepts, paradoxical thesis, and author perspective:

1. Spark (Before Opening): A counter-intuitive, perspective-shifting question to carry before page 1.
2. Lens (Midway Observation): An exact tension or nuance to actively notice while turning pages.
3. Quest (Critical Dilemma): A sharp philosophical conflict or author's claim that challenges the reader's status quo.
4. Echo (Life Takeaway): A lasting personal inquiry that transforms this book into lifelong personal agency.

Strict Output Rules:
- Return ONLY a raw JSON object with keys: "spark", "lens", "quest", "echo".
- Write questions in English (or match the predominant language of the book/query).
- Do not use markdown backticks, just valid parseable JSON.`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      responseMimeType: "application/json"
    }
  };

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      } else {
        const errorText = await response.text();
        lastError = new Error(`Gemini API error [${model}] (${response.status}): ${errorText}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate models failed');
}
