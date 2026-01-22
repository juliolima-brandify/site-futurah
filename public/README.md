# Pasta Public - Arquivos Estáticos

Esta pasta contém todos os arquivos estáticos que serão servidos publicamente.

## Estrutura de Pastas

```
public/
├── images/           # Imagens do site
│   ├── hero/        # Imagens da seção Hero
│   ├── logos/       # Logos de parceiros/clientes
│   ├── team/        # Fotos da equipe
│   └── courses/     # Imagens dos cursos
├── fonts/           # Fontes customizadas (Neue Hass Grot)
└── icons/           # Ícones e favicons
```

## Como Usar Imagens

### 1. Adicione suas imagens nas pastas apropriadas

Exemplo:
- `public/images/hero/star-3d.png` → Imagem da estrela 3D do Hero
- `public/images/logos/company-logo.png` → Logo de empresa parceira

### 2. Use o componente Image do Next.js

```tsx
import Image from 'next/image';

// Imagem estática
<Image
  src="/images/hero/star-3d.png"
  alt="Estrela 3D"
  width={500}
  height={500}
  priority // Para imagens above-the-fold
/>
```

### 3. Ou use img normal para imagens simples

```tsx
<img src="/images/logos/company.png" alt="Company" />
```

## Otimizações Automáticas

O Next.js otimiza automaticamente as imagens quando você usa o componente `Image`:
- ✅ Lazy loading automático
- ✅ Conversão para formatos modernos (WebP, AVIF)
- ✅ Responsive images
- ✅ Placeholder blur
- ✅ Prevenção de layout shift

## Formatos Recomendados

- **Fotos**: JPG/JPEG, WebP
- **Ilustrações**: PNG, SVG
- **Ícones**: SVG (preferencial)
- **Animações**: GIF, WebP animado

## Tamanhos Recomendados

- Hero images: 1920x1080px ou maior
- Thumbnails: 400x300px
- Logos: 200x200px (ou proporcional)
- Avatares: 150x150px
