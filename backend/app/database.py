
from datetime import datetime
import json
import os
from typing import Dict, List, Optional, Union

# This is a simple file-based database for the demo
# In a real app, you would use a proper database like SQLite, PostgreSQL, etc.

DATA_DIR = "data"
USER_FILE = os.path.join(DATA_DIR, "users.json")
ITEMS_FILE = os.path.join(DATA_DIR, "items.json")
OUTFITS_FILE = os.path.join(DATA_DIR, "outfits.json")

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize empty data files if they don't exist
for file_path in [USER_FILE, ITEMS_FILE, OUTFITS_FILE]:
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            json.dump({}, f)

def load_data(file_path: str) -> Dict:
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {}

def save_data(file_path: str, data: Dict) -> None:
    with open(file_path, "w") as f:
        json.dump(data, f, default=str)

# User functions
def get_user_by_email(email: str) -> Optional[Dict]:
    users = load_data(USER_FILE)
    for user_id, user in users.items():
        if user["email"] == email:
            return {**user, "id": user_id}
    return None

def create_user(user_id: str, user_data: Dict) -> Dict:
    users = load_data(USER_FILE)
    users[user_id] = user_data
    save_data(USER_FILE, users)
    return {**user_data, "id": user_id}

def get_user_by_id(user_id: str) -> Optional[Dict]:
    users = load_data(USER_FILE)
    if user_id in users:
        return {**users[user_id], "id": user_id}
    return None

# Item functions
def get_items_by_user(user_id: str) -> List[Dict]:
    items_data = load_data(ITEMS_FILE)
    user_items = items_data.get(user_id, {})
    return [{"id": item_id, **item} for item_id, item in user_items.items()]

def get_item_by_id(user_id: str, item_id: str) -> Optional[Dict]:
    items_data = load_data(ITEMS_FILE)
    user_items = items_data.get(user_id, {})
    if item_id in user_items:
        return {"id": item_id, **user_items[item_id]}
    return None

def create_item(user_id: str, item_id: str, item_data: Dict) -> Dict:
    items_data = load_data(ITEMS_FILE)
    user_items = items_data.get(user_id, {})
    user_items[item_id] = item_data
    items_data[user_id] = user_items
    save_data(ITEMS_FILE, items_data)
    return {"id": item_id, **item_data}

def update_item(user_id: str, item_id: str, item_updates: Dict) -> Optional[Dict]:
    items_data = load_data(ITEMS_FILE)
    user_items = items_data.get(user_id, {})
    
    if item_id not in user_items:
        return None
    
    for key, value in item_updates.items():
        if value is not None:
            user_items[item_id][key] = value
    
    items_data[user_id] = user_items
    save_data(ITEMS_FILE, items_data)
    return {"id": item_id, **user_items[item_id]}

def delete_item(user_id: str, item_id: str) -> bool:
    items_data = load_data(ITEMS_FILE)
    user_items = items_data.get(user_id, {})
    
    if item_id not in user_items:
        return False
    
    del user_items[item_id]
    items_data[user_id] = user_items
    save_data(ITEMS_FILE, items_data)
    
    # Also remove item from outfits
    outfits_data = load_data(OUTFITS_FILE)
    user_outfits = outfits_data.get(user_id, {})
    
    for outfit_id, outfit in user_outfits.items():
        if "items" in outfit and item_id in outfit["items"]:
            outfit["items"] = [i for i in outfit["items"] if i != item_id]
    
    outfits_data[user_id] = user_outfits
    save_data(OUTFITS_FILE, outfits_data)
    
    return True

# Outfit functions
def get_outfits_by_user(user_id: str) -> List[Dict]:
    outfits_data = load_data(OUTFITS_FILE)
    user_outfits = outfits_data.get(user_id, {})
    return [{"id": outfit_id, **outfit} for outfit_id, outfit in user_outfits.items()]

def get_outfit_by_id(user_id: str, outfit_id: str) -> Optional[Dict]:
    outfits_data = load_data(OUTFITS_FILE)
    user_outfits = outfits_data.get(user_id, {})
    if outfit_id in user_outfits:
        return {"id": outfit_id, **user_outfits[outfit_id]}
    return None

def create_outfit(user_id: str, outfit_id: str, outfit_data: Dict) -> Dict:
    outfits_data = load_data(OUTFITS_FILE)
    user_outfits = outfits_data.get(user_id, {})
    user_outfits[outfit_id] = outfit_data
    outfits_data[user_id] = user_outfits
    save_data(OUTFITS_FILE, outfits_data)
    return {"id": outfit_id, **outfit_data}

def update_outfit(user_id: str, outfit_id: str, outfit_updates: Dict) -> Optional[Dict]:
    outfits_data = load_data(OUTFITS_FILE)
    user_outfits = outfits_data.get(user_id, {})
    
    if outfit_id not in user_outfits:
        return None
    
    for key, value in outfit_updates.items():
        if value is not None:
            user_outfits[outfit_id][key] = value
    
    outfits_data[user_id] = user_outfits
    save_data(OUTFITS_FILE, outfits_data)
    return {"id": outfit_id, **user_outfits[outfit_id]}

def delete_outfit(user_id: str, outfit_id: str) -> bool:
    outfits_data = load_data(OUTFITS_FILE)
    user_outfits = outfits_data.get(user_id, {})
    
    if outfit_id not in user_outfits:
        return False
    
    del user_outfits[outfit_id]
    outfits_data[user_id] = user_outfits
    save_data(OUTFITS_FILE, outfits_data)
    return True
