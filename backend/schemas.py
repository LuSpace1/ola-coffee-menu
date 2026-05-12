from pydantic import BaseModel
from typing import Optional

# 1. Esquema Base (Campos comunes)
class ProductBase(BaseModel):
    name: str
    category: str
    price: int
    description: Optional[str] = None
    available: bool = True

# 2. Esquema para Crear (Mismos campos que base)
class ProductCreate(ProductBase):
    pass

# 3. Esquema para Leer (Incluye el ID generado por la DB)
class Product(ProductBase):
    id: int

    class Config:
        # Esto permite que Pydantic lea datos directamente de los modelos de SQLAlchemy
        from_attributes = True

# 4. Esquema para Login
class LoginRequest(BaseModel):
    password: str

# 5. Esquema para Recuperación
class RecoveryParams(BaseModel):
    email: str

class PinVerification(BaseModel):
    pin: str
    new_password: str

class EmailUpdate(BaseModel):
    new_email: str