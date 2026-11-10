import { MUEBLES } from '@/data/catalogo'
import type { MuebleId, ZonaId } from '@/types'

// Medidas en metros. La pared de fondo está en z = PARED_Z y los muebles
// se recargan en ella. Este archivo es la única fuente de la geometría:
// los muebles, la cámara y (en la Fase 4) los insumos leen de aquí.

type Vec3 = [number, number, number]

export const PARED_Z = -0.6

/** Paleta low-poly de la cocina. */
export const COLORES = {
  pisoClaro: '#d9b98c',
  pisoOscuro: '#cfac7c',
  pared: '#8e2433', // granada
  paredLateral: '#7c1f2d',
  zoclo: '#4f1219',
  fondo: '#5e1620',
  electro: '#eef0f1',
  electroInterior: '#dfe6ea',
  metal: '#9aa3a8',
  metalOscuro: '#3a3f42',
  vidrio: '#cfe6ef',
  congeladorInterior: '#d6ebf2',
  madera: '#a8733f',
  maderaOscura: '#875a2f',
  maderaInterior: '#c99a66',
  maderaClara: '#c8995f',
  etiqueta: '#4e2f1f',
} as const

// ─── Muebles ────────────────────────────────────────────────────────────────

export interface Dimensiones {
  ancho: number
  alto: number
  fondo: number
  /** Grosor de las paredes del mueble. */
  grosor: number
}

export const DIM: Record<MuebleId, Dimensiones> = {
  refrigerador: { ancho: 1.3, alto: 2.0, fondo: 0.75, grosor: 0.04 },
  congelador: { ancho: 1.2, alto: 0.85, fondo: 0.7, grosor: 0.05 },
  alacena: { ancho: 1.2, alto: 1.8, fondo: 0.5, grosor: 0.035 },
  repisa: { ancho: 1.0, alto: 1.6, fondo: 0.45, grosor: 0.03 },
}

/** Posición (x) de cada mueble en la fila, de izquierda a derecha. */
const POSICION_X: Record<MuebleId, number> = {
  refrigerador: -2.15,
  congelador: -0.7,
  alacena: 0.85,
  repisa: 2.3,
}

/** Posición de un mueble: en su lugar de la fila y recargado en la pared. */
export function lugarMueble(id: MuebleId): Vec3 {
  return [POSICION_X[id], 0, PARED_Z + DIM[id].fondo / 2 + 0.03]
}

/**
 * Divide un espacio (de `desde` a `hasta`) en `n` niveles iguales y devuelve
 * la altura de la superficie de cada nivel, de abajo hacia arriba.
 */
export function nivelesZona(desde: number, hasta: number, n: number): number[] {
  const paso = (hasta - desde) / n
  return Array.from({ length: n }, (_, i) => +(desde + paso * i).toFixed(3))
}

// ─── Huecos: el espacio de cada zona dentro de su mueble ───────────────────

/** Espacio interior de una zona, relativo al mueble. */
export interface Hueco {
  /** Centro en x del hueco. */
  x: number
  ancho: number
  /** Superficies donde se apoyan los insumos (de abajo hacia arriba). */
  niveles: number[]
  /** Altura del techo del hueco. */
  techo: number
  /** Puerta que hay que abrir para verlo. */
  puerta: 'izquierda' | 'derecha' | 'tapa' | 'ninguna'
}

/** Mitades de un mueble con divisor vertical al centro. */
function mitad(d: Dimensiones, lado: 'izquierda' | 'derecha', divisor: number) {
  const interior = d.ancho / 2 - d.grosor - divisor / 2
  const x = (divisor / 2 + interior / 2) * (lado === 'izquierda' ? -1 : 1)
  return { x, ancho: interior }
}

/** Reparte zonas (de arriba a abajo) en los niveles de una columna. */
function columna(
  zonasArribaAbajo: ZonaId[],
  niveles: number[],
  techo: number,
  base: Omit<Hueco, 'niveles' | 'techo'>,
  nivelesPorZona = 1,
): Partial<Record<ZonaId, Hueco>> {
  const resultado: Partial<Record<ZonaId, Hueco>> = {}
  const n = zonasArribaAbajo.length
  zonasArribaAbajo.forEach((zona, i) => {
    const desde = (n - 1 - i) * nivelesPorZona
    const propios = niveles.slice(desde, desde + nivelesPorZona)
    const techoZona = niveles[desde + nivelesPorZona] ?? techo
    resultado[zona] = { ...base, niveles: propios, techo: techoZona }
  })
  return resultado
}

