
import uuid
from datetime import datetime
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, status

from .. import database
from ..auth import get_current_user
from ..models import Outfit, OutfitCreate, OutfitUpdate

router = APIRouter(
    prefix="/outfits",
    tags=["outfits"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[Outfit])
async def read_outfits(current_user: Dict = Depends(get_current_user)):
    return database.get_outfits_by_user(current_user["id"])

@router.get("/{outfit_id}", response_model=Outfit)
async def read_outfit(outfit_id: str, current_user: Dict = Depends(get_current_user)):
    outfit = database.get_outfit_by_id(current_user["id"], outfit_id)
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit

@router.post("/", response_model=Outfit)
async def create_outfit(outfit: OutfitCreate, current_user: Dict = Depends(get_current_user)):
    # Check if all items exist
    for item_id in outfit.items:
        if database.get_item_by_id(current_user["id"], item_id) is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Item {item_id} not found"
            )
    
    outfit_id = str(uuid.uuid4())
    outfit_dict = outfit.dict()
    outfit_dict["createdAt"] = datetime.now()
    
    return database.create_outfit(current_user["id"], outfit_id, outfit_dict)

@router.patch("/{outfit_id}", response_model=Outfit)
async def update_outfit(
    outfit_id: str, 
    outfit_update: OutfitUpdate, 
    current_user: Dict = Depends(get_current_user)
):
    # Check if all items exist
    if outfit_update.items:
        for item_id in outfit_update.items:
            if database.get_item_by_id(current_user["id"], item_id) is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Item {item_id} not found"
                )
    
    updated_outfit = database.update_outfit(
        current_user["id"], 
        outfit_id, 
        outfit_update.dict(exclude_unset=True)
    )
    
    if updated_outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    
    return updated_outfit

@router.delete("/{outfit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_outfit(outfit_id: str, current_user: Dict = Depends(get_current_user)):
    success = database.delete_outfit(current_user["id"], outfit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return None
