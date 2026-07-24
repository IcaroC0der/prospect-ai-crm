# Guia de Estilos (Style Guide): IPR Tech

Este documento centraliza as diretrizes visuais e de design da **IPR Tech**, focado em manter um padrão estético de "Luxo Discreto" (Manhattan Consulting Vibe). Deve ser utilizado para balizar o desenvolvimento de novas páginas, criativos de marketing e materiais da agência.

---

## 1. Paleta de Cores

A paleta é estritamente neutra, baseada no alto contraste entre a escuridão absoluta e uma cor de fundo quente e sofisticada. 

* **Cores Principais:**
  * **Brand Black (`#000000`):** Usado para fundos no Dark Mode, textos primários no Light Mode e botões de ação.
  * **Brand Creme (`#F5F1E8`):** Usado para fundos no Light Mode e textos primários no Dark Mode. Traz a sensação de papel premium e editorial.
  * **Brand White (`#FFFFFF`):** Branco puro, usado para criar contraste extremo em detalhes, cartões ou fundos isolados.

* **Tons de Cinza (Apoio e Hierarquia):**
  * **Gray Light (`#E9E9E9`):** Bordas sutis, linhas divisórias finas.
  * **Gray Medium (`#BDBDBD`):** Textos secundários ou de apoio (Dark Mode).
  * **Gray Dark (`#707070` a `#222222`):** Textos secundários (Light Mode) e hovers.

---

## 2. Tipografia

O projeto utiliza a fonte **Inter** (sans-serif) para garantir máxima legibilidade em interfaces digitais, aliada a um uso agressivo de peso e espaçamento para gerar impacto.

* **Headlines (Títulos Principais - H1, H2):**
  * Peso: `Black (900)` ou `Bold (700)`
  * Tracking (Espaçamento de letras): Negativo (`tracking-tighter`)
  * Case: Uppercase (Maiúsculas) preferencialmente
  * Exemplo: `text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase`

* **Subtítulos e Apoio (Overlines):**
  * Peso: `Semibold (600)` ou `Bold (700)`
  * Tracking: Muito afastado (`tracking-widest`)
  * Case: Uppercase
  * Cor: Normalmente tons de cinza ou contraste reverso.

* **Corpo de Texto (Body):**
  * Peso: `Medium (500)` ou `Regular (400)`
  * Line-height: Relaxado (`leading-relaxed`)
  * Tamanho: `text-lg` ou `text-sm` (dependendo do bloco de leitura).

---

## 3. Componentes e Interações

* **Botões (CTAs):**
  * Design "Bloco": Sem bordas arredondadas (Sharp edges).
  * Fundo sólido de alto contraste (Preto no modo claro, Branco no modo escuro).
  * Tipografia: `text-sm font-bold tracking-widest uppercase`.
  * Padding: Farto (ex: `px-12 py-5`).
  * Hover: Transição de cor suave para cinza escuro.

* **Bordas e Linhas:**
  * Uso intenso de linhas de 1px (`border-brand-gray-light` ou `border-[#222]`) para criar grids arquitetônicos e separar blocos de informação de forma elegante, sem sobrecarregar a tela.

* **Espaço Negativo (Whitespace):**
  * O design depende radicalmente do espaço vazio. Nunca esprema elementos.
  * Padding padrão de seção: `py-24 px-6 md:px-12 lg:px-24`.

---

## 4. Direção de Fotografia

* **Estética Obrigatória:** Fotografia preto e branco (B&W) de alta qualidade.
* **Temas:** Arquitetura moderna de Nova York (linhas retas, concreto, vidro, arranha-céus) ou ambientes de trabalho minimalistas e escuros (mesas premium, setups de design).
* **Ausência de Elementos Humanos:** Evitar rostos e pessoas sorrindo para não quebrar a aura institucional de software de precisão e autoridade fria.

---

## 5. Tom de Voz (Copywriting)

A comunicação da IPR Tech não tenta agradar ou ser descolada. Ela é:
* **Autoritária:** Fala como um parceiro executivo.
* **Minimalista:** Frases curtas, diretas, terminadas em ponto final.
* **Premium:** Uso de vocabulário corporativo de alto nível (ex: "Arquitetura escalável", "Luxo discreto", "Ativos digitais robustos").
* **Exemplo de Copy:** *"Não entregamos apenas sites; desenvolvemos ativos digitais robustos, criados para marcas que não aceitam o medíocre. Foco rigoroso. Resultados inquestionáveis."*
