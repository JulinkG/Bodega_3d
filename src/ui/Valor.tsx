import { useMemo } from 'react'
import { MUEBLES, ORDEN_MUEBLES } from '@/data/catalogo'
import { formatoMXN } from '@/lib/formato'
import { valorPorMueble } from '@/lib/inventario'
import { useInventario } from '@/store/useInventario'

/** Valor total del inventario y cuánto hay en cada mueble. */
export function Valor() {
  const insumos = useInventario((s) => s.insumos)
  const porMueble = useMemo(() => valorPorMueble(insumos), [insumos])
  const total = ORDEN_MUEBLES.reduce((s, m) => s + porMueble[m], 0)
  const maximo = Math.max(...ORDEN_MUEBLES.map((m) => porMueble[m]), 1)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-granada p-4 text-crema-50">
        <p className="text-sm opacity-80">Valor total del inventario</p>
        <p className="text-3xl font-bold">{formatoMXN(total)}</p>
        <p className="text-xs opacity-80">{insumos.length} insumos · a costo de compra</p>
      </div>
      <ul className="flex flex-col gap-3">
        {ORDEN_MUEBLES.map((m) => (
          <li key={m}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium">{MUEBLES[m].nombre}</span>
              <span className="font-semibold">{formatoMXN(porMueble[m])}</span>
            </div>
            <div className="h-2.5 rounded-full bg-crema-100">
              <div className="h-full rounded-full bg-cafe-500" style={{ width: `${(porMueble[m] / maximo) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
