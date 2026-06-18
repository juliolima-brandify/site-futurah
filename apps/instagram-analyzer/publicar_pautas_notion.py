#!/usr/bin/env python3
"""
Publica o Banco de Pautas no Notion (workspace Espaço de Futurah).
Cria: pagina do cliente -> database de pautas -> 1 linha por pauta.

Uso:
  python publicar_pautas_notion.py            # cria tudo do zero
  NOTION_PARENT=<page_id> python ...          # sob outra pagina

Le NOTION_TOKEN do .env.local (mesma pasta).
"""
import os, sys, json, urllib.request, urllib.error
from pathlib import Path

# ── carrega .env.local ───────────────────────────────────────────────────────
envf = Path(__file__).with_name(".env.local")
if envf.exists():
    for line in envf.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

TOKEN = os.environ.get("NOTION_TOKEN")
if not TOKEN:
    sys.exit("NOTION_TOKEN ausente no .env.local")

# pagina ja compartilhada com a integracao, usada como casa provisoria
PARENT_PAGE = os.environ.get("NOTION_PARENT", "d57e03d0-a2d5-83c1-8d19-81996786c975")
NV = "2022-06-28"
API = "https://api.notion.com/v1"


def call(method, path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(API + path, data=data, method=method)
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Notion-Version", NV)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Erro {e.code} em {method} {path}: {e.read().decode()}")


def rt(text):
    return [{"type": "text", "text": {"content": text[:1900]}}]


# ── 1) pagina do cliente ─────────────────────────────────────────────────────
cliente = call("POST", "/pages", {
    "parent": {"type": "page_id", "page_id": PARENT_PAGE},
    "icon": {"type": "emoji", "emoji": "👤"},
    "properties": {"title": {"title": rt("Augusto Felipe")}},
    "children": [
        {"object": "block", "type": "callout", "callout": {
            "rich_text": rt("Cliente — mentor de creators (viral, crescimento no Instagram e monetização de marca pessoal). Produtos: Construindo um Viral, mentoria Creator Elite, Augusto.IA."),
            "icon": {"type": "emoji", "emoji": "🎯"}}},
    ],
})
cliente_id = cliente["id"]
print("Pagina cliente:", cliente["url"])

# ── 2) database de pautas ────────────────────────────────────────────────────
def sel(*opts):
    return {"select": {"options": [{"name": o} for o in opts]}}

db = call("POST", "/databases", {
    "parent": {"type": "page_id", "page_id": cliente_id},
    "is_inline": True,
    "icon": {"type": "emoji", "emoji": "💡"},
    "title": rt("Banco de Pautas — Reels"),
    "properties": {
        "Ideia": {"title": {}},
        "Ângulo": sel("🔥 Em alta", "💊 Verdade difícil", "⚡ Dica prática", "📈 Google Trends"),
        "Gancho": {"rich_text": {}},
        "Por que agora": {"rich_text": {}},
        "Fonte": sel("Trend Instagram", "Dado/Insight", "Google Trends"),
        "Formato": sel("Reel", "Carrossel", "Story"),
        "Status": sel("💡 Ideia", "✅ Aprovada", "🎬 Roteirizada", "📤 Publicada"),
        "Gerada em": {"date": {}},
    },
})
db_id = db["id"]
print("Database:", db.get("url", db_id))

# ── 3) pautas ────────────────────────────────────────────────────────────────
GERADA = "2026-06-10"
A_ALTA, A_VERD, A_DICA, A_GT = "🔥 Em alta", "💊 Verdade difícil", "⚡ Dica prática", "📈 Google Trends"

