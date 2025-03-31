
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# Auth models
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    name: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    createdAt: datetime
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Clothing models
class ClothingCategory(str):
    def __new__(cls, value):
        if value not in ["tops", "bottoms", "outerwear", "dresses", "shoes", "accessories"]:
            raise ValueError(f"Invalid category: {value}")
        return super().__new__(cls, value)

class ClothingColor(str):
    def __new__(cls, value):
        if value not in ["black", "white", "red", "blue", "green", "yellow", "purple", 
                          "pink", "brown", "gray", "silver", "multicolor", "other"]:
            raise ValueError(f"Invalid color: {value}")
        return super().__new__(cls, value)

class ClothingSeason(str):
    def __new__(cls, value):
        if value not in ["spring", "summer", "fall", "winter", "all"]:
            raise ValueError(f"Invalid season: {value}")
        return super().__new__(cls, value)

class ClothingOccasion(str):
    def __new__(cls, value):
        if value not in ["casual", "formal", "business", "athletic", "special", "other"]:
            raise ValueError(f"Invalid occasion: {value}")
        return super().__new__(cls, value)

class ClothingItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    imageUrl: str
    category: str
    color: str
    season: List[str]
    occasion: List[str]
    brand: Optional[str] = None
    favorite: bool = False

class ClothingItemCreate(ClothingItemBase):
    pass

class ClothingItem(ClothingItemBase):
    id: str
    lastWorn: Optional[datetime] = None
    createdAt: datetime
    
    class Config:
        orm_mode = True

class ClothingItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[List[str]] = None
    occasion: Optional[List[str]] = None
    brand: Optional[str] = None
    favorite: Optional[bool] = None
    lastWorn: Optional[datetime] = None

# Outfit models
class OutfitBase(BaseModel):
    name: str
    description: Optional[str] = None
    items: List[str]  # List of item IDs
    occasion: List[str]
    season: List[str]
    favorite: bool = False

class OutfitCreate(OutfitBase):
    pass

class Outfit(OutfitBase):
    id: str
    lastWorn: Optional[datetime] = None
    createdAt: datetime
    
    class Config:
        orm_mode = True

class OutfitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    items: Optional[List[str]] = None
    occasion: Optional[List[str]] = None
    season: Optional[List[str]] = None
    favorite: Optional[bool] = None
    lastWorn: Optional[datetime] = None
