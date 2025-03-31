
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, items, outfits, images

app = FastAPI(title="Wardrobe Wizardry API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(outfits.router)
app.include_router(images.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Wardrobe Wizardry API"}
