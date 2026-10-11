# Floricultura Afeto — site

*Acreditamos que flores carregam sentimentos.*

Site estático (HTML, CSS e JavaScript puros), pronto para o GitHub Pages. Sem framework, sem backend, sem banco de dados. Os pedidos e o formulário de personalização montam a mensagem e abrem o WhatsApp oficial da loja.

---

## 1. Estrutura

```
floricultura-afeto/
├── index.html              Início (hero com vídeo, sentimentos, destaques, manifesto, ocasiões…)
├── arranjos/index.html     Catálogo com filtros (tipo, sentimento, ocasião) + guia de kokedama
├── sobre/index.html        A Afeto, o que vende, jeito de atender, localização e mapa
├── contato/index.html      Canais + formulário "Personalize seu presente" + mapa
├── 404.html                Página não encontrada
├── favicon.svg · robots.txt · sitemap.xml · .nojekyll
└── assets/
    ├── css/   fonts · tokens · base · layout · components · pages
    ├── js/    config · catalog-data · main · catalog · order · contact
    ├── fonts/ Fraunces e DM Sans (hospedadas no site, licença OFL)
    └── img/
        ├── hero/       afeto-hero.webm / .mp4 / poster.jpg (gerados a partir do GIF enviado)
        ├── editorial/  quadros do vídeo usados no manifesto, "Sobre" e redes
        ├── products/   12 ilustrações SVG originais (exemplos de catálogo)
        └── brand/      logo provisório, ícone Apple, imagem de compartilhamento (og-image)
```

"Ocasiões" e "Personalize" foram consolidadas: ocasiões é uma seção da home que filtra o catálogo; personalização vive na home (atalho para o WhatsApp) e no contato (formulário completo). Assim não há páginas vazias.

---

## 2. Configuração (um único arquivo)

Tudo que é dado comercial fica em **`assets/js/config.js`**:

| Campo | Situação |
|---|---|
| `business.whatsapp` | `553125233981` — (31) 2523-3981, informado como WhatsApp |
| `business.address` | Av. Augusto de Lima, 744, Loja E9-231, Mercado Central, Centro, BH – MG, 30190-006 |
| `business.social.tiktok` | `@floricultura.afeto` |
| `business.hours` | **pendente** (`null` = some do site) |
| `business.social.instagram` | **pendente** (`null` = botões somem) |
| `business.email`, `business.cnpj` | **pendentes** (aparecem no rodapé quando preenchidos) |
| `messages.*` | Mensagens iniciais do WhatsApp (geral, por produto, personalização, visita) |
| `catalog.showDemoNotice` | `true` enquanto as imagens forem ilustrativas |
| `siteUrl` | Endereço final do site |

O JavaScript aplica esses dados em todas as páginas (`data-config`, `data-href`, `data-wa`). O HTML também traz endereço e telefone escritos para SEO e para quem navega sem JavaScript: se mudar o telefone ou endereço, faça também um "localizar e substituir" nos `.html`.

---

## 3. Catálogo

Arquivo **`assets/js/catalog-data.js`**. Cada item:

```js
{
  id: "buque-afeto",                 // usado nos links e no pedido
  name: "Buquê Afeto",
  category: "buques",                // buques | arranjos | plantas | kokedamas
  short: "…",                        // linha do cartão
  story: "…",                        // texto do detalhe ("a história do arranjo")
  composition: ["…"],                // composição de referência
  sentiments: ["apaixonar", "carinho"],
  occasions: ["romance", "aniversario"],
  image: "buque-afeto",              // assets/img/products/buque-afeto.svg (ou "foto.jpg")
  price: null,                       // ex.: "A partir de R$ 120" quando a loja definir
  size: null,                        // ex.: "Aprox. 40 cm"
  featured: true,                    // até 5 aparecem na home
  demo: true                         // mostra o selo "Ilustração"
}
```

**Trocando ilustrações por fotos reais:** salve a foto em `assets/img/products/` (JPG ou WebP, 800×1000 px, proporção 4:5), informe o nome com extensão em `image` (ex.: `image: "buque-afeto.jpg"`) e marque `demo: false`. Sem extensão, o site procura o `.svg`. Quando nenhum item for demonstrativo, mude `showDemoNotice` para `false`.

Os 12 itens atuais são **exemplos ilustrativos** (buquês, arranjos, orquídea, suculentas e três kokedamas). Não representam estoque, preço ou disponibilidade.

---

## 4. Como o pedido funciona

1. O visitante clica em **Adicionar ao pedido** (o item vai para a sacola, salva no navegador).
2. Abre **Pedido** no cabeçalho, ajusta quantidades, informa nome, retirada ou entrega, data, cartão e observações.
3. **Enviar pedido pelo WhatsApp** abre a conversa com a mensagem pronta. O site informa que a mensagem precisa ser enviada por lá — nada é simulado como "enviado".

Cada produto também tem **Perguntar no WhatsApp**, com o nome do arranjo na mensagem. O botão verde flutuante abre a conversa geral.

---

## 5. Formulário de contato

O formulário de **Personalize seu presente** (página Contato) valida os campos e monta a mensagem no WhatsApp. Não há envio por e-mail porque o site é estático. Para receber também por e-mail:

- **Formspree** ou **Getform**: troque o `submit` em `assets/js/contact.js` por um `fetch` para o endpoint do serviço (plano gratuito atende baixo volume).
- **Google Forms**: crie o formulário e aponte o `action` para ele (perde-se a validação personalizada).
- Se o site migrar para **Netlify**, basta adicionar `data-netlify="true"` ao `<form>`.

