#!/usr/bin/env python3
"""
Transcreve em lote os reels listados em urls_<perfil>.txt, carregando o modelo
Whisper UMA vez so. Junta a transcricao com as metricas de meta_<perfil>.json e
salva em dados_<perfil>.json (pronto pra analise do dossie).

Uso:
  python transcrever_lote.py nutriniquee --modelo small
  python transcrever_lote.py perfil1 perfil2 --modelo base
"""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
COOKIES = BASE / "cookies.txt"


def download_audio(url: str, out_dir: Path) -> Path | None:
    before = set(out_dir.glob("*.mp3"))
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-x", "--audio-format", "mp3", "--audio-quality", "5",
        "-o", str(out_dir / "%(id)s.%(ext)s"),
        "--no-warnings", "--quiet",
    ]
    if COOKIES.exists():
        cmd += ["--cookies", str(COOKIES)]
    cmd.append(url)
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        print(f"    [download erro] {(res.stderr or '')[:160]}")
        return None
    new = set(out_dir.glob("*.mp3")) - before
    return next(iter(new)) if new else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("usernames", nargs="+")
    ap.add_argument("--modelo", default="small", choices=["tiny", "base", "small", "medium"])
    args = ap.parse_args()

    import whisper
    print(f"Carregando modelo Whisper '{args.modelo}'...")
    model = whisper.load_model(args.modelo)
    print("Modelo carregado.\n")

    for username in args.usernames:
        username = username.lstrip("@")
        urls_file = BASE / f"urls_{username}.txt"
        meta_file = BASE / f"meta_{username}.json"
        if not urls_file.exists():
            print(f"[pular] {urls_file.name} nao existe")
            continue

        meta = {}
        perfil = {}
        if meta_file.exists():
            mj = json.loads(meta_file.read_text(encoding="utf-8"))
            perfil = mj.get("perfil", {})
            for r in mj.get("reels", []):
                meta[r["code"]] = r

        urls = [u.strip() for u in urls_file.read_text(encoding="utf-8").splitlines() if u.strip()]
        print(f"=== @{username}: {len(urls)} reels ===")
        resultados = []

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            for i, url in enumerate(urls, 1):
                code = url.rstrip("/").split("/")[-1]
                print(f"  [{i}/{len(urls)}] {code}", end=" ", flush=True)
                audio = download_audio(url, tmp_path)
                if not audio:
                    print("dl-falhou")
                    continue
                try:
                    texto = model.transcribe(str(audio), language="pt")["text"].strip()
                except Exception as e:
                    print(f"transc-erro {e}")
                    audio.unlink(missing_ok=True)
                    continue
                audio.unlink(missing_ok=True)
                m = meta.get(code, {})
                resultados.append({
                    "code": code,
                    "url": url,
                    "plays": m.get("plays", 0),
                    "likes": m.get("likes", 0),
                    "comments": m.get("comments", 0),
                    "taken_at": m.get("taken_at"),
                    "caption": m.get("caption", ""),
                    "transcricao": texto,
                })
                print(f"OK ({len(texto)}c, {m.get('plays',0):,} plays)")

        out = BASE / f"dados_{username}.json"
        out.write_text(json.dumps({"perfil": perfil, "reels": resultados},
                                  ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  -> {out.name} ({len(resultados)} transcritos)\n")


if __name__ == "__main__":
    main()
