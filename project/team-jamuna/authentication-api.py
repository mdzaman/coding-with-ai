from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
import secrets
import redis
import asyncio
from datetime import datetime, timedelta

app = FastAPI()
redis_client = redis.Redis(host='localhost', port=6379, db=0)

class User(BaseModel):
    id: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    auth_provider: str
    plan: dict

class APIKey(BaseModel):
    key: str
    name: str
    created_at: datetime
    last_used: Optional[datetime]
    rate_limit: int

async def generate_api_key():
    """Generate a secure API key with prefix"""
    return f"sk_{secrets.token_urlsafe(32)}"

async def store_api_key(user_id: str, api_key: str, rate_limit: int):
    """Store API key in Redis with rate limiting info"""
    key_data = {
        'user_id': user_id,
        'created_at': datetime.utcnow().isoformat(),
        'rate_limit': rate_limit,
        'last_used': None
    }
    redis_client.hmset(f"apikey:{api_key}", key_data)
    redis_client.sadd(f"user:{user_id}:apikeys", api_key)

@app.post("/auth/social")
async def social_auth(provider: str, token: str):
    """Handle social authentication"""
    # Verify token with provider
    user_info = await verify_social_token(provider, token)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid social token")
    
    # Create or update user
    user = await create_or_update_user(user_info, provider)
    
    # Generate access token
    access_token = create_access_token(user.id)
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/email")
async def email_auth(email: EmailStr):
    """Handle email authentication"""
    # Generate and send verification code
    verification_code = secrets.randbelow(1000000)
    redis_client.setex(
        f"verification:{email}",
        timedelta(minutes=15),
        str(verification_code)
    )
    
    # In production, send email here
    print(f"Verification code for {email}: {verification_code}")
    
    return {"message": "Verification code sent"}

@app.post("/auth/phone")
async def phone_auth(phone: str):
    """Handle phone authentication"""
    # Generate and send verification code
    verification_code = secrets.randbelow(1000000)
    redis_client.setex(
        f"verification:{phone}",
        timedelta(minutes=15),
        str(verification_code)
    )
    
    # In production, send SMS here
    print(f"Verification code for {phone}: {verification_code}")
    
    return {"message": "Verification code sent"}

@app.post("/api/keys")
async def create_api_key(user: User = Depends(get_current_user)):
    """Create new API key for user"""
    api_key = await generate_api_key()
    
    # Calculate rate limit based on user's plan
    rate_limit = calculate_rate_limit(user.plan)
    
    # Store API key
    await store_api_key(user.id, api_key, rate_limit)
    
    return {
        "api_key": api_key,
        "rate_limit": rate_limit,
        "created_at": datetime.utcnow().isoformat()
    }

@app.get("/api/keys")
async def list_api_keys(user: User = Depends(get_current_user)):
    """List all API keys for user"""
    api_keys = redis_client.smembers(f"user:{user.id}:apikeys")
    keys_data = []
    
    for key in api_keys:
        key_data = redis_client.hgetall(f"apikey:{key}")
        keys_data.append({
            "key": key,
            "created_at": key_data[b'created_at'].decode(),
            "last_used": key_data.get(b'last_used', None),
            "rate_limit": int(key_data[b'rate_limit'])
        })
    
    return {"api_keys": keys_data}

@app.delete("/api/keys/{api_key}")
async def revoke_api_key(api_key: str, user: User = Depends(get_current_user)):
    """Revoke an API key"""
    # Verify key belongs to user
    if not redis_client.sismember(f"user:{user.id}:apikeys", api_key):
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Remove key
    redis_client.delete(f"apikey:{api_key}")
    redis_client.srem(f"user:{user.id}:apikeys", api_key)
    
    return {"message": "API key revoked"}

def calculate_rate_limit(plan: dict) -> int:
    """Calculate API rate limit based on user's plan"""
    base_rate = 60  # requests per minute
    multiplier = plan.get('messages', 1000) / 1000
    return int(base_rate * multiplier)

