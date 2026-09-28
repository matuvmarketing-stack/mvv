from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import Optional, List, Annotated
import os
import random
import string
import logging
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v))]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=True)
        data.pop("_id", None)
        return data

    @classmethod
    def from_mongo(cls, doc: dict):
        if doc and "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return cls(**doc)


class ProductSpec(BaseModel):
    gramaje: str
    composicion: str
    origen: str
    lavado: str


class ProductColor(BaseModel):
    name: str
    hex: str


class Product(BaseDocument):
    slug: str
    name: str
    category: str
    price: float
    currency: str = "EUR"
    badge: str
    short_description: str
    full_description: str
    sizes: List[str]
    colors: List[ProductColor]
    images: List[str]
    specs: ProductSpec


class CustomerInfo(BaseModel):
    nombre: str
    email: str
    telefono: Optional[str] = ""
    direccion: str
    ciudad: str
    codigo_postal: str


class OrderItemIn(BaseModel):
    slug: str
    size: str
    color: str
    qty: int


class OrderCreate(BaseModel):
    customer: CustomerInfo
    items: List[OrderItemIn]


class OrderItem(BaseModel):
    slug: str
    name: str
    size: str
    color: str
    qty: int
    unit_price: float


class Order(BaseDocument):
    referencia: str
    customer: CustomerInfo
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    currency: str = "EUR"
    status: str = "confirmado"
    created_at: str


class ContactCreate(BaseModel):
    nombre: str
    email: str
    asunto: str
    mensaje: str


class ContactMessage(BaseDocument):
    nombre: str
    email: str
    asunto: str
    mensaje: str
    created_at: str


FREE_SHIPPING_THRESHOLD = 70.0
SHIPPING_COST = 4.95

IMG = "https://static.prod-images.emergentagent.com/jobs/e857de67-4c7c-47bf-b5cb-e190c2c87968/images"

PRODUCTS_SEED = [
    {
        "slug": "sudadera-rh11-heavyweight",
        "name": "Sudadera RH11 Heavyweight Hood",
        "category": "Sudadera",
        "price": 89.00,
        "currency": "EUR",
        "badge": "EDICIÓN LIMITADA · 420 GSM",
        "short_description": "Capucha envolvente sin cordones visibles, bolsillo canguro oculto y corte oversize atlético fabricado en algodón denso peinado.",
        "full_description": "La sudadera definitiva de entrenamiento y calle. Diseñada con un peso estructural de 420 GSM que mantiene su caída limpia sesión tras sesión. Doble puño elástico, interior afelpado térmico de tacto sedoso y remates termosellados.",
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "colors": [
            {"name": "Negro Obsidiana", "hex": "#0A0A0A"},
            {"name": "Gris Carbón", "hex": "#27272A"},
            {"name": "Rojo Umbra", "hex": "#5A0B13"},
        ],
        "images": [
            f"{IMG}/f872cb450e55e9a3d9e3792c953dc20edeb26b31920bf176afd1b4aafce393aa.jpeg",
            f"{IMG}/68b9f6f009dbe163cb88c805c691240df41d2ba4fa24fca6bee0e7ffd333c394.jpeg",
            f"{IMG}/9eb44872feaaeb3c6d1883a9d360f5e120884721ee839e025856e872db29d925.jpeg",
            f"{IMG}/a60d933d3bd0ac15e6643097bd4ce38ec6a2f310af71e4081b9b34aa99ae4c33.jpeg",
        ],
        "specs": {
            "gramaje": "420 GSM French Terry",
            "composicion": "100% Algodón Peinado Orgánico",
            "origen": "Confeccionado en Portugal / Tintado en España",
            "lavado": "Lavar en frío a 30°C. No usar secadora. Planchar del revés.",
        },
    },
    {
        "slug": "camiseta-rh11-tactical-tee",
        "name": "Camiseta RH11 Tactical Boxy Tee",
        "category": "Camiseta",
        "price": 45.00,
        "currency": "EUR",
        "badge": "ALTA DENSIDAD · 240 GSM",
        "short_description": "Cuello cerrado de 3 cm reforzado, hombro caído y acabado texturizado matte. La base perfecta para tu día a día de alto rendimiento.",
        "full_description": "Construida para resistir el roce y mantener un porte intachable. El grosor de 240 GSM proporciona una silueta limpia sin transparencias. Transpirable, con costuras planas anti-rozaduras para levantamientos y uso diario.",
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "colors": [
            {"name": "Negro Obsidiana", "hex": "#0A0A0A"},
            {"name": "Gris Grafito", "hex": "#27272A"},
        ],
        "images": [
            f"{IMG}/d29fdccd2ede37089fc8da74e9978ced543996d01ea629c08cfa99192b0ce53c.jpeg",
            f"{IMG}/6d781ac8e8fac1e6c26e51f3599f998480527cb4b245cbf7bc3178551dd4e6be.jpeg",
            f"{IMG}/fcbd81115afd011492de8011fb2c8a54042a310da10b331e5bf742196ab33408.jpeg",
            f"{IMG}/688517d3399a6d052356eff5a4d7a20065fd370f4620a015bf6a9cf7c105f7e5.jpeg",
        ],
        "specs": {
            "gramaje": "240 GSM Single Jersey",
            "composicion": "100% Algodón Peinado Premium",
            "origen": "Confeccionado en Portugal",
            "lavado": "Lavar en frío a 30°C. Secado al aire recomendado.",
        },
    },
]


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


