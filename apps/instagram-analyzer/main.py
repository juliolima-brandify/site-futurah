#!/usr/bin/env python3
"""
Instagram Reel Analyzer
Baixa Reels, transcreve com Whisper e analisa padrões com Claude.

Uso:
  python main.py sidneibonfim --limit 10
  python main.py perfil1 perfil2 --limit 5 --output relatorios/
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

import anthropic
import openai
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
COOKIES_FILE = os.getenv("INSTAGRAM_COOKIES_FILE", "cookies.txt")


# ---------------------------------------------------------------------------
# Coleta
# ---------------------------------------------------------------------------

def get_reels_list(username: str, limit: int) -> list[dict]:
    """Obtém metadados dos Reels mais recentes de um perfil via yt-dlp."""
    url = f"https://www.instagram.com/{username}/reels/"
    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "--dump-json",
        "--playlist-end", str(limit),
        "--no-warnings",
    ]
    if Path(COOKIES_FILE).exists():
        cmd += ["--cookies", COOKIES_FILE]
    cmd.append(url)

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")

    reels = []
    for line in result.stdout.strip().split("\n"):
        if line.strip():
            try:
                reels.append(json.loads(line))
            except json.JSONDecodeError:
                pass

    if not reels and result.stderr:
        print(f"  [aviso yt-dlp] {result.stderr[:300]}")

    return reels


def download_audio(url: str, output_dir: Path) -> Path | None:
    """Baixa o áudio do Reel em MP3."""
    before = set(output_dir.glob("*.mp3"))

    cmd = [
        "yt-dlp",
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "0",
        "-o", str(output_dir / "%(id)s.%(ext)s"),
        "--no-warnings",
        "--quiet",
    ]
    if Path(COOKIES_FILE).exists():
        cmd += ["--cookies", COOKIES_FILE]
    cmd.append(url)

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        print(f"  [yt-dlp erro] {result.stderr[:200]}")
        return None

    after = set(output_dir.glob("*.mp3"))
    new_files = after - before
    return next(iter(new_files)) if new_files else None


# ---------------------------------------------------------------------------
# Transcrição
# ---------------------------------------------------------------------------

def transcribe(audio_path: Path) -> str:
    """Transcreve áudio com OpenAI Whisper."""
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    with open(audio_path, "rb") as f:
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            language="pt",
        )
    return result.text


# ---------------------------------------------------------------------------
# Análise individual
# ---------------------------------------------------------------------------

ANALYSIS_PROMPT = """Analise este roteiro de Reel do Instagram e extraia os padrões de conteúdo.

TRANSCRIÇÃO:
{transcript}

VIEWS/LIKES APROXIMADOS: {views}

Responda SOMENTE com JSON válido, sem texto fora do JSON, usando esta estrutura:
{{
  "gancho_tipo": "pergunta|choque|promessa|história|polêmica|curiosidade|outro",
  "gancho_texto": "primeiros 1-2 segundos — copie o texto exato",
  "estrutura": "problema-agitação-solução|educativo|storytelling|lista|prova-social|outro",
  "tom": "educativo|emocional|polêmico|inspirador|humorístico|espiritual",
  "tema_principal": "tema resumido em até 5 palavras",
  "palavras_chave": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"],
  "tem_cta": true,
  "cta_texto": "texto do CTA ou null",
  "score_viral": 7,
  "pontos_fortes": ["ponto 1", "ponto 2"],
  "pontos_fracos": ["ponto 1"],
  "resumo": "1 frase descrevendo o conteúdo do vídeo"
}}"""


def analyze_reel(transcript: str, views: int) -> dict:
    """Analisa padrões de gancho e estrutura com Claude."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": ANALYSIS_PROMPT.format(transcript=transcript, views=f"{views:,}")
        }],
    )

    text = message.content[0].text.strip()
    start = text.find("{")
    end = text.rfind("}") + 1
    return json.loads(text[start:end])


# ---------------------------------------------------------------------------
# Relatório consolidado
# ---------------------------------------------------------------------------

REPORT_PROMPT = """Com base na análise de {n} Reels do perfil @{username}, gere um relatório estratégico em Markdown.

DADOS:
{data}

Estrutura do relatório:

## 1. Resumo Executivo
Padrões dominantes em 5 bullet points diretos.

## 2. Tipos de Gancho
Quais aparecem mais. Exemplos reais da transcrição.

## 3. Estruturas Narrativas
As estruturas mais usadas e como funcionam neste perfil.

## 4. Tom e Posicionamento
Como o criador se posiciona. Que linguagem usa.

## 5. Temas e Palavras-Chave Recorrentes
Nuvem de temas. O que aparece sempre.

## 6. Top 3 Reels Mais Fortes
Score mais alto — o que os torna eficazes.

## 7. O Que Replicar
5 recomendações práticas e acionáveis para criar conteúdo similar.

Seja direto, específico e prático. Use exemplos reais dos dados."""


