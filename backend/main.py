from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ola Coffee API")

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# API Endpoints

@app.get("/products", response_model=List[schemas.Product])
def get_products(
    category: str = None, 
    search: str = None, 
    db: Session = Depends(get_db)
):
    """Get products with optional category and search filters"""
    query = db.query(models.Product)
    
    if category and category != "Todos":
        query = query.filter(models.Product.category == category)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            models.Product.name.ilike(search_fmt) | 
            models.Product.description.ilike(search_fmt)
        )
    
    return query.all()


@app.post("/products", response_model=schemas.Product)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db)
):
    """Create a new product"""
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int, 
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db)
):
    """Update an existing product"""
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(
            status_code=404, 
            detail="Producto no encontrado"
        )
    
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@app.patch("/products/{product_id}/toggle", response_model=schemas.Product)
def toggle_stock(
    product_id: int, 
    db: Session = Depends(get_db)
):
    """Toggle product availability"""
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(
            status_code=404, 
            detail="Producto no encontrado"
        )
    
    db_product.available = not db_product.available
    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int, 
    db: Session = Depends(get_db)
):
    """Delete a product"""
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(
            status_code=404, 
            detail="Producto no encontrado"
        )
    
    db.delete(db_product)
    db.commit()
    return {"message": "Producto eliminado exitosamente"}


@app.put("/categories/rename")
def rename_category(
    old_name: str, 
    new_name: str, 
    db: Session = Depends(get_db)
):
    """Rename a category across all products"""
    if not old_name or not new_name:
        raise HTTPException(
            status_code=400,
            detail="Debe proporcionar old_name y new_name"
        )
        
    # Bulk update all products in the old category
    updated_count = db.query(models.Product).filter(
        models.Product.category == old_name
    ).update({"category": new_name})
    
    if updated_count == 0:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron productos con la categoría '{old_name}'"
        )
        
    db.commit()
    return {"message": f"Categoría '{old_name}' renombrada a '{new_name}' en {updated_count} productos"}


@app.post("/login")
def login(
    data: schemas.LoginRequest, 
    db: Session = Depends(get_db)
):
    """Secure login endpoint using hashed passwords"""
    config = db.query(models.AppConfig).first()
    if not config:
        raise HTTPException(status_code=500, detail="Configuración no encontrada")

    from security import verify_password
    if verify_password(data.password, config.admin_password):
        return {"status": "ok", "token": "access-granted"}
    
    raise HTTPException(
        status_code=401, 
        detail="Contraseña incorrecta"
    )

# --- SISTEMA DE RECUPERACIÓN ---
import random
import time
from email_service import send_recovery_email

active_pins = {} # { "correo": {"pin": "123456", "expires_at": timestamp} }
PIN_EXPIRATION_SECONDS = 900 # 15 min

@app.post("/request-recovery")
def request_recovery(db: Session = Depends(get_db)):
    """Genera y envía un PIN al correo de recuperación si existe"""
    config = db.query(models.AppConfig).first()
    if not config or not config.recovery_email:
        raise HTTPException(status_code=400, detail="No hay un correo de recuperación configurado.")

    email = config.recovery_email.strip().lower()
    pin = str(random.randint(100000, 999999))
    
    active_pins[email] = {
        "pin": pin,
        "expires_at": time.time() + PIN_EXPIRATION_SECONDS
    }
    
    # Enviar correo
    success = send_recovery_email(email, pin)
    if not success:
         raise HTTPException(status_code=500, detail="Error al enviar el correo.")
         
    return {"message": "Si el correo está registrado, se enviará un PIN válido por 15 minutos."}

@app.post("/verify-pin")
def verify_pin_and_change_password(
    data: schemas.PinVerification,
    db: Session = Depends(get_db)
):
    """Verifica PIN y cambia contraseña"""
    config = db.query(models.AppConfig).first()
    if not config or not config.recovery_email:
        raise HTTPException(status_code=400, detail="Configuración inválida")
        
    email = config.recovery_email.strip().lower()
    record = active_pins.get(email)
    
    if not record:
        raise HTTPException(status_code=400, detail="No hay un PIN activo o ha expirado")
        
    if time.time() > record["expires_at"]:
        del active_pins[email]
        raise HTTPException(status_code=400, detail="El PIN ha expirado")
        
    if record["pin"] != data.pin:
        raise HTTPException(status_code=401, detail="PIN incorrecto")
        
    # Validado. Cambiar clave.
    from security import get_password_hash
    config.admin_password = get_password_hash(data.new_password)
    db.commit()
    
    # Invalida PIN usado
    del active_pins[email]
    
    return {"message": "Contraseña actualizada exitosamente"}

@app.put("/config/email")
def update_recovery_email(
    data: schemas.EmailUpdate,
    db: Session = Depends(get_db)
):
    """Actualiza el correo de recuperación"""
    config = db.query(models.AppConfig).first()
    if not config:
         raise HTTPException(status_code=500, detail="Configuración no encontrada")
         
    config.recovery_email = data.new_email.strip().lower()
    db.commit()
    return {"message": "Correo de recuperación actualizado"}
    
@app.get("/config/has-email")
def check_has_email(db: Session = Depends(get_db)):
    """Retorna si el admin tiene un correo configurado"""
    config = db.query(models.AppConfig).first()
    if not config:
        return {"hasEmail": False, "email": None}
    return {"hasEmail": bool(config.recovery_email), "email": config.recovery_email}
