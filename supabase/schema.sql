-- Bodega 3D · Relato Café — esquema de base de datos
-- Pegar completo en Supabase > SQL Editor > Run (Fase 5). Se corre UNA sola vez
-- en un proyecto nuevo. Después, si quieres datos de prueba, corre seed.sql.
-- Cambios respecto a la guía original van marcados con [mejora].

create table zonas (
  id text primary key,            -- 'jarabes', 'verduras', ...
  nombre text not null,
  mueble text not null            -- 'refrigerador','congelador','alacena','repisa'
    check (mueble in ('refrigerador','congelador','alacena','repisa'))  -- [mejora]
);

create table insumos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,                                      -- [mejora] sin duplicados
  zona_id text not null references zonas(id),                       -- [mejora] not null
  unidad text not null
    check (unidad in ('pz','kg','g','L','ml','botella','paquete','caja')), -- [mejora]
  stock_minimo numeric not null default 0 check (stock_minimo >= 0),     -- [mejora]
  costo_unitario numeric not null default 0 check (costo_unitario >= 0), -- [mejora]
  proveedor text,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table movimientos (
  id bigint generated always as identity primary key,
  insumo_id uuid not null references insumos(id) on delete cascade,
  tipo text not null check (tipo in ('entrada','salida','merma','ajuste')),
  cantidad numeric not null check (cantidad >= 0),  -- [mejora] el signo lo da el tipo
  nota text,
  usuario uuid default auth.uid(),
  -- [mejora] correo de quien registró, para mostrarlo en el historial
  usuario_email text default (auth.jwt() ->> 'email'),
  creado_en timestamptz not null default now()
);

-- [mejora] Índice para que la vista de stock y el historial sean rápidos.
create index movimientos_insumo_fecha_idx on movimientos (insumo_id, creado_en desc);
create index insumos_zona_idx on insumos (zona_id) where activo;

-- Stock calculado: el último ajuste manda; luego suma entradas
-- y resta salidas y merma posteriores a ese ajuste.
create view stock_actual with (security_invoker = on) as
select i.*,
  coalesce((select m.cantidad from movimientos m
            where m.insumo_id = i.id and m.tipo = 'ajuste'
            order by m.creado_en desc limit 1), 0)
  + coalesce((select sum(case when m.tipo = 'entrada' then m.cantidad
                              else -m.cantidad end)
              from movimientos m
              where m.insumo_id = i.id
                and m.tipo in ('entrada','salida','merma')
                and m.creado_en > coalesce((select max(a.creado_en)
                    from movimientos a where a.insumo_id = i.id
                    and a.tipo = 'ajuste'), '-infinity')), 0)
  as stock
from insumos i where i.activo;

-- Seguridad: solo usuarios con sesión iniciada. Sin sesión no se ve nada.
alter table zonas enable row level security;
alter table insumos enable row level security;
alter table movimientos enable row level security;

-- [mejora] Permisos más finos que "for all":
-- Zonas: catálogo fijo, solo lectura.
create policy "equipo lee zonas" on zonas for select to authenticated using (true);

-- Insumos: leer, dar de alta y editar. No se borran: se desactivan (activo = false)
-- para no perder su historial.
create policy "equipo lee insumos" on insumos for select to authenticated using (true);
create policy "equipo crea insumos" on insumos for insert to authenticated with check (true);
create policy "equipo edita insumos" on insumos for update to authenticated using (true) with check (true);

-- Movimientos: leer y registrar. No se editan ni se borran (es el kardex);
-- un error se corrige con otro movimiento, por ejemplo un "ajuste".
create policy "equipo lee movimientos" on movimientos for select to authenticated using (true);
create policy "equipo registra movimientos" on movimientos for insert to authenticated with check (true);

-- [mejora] Sin esto, Supabase Realtime NO envía los cambios (Fase 6).
alter publication supabase_realtime add table movimientos;
alter publication supabase_realtime add table insumos;

insert into zonas values
  ('jarabes','Jarabes y salsas dulces','refrigerador'),
  ('lacteos','Lácteos','refrigerador'),
  ('salsas','Salsas y aderezos','refrigerador'),
  ('jugos','Jugos y bebidas listas','refrigerador'),
  ('frutas','Frutas frescas','refrigerador'),
  ('verduras','Verduras y hierbas','refrigerador'),
  ('proteinas','Proteínas','refrigerador'),
  ('congelados','Congelados','congelador'),
  ('cafe_polvos','Café y polvos para bebidas','alacena'),
  ('toppings','Toppings y endulzantes','alacena'),
  ('panaderia','Panadería','alacena'),
  ('abarrotes','Abarrotes y condimentos','alacena'),
  ('desechables_bebidas','Desechables para bebidas','repisa'),
  ('desechables_comida','Desechables para comida','repisa'),
  ('empaque','Empaque y etiquetado','repisa');
