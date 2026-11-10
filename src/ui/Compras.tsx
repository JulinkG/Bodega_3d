import { useMemo, useState } from 'react'
import { formatoCantidad, formatoMXN } from '@/lib/formato'
import { FACTOR_OBJETIVO, listaDeCompras, type GrupoCompra } from '@/lib/inventario'
import { useInventario } from '@/store/useInventario'
import { abrirInsumo } from './acciones'

const fechaCorta = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

/** Texto listo para pegar en WhatsApp (negritas con *asteriscos*). */
function textoWhatsApp(grupos: GrupoCompra[]): string {
  const partes = [`*Pedido Relato Café* · ${fechaCorta.format(new Date())}`]
  for (const g of grupos) {
    partes.push('', `*${g.proveedor}*`)
    for (const r of g.renglones) partes.push(`• ${r.insumo.nombre}: ${formatoCantidad(r.cantidad, r.insumo.unidad)}`)
  }
  return partes.join('\n')
}

/** Copia al portapapeles; con respaldo para http en la red local (sin HTTPS). */
async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = texto
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

/** Lo que falta para llegar a 2 × mínimo, agrupado por proveedor. */
export function Compras() {
  const insumos = useInventario((s) => s.insumos)
  const grupos = useMemo(() => listaDeCompras(insumos), [insumos])
  const [copiado, setCopiado] = useState<'si' | 'no' | null>(null)

  if (grupos.length === 0) {
    return <p className="rounded-xl bg-ok/10 p-4 text-sm text-ok">No hay nada que comprar por ahora.</p>
  }

  const total = grupos.reduce((s, g) => s + g.total, 0)
  const texto = textoWhatsApp(grupos)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-cafe-500">
        Insumos en rojo o ámbar, con la cantidad para llegar a {FACTOR_OBJETIVO} × el mínimo.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={async () => {
            setCopiado((await copiar(texto)) ? 'si' : 'no')
            setTimeout(() => setCopiado(null), 2500)
          }}
          className="min-h-12 rounded-xl bg-cafe-700 px-3 text-sm font-semibold text-crema-50 transition hover:bg-cafe-900 active:scale-[0.98]"
        >
          {copiado === 'si' ? '¡Copiado!' : copiado === 'no' ? 'No se pudo copiar' : 'Copiar para WhatsApp'}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
          target="_blank"
          rel="noreferrer"
          className="grid min-h-12 place-items-center rounded-xl border border-cafe-700 px-3 text-sm font-semibold text-cafe-700 transition hover:bg-crema-100"
        >
          Abrir en WhatsApp
        </a>
      </div>

      {grupos.map((g) => (
        <section key={g.proveedor} className="rounded-xl bg-crema-50 p-3">
          <header className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="font-semibold">{g.proveedor}</h3>
            <span className="text-sm text-cafe-500">{formatoMXN(g.total)}</span>
          </header>
          <ul className="flex flex-col">
            {g.renglones.map((r) => (
              <li key={r.insumo.id}>
                <button
                  type="button"
                  onClick={() => abrirInsumo(r.insumo)}
                  className="flex min-h-11 w-full items-center justify-between gap-2 border-t border-crema-200 text-left text-sm first:border-t-0 hover:text-granada"
                >
                  <span className="truncate">{r.insumo.nombre}</span>
                  <span className="shrink-0 font-semibold">{formatoCantidad(r.cantidad, r.insumo.unidad)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-right text-sm">
        Total estimado: <span className="font-bold">{formatoMXN(total)}</span>
      </p>
    </div>
  )
}
