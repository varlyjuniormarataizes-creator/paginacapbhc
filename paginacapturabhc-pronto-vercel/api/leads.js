import { saveLead, validateLead } from '../lib/saveLead.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  try {
    const { nome, whatsapp, email } = req.body || {};

    const validationError = validateLead({ nome, whatsapp, email });
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    await saveLead({
      nome,
      whatsapp,
      email,
      origem: req.headers['referer'] || '',
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar lead:', err);
    res.status(500).json({ error: 'Erro ao salvar os dados. Tente novamente.' });
  }
}
