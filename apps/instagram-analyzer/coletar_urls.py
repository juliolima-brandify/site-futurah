#!/usr/bin/env python3
"""
Enumera os Reels mais recentes de perfis do Instagram usando a sessao logada
(cookies.txt no formato Netscape) via API web/mobile (/api/v1/feed/user) e
salva em urls_<perfil>.txt + meta_<perfil>.json.

yt-dlp e instaloader nao conseguem mais listar perfis com a API atual; este
coletor bate direto no endpoint de feed, que ainda devolve os posts.

Uso:
  python coletar_urls.py nutriniquee --limit 20
  python coletar_urls.py perfil1 perfil2 --limit 20
"""

import argparse
import json
import sys
import time
from http.cookiejar import MozillaCookieJar
from pathlib import Path

import requests

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
COOKIES = BASE / "cookies.txt"
APP_ID = "936619743392459"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36")


def build_session() -> requests.Session:
    cj = MozillaCookieJar(str(COOKIES))
    cj.load(ignore_discard=True, ignore_expires=True)
    s = requests.Session()
    s.cookies.update(cj)
    s.headers.update({
        "User-Agent": UA,
        "X-IG-App-ID": APP_ID,
        "Referer": "https://www.instagram.com/",
    })
    return s


def get_user_id(s: requests.Session, username: str) -> dict:
    r = s.get(
        "https://www.instagram.com/api/v1/users/web_profile_info/",
        params={"username": username},
        headers={"Referer": f"https://www.instagram.com/{username}/"},
        timeout=30,
    )
    r.raise_for_status()
    u = r.json()["data"]["user"]
    return {
        "id": u["id"],
        "full_name": u.get("full_name"),
        "followers": u["edge_followed_by"]["count"],
        "bio": (u.get("biography") or "")[:500],
        "posts": u["edge_owner_to_timeline_media"]["count"],
    }


def coletar(s: requests.Session, username: str, limit: int) -> tuple[dict, list[dict]]:
    username = username.lstrip("@")
    prof = get_user_id(s, username)
    uid = prof["id"]
    print(f"  @{username}: {prof['followers']:,} seguidores | {prof['posts']} posts | {prof['full_name']}")

    reels: list[dict] = []
    max_id = None
    pages = 0
    while len(reels) < limit and pages < 15:
        params = {"count": 12}
        if max_id:
            params["max_id"] = max_id
        r = s.get(f"https://www.instagram.com/api/v1/feed/user/{uid}/", params=params, timeout=30)
        if r.status_code != 200:
            print(f"  [aviso] feed status {r.status_code} (page {pages})")
            break
        d = r.json()
        for it in d.get("items", []):
            if it.get("media_type") != 2:  # 2 = video/reel
                continue
            cap = (it.get("caption") or {})
            reels.append({
                "url": f"https://www.instagram.com/reel/{it.get('code')}/",
                "code": it.get("code"),
                "plays": it.get("play_count") or it.get("ig_play_count") or it.get("view_count") or 0,
                "likes": it.get("like_count") or 0,
                "comments": it.get("comment_count") or 0,
                "taken_at": it.get("taken_at"),
                "caption": (cap.get("text") or "")[:600],
            })
            if len(reels) >= limit:
                break
        pages += 1
        if not d.get("more_available"):
            break
        max_id = d.get("next_max_id")
        time.sleep(2.0)

    return prof, reels


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("usernames", nargs="+")
    ap.add_argument("--limit", type=int, default=20)
    args = ap.parse_args()

    if not COOKIES.exists():
        print(f"  [erro] {COOKIES} nao existe")
        sys.exit(1)

    s = build_session()

    for username in args.usernames:
        username = username.lstrip("@")
        print(f"\n=== Coletando @{username} (top {args.limit}) ===")
        try:
            prof, reels = coletar(s, username, args.limit)
        except Exception as e:
            print(f"  [erro] {e}")
            continue

        if not reels:
            print("  Nenhum reel encontrado.")
            continue

        (BASE / f"urls_{username}.txt").write_text(
            "\n".join(r["url"] for r in reels) + "\n", encoding="utf-8")
        (BASE / f"meta_{username}.json").write_text(
            json.dumps({"perfil": prof, "reels": reels}, ensure_ascii=False, indent=2),
            encoding="utf-8")
        print(f"  OK -> {len(reels)} reels em urls_{username}.txt (+ meta_{username}.json)")
        time.sleep(4)


if __name__ == "__main__":
    main()
