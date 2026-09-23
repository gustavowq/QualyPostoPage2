// Centraliza os dados usados pelo botão de contato.
export const SITE_CONFIG = {
  /*
   * Coloque DDI + DDD + número, usando somente números.
   * Exemplo fictício de formato: 5562999999999
   */
  whatsappNumber: '',

  whatsappMessage:
    'Olá! Conheci o QualyPosto pelo site e gostaria de saber mais sobre a plataforma.'
};

// Monta o link do WhatsApp somente quando existe um número configurado.
export function getWhatsAppUrl(): string {
  if (!SITE_CONFIG.whatsappNumber) {
    return '';
  }

  return (
    `https://wa.me/${SITE_CONFIG.whatsappNumber}` +
    `?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`
  );
}
