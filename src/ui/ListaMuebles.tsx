import { MUEBLES, ORDEN_MUEBLES, ZONAS } from '@/data/catalogo'
import { useBodega } from '@/store/useBodega'

/** Atajo 2D: cada zona es un botón que abre su mueble en la escena. */
export function ListaMuebles() {
  const zonaActiva = useBodega((s) => s.zonaActiva)
  const muebleActivo = useBodega((s) => s.muebleActivo)
  const alternarZona = useBodega((s) => s.alternarZona)

  return (
    <ul className="space-y-2">
      {ORDEN_MUEBLES.map((id) => (
        <li
          key={id}
          className={`rounded-lg p-3 transition ${muebleActivo === id ? 'bg-crema-200' : 'bg-crema-50'}`}
        >
          <p className="font-medium">{MUEBLES[id].nombre}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MUEBLES[id].zonas.map((z) => {
              const activa = zonaActiva === z
              return (
                <button
                  key={z}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => alternarZona(z)}
                  className={`min-h-10 rounded-full border px-3 text-sm transition active:scale-95 ${
                    activa
                      ? 'border-cafe-700 bg-cafe-700 text-crema-50'
                      : 'border-crema-200 bg-white text-cafe-500 hover:border-cafe-500'
                  }`}
                >
                  {ZONAS[z].nombre}
                </button>
              )
            })}
          </div>
        </li>
      ))}
    </ul>
  )
}
