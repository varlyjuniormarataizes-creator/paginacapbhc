import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { saveLead, validateLead } from './lib/saveLead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
app.use(express.static(publicPath));

app.post('/api/leads', async (req, res) => {
  try {
    const { nome, whatsapp, email } = req.body || {};

    const validationError = validateLead({ nome, whatsapp, email });
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    await saveLead({ nome, whatsapp, email, origem: req.headers['referer'] || '' });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar lead:', err);
    res.status(500).json({ error: 'Erro ao salvar os dados. Tente novamente.' });
  }
});

app.get('*', (req, res) => {
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
