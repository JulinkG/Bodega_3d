import { useState, type FormEvent } from 'react'
import { MUEBLES, ZONAS } from '@/data/catalogo'
import { formatoCantidad, formatoMXN } from '@/lib/formato'
import { COLOR_NIVEL, NOMBRE_NIVEL, esUnidadEntera, nivelDe, valorDe } from '@/lib/inventario'
import { useInventario } from '@/store/useInventario'
import type { TipoMovimiento } from '@/types'

const TIPOS: { tipo: TipoMovimiento; etiqueta: string; boton: string; ayuda: string }[] = [
  { tipo: 'entrada', etiqueta: '+ Entrada', boton: 'Registrar entrada', ayuda: 'Lo que llegó (compra o pedido).' },
  { tipo: 'salida', etiqueta: '− Salida', boton: 'Registrar salida', ayuda: 'Lo que se usó para preparar.' },
  { tipo: 'merma', etiqueta: 'Merma', boton: 'Registrar merma', ayuda: 'Lo que se tiró: caducó, se echó a perder o se cayó.' },
  { tipo: 'ajuste', etiqueta: 'Ajuste', boton: 'Guardar conteo', ayuda: 'Cuánto hay de verdad al contar. Reemplaza el stock.' },
]

/**
 * Ficha del insumo seleccionado con los botones para registrar movimientos.
 * Se monta con `key` = id del insumo, así el formulario se limpia al cambiar.
 */
export function PanelInsumo() {
  const insumo = useInventario((s) => s.insumos.find((i) => i.id === s.seleccionado))
  const seleccionar = useInventario((s) => s.seleccionar)
  const registrar = useInventario((s) => s.registrarMovimiento)

  const [tipo, setTipo] = useState<TipoMovimiento>('salida')
  const [cantidad, setCantidad] = useState('')
  const [nota, setNota] = useState('')
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null)
  const [guardando, setGuardando] = useState(false)

  if (!insumo) return null

  const nivel = nivelDe(insumo)
  const zona = ZONAS[insumo.zona_id]
  const paso = esUnidadEntera(insumo.unidad) ? 1 : 0.5
  const actual = TIPOS.find((t) => t.tipo === tipo)!

  const cambiarCantidad = (delta: number) => {
    const n = Math.max(0, (parseFloat(cantidad.replace(',', '.')) || 0) + delta)
    setCantidad(String(+n.toFixed(3)))
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    const n = parseFloat(cantidad.replace(',', '.'))
    const r = await registrar({ insumoId: insumo.id, tipo, cantidad: n, nota })
    setGuardando(false)
    if (r.ok) {
      setMensaje({ ok: true, texto: `Listo: ${actual.etiqueta.replace(/^[+−] /, '').toLowerCase()} de ${formatoCantidad(n, insumo.unidad)}.` })
      setCantidad('')
      setNota('')
    } else {
      setMensaje({ ok: false, texto: r.error })
    }
  }

  return (
    <section aria-label={`Insumo ${insumo.nombre}`} className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-cafe-500">
            {MUEBLES[zona.mueble].nombre} · {zona.nombre}
          </p>
          <h2 className="text-xl font-bold leading-tight">{insumo.nombre}</h2>
        </div>
        <button
          type="button"
          onClick={() => seleccionar(null)}
          aria-label="Cerrar"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-crema-100 text-xl text-cafe-700 hover:bg-crema-200"
        >
          ×
        </button>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 flex items-center justify-between rounded-xl bg-crema-50 p-3">
          <div>
            <p className="text-xs text-cafe-500">Stock actual</p>
            <p className="text-2xl font-bold">{formatoCantidad(insumo.stock, insumo.unidad)}</p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: COLOR_NIVEL[nivel] }}
          >
            {NOMBRE_NIVEL[nivel]}
          </span>
        </div>
        <Dato titulo="Mínimo" valor={formatoCantidad(insumo.stock_minimo, insumo.unidad)} />
        <Dato titulo="Valor en bodega" valor={formatoMXN(valorDe(insumo))} />
        <Dato titulo="Costo unitario" valor={`${formatoMXN(insumo.costo_unitario)} / ${insumo.unidad}`} />
        <Dato titulo="Proveedor" valor={insumo.proveedor ?? '—'} />
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-3 rounded-xl border border-crema-200 p-3">
        <div role="radiogroup" aria-label="Tipo de movimiento" className="grid grid-cols-4 gap-1 rounded-xl bg-crema-100 p-1">
          {TIPOS.map((t) => (
            <button
              key={t.tipo}
              type="button"
              role="radio"
              aria-checked={tipo === t.tipo}
              onClick={() => {
                setTipo(t.tipo)
                setMensaje(null)
              }}
              className={`min-h-11 rounded-lg px-1 text-sm font-semibold transition ${
                tipo === t.tipo ? 'bg-cafe-700 text-crema-50 shadow' : 'text-cafe-700 hover:bg-crema-200'
              }`}
            >
              {t.etiqueta}
            </button>
          ))}
        </div>
        <p className="text-xs text-cafe-500">{actual.ayuda}</p>

        <label className="flex flex-col gap-1 text-sm font-medium">
          {tipo === 'ajuste' ? 'Conteo real' : 'Cantidad'} ({insumo.unidad})
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cambiarCantidad(-paso)}
              aria-label="Menos"
              className="grid size-11 place-items-center rounded-lg bg-crema-100 text-xl hover:bg-crema-200"
            >
              −
            </button>
            <input
              inputMode="decimal"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0"
              className="min-h-11 w-full rounded-lg border border-crema-200 px-3 text-center text-lg font-semibold outline-none focus:border-cafe-500"
            />
            <button
              type="button"
              onClick={() => cambiarCantidad(paso)}
              aria-label="Más"
              className="grid size-11 place-items-center rounded-lg bg-crema-100 text-xl hover:bg-crema-200"
            >
              +
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Nota (opcional)
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder={tipo === 'merma' ? 'Ej. caducó' : 'Ej. pedido del lunes'}
            className="min-h-11 rounded-lg border border-crema-200 px-3 outline-none focus:border-cafe-500"
          />
        </label>

        {mensaje && (
          <p
            role="status"
            className={`rounded-lg px-3 py-2 text-sm ${mensaje.ok ? 'bg-ok/15 text-ok' : 'bg-critico/10 text-critico'}`}
          >
            {mensaje.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={guardando || cantidad.trim() === ''}
          className="min-h-12 rounded-xl bg-granada font-semibold text-white transition hover:bg-granada-oscuro active:scale-[0.98] disabled:opacity-40"
        >
          {actual.boton}
        </button>
      </form>
    </section>
  )
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-crema-50 p-3">
      <p className="text-xs text-cafe-500">{titulo}</p>
      <p className="font-semibold">{valor}</p>
    </div>
  )
}
