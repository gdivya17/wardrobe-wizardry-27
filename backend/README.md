
# Wardrobe Wizardry Backend

This is the Python FastAPI backend for the Wardrobe Wizardry app.

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
```
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run the server:
```
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## Troubleshooting

If you get an error like `[Errno 48] Address already in use`, port 8000 is already in use by another process. Use a different port:

```
uvicorn app.main:app --reload --port 8001
```

Then, set the environment variable in your frontend to point to this port:

```
# On Windows
set VITE_API_URL=http://localhost:8001

# On macOS/Linux
export VITE_API_URL=http://localhost:8001
```

And restart your frontend server.
