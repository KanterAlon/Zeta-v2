const path = require('path');
const axios = require('axios');
const vision = require('@google-cloud/vision');

const OFF_PROD_URL = process.env.OPENFOODFACTS_PRODUCT_URL ||
  'https://world.openfoodfacts.org/api/v2/product';
const OFF_SEARCH_URL = process.env.OPENFOODFACTS_SEARCH_URL ||
  'https://world.openfoodfacts.org/cgi/search.pl';
const OFF_API_URL = process.env.OPENFOODFACTS_API_URL || 'https://world.openfoodfacts.org/api/v2/search';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
    __dirname,
    '..',
    'camera-service',
    'credentials',
    'google-vision.json'
  );
}

const visionClient = new vision.ImageAnnotatorClient();

function getVertices(boundingPoly) {
  if (!boundingPoly) return [];
  if (boundingPoly.normalizedVertices?.length) {
    return boundingPoly.normalizedVertices.map(v => ({
      x: v.x ?? 0,
      y: v.y ?? 0
    }));
  }
  if (boundingPoly.vertices?.length) {
    return boundingPoly.vertices.map(v => ({
      x: v.x ?? 0,
      y: v.y ?? 0
    }));
  }
  return [];
}

function getBoxMetrics(boundingPoly) {
  const vertices = getVertices(boundingPoly);
  if (!vertices.length) return { area: 0, box: null };
  const xs = vertices.map(v => v.x);
  const ys = vertices.map(v => v.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);
  return {
    area: width * height,
    box: {
      minX,
      minY,
      maxX,
      maxY,
      vertices
    }
  };
}

function paragraphText(paragraph) {
  return (paragraph.words || [])
    .map(word => (word.symbols || []).map(symbol => symbol.text).join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDominantText(fullTextAnnotation) {
  if (!fullTextAnnotation?.pages?.length) return null;
  const candidates = [];
  fullTextAnnotation.pages.forEach(page => {
    (page.blocks || []).forEach(block => {
      (block.paragraphs || []).forEach(paragraph => {
        const text = paragraphText(paragraph);
        if (!text) return;
        const { area, box } = getBoxMetrics(paragraph.boundingBox || block.boundingBox);
        if (area <= 0) return;
        const weight = area * (1 + Math.log1p(text.length));
        candidates.push({ text, weight, box });
      });
    });
  });
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.weight - a.weight);
  return candidates[0];
}

async function searchOFF(terms) {
  const searchParams = {
    search_terms: terms,
    page_size: 1,
    fields: 'product_name,image_url'
  };
  const url = `${OFF_API_URL}?${new URLSearchParams(searchParams)}`;
  console.log('[Camera] OFF search URL:', url);
  const res = await axios.get(OFF_API_URL, { params: searchParams });
  return res.data.count > 0 ? res.data : null;
}

async function handleUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const buffer = req.file.buffer;

    const [vResp] = await visionClient.annotateImage({
      image: { content: buffer },
      features: [
        { type: 'BARCODE_DETECTION' },
        { type: 'LOGO_DETECTION', maxResults: 5 },
        { type: 'DOCUMENT_TEXT_DETECTION' },
        { type: 'WEB_DETECTION', maxResults: 5 },
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'OBJECT_LOCALIZATION' }
      ]
    });

    const barcodes = (vResp.barcodeAnnotations || []).map(b => b.rawValue);
    const logos = (vResp.logoAnnotations || []).map(l => ({ name: l.description, score: l.score }));
    const rawText = vResp.fullTextAnnotation?.text?.trim() || '';
    const dominant = extractDominantText(vResp.fullTextAnnotation);
    const text = rawText;
    const webEnts = (vResp.webDetection?.webEntities || []).map(e => ({ desc: e.description, score: e.score }));
    const labels = (vResp.labelAnnotations || []).map(l => ({ desc: l.description, score: l.score }));
    const objects = (vResp.localizedObjectAnnotations || []).map(o => ({
      name: o.name,
      score: o.score,
      box: getBoxMetrics(o.boundingPoly).box
    }));

    const visionData = {
      barcodes,
      logos,
      text,
      webEnts,
      labels,
      objects,
      primaryText: dominant?.text || null,
      primaryBox: dominant?.box || null
    };

    const prompt = `
    Eres un asistente en ESPAÑOL experto en productos alimenticios. Recibes un JSON con datos de Google Vision sobre un envase. Tu tarea es devolver SOLO el término de búsqueda más corto y útil para buscar ese producto en OpenFoodFacts.
    \n    ✅ REGLAS CLARAS:
    1. Prioriza siempre el campo \`primaryText\`, que corresponde al texto más grande detectado en el envase.
       - Si \`primaryText\` no es descriptivo, usa el campo \`text\` como apoyo.
       - Si hay varias líneas, elige la más descriptiva en ESPAÑOL que indique qué es el producto.
       - Omite frases de marketing, ingredientes o instrucciones.
    2. Solo incluye la marca si aparece en \`logos\`.
    3. El resultado debe estar en SINGULAR, sin sabores, variantes ni cantidades.
    4. Si el nombre genérico está en otro idioma, TRADÚCELO al español.
    5. Usa \`webEnts\` y \`labels\` solo como APOYO para confirmar el OCR, NUNCA como reemplazo.
    6. No inventes datos. Si no está claro, deja fuera esa parte.
    7. Devuelve SOLO el término limpio, sin comillas ni explicaciones.
    \n    ✅ EJEMPLOS:
    - "Barritas Íntegra de Proteína con Arándanos y Semillas" → Barrita Íntegra
    - "Font Vella Agua Mineral Natural" (con logo Font Vella) → Font Vella Agua Mineral
    - "Nestlé Chocolate KitKat 4 barras" (con logo KitKat) → KitKat
    \n    Ahora, procesa este JSON y devuelve SOLO la línea con el término final (sin comillas ni nada más):
    \n    \`\`\`json
    ${JSON.stringify(visionData, null, 2)}
    \`\`\`
    `.trim();

    const aiResp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente que genera términos de búsqueda para OpenFoodFacts, en español y con marcas reales.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 32
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const aiResponse = aiResp.data.choices[0].message.content.trim();

    let offData = null;
    let offMethod = null;

    if (barcodes.length) {
      try {
        const byCode = await axios.get(`${OFF_PROD_URL}/${encodeURIComponent(barcodes[0])}.json`);
        if (byCode.data.status === 1) {
          offData = byCode.data.product;
          offMethod = 'barcode';
        }
      } catch (e) {
        console.warn('OFF by barcode failed:', e.message);
      }
    }

    if (!offData) {
      const offSearch = await searchOFF(aiResponse);
      if (offSearch) {
        offData = offSearch.products?.[0] || offSearch;
        offMethod = 'search';
      }
    }

    res.json({
      vision: visionData,
      ai: { prompt, response: aiResponse },
      off: { found: !!offData, method: offMethod, data: offData }
    });
  } catch (err) {
    console.error('Error en /upload:', err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}

module.exports = {
  handleUpload
};
