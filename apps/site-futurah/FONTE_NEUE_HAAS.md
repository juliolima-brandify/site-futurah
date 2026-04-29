# ✅ Fonte Neue Haas Grotesk Display Configurada

## 🎨 Arquivos de Fonte

Os seguintes arquivos TTF foram adicionados em `public/fonts/`:

```
✅ NeueHaasDisplayLight.ttf   (weight: 300)
✅ NeueHaasDisplayRoman.ttf   (weight: 400 - Regular)
✅ NeueHaasDisplayMediu.ttf   (weight: 500 - Medium)
✅ NeueHaasDisplayBold.ttf    (weight: 700 - Bold)
```

---

## 🔧 Configuração Implementada

### 1️⃣ app/globals.css

Adicionados `@font-face` para cada peso da fonte:

```css
@font-face {
  font-family: 'Neue Haas Grotesk Display';
  src: url('/fonts/NeueHaasDisplayRoman.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* ... outros pesos (300, 500, 700) ... */
```

### 2️⃣ tailwind.config.ts

Configurada como fonte padrão:

```typescript
fontFamily: {
  sans: ['Neue Haas Grotesk Display', 'system-ui', 'sans-serif'],
}
```

### 3️⃣ lib/fonts.ts

Removida a importação do Google Fonts (Inter) e configurado para usar a fonte local.

---

## 🎯 Pesos Disponíveis

Use as classes do Tailwind para diferentes pesos:

```tsx
<p className="font-light">      {/* 300 - Light */}
<p className="font-normal">     {/* 400 - Roman/Regular */}
<p className="font-medium">     {/* 500 - Medium */}
<p className="font-bold">       {/* 700 - Bold */}
```

---

## ✅ Aplicação Automática

A fonte está aplicada automaticamente em:

- ✅ Todo o site (via `body` no `globals.css`)
- ✅ Todos os componentes (via Tailwind `font-sans`)
- ✅ Hero título (font-medium = 500)
- ✅ Hero descrição (font-normal = 400)
- ✅ Header (font-light = 300)
- ✅ Footer textos (font-normal = 400)

---

## 🚀 Performance

- `font-display: swap` - Evita FOIT (Flash of Invisible Text)
- Fonte carregada localmente (sem requisições externas)
- Otimização automática pelo Next.js

---

## 🎨 Uso no Projeto

A fonte **Neue Haas Grotesk Display** agora é a fonte padrão do site!

**Você não precisa fazer nada**, ela já está ativa em todos os componentes. 🎉
