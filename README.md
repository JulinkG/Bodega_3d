# Bodega 3D · Relato Café

Dashboard web de inventario con la cocina de Relato Café en 3D: abre un mueble, ve los insumos
en sus repisas con color por nivel (verde / ámbar / rojo) y registra entradas, salidas, merma
y ajustes.

## Correr en local

```bash
npm install
cp .env.example .env.local   # y pon tus llaves de Supabase
npm run dev                  # http://localhost:5173
npm run dev:red              # para abrirlo desde el celular en el mismo wifi
```

## Stack

Vite + React + TypeScript · Three.js con React Three Fiber y drei · Zustand · Tailwind CSS v4 ·
Supabase (Postgres, Auth, Realtime) · Netlify.

El esquema de la base de datos está en [`supabase/schema.sql`](supabase/schema.sql).
