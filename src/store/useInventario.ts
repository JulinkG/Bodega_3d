import { create } from 'zustand'
import { crearInsumosDePrueba } from '@/data/mock'
import { aplicarMovimiento } from '@/lib/inventario'
import type { InsumoConStock, Movimiento, TipoMovimiento } from '@/types'

export interface NuevoMovimiento {
  insumoId: string
  tipo: TipoMovimiento
  cantidad: number
  nota?: string
}

export type Resultado = { ok: true } | { ok: false; error: string }

interface EstadoInventario {
  insumos: InsumoConStock[]
  /** Movimientos registrados en esta sesión (en la Fase 6 vendrán de Supabase). */
  movimientos: Movimiento[]
  /** Insumo abierto en el panel lateral. */
  seleccionado: string | null

  seleccionar: (id: string | null) => void
  /** Async a propósito: en la Fase 6 escribirá en Supabase con la misma firma. */
  registrarMovimiento: (m: NuevoMovimiento) => Promise<Resultado>
}

let siguienteId = 1

export const useInventario = create<EstadoInventario>()((set, get) => ({
  insumos: crearInsumosDePrueba(),
  movimientos: [],
  seleccionado: null,

  seleccionar: (id) => set({ seleccionado: id }),

  registrarMovimiento: async ({ insumoId, tipo, cantidad, nota }) => {
    const insumo = get().insumos.find((i) => i.id === insumoId)
    if (!insumo) return { ok: false, error: 'No encontré ese insumo.' }
    if (!Number.isFinite(cantidad) || cantidad < 0 || (tipo !== 'ajuste' && cantidad === 0)) {
      return { ok: false, error: 'Escribe una cantidad mayor a cero.' }
    }
    if ((tipo === 'salida' || tipo === 'merma') && cantidad > insumo.stock) {
      return {
        ok: false,
        error: `Solo hay ${insumo.stock} ${insumo.unidad}. Si el conteo real es otro, usa "Ajuste".`,
      }
    }

    const movimiento: Movimiento = {
      id: siguienteId++,
      insumo_id: insumoId,
      tipo,
      cantidad,
      nota: nota?.trim() || null,
      usuario: null,
      usuario_email: null,
      creado_en: new Date().toISOString(),
    }
    set((s) => ({
      movimientos: [movimiento, ...s.movimientos],
      insumos: s.insumos.map((i) =>
        i.id === insumoId ? { ...i, stock: +aplicarMovimiento(i.stock, tipo, cantidad).toFixed(3) } : i,
      ),
    }))
    return { ok: true }
  },
}))
