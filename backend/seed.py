from database import SessionLocal
import models

#DATOS EXACTOS DE LA CARTA OLA COFFEE (PDF)
MENU_ITEMS = [
    # --- (NOT) COFFEE ---
    {"name": "TÉ SABORES", "category": "(Not) Coffee", "price": 2500, "description": "Selección de tés premium en variedad de sabores."},
    {"name": "TÉ FRÍO", "category": "(Not) Coffee", "price": 3500, "description": "Té helado refrescante, perfecto para el verano."},
    {"name": "ZUMO NARANJA", "category": "(Not) Coffee", "price": 4000, "description": "Jugo de naranja natural recién exprimido."},
    {"name": "LIMONADA", "category": "(Not) Coffee", "price": 3500, "description": "Limonada casera refrescante con toque de menta."},
    {"name": "KOMBUCHA", "category": "(Not) Coffee", "price": 3500, "description": "Bebida fermentada probiótica y refrescante."},
    {"name": "GINGER BEER", "category": "(Not) Coffee", "price": 3500, "description": "Cerveza de jengibre artesanal sin alcohol."},
    {"name": "CHAI LATTE", "category": "(Not) Coffee", "price": 4000, "description": "Té especiado con leche cremosa y canela."},
    {"name": "DIRTY CHAI", "category": "(Not) Coffee", "price": 4500, "description": "Chai latte con shot de espresso."},
    {"name": "MATCHA LATTE", "category": "(Not) Coffee", "price": 4000, "description": "Té verde japonés con leche espumosa."},

    # --- COFFEE ---
    {"name": "ESPRESSO", "category": "Coffee", "price": 2500, "description": "Shot doble de café espresso intenso."},
    {"name": "AMERICANO", "category": "Coffee", "price": 2800, "description": "Espresso suave con agua caliente."},
    {"name": "FLAT WHITE", "category": "Coffee", "price": 3000, "description": "Espresso con microespuma de leche sedosa."},
    {"name": "CAPUCCINO", "category": "Coffee", "price": 3200, "description": "Espresso con leche vaporizada y espuma cremosa."},
    {"name": "CAPUCCINO VAINILLA", "category": "Coffee", "price": 3700, "description": "Capuccino con toque dulce de vainilla."},
    {"name": "CAPUCCINO CARAMELO", "category": "Coffee", "price": 3700, "description": "Capuccino con salsa de caramelo casera."},
    {"name": "CAPUCCINO MANI", "category": "Coffee", "price": 3900, "description": "Capuccino con mantequilla de maní cremosa."},
    {"name": "CORTADO", "category": "Coffee", "price": 3000, "description": "Espresso cortado con leche caliente."},
    {"name": "LATTE", "category": "Coffee", "price": 3500, "description": "Espresso con abundante leche vaporizada."},
    {"name": "COLD BREW", "category": "Coffee", "price": 3500, "description": "Café de extracción en frío, suave y refrescante."},
    {"name": "ICED LATTE", "category": "Coffee", "price": 3800, "description": "Latte helado con hielo y leche fría."},
    {"name": "MOCACCINO", "category": "Coffee", "price": 3900, "description": "Capuccino con chocolate y crema batida."},
    {"name": "ESPRESSO TONIC", "category": "Coffee", "price": 3800, "description": "Espresso con agua tónica y hielo."},
    {"name": "ESPRESSO NARANJA", "category": "Coffee", "price": 4000, "description": "Espresso con jugo de naranja natural."},
    {"name": "AFFOGATO", "category": "Coffee", "price": 4000, "description": "Helado de vainilla bañado en espresso caliente."},

    # --- CHOCOLATE ---
    {"name": "CALIENTE", "category": "Chocolate", "price": 3800, "description": "Chocolate caliente cremoso y reconfortante."},
    {"name": "MASHMALLOW", "category": "Chocolate", "price": 4000, "description": "Chocolate caliente con malvaviscos tostados."},
    {"name": "NARANJA", "category": "Chocolate", "price": 4200, "description": "Chocolate caliente con esencia de naranja."},
    {"name": "BLANCO/COCO", "category": "Chocolate", "price": 4200, "description": "Chocolate blanco con coco rallado."},
    {"name": "BLANCO/MATCHA", "category": "Chocolate", "price": 4200, "description": "Chocolate blanco con matcha japonés."},
    {"name": "VIRAL NEW YORK", "category": "Chocolate", "price": 5590, "description": "Nuestra versión del famoso chocolate viral, ultra cremoso y abundante."},
    {"name": "EXTRA VEGETAL", "category": "Chocolate", "price": 500, "description": "Leche vegetal adicional (avena, almendra o coco)."},

    # --- DULCE ---
    {"name": "CAKE ZANAHORIA", "category": "Dulce", "price": 2800, "description": "Bizcocho de zanahoria con frosting de queso crema."},
    {"name": "BANANA BREAD", "category": "Dulce", "price": 3300, "description": "Pan de plátano casero con nueces."},
    {"name": "PIE DE LIMÓN", "category": "Dulce", "price": 3800, "description": "Tarta de limón con merengue suizo."},
    {"name": "PIE DE FRAMBUESA", "category": "Dulce", "price": 4000, "description": "Tarta de frambuesa con crema pastelera."},
    {"name": "COOKIE CHIPS", "category": "Dulce", "price": 3000, "description": "Cookie clásica con chips de chocolate."},
    {"name": "COOKIE OREO", "category": "Dulce", "price": 3000, "description": "Cookie rellena con trozos de oreo."},
    {"name": "COOKIE SALTED CARAMEL", "category": "Dulce", "price": 3000, "description": "Cookie con caramelo salado y chocolate."},
    {"name": "COOKIE FRAMBUESA", "category": "Dulce", "price": 3500, "description": "Cookie con frambuesa y chocolate blanco."},
    {"name": "COOKIE PISTACHO", "category": "Dulce", "price": 4000, "description": "Cookie gourmet con pistacho y chocolate."},
    {"name": "COOKIE NUTELLA", "category": "Dulce", "price": 3500, "description": "Cookie rellena de nutella cremosa."},
    {"name": "COOKIE RED VELVET", "category": "Dulce", "price": 3500, "description": "Cookie red velvet con chips de chocolate blanco."},
    {"name": "COOKIES SIN AZÚCAR", "category": "Dulce", "price": 3000, "description": "Cookie saludable sin azúcar añadida."},
    {"name": "BOMBONES", "category": "Dulce", "price": 2200, "description": "Selección de bombones artesanales."},
    {"name": "BROWNIE", "category": "Dulce", "price": 3500, "description": "Brownie de chocolate intenso y húmedo."},

    # --- SALADO ---
    {
        "name": "CLÁSICO", 
        "category": "Salado", 
        "price": 5500, 
        "description": "Croissant o pan brioche con jamón y queso."
    },
    {
        "name": "CAPRESSE", 
        "category": "Salado", 
        "price": 6000, 
        "description": "Croissant con queso de cabra, tomate, pesto y albahaca."
    },
    {
        "name": "SALMÓN", 
        "category": "Salado", 
        "price": 6500, 
        "description": "Croissant con salmón, queso philadelphia y rúcula."
    },
    {
        "name": "HUEVO CLASICO", 
        "category": "Salado", 
        "price": 6000, 
        "description": "Pan brioche, palta, huevo y salsa de yogurt ciboulette."
    },
    {
        "name": "TOSTÓN PALTA", 
        "category": "Salado", 
        "price": 6000, 
        "description": "Pan brioche, palta, jamón artesanal y tomate."
    },

    # --- BOWLS ---
    {
        "name": "AÇAI BOWL", 
        "category": "Bowls", 
        "price": 7490, 
        "description": "Açai, frutilla, plátano, granola, coco laminado y mantequilla de maní."
    },
    {
        "name": "BOWL YOGURT", 
        "category": "Bowls", 
        "price": 6990, 
        "description": "Yogurt griego con frutas de estación, granola, coco laminado y miel."
    },

    # --- BRUNCH ---
    {
        "name": "PARA 1", 
        "category": "Brunch", 
        "price": 11990, 
        "description": "Capuccino + huevo clásico + mini açai."
    },
    {
        "name": "PARA 2", 
        "category": "Brunch", 
        "price": 19990, 
        "description": "Dos cafés a elección (flat white, capuccino o americano) + tostón palta + croissant capresse + cookie a elección (oreo/chips/red velvet)."
    },

    # --- SMASH COOKIE ---
    {
        "name": "PISTACHO", 
        "category": "Smash Cookie", 
        "price": 6990, 
        "description": "Cookie chocolate, helado vainilla, salsa pistacho natural y trozos de pistacho."
    },
    {
        "name": "NUTELLA", 
        "category": "Smash Cookie", 
        "price": 6990, 
        "description": "Cookie tradicional, helado vainilla, nutella y chips."
    }
]

def seed_db():
    print("Cargando menú oficial...")
    db = SessionLocal()
    
    count = 0
    for item in MENU_ITEMS:
        if "description" not in item:
            item["description"] = None

        producto = models.Product(**item)
        db.add(producto)
        count += 1
    
    db.commit()
    print(f"Se cargaron {count} productos oficiales en la base de datos.")
    db.close()

if __name__ == "__main__":
    seed_db()