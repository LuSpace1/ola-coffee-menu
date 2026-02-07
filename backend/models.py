from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Product(Base):
    """Product model for menu items"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Integer)
    description = Column(String, nullable=True)
    available = Column(Boolean, default=True)