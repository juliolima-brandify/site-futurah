# 📦 Guia de Componentes - Futura and Co.

## Componentes de Layout

### Container

Wrapper responsivo com max-width e padding consistente.

```tsx
import Container from '@/components/layout/Container';

// Uso básico
<Container>
  <h1>Conteúdo aqui</h1>
</Container>

// Com classe customizada
<Container className="py-12 bg-white">
  <p>Conteúdo com estilos extras</p>
</Container>

// Como elemento semântico diferente
<Container as="section">
  <h2>Seção</h2>
</Container>
```

**Props:**
- `children`: ReactNode (obrigatório)
- `className`: string (opcional)
- `as`: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer' (default: 'div')

---

### Header

Navegação principal com menu mobile e sticky behavior.

```tsx
import Header from '@/components/layout/Header';

// Uso (já incluído no layout)
<Header />
```

**Características:**
- Sticky no scroll com backdrop blur
- Menu hamburger em mobile
- Navegação: SOBRE, CONTEÚDOS, CONTATO, PARA EMPRESAS
- Botão "Ver Cursos" destacado com cor highlight
- Animações suaves de abertura/fechamento do menu
- Bloqueia scroll do body quando menu aberto

---

### Footer

Rodapé completo com links, contato e redes sociais.

```tsx
import Footer from '@/components/layout/Footer';

// Uso (já incluído no layout)
<Footer />
```

**Características:**
- Fundo escuro (#1B1B1B)
- 4 colunas de links
- Informações de contato (email, telefone, localização)
- Links de redes sociais
- Copyright dinâmico
- Links legais (privacidade, termos)

---

## Componentes de Seção

### Hero

Seção principal da homepage com slogan e CTA.

```tsx
import Hero from '@/components/sections/Hero';

<Hero />
```

**Características:**
- Título principal editável
- Slogan destacado em azul
- Badge com contador
- CTA "Comece sua jornada agora" com ícone
- Elemento visual SVG animado
- Layout responsivo (2 colunas → 1 coluna em mobile)
- Elementos decorativos com animações

**Customização:**
Para editar o conteúdo, abra `components/sections/Hero.tsx` e modifique:
- Linha 18: Badge text
- Linhas 22-24: Título principal
- Linhas 25-27: Slogan
- Linhas 31-36: Descrição
- Linha 41: Texto do CTA

---

## Componentes de UI

### Button

Botão reutilizável com 3 variantes e suporte para ícone.

```tsx
import Button from '@/components/ui/Button';

// Variante Primary (padrão)
<Button variant="primary">
  Clique Aqui
</Button>

// Variante Secondary (highlight)
<Button variant="secondary">
  Ver Cursos
</Button>

// Variante Outline
<Button variant="outline">
  Saiba Mais
</Button>

// Com ícone de seta
<Button variant="primary" showIcon>
  Comece Agora
</Button>

// Com classe customizada
<Button className="w-full" onClick={() => console.log('clicou')}>
  Botão Full Width
</Button>
```

**Props:**
- `children`: ReactNode (obrigatório)
- `variant`: 'primary' | 'secondary' | 'outline' (default: 'primary')
- `showIcon`: boolean (default: false) - mostra ícone de seta
- `className`: string (opcional)
- Todos os props de HTMLButtonElement

**Variantes:**
- **primary**: Fundo preto (#1B1B1B) → hover azul (#0B2FFF)
- **secondary**: Fundo verde limão (#DCFF69) → hover preto
- **outline**: Borda preta → hover fundo preto

---

### Logo

Logo da marca com link para home.

```tsx
import Logo from '@/components/ui/Logo';

// Logo padrão (escuro)
<Logo />

// Logo claro (para fundos escuros)
<Logo variant="light" />

// Com classe customizada
<Logo className="mb-4" />
```

**Props:**
- `className`: string (opcional)
- `variant`: 'light' | 'dark' (default: 'dark')

**Características:**
- Link para home page (/)
- Hover com transição de cor
- "Futura and Co." como texto principal
- "Human Academy" como subtítulo

---

## Paleta de Cores (Tailwind)

Use estas classes para manter consistência:

```tsx
// Títulos
className="text-brand-title"  // #1B1B1B

// Fundo
className="bg-brand-background"  // #E7E7E7

// Texto corpo
className="text-brand-body"  // #383838

// Botões
className="bg-brand-button hover:bg-brand-button-hover"  // #1B1B1B → #0B2FFF

// Destaques
className="bg-brand-highlight"  // #DCFF69
```

---

## Exemplos de Uso

### Página Simples

```tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export default function Sobre() {
  return (
    <>
      <Header />
      <main className="py-24">
        <Container>
          <h1 className="text-5xl font-bold text-brand-title mb-6">
            Sobre Nós
          </h1>
          <p className="text-lg text-brand-body mb-8">
            Conteúdo da página...
          </p>
          <Button variant="secondary" showIcon>
            Fale Conosco
          </Button>
        </Container>
      </main>
      <Footer />
    </>
  );
}
```

### Card de Destaque

```tsx
<div className="bg-brand-highlight p-8 rounded-2xl">
  <h3 className="text-2xl font-bold text-brand-title mb-4">
    Curso em Destaque
  </h3>
  <p className="text-brand-body mb-6">
    Aprenda IA aplicada ao marketing.
  </p>
  <Button variant="primary">
    Inscreva-se
  </Button>
</div>
```

### Seção com Grid

```tsx
<Container className="py-16">
  <h2 className="text-4xl font-bold text-brand-title text-center mb-12">
    Nossos Cursos
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {cursos.map((curso) => (
      <div key={curso.id} className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-brand-title mb-3">
          {curso.titulo}
        </h3>
        <p className="text-brand-body mb-4">{curso.descricao}</p>
        <Button variant="outline">Ver Mais</Button>
      </div>
    ))}
  </div>
</Container>
```

---

## Dicas de Estilo

### Espaçamento Consistente

```tsx
// Seções grandes
className="py-24 lg:py-32"

// Seções médias
className="py-16 lg:py-20"

// Espaçamento interno
className="px-6 py-8"
```

### Tipografia

```tsx
// Título principal
className="text-5xl lg:text-7xl font-bold"

// Subtítulo
className="text-2xl lg:text-3xl font-semibold"

// Corpo de texto
className="text-base lg:text-lg"

// Texto pequeno
className="text-sm"
```

### Responsividade

```tsx
// Grid adaptativo
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Flex adaptativo
className="flex flex-col lg:flex-row"

// Ocultar em mobile
className="hidden lg:block"

// Mostrar apenas em mobile
className="lg:hidden"
```

---

## 🎨 Personalizações Futuras

Para adicionar novos componentes, mantenha a estrutura:

```
components/
├── layout/      ← Componentes de estrutura (Header, Footer, Sidebar, etc.)
├── sections/    ← Seções completas (Hero, About, Features, etc.)
└── ui/          ← Componentes reutilizáveis (Button, Card, Input, etc.)
```

**Boas práticas:**
- ✅ Use TypeScript para props
- ✅ Documente props complexas
- ✅ Mantenha componentes pequenos e focados
- ✅ Use classes do Tailwind, evite CSS customizado
- ✅ Pense em responsividade desde o início
- ✅ Adicione acessibilidade (aria-labels, focus states)
