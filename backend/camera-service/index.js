// backend/camera-service/index.js
// Backend separado para búsqueda por cámara
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const path = require('path');
const dotenv = require('dotenv');
// Cargar variables de entorno para el servicio de cámara
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.secrets'), override: true });

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const vision = require('@google-cloud/vision');

const app = express();
app.use(cors());

// Ruta a credenciales de Google Vision
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'credentials', 'google-vision.json');
}

const OFF_PROD_URL = process.env.OPENFOODFACTS_PRODUCT_URL;
const OFF_SEARCH_URL = process.env.OPENFOODFACTS_SEARCH_URL;

const visionClient = new vision.ImageAnnotatorClient();
const upload = multer({ storage: multer.memoryStorage() });

// Buscar en OpenFoodFacts
async function searchOFF(terms) {
  const res = await axios.get(OFF_SEARCH_URL, {
    params: { search_terms: terms, search_simple: 1, action: 'process', json: 1 }
  });
  return res.data.count > 0 ? res.data : null;
}

app.post('/upload', upload.single('image'), async (req, res) => {
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
    const text = rawText;
    const webEnts = (vResp.webDetection?.webEntities || []).map(e => ({ desc: e.description, score: e.score }));
    const labels = (vResp.labelAnnotations || []).map(l => ({ desc: l.description, score: l.score }));
    const objects = (vResp.localizedObjectAnnotations || []).map(o => o.name);

    const visionData = { barcodes, logos, text, webEnts, labels, objects };

    const prompt = `
    Eres un asistente en ESPAÑOL experto en productos alimenticios. Recibes un JSON con datos de Google Vision sobre un envase. Tu tarea es devolver SOLO el término de búsqueda más corto y útil para buscar ese producto en OpenFoodFacts.
    \n    ✅ REGLAS CLARAS:
    1. Usa el texto OCR (\`text\`) como fuente PRINCIPAL para identificar el nombre genérico.
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Camera backend en http://localhost:${PORT}`));
