import { useMemo } from 'react'
import { ZONAS } from '@/data/catalogo'
import { formatoCantidad } from '@/lib/formato'
import { alertas, COLOR_NIVEL, nivelDe } from '@/lib/inventario'
import { useInventario } from '@/store/useInventario'
import { abrirInsumo } from './acciones'

/** Insumos en rojo y ámbar. Tocar uno abre su mueble y su ficha. */
export function Alertas() {
  const insumos = useInventario((s) => s.insumos)
  const lista = useMemo(() => alertas(insumos), [insumos])

  if (lista.length === 0) {
    return <p className="rounded-xl bg-ok/10 p-4 text-sm text-ok">Todo en verde. No hay nada por debajo del mínimo.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {lista.map((i) => {
        const nivel = nivelDe(i)
        return (
          <li key={i.id}>
            <button
              type="button"
              onClick={() => abrirInsumo(i)}
              className="flex min-h-14 w-full items-center gap-3 rounded-xl bg-crema-50 px-3 py-2 text-left transition hover:bg-crema-100 active:scale-[0.99]"
            >
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: COLOR_NIVEL[nivel] }}
                aria-label={nivel === 'critico' ? 'Bajo el mínimo' : 'Se está acabando'}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{i.nombre}</span>
                <span className="block truncate text-xs text-cafe-500">{ZONAS[i.zona_id].nombre}</span>
              </span>
              <span className="shrink-0 text-right text-sm">
                <span className="block font-semibold">{formatoCantidad(i.stock, i.unidad)}</span>
                <span className="block text-xs text-cafe-500">mín. {formatoCantidad(i.stock_minimo, i.unidad)}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
