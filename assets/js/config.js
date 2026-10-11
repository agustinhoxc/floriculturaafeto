/* ==========================================================================
   CONFIGURAÇÃO CENTRAL DA FLORICULTURA AFETO
   Altere aqui os dados comerciais. O restante do site lê deste arquivo.
   Campos com valor null ficam ocultos no site até serem preenchidos.
   ========================================================================== */
window.AFETO_CONFIG = {
  /* Endereço final do site (usado em links de compartilhamento). Atualize ao publicar. */
  siteUrl: "https://agustinhoxc.github.io/floricultura-afeto/",

  business: {
    name: "Floricultura Afeto",
    tagline: "Acreditamos que flores carregam sentimentos.",

    /* WhatsApp oficial: só dígitos, com 55 + DDD. (31) 2523-3981 */
    whatsapp: "553125233981",
    phoneDisplay: "(31) 2523-3981",

    address: {
      street: "Av. Augusto de Lima, 744",
      unit: "Loja E9-231",
      venue: "Mercado Central de Belo Horizonte",
      district: "Centro",
      city: "Belo Horizonte",
      state: "MG",
      zip: "30190-006"
    },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Floricultura+Afeto+Mercado+Central+Belo+Horizonte",
    mapsEmbed: "https://www.google.com/maps?q=Av.+Augusto+de+Lima,+744,+Centro,+Belo+Horizonte+-+MG,+30190-006&output=embed",

    /* PENDENTE: horário de funcionamento da loja (ex.: "Seg a sáb, 8h às 18h"). */
    hours: null,

    social: {
      tiktok: "https://www.tiktok.com/@floricultura.afeto",
      tiktokHandle: "@floricultura.afeto",
      /* PENDENTE: perfil oficial do Instagram, ex.: "https://www.instagram.com/usuario/" */
      instagram: null,
      instagramHandle: null
    },

    /* PENDENTE: e-mail comercial e CNPJ (aparecem no rodapé quando preenchidos). */
    email: null,
    cnpj: null
  },

  /* Mensagens iniciais do WhatsApp. {produto} é trocado pelo nome do arranjo. */
  messages: {
    default: "Olá, Afeto! Vim pelo site e gostaria de fazer uma encomenda.",
    product: "Olá, Afeto! Vi o {produto} no site e gostaria de saber disponibilidade e valor.",
    personalize: "Olá, Afeto! Estou pensando em um presente especial. Posso contar a ocasião, as cores e o sentimento que quero transmitir?",
    visit: "Olá, Afeto! Quero passar na loja do Mercado Central. Qual o melhor horário?"
  },

  catalog: {
    /* Enquanto as fotos reais não chegam, os itens são exemplos ilustrados. */
    showDemoNotice: true,
    priceFallback: "Valor sob consulta"
  }
};
