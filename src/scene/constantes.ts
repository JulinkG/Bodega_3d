import type { MuebleId } from '@/types'

// Medidas en metros. La pared de fondo está en z = PARED_Z y los muebles
// se recargan en ella.

export const PARED_Z = -0.6

/** Paleta low-poly de la cocina. */
export const COLORES = {
  pisoClaro: '#d9b98c',
  pisoOscuro: '#cfac7c',
  pared: '#f8eee2',
  zoclo: '#b98f62',
  electro: '#eef0f1',
  electroInterior: '#dfe6ea',
  metal: '#9aa3a8',
  vidrio: '#cfe6ef',
  congeladorInterior: '#d6ebf2',
  madera: '#a8733f',
  maderaOscura: '#875a2f',
  maderaInterior: '#c99a66',
  carton: '#c79b68',
  cartonOscuro: '#a97d4e',
  etiqueta: '#4e2f1f',
} as const

/** Posición (x) de cada mueble en la fila, de izquierda a derecha. */
export const POSICION_X: Record<MuebleId, number> = {
  refrigerador: -2.3,
  congelador: -0.95,
  alacena: 0.8,
  caja: 2.4,
}

/** Profundidad de cada mueble, para recargarlo en la pared. */
export const PROFUNDIDAD: Record<MuebleId, number> = {
  refrigerador: 0.7,
  congelador: 0.7,
  alacena: 0.5,
  caja: 0.45,
}

type Vec3 = [number, number, number]

/** Vista general: a dónde mira la cámara y desde qué dirección. */
export const VISTA_GENERAL: {
  objetivo: Vec3
  direccion: Vec3
  anchoVisible: number
  altoVisible: number
} = {
  objetivo: [0.05, 1.1, 0],
  // Desde el frente y un poco arriba.
  direccion: [0, 0.38, 1],
  // Lo que debe caber en pantalla (metros): toda la fila de muebles y las etiquetas.
  anchoVisible: 6.4,
  altoVisible: 2.9,
}

/**
 * Divide una zona (de `desde` a `hasta`) en `n` niveles iguales y devuelve la
 * altura de la superficie de cada nivel. El primero es el piso de la zona; la
 * Fase 4 usa estas alturas para acomodar los insumos.
 */
export function nivelesZona(desde: number, hasta: number, n: number): number[] {
  const paso = (hasta - desde) / n
  return Array.from({ length: n }, (_, i) => +(desde + paso * i).toFixed(3))
}
