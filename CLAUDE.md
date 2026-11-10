# Bodega 3D · Relato Café

Dashboard web de inventario para la cafetería Relato Café, con la cocina en 3D interactiva.
Se abre un mueble, aparecen los insumos en sus repisas coloreados por nivel de stock, y se
registran movimientos (entrada, salida, merma, ajuste).

## Reglas del producto

- Toda la interfaz en **español de México**. Moneda **MXN** (usar `src/lib/formato.ts`, nunca formatear a mano).
- Usuarios: **2 personas** (dueño y socia), en **laptop y celular**. Todo debe funcionar con toques
  (pointer events), con botones grandes para el dedo.
- Dos puntos de venta ven los mismos datos en tiempo real (Supabase Realtime).

## Muebles y zonas

Catálogo fijo en `src/data/catalogo.ts`; debe coincidir con `supabase/schema.sql`.

| Mueble         | Zonas               | Ejemplos de insumos                                     |
|----------------|---------------------|---------------------------------------------------------|
| Refrigerador   | Jarabes, Verduras   | Vainilla, caramelo, avellana · jitomate, lechuga        |
| Congelador     | Congelados          | Frutos rojos, pollo, arrachera, hielo                   |
| Alacena        | Polvos, Leches      | Canela, matcha, cacao, chai · leches en caja sin abrir  |
| Caja de cartón | Desechables         | Vasos 12 y 16 oz, tapas, popotes, servilletas, bolsas   |

Decisión: el congelador es **una sola zona** (`congelados`); frutos rojos, pollo, arrachera e hielo
son insumos dentro de ella.

## Reglas de inventario

- Color por nivel (`src/lib/inventario.ts`): verde si stock ≥ 1.5 × mínimo, ámbar si está entre el
  mínimo y 1.5 × mínimo, rojo si está por debajo del mínimo.
- Lista de compras: lo que falta para llegar a 2 × mínimo, agrupado por proveedor.
- El stock **no se guarda**: se calcula en la vista `stock_actual` a partir de `movimientos`
  (estilo kardex). El último `ajuste` es el conteo real; después se suman entradas y se restan
  salidas y merma. `cantidad` siempre es ≥ 0; el signo lo da el `tipo`.

## Stack

Vite 8 + React 19 + TypeScript · three + @react-three/fiber v9 + @react-three/drei · zustand v5 ·
Tailwind CSS v4 (plugin `@tailwindcss/vite`, sin `tailwind.config.js`; tokens de color en
`src/index.css` bajo `@theme`) · @supabase/supabase-js · Netlify.

## Convenciones

- `src/scene/` componentes 3D (React Three Fiber). Un componente por mueble, posición por props.
- `src/ui/` interfaz 2D (paneles, formularios, login).
- `src/store/` estado global con zustand.
- `src/data/` acceso a datos (cliente Supabase, datos de prueba, catálogo).
- `src/lib/` utilidades puras (formato, reglas de inventario).
- `src/types.ts` tipos del dominio, reflejo de las tablas SQL.
- Importar con el alias `@/` (apunta a `src/`).
- Estilo 3D low-poly con geometrías básicas; nada de modelos pesados salvo `.glb` optimizados.
- Rendimiento móvil: `dpr` máximo 1.5, sombras limitadas en pantallas pequeñas.

## Seguridad

- Llaves en `.env.local` (ignorado por git). Plantilla en `.env.example`.
- En el frontend solo la llave pública (anon / publishable). **Nunca** `service_role`.
- Registro abierto desactivado en Supabase; los 2 usuarios se crean a mano.

## Comandos

- `npm run dev` servidor local (http://localhost:5173)
- `npm run dev:red` igual pero accesible desde el celular en el mismo wifi
- `npm run build` typecheck + build de producción
- `npm run lint` oxlint

## Ruta del proyecto

1. ✅ Fase 1 · Esqueleto, CLAUDE.md, esquema SQL listo en `supabase/schema.sql`
2. Fase 2 · Cocina 3D (4 muebles, etiquetas, OrbitControls con límites)
3. Fase 3 · Abrir puertas/tapas, enfoque de cámara, botón "Vista general"
4. Fase 4 · Insumos de prueba (`src/data/mock.ts`), colores, panel de movimientos, alertas, compras
5. Fase 5–6 · Supabase: login, datos reales, Realtime, administrar insumos
6. Fase 7 · Historial, conteo del sábado, merma del mes, buscador, PWA, rendimiento
7. Fase 8 · Publicar en Netlify (repo: https://github.com/JulinkG/Bodega_3d)
8. Fase 9 · Descuento automático desde Loyverse (recetas + Edge Function)
