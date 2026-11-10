-- Bodega 3D · Relato Café — esquema de base de datos
-- Pegar completo en Supabase > SQL Editor > Run (Fase 5).
-- Cambios respecto a la guía original van marcados con [mejora].

create table zonas (
  id text primary key,            -- 'jarabes', 'verduras', ...
  nombre text not null,
  mueble text not null            -- 'refrigerador','congelador','alacena','caja'
    check (mueble in ('refrigerador','congelador','alacena','caja'))  -- [mejora]
);

create table insumos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  zona_id text not null references zonas(id),                       -- [mejora] not null
  unidad text not null,
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

-- Seguridad: solo usuarios con sesión iniciada.
alter table zonas enable row level security;
alter table insumos enable row level security;
alter table movimientos enable row level security;

create policy "equipo" on zonas for all to authenticated
  using (true) with check (true);
create policy "equipo" on insumos for all to authenticated
  using (true) with check (true);
create policy "equipo" on movimientos for all to authenticated
  using (true) with check (true);

-- [mejora] Sin esto, Supabase Realtime NO envía los cambios (Fase 6).
alter publication supabase_realtime add table movimientos;
alter publication supabase_realtime add table insumos;

insert into zonas values
  ('jarabes','Jarabes','refrigerador'),
  ('verduras','Verduras','refrigerador'),
  ('congelados','Congelados','congelador'),
  ('polvos','Polvos','alacena'),
  ('leches','Leches','alacena'),
  ('desechables','Desechables','caja');
