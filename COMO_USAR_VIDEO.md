# 🎥 Como Adicionar Vídeo no Hero

## 1️⃣ Onde Colocar o Vídeo

Coloque seu arquivo de vídeo em:

```
public/videos/hero-video.mp4     ← Formato MP4 (obrigatório)
public/videos/hero-video.webm    ← Formato WebM (opcional, melhor performance)
```

**Pasta criada**: ✅ `public/videos/`

---

## 2️⃣ Formatos Recomendados

### MP4 (Obrigatório)
- Codec: H.264
- Resolução: 1080x1080px ou 1920x1080px
- Taxa de bits: 2-5 Mbps
- Compatível com todos os navegadores

### WebM (Opcional - Melhor Performance)
- Codec: VP9
- Menor tamanho de arquivo
- Melhor qualidade/compressão
- Navegadores modernos

---

## 3️⃣ Otimizações Importantes

### Tamanho do Arquivo
- ⚠️ **Máximo recomendado**: 5-10 MB
- 🎯 **Ideal**: 2-5 MB
- Use ferramentas como HandBrake ou FFmpeg para comprimir

### Poster (Imagem de Preview)
Adicione uma imagem para mostrar antes do vídeo carregar:

```
public/images/hero/video-poster.jpg
```

### Exemplo de Compressão com FFmpeg

```bash
# Comprimir para MP4 otimizado
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k public/videos/hero-video.mp4

# Converter para WebM (opcional)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 public/videos/hero-video.webm
```

---

## 4️⃣ Código Já Implementado

O Hero já está configurado como **animação contínua** (sem controles)! Apenas coloque o arquivo em `public/videos/hero-video.mp4`

### Atributos do Vídeo - Animação Pura

```tsx
<video
  autoPlay                  // Inicia automaticamente
  loop                      // Repetir infinitamente
  muted                     // Sem som (necessário para autoplay)
  playsInline               // Reproduz inline no mobile (iOS)
  disablePictureInPicture   // Desabilita picture-in-picture
  disableRemotePlayback     // Desabilita Chromecast/AirPlay
  preload="auto"            // Carrega o vídeo completamente
  className="pointer-events-none"  // Remove cliques/interação
  poster="/images/hero/video-poster.jpg"
>
  <source src="/videos/hero-video.mp4" type="video/mp4" />
  <source src="/videos/hero-video.webm" type="video/webm" />
</video>
```

✅ **Configurado como animação de fundo** - Sem play/pause, sem controles, apenas loop infinito!

---

## 5️⃣ Customizações

### Ajustar Object-fit

```tsx
className="w-full h-full object-cover"    // Preenche todo o espaço
className="w-full h-full object-contain"  // Mantém proporções
```

### Efeitos Visuais

```tsx
// Com bordas arredondadas (já aplicado)
className="rounded-3xl"

// Com sombra
className="shadow-2xl"

// Com filtro de brilho/contraste
style={{ filter: 'brightness(1.1) contrast(1.05)' }}
```

---

## 6️⃣ Performance

### Lazy Loading (Carregar Depois)

Se o vídeo estiver abaixo da dobra:

```tsx
<video
  loading="lazy"
  preload="metadata"  // Carrega apenas metadata
  // ou
  preload="none"      // Não carrega até o usuário interagir
>
```

### Preload (Hero - Above the Fold)

Para o Hero, use preload completo:

```tsx
<video
  preload="auto"  // Carrega o vídeo completamente
>
```

---

## 📋 Checklist

- [ ] Converter vídeo para MP4 (H.264)
- [ ] Comprimir para 2-5 MB
- [ ] Colocar em `public/videos/hero-video.mp4`
- [ ] (Opcional) Converter para WebM
- [ ] (Opcional) Criar poster image
- [ ] Testar no mobile e desktop
- [ ] Verificar tempo de carregamento

---

## 🎬 Exemplo Completo

```tsx
// components/sections/Hero.tsx
<div className="relative w-full max-w-2xl aspect-video">
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="w-full h-full object-cover rounded-3xl shadow-2xl"
    poster="/images/hero/video-poster.jpg"
  >
    <source src="/videos/hero-video.mp4" type="video/mp4" />
    <source src="/videos/hero-video.webm" type="video/webm" />
    <p>Seu navegador não suporta vídeos.</p>
  </video>
</div>
```

---

## ⚡ Dicas de Performance

1. **Comprimir ao máximo** sem perder qualidade
2. **Usar WebM** além do MP4 (menor tamanho)
3. **Adicionar poster** para carregamento instantâneo
4. **Considerar lazy loading** se não for critical content
5. **Testar no mobile** - vídeos consomem dados

🎯 **Agora é só colocar seu vídeo em `public/videos/hero-video.mp4` e ele vai aparecer automaticamente!**
