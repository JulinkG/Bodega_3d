import { COLOR_NIVEL, NOMBRE_NIVEL } from '@/lib/inventario'
import type { NivelStock } from '@/types'

const NIVELES: NivelStock[] = ['ok', 'bajo', 'critico']

/** Qué significa el color de la base de cada insumo. */
export function Leyenda() {
  return (
    <ul
      aria-label="Colores del nivel de stock"
      className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-cafe-700 shadow-sm backdrop-blur"
    >
      {NIVELES.map((n) => (
        <li key={n} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: COLOR_NIVEL[n] }} />
          {NOMBRE_NIVEL[n]}
        </li>
      ))}
    </ul>
  )
}