Em qualquer caso, publique um aviso de privacidade (LGPD) antes de coletar dados por e-mail.

---

## 6. Publicar no GitHub Pages

1. Crie um repositório chamado **`floricultura-afeto`** (o site já está preparado para esse nome em `agustinhoxc.github.io/floricultura-afeto/`).
2. Envie o **conteúdo** desta pasta para a raiz do repositório (o `index.html` na raiz).
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
4. Aguarde 1–2 minutos e acesse o endereço.

**Se o repositório ou o usuário tiver outro nome**, atualize o endereço em: `config.js` (`siteUrl`), `<link rel="canonical">` e `og:` de cada `.html`, `sitemap.xml`, `robots.txt` e os caminhos `/floricultura-afeto/` do `404.html`. Com domínio próprio (ex.: `floriculturaafeto.com.br`), crie o arquivo `CNAME` e use `/` nesses caminhos.

Para testar no computador: `python3 -m http.server` na pasta-mãe e abra `http://localhost:8000/floricultura-afeto/`. Abrir o `index.html` direto (duplo clique) também funciona, exceto o 404.

---

## 7. O que a cliente ainda precisa fornecer

- [ ] **Fotos reais** dos arranjos, buquês, plantas e kokedamas (prioridade máxima)
- [ ] Catálogo real: nomes, composições, tamanhos e **preços** (ou faixa "a partir de")
- [ ] **Horário de funcionamento** da loja
- [ ] Perfil do **Instagram** (se houver)
- [ ] **Entrega**: se faz, regiões, taxa e prazos (hoje o site diz "consulte")
- [ ] **Logo oficial** em SVG ou PNG transparente (o atual é uma releitura provisória)
- [ ] **CNPJ** e razão social para o rodapé; e-mail comercial
- [ ] Aprovação dos textos-base (manifesto, "Sobre", "Nosso jeito de atender")
- [ ] Confirmar se o (31) 2523-3981 é o número do WhatsApp Business que deve receber os pedidos
- [ ] Vídeo/foto real da loja para o hero (ver "Problemas conhecidos")

---

## 8. Checklist testado

Revisado em navegador (Chromium) nas larguras 320, 375, 390, 414, 768, 1024, 1280, 1440 e 1920 px:

- [x] Sem rolagem horizontal em nenhuma página/largura
- [x] Console sem erros em todas as páginas
- [x] Menu mobile abre, fecha com `Esc`, trava a rolagem do fundo
- [x] Hero: vídeo em loop (WebM com MP4 de reserva), botão pausar/reproduzir, pausa fora da tela, respeita "reduzir movimento"
- [x] "Explore por sentimento": prévia muda ao passar o mouse/foco; leva ao catálogo filtrado
- [x] Ocasiões levam ao catálogo filtrado
- [x] Filtros do catálogo (tipo, sentimento, ocasião), contagem, estado vazio, "limpar filtros", URL compartilhável (`?categoria=kokedamas&sentimento=acolher`)
- [x] Detalhe do produto (diálogo acessível, fecha com `Esc`/clique fora)
- [x] Adicionar ao pedido, quantidades, remover, persistência entre páginas, contador no cabeçalho
- [x] Envio do pedido: validação de nome e endereço (quando entrega) e mensagem completa no WhatsApp
- [x] Formulário de personalização: validação, foco no primeiro erro, ocasião pré-selecionada via URL, mensagem no WhatsApp
- [x] Campos sem dado (Instagram, horário, e-mail, CNPJ) ficam ocultos
- [x] Links de WhatsApp com mensagem por contexto; links externos em nova aba
- [x] Foco visível, link "pular para o conteúdo", textos alternativos, contraste AA nos botões (texto creme sobre terracota escuro, 5,3:1)

---

## 9. Problemas conhecidos e observações

- **Hero gerado por IA.** O GIF enviado tem nome "Gemini_Generated…": é uma cena criada por IA, não filmagem da loja. Foi mantido como pedido, mas não é apresentado como foto real. Recomendo substituir por um vídeo curto real (5–8 s, horizontal) assim que possível: basta trocar os arquivos em `assets/img/hero/` mantendo os nomes. Os quadros em `editorial/` vêm do mesmo vídeo.
- **Resolução do vídeo.** O original tem 640×360 px; foi suavizado (interpolado para 30 fps) e ampliado para 1120×630. Em telas muito grandes fica levemente macio. Um vídeo real em 1080p resolve.
- **Ilustrações** são originais, criadas para este projeto, e estão identificadas como "Ilustração" no site.
- **Mapa** é um embed do Google Maps (carrega só ao rolar até ele). Ele pode definir cookies do Google; considere mencionar isso no aviso de privacidade.
- **Sacola do pedido** usa o armazenamento local do navegador apenas para lembrar os itens; nada é enviado a servidores.
- **Datas no formulário** seguem o idioma do navegador do visitante (dd/mm/aaaa no Brasil).
- **404 personalizado** só funciona publicado (o GitHub Pages serve o `404.html`); no servidor local aparece a página padrão.

---

## 10. Créditos e licenças

- Fontes: **Fraunces** e **DM Sans**, SIL Open Font License 1.1 (arquivos em `assets/fonts/`).
- Ícones e ilustrações: SVG originais do projeto.
- Paleta: fornecida pela cliente (terracota, creme, rosa blush, madeira clara, verde folha, marrom café), com variações escuras apenas para garantir contraste.
