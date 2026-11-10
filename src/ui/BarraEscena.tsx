import { MUEBLES, ZONAS } from '@/data/catalogo'
import { useBodega } from '@/store/useBodega'

/** Controles encima de la escena: qué está abierto y el botón "Vista general". */
export function BarraEscena() {
  const zona = useBodega((s) => s.zonaActiva)
  const vistaGeneral = useBodega((s) => s.vistaGeneral)

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
      <p
        className="pointer-events-auto rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-cafe-700 shadow-sm backdrop-blur"
        aria-live="polite"
      >
        {zona
          ? `${MUEBLES[ZONAS[zona].mueble].nombre} · ${ZONAS[zona].nombre}`
          : 'Toca un mueble para abrirlo'}
      </p>
      <button
        type="button"
        onClick={vistaGeneral}
        className="pointer-events-auto min-h-11 rounded-full bg-cafe-700 px-4 text-sm font-semibold text-crema-50 shadow-md transition hover:bg-cafe-900 active:scale-95"
      >
        Vista general
      </button>
    </div>
  )
}
