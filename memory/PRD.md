# PRD — RH11 · Viste tu límite

## Problema original (statement)
Tienda online de venta directa para una marca de ropa deportiva con solo dos productos: una camiseta y una sudadera.
- Marca: RH11 (elegido por el usuario). Eslogan: "Viste tu límite" (elegido entre 3 opciones propuestas).
- Público: 18-40 años, ropa cómoda, con estilo y aire deportivo.
- Sensación: elegante, premium, deportiva y minimalista.
- Estilo: fondo #0A0A0A, textos blanco/gris claro, un solo acento sobrio — rojo oscuro (elegido por el usuario) —, tipografía sans-serif fuerte en títulos, mucho espacio negro, líneas finas, esquinas rectas, fotografía grande sobre fondo oscuro (placeholders sustituibles), animaciones sutiles.
- Estructura: cabecera fija minimalista (logo, menú Inicio/Camiseta/Sudadera/Nosotros/Contacto, carrito), hero a pantalla completa con "Comprar ahora", dos tarjetas de producto, página de producto (galería con zoom, tallas XS-XXL, color, cantidad, añadir al carrito, guía de tallas, materiales y cuidados), valores de marca (tejido, corte, diseño propio, envío rápido), sobre nosotros, contacto y footer.
- Usuario añadió: nivel Awwwards (hero kinético con reveal enmascarado línea a línea, marquee editorial lento, parallax, micro-interacciones, lenis smooth scroll, logo propio + favicon SVG).
- Carrito: cajón lateral con tallas, cantidades y total + formulario que registra el pedido en base de datos (sin pasarela de pago) — elegido por el usuario.

## Arquitectura
- Frontend: React (CRA + craco) + Tailwind + framer-motion + lenis + lucide-react + sonner. Rutas: `/` (one-page) y `/producto/:slug`.
- Backend: FastAPI + Motor (MongoDB) vía MONGO_URL/DB_NAME de entorno. Modelos con BaseDocument (PyObjectId, to_mongo/from_mongo).
- Endpoints: GET /api, GET /api/products (seed automático 2 productos), POST /api/orders (valida talla, recalcula precios server-side, referencia RH11-XXXXXX, envío gratis >70€), GET /api/orders, POST /api/contact.
- Imágenes de producto generadas (10, fondo oscuro coherente) servidas desde storage; sustituibles cambiando `src/data/products.js` y el seed del backend.

## Personas
- Comprador 18-30: entra por el hero deportivo, compra sudadera en 3 clics.
- Comprador 30-40: valora materiales/guía de tallas, usa el formulario de contacto.

## Requisitos core
1. One-page con hero kinético, marquee, grid 2 productos, valores, nosotros, contacto. 2. Páginas de producto completas. 3. Carrito drawer con checkout a DB. 4. Backend con catálogo + pedidos + contactos.

## Implementado (2026-09-28)
- Todo lo anterior, verificado con curl y flujo e2e de compra (pedido RH11-MCHGUQ registrado).
- Asistente de compras IA con Claude (claude-sonnet-4-6 vía EMERGENT_LLM_KEY): chat flotante con streaming SSE (POST /api/assistant/chat), historial persistido en MongoDB (GET /api/assistant/history/{session_id}), system prompt con catálogo real, guía de tallas y políticas; asesor de tallas por altura/peso. Verificado e2e.
- Hero: palabra "LÍMITE" con relleno blanco (edición visual pedida por el usuario).

## Backlog (P0/P1/P2)
- P0: —
- P1: pasarela de pago real (Stripe test ya disponible), emails de confirmación (Resend gestionado).
- P2: panel admin para ver pedidos y conversaciones del asistente, más productos/colores, reseñas.

## Próximas tareas
1. Conectar Stripe test para pago con tarjeta dentro del drawer. 2. Email automático de confirmación al registrar pedido. 3. Panel simple de pedidos.
