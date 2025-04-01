
from datetime import datetime, timedelta
from typing import Dict
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import uuid

from .. import database
from ..auth import authenticate_user, create_access_token, get_current_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from ..models import Token, User, UserCreate, UserLogin

logger = logging.getLogger("wardrobe-api")

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={404: {"description": "Not found"}},
)

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    try:
        logger.info(f"Registration attempt for email: {user_data.email}")
        
        # Check if user already exists
        db_user = database.get_user_by_email(user_data.email)
        if db_user:
            logger.warning(f"Registration failed: Email already registered: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(user_data.password)
        
        user_dict = {
            "email": user_data.email,
            "name": user_data.name,
            "password": hashed_password,
            "createdAt": str(datetime.now())
        }
        
        logger.info(f"Creating user with ID: {user_id}")
        user = database.create_user(user_id, user_dict)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_id}, expires_delta=access_token_expires
        )
        
        # Remove password from return
        user.pop("password", None)
        
        # Make sure to include the id in the response
        result = {**user, "id": user_id, "access_token": access_token}
        logger.info(f"User registered successfully: {user_id}")
        return result
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(form_data: UserLogin):
    logger.info(f"Login attempt for email: {form_data.email}")
    user = authenticate_user(form_data.email, form_data.password)
    if not user:
        logger.warning(f"Login failed: Incorrect email or password for {form_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    logger.info(f"Login successful for user: {user['id']}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: Dict = Depends(get_current_user)):
    logger.info(f"User profile accessed: {current_user['id']}")
    # Remove password from return
    user_dict = {k: v for k, v in current_user.items() if k != "password"}
    return user_dict
