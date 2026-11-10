// Genera supabase/seed.sql con los 95 insumos de prueba (src/data/mock.ts).
// Uso: npm run seed:sql
//
// El SQL da de alta cada insumo y registra su stock inicial como un movimiento
// "ajuste" (el conteo real), igual que haría la app. Se puede correr más de una
// vez: si el insumo ya existe, actualiza sus datos y no repite el ajuste.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { crearInsumosDePrueba } from '../src/data/mock'

const texto = (v: string | null) => (v === null ? 'null' : `'${v.replace(/'/g, "''")}'`)

const insumos = crearInsumosDePrueba()

const filas = insumos
  .map(
    (i) =>
      `  (${texto(i.nombre)}, ${texto(i.zona_id)}, ${texto(i.unidad)}, ${i.stock_minimo}, ${i.costo_unitario}, ${texto(i.proveedor)}, ${i.stock})`,
  )
  .join(',\n')

const sql = `-- Bodega 3D · Relato Café — DATOS DE PRUEBA (${insumos.length} insumos)
-- Generado con "npm run seed:sql" a partir de src/data/mock.ts. No editar a mano.
-- Mínimos, costos, proveedores y stocks son INVENTADOS para probar la app.
-- Pegar en Supabase > SQL Editor > Run, después de schema.sql.

with datos (nombre, zona_id, unidad, stock_minimo, costo_unitario, proveedor, stock) as (
  values
${filas}
),
altas as (
  insert into insumos (nombre, zona_id, unidad, stock_minimo, costo_unitario, proveedor)
  select nombre, zona_id, unidad, stock_minimo, costo_unitario, proveedor from datos
  on conflict (nombre) do update set
    zona_id = excluded.zona_id,
    unidad = excluded.unidad,
    stock_minimo = excluded.stock_minimo,
    costo_unitario = excluded.costo_unitario,
    proveedor = excluded.proveedor
  returning id, nombre
)
-- Stock inicial como "ajuste", solo para insumos que aún no tienen movimientos.
insert into movimientos (insumo_id, tipo, cantidad, nota)
select a.id, 'ajuste', d.stock, 'Carga inicial (datos de prueba)'
from altas a
join datos d using (nombre)
where not exists (select 1 from movimientos m where m.insumo_id = a.id);
`

const destino = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url))
writeFileSync(destino, sql)
console.log(`Listo: supabase/seed.sql con ${insumos.length} insumos.`)
