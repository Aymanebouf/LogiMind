# Backend SupplyChainX (FastAPI)

## Lancer en local

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # et remplis les clés
uvicorn app.main:app --reload
