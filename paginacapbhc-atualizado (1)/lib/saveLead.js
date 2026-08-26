// Envia os dados do lead (nome, whatsapp, email) para a planilha Google
// configurada via Google Apps Script Web App.
//
// Configure a variável de ambiente GOOGLE_SHEETS_WEBHOOK_URL com a URL
// do seu Web App do Apps Script (veja instruções no README).

export async function saveLead({ nome, whatsapp, email, origem }) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      'GOOGLE_SHEETS_WEBHOOK_URL não configurada nas variáveis de ambiente.'
    );
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: String(nome).trim(),
      whatsapp: String(whatsapp).trim(),
      email: String(email).trim(),
      origem: origem || '',
      data: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Planilha respondeu com status ${response.status}`);
  }

  return true;
}

export function validateLead({ nome, whatsapp, email }) {
  if (!nome || !whatsapp || !email) {
    return 'Campos obrigatórios ausentes (nome, whatsapp, email).';
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(email))) {
    return 'E-mail inválido.';
  }
  const digits = String(whatsapp).replace(/\D/g, '');
  if (digits.length < 10) {
    return 'WhatsApp inválido.';
  }
  return null;
}
