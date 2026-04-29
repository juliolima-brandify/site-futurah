#!/usr/bin/env python3
"""
Baixa áudio dos Reels e transcreve localmente com Whisper.
Não precisa de nenhuma chave de API.

Uso:
  python transcrever.py afonsomolina --limit 10
  python transcrever.py https://www.instagram.com/reel/XYZABC/
"""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

# Fix Windows terminal encoding
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# ---------------------------------------------------------------------------
# Download
# ---------------------------------------------------------------------------

def get_reels(username: str, limit: int) -> list[dict]:
    print(f"  Buscando {limit} Reels de @{username}...")
    url = f"https://www.instagram.com/{username}/reels/"
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--flat-playlist",
        "--dump-json",
        "--playlist-end", str(limit),
        "--no-warnings",
        url,
    ]
    cookies = Path("cookies.txt")
    if cookies.exists():
        cmd += ["--cookies", str(cookies)]

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    reels = []
    for line in result.stdout.strip().split("\n"):
        if line.strip():
            try:
                reels.append(json.loads(line))
            except json.JSONDecodeError:
                pass

    if not reels and result.stderr:
        print(f"  [aviso] {result.stderr[:300]}")
    return reels


def download_audio(url: str, output_dir: Path) -> Path | None:
    before = set(output_dir.glob("*.mp3"))
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-x", "--audio-format", "mp3", "--audio-quality", "0",
        "-o", str(output_dir / "%(id)s.%(ext)s"),
        "--no-warnings", "--quiet",
    ]
    cookies = Path("cookies.txt")
    if cookies.exists():
        cmd += ["--cookies", str(cookies)]
    cmd.append(url)

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        print(f"  [erro download] {result.stderr[:200]}")
        return None

    after = set(output_dir.glob("*.mp3"))
    new = after - before
    return next(iter(new)) if new else None


# ---------------------------------------------------------------------------
# Transcrição local (Whisper)
# ---------------------------------------------------------------------------

def transcrever(audio_path: Path, modelo: str = "small") -> str:
    try:
        import whisper
    except ImportError:
        print("\n  Whisper não instalado. Rode:\n  pip install openai-whisper\n")
        sys.exit(1)

    model = whisper.load_model(modelo)
    result = model.transcribe(str(audio_path), language="pt")
    return result["text"].strip()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Baixa e transcreve Reels sem API")
    parser.add_argument("alvo", nargs="?", help="Username do Instagram ou URL de um Reel")
    parser.add_argument("--urls-file", help="Arquivo .txt com uma URL por linha")
    parser.add_argument("--limit", type=int, default=10, help="Qtd de Reels (padrão: 10)")
    parser.add_argument("--modelo", default="small", choices=["tiny","base","small","medium"],
                        help="Modelo Whisper (padrão: small)")
    parser.add_argument("--output", default="transcricoes", help="Pasta de saída")
    args = parser.parse_args()

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Modo arquivo de URLs
    if args.urls_file:
        linhas = Path(args.urls_file).read_text(encoding="utf-8").strip().split("\n")
        urls = [{"url": u.strip(), "id": u.strip().split("/")[-2], "view_count": 0}
                for u in linhas if u.strip()]
    elif args.alvo and args.alvo.startswith("http"):
        urls = [{"url": args.alvo, "id": args.alvo.split("/")[-2], "view_count": 0}]
    elif args.alvo:
        username = args.alvo.lstrip("@")
        reels = get_reels(username, args.limit)
        if not reels:
            print("Nenhum Reel encontrado. Tente adicionar cookies.txt.")
            sys.exit(1)
        urls = [
            {
                "url": r.get("url") or f"https://www.instagram.com/reel/{r.get('id')}/",
                "id": r.get("id", f"reel_{i}"),
                "view_count": r.get("view_count") or r.get("like_count") or 0,
            }
            for i, r in enumerate(reels, 1)
        ]
    else:
        print("Informe um username, URL ou --urls-file.")
        sys.exit(1)

    print(f"\n  {len(urls)} Reels para processar\n")
    resultados = []

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)

        for i, reel in enumerate(urls, 1):
            print(f"[{i}/{len(urls)}] {reel['url']}")

            print("  ⤷ Baixando áudio...", end=" ", flush=True)
            audio = download_audio(reel["url"], tmp_path)
            if not audio:
                print("✗")
                continue
            print("✓")

            print(f"  ⤷ Transcrevendo (modelo={args.modelo})...", end=" ", flush=True)
            try:
                texto = transcrever(audio, args.modelo)
                print(f"✓  ({len(texto)} chars)")
            except Exception as e:
                print(f"✗ {e}")
                continue
            finally:
                audio.unlink(missing_ok=True)

            resultado = {
                "reel": i,
                "url": reel["url"],
                "views": reel["view_count"],
                "transcricao": texto,
            }
            resultados.append(resultado)

            # Salva transcrição individual em .txt
            txt_file = output_dir / f"reel_{i:02d}.txt"
            txt_file.write_text(
                f"URL: {reel['url']}\nViews: {reel['view_count']}\n\n{texto}\n",
                encoding="utf-8",
            )
            print(f"  ✓ Salvo: {txt_file}")

    # Salva tudo em um único JSON
    json_file = output_dir / "todos.json"
    json_file.write_text(json.dumps(resultados, ensure_ascii=False, indent=2), encoding="utf-8")

    # Gera arquivo de resumo para colar no chat
    resumo_file = output_dir / "para_analise.txt"
    linhas = [f"=== TRANSCRIÇÕES @{args.alvo.lstrip('@')} ===\n"]
    for r in resultados:
        linhas.append(f"--- Reel {r['reel']} | {r['views']:,} views ---")
        linhas.append(r["transcricao"])
        linhas.append("")
    resumo_file.write_text("\n".join(linhas), encoding="utf-8")

    print(f"\n{'='*50}")
    print(f"  ✅ {len(resultados)} transcrições salvas em: {output_dir}/")
    print(f"  📋 Cole o conteúdo de '{resumo_file}' no chat para análise")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
