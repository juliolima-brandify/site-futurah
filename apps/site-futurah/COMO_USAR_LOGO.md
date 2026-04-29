# 🎨 Como Adicionar o Logo do Site

## 1️⃣ Prepare seus arquivos de logo

Crie **duas versões** do logo:

```
public/images/logos/futura-logo.png         ← Versão escura (para fundo claro)
public/images/logos/futura-logo-white.png   ← Versão branca (para header escuro)
```

**Tamanhos recomendados:**
- Largura: 150-200px
- Altura: 40-60px
- Formato: PNG com fundo transparente (ou SVG)

---

## 2️⃣ Opção A: Logo como Imagem (Recomendado)

### Atualizar `components/ui/Logo.tsx`:

```tsx
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const logoSrc = variant === 'light' 
    ? '/images/logos/futura-logo-white.png' 
    : '/images/logos/futura-logo.png';
  
  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <Image
        src={logoSrc}
        alt="Futura and Co."
        width={180}
        height={50}
        priority
        className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-80"
      />
    </Link>
  );
}
```

---

## 3️⃣ Opção B: Logo com Imagem + Texto

```tsx
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const logoSrc = variant === 'light' 
    ? '/images/logos/futura-logo-white.png' 
    : '/images/logos/futura-logo.png';
  
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-title';
  
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <Image
        src={logoSrc}
        alt="Futura and Co."
        width={40}
        height={40}
        priority
        className="w-10 h-10 transition-opacity duration-300 group-hover:opacity-80"
      />
      <div className="flex flex-col">
        <span className={`text-xl font-bold tracking-tight ${textColor}`}>
          Futura and Co.
        </span>
        <span className={`text-xs font-medium tracking-wider ${variant === 'light' ? 'text-gray-300' : 'text-brand-body'} uppercase`}>
          Human Academy
        </span>
      </div>
    </Link>
  );
}
```

---

## 4️⃣ Para o Header (já está usando)

O Header usa o variant `light` automaticamente:

```tsx
// Isso já está no Header.tsx
<Link href="/" className="flex-shrink-0">
  <span className="text-white font-bold text-lg tracking-tight">
    /H Academy™
  </span>
</Link>
```

Se quiser trocar por logo:

```tsx
<Link href="/" className="flex-shrink-0">
  <Image
    src="/images/logos/futura-logo-white.png"
    alt="Futura and Co."
    width={150}
    height={40}
    priority
    className="h-8 w-auto"
  />
</Link>
```

---

## 5️⃣ Favicon (ícone da aba do navegador)

Adicione também:

```
public/favicon.ico                    ← 32x32px
public/icons/icon-192.png            ← 192x192px
public/icons/icon-512.png            ← 512x512px
public/icons/apple-touch-icon.png    ← 180x180px
```

### Atualizar `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  // ... outras configs
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};
```

---

## 📋 Checklist

- [ ] Criar logo versão escura (`futura-logo.png`)
- [ ] Criar logo versão branca (`futura-logo-white.png`)
- [ ] Colocar na pasta `public/images/logos/`
- [ ] Atualizar `components/ui/Logo.tsx`
- [ ] Atualizar Header se necessário
- [ ] Criar favicon.ico
- [ ] Criar icons para PWA
- [ ] Atualizar metadata no layout.tsx

---

## 🎯 Exemplo de Logo SVG

Se seu logo for SVG, é ainda melhor! Apenas use:

```tsx
<Image
  src="/images/logos/futura-logo.svg"
  alt="Futura and Co."
  width={180}
  height={50}
  priority
/>
```

SVG é vetorial e fica perfeito em qualquer tamanho! 🚀
