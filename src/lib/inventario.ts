import { ZONAS } from '@/data/catalogo'
import type { InsumoConStock, MuebleId, NivelStock, TipoMovimiento, Unidad } from '@/types'

/** Umbral para "ámbar": por debajo de 1.5 × mínimo. */
export const FACTOR_BAJO = 1.5
/** La lista de compras rellena hasta 2 × mínimo. */
export const FACTOR_OBJETIVO = 2

export function nivelDeStock(stock: number, minimo: number): NivelStock {
  if (stock < minimo) return 'critico'
  if (stock < minimo * FACTOR_BAJO) return 'bajo'
  return 'ok'
}

export const nivelDe = (i: InsumoConStock) => nivelDeStock(i.stock, i.stock_minimo)

/** Cuánto hay que comprar para llegar a 2 × mínimo (0 si no hace falta). */
export function cantidadPorComprar(stock: number, minimo: number): number {
  return Math.max(0, minimo * FACTOR_OBJETIVO - stock)
}

/** Colores compartidos entre la escena 3D y el panel 2D. */
export const COLOR_NIVEL: Record<NivelStock, string> = {
  ok: '#4f9d5d',
  bajo: '#e0a030',
  critico: '#d64541',
}

export const NOMBRE_NIVEL: Record<NivelStock, string> = {
  ok: 'Suficiente',
  bajo: 'Se está acabando',
  critico: 'Bajo el mínimo',
}

/** Unidades que se cuentan en piezas enteras. */
const UNIDADES_ENTERAS: Unidad[] = ['pz', 'botella', 'paquete', 'caja']

export const esUnidadEntera = (u: Unidad) => UNIDADES_ENTERAS.includes(u)

/** Redondea hacia arriba a una cantidad que se pueda pedir. */
export function redondearCompra(cantidad: number, unidad: Unidad): number {
  if (cantidad <= 0) return 0
  if (esUnidadEntera(unidad)) return Math.ceil(cantidad)
  if (unidad === 'g' || unidad === 'ml') return Math.ceil(cantidad / 50) * 50
  return Math.ceil(cantidad * 2) / 2 // kg y L de medio en medio
}

export const valorDe = (i: InsumoConStock) => Math.max(0, i.stock) * i.costo_unitario

// ─── Alertas ────────────────────────────────────────────────────────────────

/** Insumos en rojo y luego en ámbar, de lo más urgente a lo menos. */
export function alertas(insumos: InsumoConStock[]): InsumoConStock[] {
  const orden: Record<NivelStock, number> = { critico: 0, bajo: 1, ok: 2 }
  return insumos
    .filter((i) => nivelDe(i) !== 'ok')
    .sort(
      (a, b) =>
        orden[nivelDe(a)] - orden[nivelDe(b)] ||
        a.stock / (a.stock_minimo || 1) - b.stock / (b.stock_minimo || 1),
    )
}

// ─── Lista de compras ───────────────────────────────────────────────────────

export interface RenglonCompra {
  insumo: InsumoConStock
  cantidad: number
  costo: number
}

export interface GrupoCompra {
  proveedor: string
  renglones: RenglonCompra[]
  total: number
}

/**
 * Lo que hay que pedir: insumos en rojo o ámbar, la cantidad para llegar a
 * 2 × mínimo, agrupados por proveedor.
 */
export function listaDeCompras(insumos: InsumoConStock[]): GrupoCompra[] {
  const grupos = new Map<string, GrupoCompra>()
  for (const insumo of alertas(insumos)) {
    const cantidad = redondearCompra(cantidadPorComprar(insumo.stock, insumo.stock_minimo), insumo.unidad)
    if (cantidad <= 0) continue
    const proveedor = insumo.proveedor || 'Sin proveedor'
    const grupo = grupos.get(proveedor) ?? { proveedor, renglones: [], total: 0 }
    const costo = cantidad * insumo.costo_unitario
    grupo.renglones.push({ insumo, cantidad, costo })
    grupo.total += costo
    grupos.set(proveedor, grupo)
  }
  return [...grupos.values()].sort((a, b) => b.total - a.total)
}

// ─── Valor del inventario ───────────────────────────────────────────────────

export function valorPorMueble(insumos: InsumoConStock[]): Record<MuebleId, number> {
  const valor: Record<MuebleId, number> = { refrigerador: 0, congelador: 0, alacena: 0, repisa: 0 }
  for (const i of insumos) valor[ZONAS[i.zona_id].mueble] += valorDe(i)
  return valor
}

// ─── Movimientos ────────────────────────────────────────────────────────────

/** Stock después de aplicar un movimiento (misma lógica que la vista SQL). */
export function aplicarMovimiento(stock: number, tipo: TipoMovimiento, cantidad: number): number {
  switch (tipo) {
    case 'entrada':
      return stock + cantidad
    case 'salida':
    case 'merma':
      return stock - cantidad
    case 'ajuste':
      return cantidad
  }
}
