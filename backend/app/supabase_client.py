# backend/app/supabase_client.py
import os
from typing import Optional
from dotenv import load_dotenv, find_dotenv
from supabase import create_client, Client

# Charge le .env le plus proche (backend/.env ou un parent)
dotenv_path = find_dotenv(".env", usecwd=True)
if dotenv_path:
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()

# On essaie plusieurs noms de clés possibles
SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
SUPABASE_KEY: Optional[str] = (
    os.getenv("SUPABASE_KEY")  # ton backend .env peut déjà l'utiliser
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # clé service (recommandée côté serveur)
    or os.getenv("SUPABASE_ANON_KEY")  # à défaut
)

def _make_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError(
            "SUPABASE_URL ou SUPABASE_KEY manquants.\n"
            "Crée backend/.env avec par ex. :\n"
            "SUPABASE_URL=https://xxxx.supabase.co\n"
            "SUPABASE_KEY=eyJhbGciOiJI... (service role ou anon)\n"
            "➡️ Supabase > Project Settings > API"
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Instance partagée
supabase: Client = _make_client()

# Compatibilité avec l'ancien import : from app.supabase_client import get_supabase
def get_supabase() -> Client:
    return supabase