export const DIVISOR = 0.03

const R = DIM.refrigerador
const A = DIM.alacena
const C = DIM.congelador
const P = DIM.repisa

/** Altura de la base con rejilla del refrigerador (el gabinete va encima). */
export const BASE_REFRI = 0.08

/** Niveles del refrigerador: 4 a la izquierda, 3 a la derecha. */
export const NIVELES_REFRI = {
  izquierda: nivelesZona(BASE_REFRI + R.grosor, R.alto - R.grosor, 4),
  derecha: nivelesZona(BASE_REFRI + R.grosor, R.alto - R.grosor, 3),
}
export const NIVELES_ALACENA = nivelesZona(A.grosor, A.alto - A.grosor, 4)
/** La repisa abierta: 3 niveles con espacio libre arriba de cada uno. */
export const NIVELES_REPISA = nivelesZona(0.08, P.alto - 0.1, 3)

export const HUECOS: Record<ZonaId, Hueco> = {
  ...columna(['jarabes', 'lacteos', 'salsas', 'jugos'], NIVELES_REFRI.izquierda, R.alto - R.grosor, {
    ...mitad(R, 'izquierda', DIVISOR),
    puerta: 'izquierda',
  }),
  ...columna(['frutas', 'verduras', 'proteinas'], NIVELES_REFRI.derecha, R.alto - R.grosor, {
    ...mitad(R, 'derecha', DIVISOR),
    puerta: 'derecha',
  }),
  congelados: { x: 0, ancho: C.ancho - 2 * C.grosor, niveles: [0.06 + C.grosor], techo: C.alto, puerta: 'tapa' },
  ...columna(
    ['cafe_polvos', 'toppings'],
    NIVELES_ALACENA,
    A.alto - A.grosor,
    { ...mitad(A, 'izquierda', DIVISOR), puerta: 'izquierda' },
    2,
  ),
  ...columna(
    ['panaderia', 'abarrotes'],
    NIVELES_ALACENA,
    A.alto - A.grosor,
    { ...mitad(A, 'derecha', DIVISOR), puerta: 'derecha' },
    2,
  ),
  ...columna(['desechables_bebidas', 'desechables_comida', 'empaque'], NIVELES_REPISA, P.alto, {
    x: 0,
    ancho: P.ancho - 2 * P.grosor,
    puerta: 'ninguna',
  }),
} as Record<ZonaId, Hueco>

/** Zonas que quedan detrás de cada puerta de un mueble. */
export function zonasDePuerta(mueble: MuebleId, puerta: Hueco['puerta']): ZonaId[] {
  return MUEBLES[mueble].zonas.filter((z) => HUECOS[z].puerta === puerta)
}

// ─── Cámara ─────────────────────────────────────────────────────────────────

/** Encuadre de cámara: a dónde mira, desde qué dirección y qué debe caber. */
export interface Encuadre {
  objetivo: Vec3
  direccion: Vec3
  anchoVisible: number
  altoVisible: number
}

/** Vista general: toda la cocina, con el logo y los gráficos de la pared. */
export const VISTA_GENERAL: Encuadre = {
  objetivo: [0, 1.55, 0],
  // Desde el frente y un poco arriba.
  direccion: [0, 0.28, 1],
  anchoVisible: 6.6,
  altoVisible: 3.5,
}

/** Dirección desde la que se mira cada mueble al abrir una zona. */
const DIRECCION: Record<MuebleId, (h: Hueco) => Vec3> = {
  refrigerador: (h) => [Math.sign(h.x) * 0.2, 0.2, 1],
  congelador: () => [0, 1.1, 1],
  alacena: (h) => [Math.sign(h.x) * 0.15, 0.2, 1],
  repisa: () => [0, 0.15, 1],
}

/** Encuadre de una zona, calculado a partir de su hueco. */
export function encuadreZona(zona: ZonaId, mueble: MuebleId): Encuadre {
  const h = HUECOS[zona]
  const [mx, , mz] = lugarMueble(mueble)
  const base = h.niveles[0]
  const alto = h.techo - base
  return {
    objetivo: [mx + h.x, base + alto / 2, mz],
    direccion: DIRECCION[mueble](h),
    anchoVisible: Math.max(h.ancho + 0.9, 1.4),
    altoVisible: Math.max(alto + 0.45, 0.9),
  }
}