async def seed_products():
    if await db.products.count_documents({}) == 0:
        docs = [Product(**p).to_mongo() for p in PRODUCTS_SEED]
        await db.products.insert_many(docs)


@api_router.get("/products", response_model=List[Product])
async def list_products():
    docs = await db.products.find().to_list(100)
    return [Product.from_mongo(d) for d in docs]


def make_reference():
    return "RH11-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


@api_router.post("/orders", response_model=Order, status_code=201)
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="El carrito está vacío")
    doc_items, subtotal = [], 0.0
    for item in payload.items:
        prod = await db.products.find_one({"slug": item.slug})
        if not prod:
            raise HTTPException(status_code=400, detail=f"Producto no encontrado: {item.slug}")
        if item.size not in prod["sizes"]:
            raise HTTPException(status_code=400, detail=f"Talla no válida: {item.size}")
        if item.qty < 1:
            raise HTTPException(status_code=400, detail="Cantidad no válida")
        price = float(prod["price"])
        subtotal += price * item.qty
        doc_items.append(OrderItem(
            slug=item.slug, name=prod["name"], size=item.size,
            color=item.color, qty=item.qty, unit_price=price,
        ))
    shipping = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST
    order = Order(
        referencia=make_reference(),
        customer=payload.customer,
        items=doc_items,
        subtotal=round(subtotal, 2),
        shipping=shipping,
        total=round(subtotal + shipping, 2),
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    result = await db.orders.insert_one(order.to_mongo())
    order.id = str(result.inserted_id)
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    docs = await db.orders.find().sort("_id", -1).to_list(100)
    return [Order.from_mongo(d) for d in docs]


@api_router.post("/contact", status_code=201)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(
        **payload.model_dump(), created_at=datetime.now(timezone.utc).isoformat()
    )
    result = await db.contact_messages.insert_one(msg.to_mongo())
    msg.id = str(result.inserted_id)
    return {"ok": True, "id": msg.id}


# ---------------- AI Shopping Assistant (Claude) ----------------
import json
from starlette.responses import StreamingResponse
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ASSISTANT_MODEL = ("anthropic", "claude-sonnet-4-6")


class ChatIn(BaseModel):
    session_id: str
    message: str


class ChatMessageDoc(BaseDocument):
    session_id: str
    role: str
    text: str
    created_at: str


ASSISTANT_SYSTEM_PROMPT = """Eres el asistente de compras de RH11, una marca de ropa deportiva premium y minimalista. Tono: cercano, directo, sobrio y con carácter. Responde SIEMPRE en español, de forma concisa (2-4 frases salvo que pidan más detalle).

CATÁLOGO (solo existen estas dos prendas):
1) Sudadera RH11 Heavyweight Hood — 89,00 €
   - 420 GSM French Terry, 100% algodón peinado orgánico. Confeccionada en Portugal, tintada en España.
   - Capucha envolvente sin cordones visibles, bolsillo canguro oculto, corte oversize atlético, puños dobles elásticos, interior afelpado térmico.
   - Colores: Negro Obsidiana, Gris Carbón, Rojo Umbra. Tallas: XS-XXL.
2) Camiseta RH11 Tactical Boxy Tee — 45,00 €
   - 240 GSM single jersey, 100% algodón peinado premium. Confeccionada en Portugal.
   - Cuello cerrado de 3 cm reforzado, hombro caído, acabado matte, costuras planas anti-rozaduras.
   - Colores: Negro Obsidiana, Gris Grafito. Tallas: XS-XXL.

GUÍA DE TALLAS (medidas de la prenda en cm, en plano):
- XS: pecho 104, largo 68, manga 59 — recomendado 160-170 cm / 55-65 kg
- S: pecho 108, largo 70, manga 60 — recomendado 168-175 cm / 65-72 kg
- M: pecho 114, largo 72, manga 61 — recomendado 173-182 cm / 72-80 kg
- L: pecho 120, largo 74, manga 62 — recomendado 178-188 cm / 80-88 kg
- XL: pecho 126, largo 76, manga 63 — recomendado 182-192 cm / 88-96 kg
- XXL: pecho 132, largo 78, manga 64 — recomendado 185-198 cm / >95 kg

ASESORÍA DE TALLAS: si el cliente da altura y peso, recomienda UNA talla concreta usando la columna "recomendado" y explica brevemente por qué. El corte es boxy/oversize: si está entre dos tallas y prefiere un look más entallado, puede bajar una talla. Si solo da un dato, pide amablemente el otro.

POLÍTICAS: envío 24/48h en península, gratuito a partir de 70 € (si no, 4,95 €). Devoluciones 30 días con prenda sin usar. Packaging negro mate compostable con precinto numerado. Pago contra entrega al tramitar el pedido desde el carrito.

REGLAS: no inventes productos, precios ni políticas fuera de esta información. Si preguntan por algo que no existe, redirígelo con elegancia a las dos piezas. Cuida la ortografía española (ñ, acentos)."""


def _clean_session(sid: str) -> str:
    return "".join(c for c in sid if c.isalnum() or c == "-")[:64] or "anon"


@api_router.post("/assistant/chat")
async def assistant_chat(payload: ChatIn):
    message = payload.message.strip()[:2000]
    if not message:
        raise HTTPException(status_code=400, detail="Mensaje vacío")
    sid = _clean_session(payload.session_id)
    await db.chat_messages.insert_one(
        ChatMessageDoc(
            session_id=sid, role="user", text=message,
            created_at=datetime.now(timezone.utc).isoformat(),
        ).to_mongo()
    )
    chat = (
        LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"rh11-assistant-{sid}",
            system_message=ASSISTANT_SYSTEM_PROMPT,
        )
        .with_model(*ASSISTANT_MODEL)
    )

    async def event_generator():
        full = ""
        try:
            async for ev in chat.stream_message(UserMessage(text=message)):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'type': 'delta', 'content': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as exc:
            logger.error(f"Assistant error: {exc}")
            yield f"data: {json.dumps({'type': 'error', 'detail': 'El asistente no está disponible ahora mismo. Inténtalo en unos segundos.'})}\n\n"
            return
        await db.chat_messages.insert_one(
            ChatMessageDoc(
                session_id=sid, role="assistant", text=full,
                created_at=datetime.now(timezone.utc).isoformat(),
            ).to_mongo()
        )
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.get("/assistant/history/{session_id}")
async def assistant_history(session_id: str):
    sid = _clean_session(session_id)
    docs = await db.chat_messages.find({"session_id": sid}).sort("_id", 1).to_list(200)
    return [{"role": d["role"], "text": d["text"], "created_at": d.get("created_at")} for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await seed_products()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
