
import uuid
from datetime import datetime
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, status

from .. import database
from ..auth import get_current_user
from ..models import ClothingItem, ClothingItemCreate, ClothingItemUpdate

router = APIRouter(
    prefix="/items",
    tags=["clothing items"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ClothingItem])
async def read_items(current_user: Dict = Depends(get_current_user)):
    return database.get_items_by_user(current_user["id"])

@router.get("/{item_id}", response_model=ClothingItem)
async def read_item(item_id: str, current_user: Dict = Depends(get_current_user)):
    item = database.get_item_by_id(current_user["id"], item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=ClothingItem)
async def create_item(item: ClothingItemCreate, current_user: Dict = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    item_dict = item.dict()
    item_dict["createdAt"] = datetime.now()
    
    return database.create_item(current_user["id"], item_id, item_dict)

@router.patch("/{item_id}", response_model=ClothingItem)
async def update_item(
    item_id: str, 
    item_update: ClothingItemUpdate, 
    current_user: Dict = Depends(get_current_user)
):
    updated_item = database.update_item(
        current_user["id"], 
        item_id, 
        item_update.dict(exclude_unset=True)
    )
    
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return updated_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: str, current_user: Dict = Depends(get_current_user)):
    success = database.delete_item(current_user["id"], item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return None
