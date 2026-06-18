#!/usr/bin/env python3
"""
Baixa um Reel, post de video ou Stories do Instagram em arquivo local.

Uso:
  python baixar.py <url-do-reel>
  python baixar.py <url-do-post>
  python baixar.py <url-de-stories>
  python baixar.py <usuario>          # todos os stories ativos do perfil

Reels e posts publicos funcionam sem login.
Stories e perfis privados exigem um cookies.txt (login) nesta pasta.
"""

import subprocess
import sys
from pathlib import Path

# Corrige encoding do terminal no Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
DOWNLOADS = BASE / "downloads"
COOKIES = BASE / "cookies.txt"


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    alvo = sys.argv[1].strip()

    # Username puro (sem http) -> stories ativos do perfil
    if not alvo.startswith("http"):
        alvo = f"https://www.instagram.com/stories/{alvo.lstrip('@')}/"

    DOWNLOADS.mkdir(exist_ok=True)

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "bv*+ba/b",                 # melhor video + audio, com fallback
        "--merge-output-format", "mp4",
        "-o", str(DOWNLOADS / "%(uploader_id)s_%(id)s.%(ext)s"),
        "--no-warnings",
        "--newline",
    ]

    if COOKIES.exists():
        cmd += ["--cookies", str(COOKIES)]
        print(f"  Login:   usando {COOKIES.name}")
    else:
        print("  Login:   sem cookies.txt (Stories e perfis privados nao funcionam)")

    print(f"  Alvo:    {alvo}")
    print(f"  Destino: {DOWNLOADS}\n")

    result = subprocess.run(cmd + [alvo])

    if result.returncode == 0:
        print(f"\n  OK -> arquivos em {DOWNLOADS}")
    else:
        print(f"\n  Falhou (codigo {result.returncode}).")
        if not COOKIES.exists():
            print("  Se era um Story ou perfil privado, exporte o cookies.txt e tente de novo.")

    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