def generate_report(results: list[dict], username: str) -> str:
    """Gera relatório de padrões consolidados em Markdown."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Remove transcrições completas para não explodir o contexto
    slim = [{k: v for k, v in r.items() if k != "transcricao"} for r in results]

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        messages=[{
            "role": "user",
            "content": REPORT_PROMPT.format(
                n=len(results),
                username=username,
                data=json.dumps(slim, ensure_ascii=False, indent=2),
            )
        }],
    )
    return message.content[0].text


# ---------------------------------------------------------------------------
# Fluxo principal
# ---------------------------------------------------------------------------

def analyze_profile(username: str, limit: int, output_dir: Path) -> None:
    print(f"\n{'='*55}")
    print(f"  Perfil: @{username}")
    print(f"{'='*55}")

    print("  Buscando Reels...")
    reels = get_reels_list(username, limit)

    if not reels:
        print("  ✗ Nenhum Reel encontrado. Verifique o perfil ou o cookies.txt.")
        return

    print(f"  {len(reels)} Reels encontrados")
    results = []

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)

        for i, reel in enumerate(reels, 1):
            reel_id = reel.get("id", "")
            reel_url = reel.get("url") or f"https://www.instagram.com/reel/{reel_id}/"
            views = reel.get("view_count") or reel.get("like_count") or 0

            print(f"\n  [{i}/{len(reels)}] {reel_url}")
            print(f"  ⤷ Baixando áudio...", end=" ", flush=True)

            audio = download_audio(reel_url, tmp_path)
            if not audio:
                print("✗ falhou")
                continue
            print("✓")

            print(f"  ⤷ Transcrevendo...", end=" ", flush=True)
            try:
                transcript = transcribe(audio)
                print(f"✓  ({len(transcript)} chars)")
            except Exception as e:
                print(f"✗ {e}")
                continue
            finally:
                audio.unlink(missing_ok=True)

            print(f"  ⤷ Analisando...", end=" ", flush=True)
            try:
                analysis = analyze_reel(transcript, views)
                analysis["url"] = reel_url
                analysis["views"] = views
                analysis["transcricao"] = transcript
                results.append(analysis)
                print(f"✓  gancho={analysis['gancho_tipo']} score={analysis['score_viral']}/10")
            except Exception as e:
                print(f"✗ {e}")

    if not results:
        print("\n  ✗ Nenhum Reel processado com sucesso.")
        return

    # Salva dados brutos
    data_file = output_dir / f"{username}_dados.json"
    data_file.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    # Gera relatório consolidado
    print(f"\n  Gerando relatório estratégico...")
    report_md = generate_report(results, username)

    report_file = output_dir / f"{username}_relatorio.md"
    report_file.write_text(report_md, encoding="utf-8")

    print(f"\n  ✅ Relatório: {report_file}")
    print(f"  ✅ Dados:     {data_file}")


def check_dependencies() -> bool:
    """Verifica se yt-dlp está disponível."""
    result = subprocess.run(["yt-dlp", "--version"], capture_output=True)
    if result.returncode != 0:
        print("✗ yt-dlp não encontrado. Instale com: pip install yt-dlp")
        return False
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Analisa padrões de gancho em Reels do Instagram"
    )
    parser.add_argument(
        "usernames",
        nargs="+",
        help="Nomes de usuário do Instagram (sem @)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=10,
        help="Número de Reels por perfil (padrão: 10)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="relatorio",
        help="Pasta de saída (padrão: relatorio/)",
    )
    args = parser.parse_args()

    if not check_dependencies():
        sys.exit(1)

    if not ANTHROPIC_API_KEY:
        print("✗ ANTHROPIC_API_KEY não definida no .env")
        sys.exit(1)

    if not OPENAI_API_KEY:
        print("✗ OPENAI_API_KEY não definida no .env")
        sys.exit(1)

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    for username in args.usernames:
        analyze_profile(username.lstrip("@"), args.limit, output_dir)

    print(f"\n{'='*55}")
    print(f"  Análise completa! Resultados em: {output_dir}/")
    print(f"{'='*55}\n")


if __name__ == "__main__":
    main()
