# Futura and Co. - Site Institucional

Site institucional da Futura and Co., estúdio de marketing inteligente com foco em IA para profissionais criativos.

## 🚀 Tecnologias

- **Next.js 14+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones otimizados

## 🎨 Design System

### Cores

```
Títulos:       #1B1B1B
Fundo:         #E7E7E7
Texto Body:    #383838
Botões:        #1B1B1B (hover: #0B2FFF)
Destaque:      #DCFF69
```

### Tipografia

- **Fonte**: Neue Hass Grot (fallback: Inter)
- **Pesos**: 400 (Regular), 500 (Medium), 700 (Bold)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🏗️ Estrutura do Projeto

```
site-futurah/
├── app/
│   ├── layout.tsx          # Layout raiz com metadata
│   ├── page.tsx            # Página inicial
│   └── globals.css         # Estilos globais
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Header sticky com menu mobile
│   │   ├── Footer.tsx      # Footer com links e contato
│   │   └── Container.tsx   # Container wrapper
│   ├── sections/
│   │   └── Hero.tsx        # Seção Hero principal
│   └── ui/
│       ├── Button.tsx      # Botão reutilizável
│       └── Logo.tsx        # Logo da marca
├── lib/
│   └── fonts.ts            # Configuração de fontes
└── public/
    └── fonts/              # Fontes locais
```

## ⚡ Otimizações de Performance

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Implementações

- ✅ Next.js Image Optimization
- ✅ Font optimization com `next/font`
- ✅ Tailwind CSS purge automático
- ✅ Static Generation (SSG)
- ✅ Minificação automática
- ✅ Tree shaking
- ✅ Lazy loading de componentes
- ✅ Metadata SEO otimizado

## 📱 Responsividade

Breakpoints (Tailwind padrão):

- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

Mobile-first approach em todos os componentes.

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm start        # Servidor de produção
npm run lint     # Executar ESLint
```

## 🌟 Componentes Principais

### Header

- Logo com link para home
- Navegação desktop e mobile
- Menu hamburger responsivo
- Sticky com backdrop blur
- Botão CTA destacado

### Hero

- Slogan principal
- Badge com contador
- CTA com ícone animado
- Elemento visual SVG
- Layout responsivo

### Footer

- Logo e descrição
- Links organizados em colunas
- Informações de contato
- Redes sociais
- Copyright e links legais

## 📝 Próximos Passos

- [ ] Adicionar mais seções (Sobre, Cursos, Depoimentos)
- [ ] Integrar CMS para conteúdo dinâmico
- [ ] Adicionar animações com Framer Motion
- [ ] Implementar formulários de contato
- [ ] Configurar analytics
- [ ] Adicionar testes unitários

## 📄 Licença

© 2026 Futura and Co. Todos os direitos reservados.
