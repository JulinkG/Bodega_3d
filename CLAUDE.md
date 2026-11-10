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
Insumos reales por zona en `src/data/insumosBase.ts` (fuente para datos de prueba y carga inicial).
Geometría de cada zona (`HUECOS`) en `src/scene/constantes.ts`.

| Mueble                     | Puerta / lugar | Zonas (de arriba a abajo)                                      |
|----------------------------|----------------|----------------------------------------------------------------|
| Refrigerador (2 puertas)   | Izquierda      | Jarabes y salsas dulces · Lácteos · Salsas y aderezos · Jugos y bebidas listas |
|                            | Derecha        | Frutas frescas · Verduras y hierbas · Proteínas (abajo, por inocuidad) |
| Congelador (cofre)         | Tapa           | Congelados                                                     |
| Alacena (2 puertas)        | Izquierda      | Café y polvos para bebidas · Toppings y endulzantes (2 niveles c/u) |
|                            | Derecha        | Panadería · Abarrotes y condimentos (2 niveles c/u)            |
| Repisa abierta (sin puertas)| —             | Desechables para bebidas · Desechables para comida · Empaque y etiquetado |

## Marca

- Pared color granada (`#8e2433`) con el logo y gráficos de Relato Café (`src/scene/Mural.tsx`).
- Imágenes en `public/marca/` (PNG con fondo transparente): `logo.png` (cara del personaje),
  `vaso-caliente.png`, `vaso-frio.png`, `huella.png`. El logo también va en el encabezado y favicon.
- Estilo de los gráficos: trazo de crayón café sobre "sticker" blanco hueso.

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
2. ✅ Fase 2 · Cocina 3D (4 muebles, etiquetas, OrbitControls con límites)
   + Ajuste: caja → repisa abierta, refri de 2 puertas, 15 zonas reales, pared granada con mural
3. ✅ Fase 3 · Abrir puertas/tapas, enfoque de cámara, botón "Vista general"
4. ✅ Fase 4 · Insumos de prueba (`src/data/mock.ts`), colores, panel de movimientos, alertas, compras
5. Fase 5 · Supabase (pasos manuales en `docs/supabase.md`; `npm run verificar:supabase`;
   datos de prueba con `npm run seed:sql` → `supabase/seed.sql`)
6. Fase 6 · Conectar la app: login, datos reales, Realtime, administrar insumos
7. Fase 7 · Historial, conteo del sábado, merma del mes, buscador, PWA, rendimiento
8. Fase 8 · Publicar en Netlify (repo: https://github.com/JulinkG/Bodega_3d)
9. Fase 9 · Descuento automático desde Loyverse (recetas + Edge Function)

## Notas de la escena 3D

- Medidas en metros; colores, posiciones y vista general en `src/scene/constantes.ts`.
- Piezas reutilizables en `src/scene/piezas.tsx`: `Bloque`, `CuerpoHueco`, `Repisas`, `Puerta`
  (gira sobre su bisagra con la prop `abierta`) y `Etiqueta` (fuente Nunito local, sin CDN).
- Interacción (Fase 3): el store `src/store/useBodega.ts` guarda `muebleActivo` y `zonaActiva`
  (solo una zona abierta a la vez). Una puerta abre todas las zonas detrás de ella
  (`zonasDePuerta`); `Huecos` permite tocar el nivel exacto y resalta la zona abierta.
- Puertas y tapa se animan con `easing.damp` de maath (~0.6 s). `soloClic()` ignora arrastres.
- `ControlCamara` anima cámara y objetivo al encuadre de la zona (`encuadreZona`) o a la vista
  general; si la persona gira o hace zoom, suelta la animación.
- Las etiquetas 3D se ocultan mientras hay un mueble abierto.
- La vista general calcula la distancia de la cámara para que quepa toda la fila en cualquier
  pantalla (laptop o celular vertical).
- La escena se carga con `React.lazy` en su propio chunk; la página aparece antes que el 3D.

## Notas de inventario (Fase 4)

- Datos de prueba: `src/data/mock.ts` arma los 89 insumos de `INSUMOS_BASE` con unidad, mínimo,
  costo, proveedor y stock. Se reinician al recargar (aún no hay base de datos).
- Estado: `src/store/useInventario.ts` (`insumos`, `movimientos`, `seleccionado`,
  `registrarMovimiento` async para cambiarlo por Supabase en la Fase 6 sin tocar la UI).
- Reglas puras en `src/lib/inventario.ts`: niveles, alertas, lista de compras (rojo y ámbar
  hasta 2 × mínimo, redondeado a unidades que se puedan pedir), valor por mueble.
- 3D: `src/scene/Insumos.tsx` acomoda los objetos en los `HUECOS` (elige cuántas filas hacia el
  fondo dan objetos más grandes sin pasarse del alto del nivel). Cada insumo tiene su modelo
  propio con colores reales en `src/scene/modelos.tsx` (`MODELOS`, por nombre; si falta, bolsa
  kraft). **El nivel de stock va en la base de color** debajo del producto (los rojos laten),
  no en el color del producto; la leyenda está en `src/ui/Leyenda.tsx`. Al agregar un insumo
  nuevo, agrégale su modelo en `MODELOS`.
- `IndicadorAlerta` = globito rojo con el número de insumos bajo el mínimo en la esquina del
  mueble (se oculta mientras ese mueble está abierto).
- 2D: `src/ui/PanelLateral.tsx` con pestañas Alertas · Compras · Valor · Zonas; la ficha
  `PanelInsumo` reemplaza las pestañas en laptop y sube como hoja inferior en celular.
- Salida o merma mayor al stock se rechaza con aviso; el conteo real va en "Ajuste".
