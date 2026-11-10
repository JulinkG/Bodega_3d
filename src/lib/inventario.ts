import type { NivelStock } from '@/types'

/** Umbral para "ámbar": por debajo de 1.5 × mínimo. */
export const FACTOR_BAJO = 1.5
/** La lista de compras rellena hasta 2 × mínimo. */
export const FACTOR_OBJETIVO = 2

export function nivelDeStock(stock: number, minimo: number): NivelStock {
  if (stock < minimo) return 'critico'
  if (stock < minimo * FACTOR_BAJO) return 'bajo'
  return 'ok'
}

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
