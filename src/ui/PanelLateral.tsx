import { useMemo, useState } from 'react'
import { alertas, nivelDe } from '@/lib/inventario'
import { useInventario } from '@/store/useInventario'
import { Alertas } from './Alertas'
import { Compras } from './Compras'
import { ListaMuebles } from './ListaMuebles'
import { PanelInsumo } from './PanelInsumo'
import { Valor } from './Valor'

type Pestana = 'alertas' | 'compras' | 'valor' | 'zonas'

/**
 * Panel 2D: a la derecha en laptop, debajo de la escena en celular.
 * La ficha del insumo reemplaza las pestañas en laptop y sube como hoja
 * inferior en celular.
 */
export function PanelLateral() {
  const [pestana, setPestana] = useState<Pestana>('alertas')
  const insumos = useInventario((s) => s.insumos)
  const seleccionado = useInventario((s) => s.seleccionado)
  const haySeleccion = seleccionado !== null
  const seleccionar = useInventario((s) => s.seleccionar)

  const conteo = useMemo(() => {
    const lista = alertas(insumos)
    return { total: lista.length, rojos: lista.filter((i) => nivelDe(i) === 'critico').length }
  }, [insumos])

  const pestanas: { id: Pestana; titulo: string; insignia?: number }[] = [
    { id: 'alertas', titulo: 'Alertas', insignia: conteo.total },
    { id: 'compras', titulo: 'Compras' },
    { id: 'valor', titulo: 'Valor' },
    { id: 'zonas', titulo: 'Zonas' },
  ]

  return (
    <aside className="flex max-h-[45vh] min-h-0 flex-col border-t border-crema-200 bg-white md:max-h-none md:w-96 md:border-t-0 md:border-l">
      <div className={`flex min-h-0 flex-1 flex-col ${haySeleccion ? 'md:hidden' : ''}`}>
        <nav role="tablist" aria-label="Secciones" className="grid shrink-0 grid-cols-4 gap-1 border-b border-crema-200 p-2">
          {pestanas.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={pestana === p.id}
              onClick={() => setPestana(p.id)}
              className={`relative min-h-11 rounded-lg text-sm font-semibold transition ${
                pestana === p.id ? 'bg-crema-200 text-cafe-900' : 'text-cafe-500 hover:bg-crema-100'
              }`}
            >
              {p.titulo}
              {!!p.insignia && (
                <span
                  className={`absolute -top-1 right-0.5 min-w-5 rounded-full px-1 text-[11px] leading-5 text-white ${
                    conteo.rojos ? 'bg-critico' : 'bg-bajo'
                  }`}
                >
                  {p.insignia}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto p-4">
          {pestana === 'alertas' && <Alertas />}
          {pestana === 'compras' && <Compras />}
          {pestana === 'valor' && <Valor />}
          {pestana === 'zonas' && <ListaMuebles />}
        </div>
      </div>

      {haySeleccion && (
        <>
          {/* Fondo oscuro detrás de la hoja (solo celular) */}
          <button
            type="button"
            aria-label="Cerrar ficha"
            onClick={() => seleccionar(null)}
            className="fixed inset-0 z-20 bg-black/20 md:hidden"
          />
          <div className="fixed inset-x-0 bottom-0 z-30 max-h-[72vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] md:static md:z-auto md:max-h-none md:flex-1 md:rounded-none md:shadow-none">
            <PanelInsumo key={seleccionado} />
          </div>
        </>
      )}
    </aside>
  )
}