PAUTAS = [
    (A_ALTA, "Trend Instagram", 'Pare de pedir like. Peça isto.', '"O like virou a métrica mais inútil do Instagram em 2026 — e eu provo."', "o algoritmo passou a pesar compartilhamento no DM 3 a 5× mais que like (100 likes valem menos que 10 envios no direct)."),
    (A_ALTA, "Trend Instagram", "O Instagram te deu o controle — e isso destruiu seu alcance", '"Tem um botão novo que o seu seguidor usou contra você sem perceber."', 'o recurso "Your Algorithm for Reels" (dez/2025) deixa o usuário escolher o que quer ver — postar muito e abusar de hashtag não força mais entrada no feed.'),
    (A_ALTA, "Trend Instagram", 'Entrar no formato "Será que o algoritmo prefere?"', '"Edição caprichada vs. câmera parada na cara: qual o Instagram entrega mais? Comenta seu palpite."', 'o formato "Seeing if the Algorithm Prefers" está 2 semanas no topo e ainda subindo — gera comentário (que é distribuição).'),
    (A_ALTA, "Trend Instagram", "Surfar o áudio do momento (Charli XCX / MJ)", 'abertura visual no "stuck frame" do "Rock Music" da Charli XCX, ou o trend "I Am Home" do "Beat It".', "são os áudios em ascensão esta semana — janela curta de surf."),
    (A_ALTA, "Trend Instagram", "Por que seu repost do TikTok não cresce no Reels", '"O Instagram sabe quando o vídeo não nasceu aqui — e te pune por isso."', "o maior boost de 2026 vai pra conteúdo nativo; reupload com marca d'água perde."),

    (A_VERD, "Dado/Insight", "Viralizar não paga suas contas", '"Mais da metade dos creators ganham menos de R$80 mil por ano. Views não é dinheiro."', "+50% dos creators faturam menos de US$15k/ano; só os com monetização estruturada escapam."),
    (A_VERD, "Dado/Insight", "Você está construindo sua renda no terreno do inimigo", '"Se 100% do seu dinheiro vem do Instagram, você não tem um negócio — tem um aluguel."', "68,8% da renda dos creators vem de brand deals, não do pagamento da plataforma."),
    (A_VERD, "Dado/Insight", "Postar todo dia parou de funcionar", '"Constância virou desculpa de quem não quer pensar em relevância."', 'com o "Your Algorithm", frequência não fura mais o feed — quem decide é o seguidor.'),
    (A_VERD, "Dado/Insight", "Seu Reel está clinicamente morto", '"100 likes e zero compartilhamento no DM? O algoritmo já te enterrou."', "confronta a métrica de vaidade — o que distribui hoje é o DM share."),
    (A_VERD, "Dado/Insight", "Você só faz Reel porque dá menos trabalho", '"O carrossel engaja 12% mais — e você o ignora por preguiça."', "Reels = +36% alcance, mas carrossel = +12% engajamento. Cutuca o acomodamento."),

    (A_DICA, "Dado/Insight", "O mix de formatos que você ajusta hoje", '"A receita exata: 60-70% Reels, 20-30% carrossel, 10% estático."', "proporção ótima de 2026 — acionável em 5 minutos no planner."),
    (A_DICA, "Dado/Insight", "A troca de CTA que dobra seu alcance", "\"Troque 'deixa o like' por 'manda pra alguém que precisa ver'.\"", "ataca o sinal que hoje pesa 3-5× (compartilhamento no direct)."),
    (A_DICA, "Dado/Insight", "Transforme seu Reel campeão em carrossel", '"Seu melhor Reel do mês tem 1 carrossel escondido dentro dele."', "reaproveita o que já validou + engajamento maior do carrossel. Zero esforço novo."),
    (A_DICA, "Dado/Insight", "O hook de 3 segundos que faz salvar", '"Os 3 primeiros segundos não são pra prender atenção — são pra fazer salvar."', "salvamento e share são os sinais que distribuem em 2026."),
    (A_DICA, "Dado/Insight", "Grave nativo em 1 take (sem app externo)", "\"Pare de exportar do CapCut com marca d'água. Grave dentro do Instagram.\"", "conteúdo nativo é premiado; executável no próximo vídeo."),

    (A_GT, "Google Trends", "O Neymar viralizou sem chutar uma bola", '"O assunto mais buscado do Brasil hoje não foi um gol — foi um corte de cabelo."', "o novo visual do Neymar pra Copa explodiu no Trends antes do jogo. Um detalhe visual vira conteúdo."),
    (A_GT, "Google Trends", "Como pegar carona na Copa mesmo fora do nicho de futebol", '"Daqui a 30 dias o feed inteiro vai ser Copa. Surfa isso sem falar de futebol."', "a Copa 2026 é o maior pico de busca do ano — masterclass de newsjacking."),
    (A_GT, "Google Trends", "A Copa vai engolir o feed — 3 jeitos de não sumir", '"Enquanto todo mundo posta jogo, tem 3 brechas de alcance abertas."', "megaeventos saturam o feed de um tema só — quem entende a brecha cresce na contramão."),
]

for ang, fonte, ideia, gancho, porque in PAUTAS:
    call("POST", "/pages", {
        "parent": {"type": "database_id", "database_id": db_id},
        "properties": {
            "Ideia": {"title": rt(ideia)},
            "Ângulo": {"select": {"name": ang}},
            "Gancho": {"rich_text": rt(gancho)},
            "Por que agora": {"rich_text": rt(porque)},
            "Fonte": {"select": {"name": fonte}},
            "Formato": {"select": {"name": "Reel"}},
            "Status": {"select": {"name": "💡 Ideia"}},
            "Gerada em": {"date": {"start": GERADA}},
        },
    })
    print("  + ", ideia)

print("\nOK — pagina do cliente:", cliente["url"])
