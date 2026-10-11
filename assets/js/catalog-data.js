/* ==========================================================================
   CATÁLOGO DE EXEMPLOS
   Itens ilustrativos para orientar o cliente. Quando houver fotos e dados
   reais, substitua "image", preencha "price" e "size" e ajuste "demo": false.
   ========================================================================== */
window.AFETO_CATALOG = {
  categories: {
    buques: { label: "Buquês", singular: "Buquê" },
    arranjos: { label: "Arranjos", singular: "Arranjo" },
    plantas: { label: "Plantas e orquídeas", singular: "Planta" },
    kokedamas: { label: "Kokedamas", singular: "Kokedama" }
  },

  sentiments: {
    apaixonar: { label: "Para apaixonar", hint: "Rosas, tons quentes, declarações", image: "buque-paixao" },
    agradecer: { label: "Para agradecer", hint: "Flores do campo e orquídeas que dizem obrigado", image: "buque-gratidao" },
    celebrar: { label: "Para celebrar", hint: "Girassóis, caixas floridas, alegria em cor", image: "buque-sol" },
    acolher: { label: "Para acolher", hint: "Tons suaves e plantas que ficam por perto", image: "kokedama-lirio" },
    surpreender: { label: "Para surpreender", hint: "Quando não precisa de data marcada", image: "box-jardim" },
    carinho: { label: "Para demonstrar carinho", hint: "Kokedamas, suculentas, cuidado no dia a dia", image: "kokedama-jiboia" }
  },

  occasions: {
    aniversario: { label: "Aniversários", text: "Cores alegres para comemorar mais um ano.", icon: "i-cake" },
    romance: { label: "Romance", text: "Para declarar, reconquistar ou só lembrar.", icon: "i-heart" },
    agradecimento: { label: "Agradecimentos", text: "Um obrigado que não cabe numa mensagem.", icon: "i-letter" },
    nascimento: { label: "Nascimentos", text: "Boas-vindas delicadas para quem acabou de chegar.", icon: "i-cradle" },
    datas: { label: "Datas especiais", text: "Dia das Mães, dos Namorados, formaturas.", icon: "i-calendar" },
    "sem-motivo": { label: "Sem motivo", text: "Os gestos espontâneos costumam ser os mais lembrados.", icon: "i-spark" }
  },

  products: [
    {
      id: "buque-afeto",
      name: "Buquê Afeto",
      category: "buques",
      short: "Rosas rosé, lisianthus e eucalipto em papel blush.",
      story: "Pensado para quem quer dizer muito com delicadeza: tons de pele, folhas prateadas e um laço terracota, a cor da casa.",
      composition: ["Rosas em tons rosé", "Lisianthus branco", "Ramos de eucalipto", "Papel de seda blush e laço"],
      sentiments: ["apaixonar", "carinho"],
      occasions: ["romance", "aniversario", "datas"],
      image: "buque-afeto", tone: "#EDDCD4",
      price: null, size: null, featured: true, demo: true
    },
    {
      id: "kokedama-jiboia",
      name: "Kokedama Jiboia",
      category: "kokedamas",
      short: "Jiboia em bola de musgo amarrada à mão, sobre prato de cerâmica.",
      story: "Um presente que continua crescendo. A jiboia é tolerante e se adapta bem a ambientes internos com luz indireta.",
      composition: ["Jiboia (Epipremnum)", "Substrato envolto em musgo", "Amarração em barbante natural", "Prato de apoio"],
      sentiments: ["carinho", "acolher"],
      occasions: ["sem-motivo", "agradecimento"],
      image: "kokedama-jiboia", tone: "#E1E1D4",
      price: null, size: null, featured: true, demo: true
    },
    {
      id: "box-jardim",
      name: "Box Jardim",
      category: "arranjos",
      short: "Caixa redonda com rosas, lisianthus e eucalipto, pronta para entregar.",
      story: "Para quando a surpresa precisa chegar inteira: as flores vêm assentadas na caixa, sem precisar de vaso.",
      composition: ["Rosas em tons claros e rosé", "Lisianthus", "Eucalipto", "Caixa redonda com fita"],
      sentiments: ["surpreender", "celebrar"],
      occasions: ["aniversario", "datas", "romance"],
      image: "box-jardim", tone: "#EEDFD8",
      price: null, size: null, featured: true, demo: true
    },
    {
      id: "orquidea-phalaenopsis",
      name: "Orquídea em cachepô",
      category: "plantas",
      short: "Phalaenopsis branca em cachepô de cerâmica.",
      story: "Elegante e duradoura, a orquídea é um agradecimento que fica muito tempo à vista de quem recebe.",
      composition: ["Orquídea Phalaenopsis", "Cachepô de cerâmica", "Acabamento com musgo"],
      sentiments: ["agradecer", "acolher", "celebrar"],
      occasions: ["agradecimento", "nascimento", "datas"],
      image: "orquidea", tone: "#E6DDDE",
      price: null, size: null, featured: true, demo: true
    },
    {
      id: "buque-gratidao",
      name: "Buquê Gratidão",
      category: "buques",
      short: "Margaridas, mosquitinho e flores do campo em papel claro.",
      story: "Leve e espontâneo, como um obrigado dito olhando nos olhos.",
      composition: ["Margaridas", "Mosquitinho", "Flores do campo em tons lilás", "Papel claro com fita verde"],
      sentiments: ["agradecer", "carinho"],
      occasions: ["agradecimento", "sem-motivo", "nascimento"],
      image: "buque-gratidao", tone: "#E6DFD0",
      price: null, size: null, featured: true, demo: true
    },
    {
      id: "buque-paixao",
      name: "Buquê Paixão",
      category: "buques",
      short: "Rosas vermelhas com folhagens e mosquitinho em papel kraft.",
      story: "O clássico que não precisa de explicação. Vermelho intenso, folhas verdes e um laço que fecha a declaração.",
      composition: ["Rosas vermelhas", "Folhagens", "Mosquitinho", "Papel kraft e laço"],
      sentiments: ["apaixonar", "surpreender"],
      occasions: ["romance", "datas"],
      image: "buque-paixao", tone: "#E8DDCD",
      price: null, size: null, featured: false, demo: true
    },
    {
      id: "buque-sol",
      name: "Buquê Sol",
      category: "buques",
      short: "Girassóis e folhagens em papel kraft.",
      story: "Para levar luz a quem está comemorando, ou a quem precisa de um dia mais bonito.",
      composition: ["Girassóis", "Folhagens verdes", "Papel kraft e cordão"],
      sentiments: ["celebrar", "surpreender", "agradecer"],
      occasions: ["aniversario", "agradecimento", "sem-motivo"],
      image: "buque-sol", tone: "#EADEC9",
      price: null, size: null, featured: false, demo: true
    },
    {
      id: "arranjo-delicadeza",
      name: "Arranjo Delicadeza",
      category: "arranjos",
      short: "Vaso de vidro com flores em branco e blush.",
      story: "Tons suaves que acolhem. Chega pronto para ficar sobre a mesa, sem precisar de nada além de água fresca.",
      composition: ["Rosas brancas e rosé", "Flores em tons blush", "Mosquitinho", "Vaso de vidro"],
      sentiments: ["acolher", "carinho"],
      occasions: ["nascimento", "agradecimento", "datas"],
      image: "arranjo-delicadeza", tone: "#E9DFD5",
      price: null, size: null, featured: false, demo: true
    },
    {
      id: "kokedama-lirio",
      name: "Kokedama Lírio-da-paz",
      category: "kokedamas",
      short: "Lírio-da-paz em bola de musgo, com flores brancas.",
      story: "Folhas verde-escuras e flores brancas: uma presença tranquila para casa ou para o trabalho.",
      composition: ["Lírio-da-paz (Spathiphyllum)", "Substrato envolto em musgo", "Amarração em barbante", "Prato de apoio"],
      sentiments: ["acolher", "agradecer"],
      occasions: ["agradecimento", "sem-motivo"],
      image: "kokedama-lirio", tone: "#E3DED4",
      price: null, size: null, featured: false, demo: true
    },
    {
      id: "kokedama-samambaia",
      name: "Kokedama Samambaia",
      category: "kokedamas",
      short: "Samambaia em kokedama para pendurar.",
      story: "Feita para ficar suspensa: as folhas caem em cascata e trazem verde para qualquer canto.",
      composition: ["Samambaia", "Substrato envolto em musgo", "Cordão para pendurar"],
      sentiments: ["carinho", "surpreender"],
      occasions: ["sem-motivo", "aniversario"],
      image: "kokedama-samambaia", tone: "#DDE0D6",
      price: null, size: null, featured: false, demo: true
    },
    {
      id: "jardim-suculentas",
      name: "Jardim de suculentas",
      category: "plantas",
      short: "Suculentas variadas em cachepô baixo de cerâmica.",
      story: "Um pequeno jardim que pede pouca água e combina com mesa de trabalho, estante ou janela.",
      composition: ["Suculentas variadas", "Cachepô de cerâmica", "Substrato e pedriscos"],
      sentiments: ["carinho", "surpreender"],
      occasions: ["sem-motivo", "aniversario", "agradecimento"],
      image: "suculentas", tone: "#E7DED2",
      price: null, size: null, featured: false, demo: true
    },
    {
      id: "rosas-avulsas",
      name: "Rosas por haste",
      category: "buques",
      short: "Escolha as cores e a quantidade de rosas, com cartão.",
      story: "Às vezes uma flor basta. Você escolhe as cores e quantas hastes; nós embrulhamos com cuidado.",
      composition: ["Rosas nas cores que você escolher", "Embalagem em papel kraft", "Cartão para mensagem"],
      sentiments: ["apaixonar", "carinho", "surpreender"],
      occasions: ["sem-motivo", "romance"],
      image: "rosas-avulsas", tone: "#ECDED9",
      price: null, size: null, featured: false, demo: true
    }
  ]
};
