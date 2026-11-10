// Tipos del dominio. Reflejan las tablas de supabase/schema.sql.

export type MuebleId = 'refrigerador' | 'congelador' | 'alacena' | 'repisa'

export type ZonaId =
  // Refrigerador (puerta izquierda, de arriba a abajo)
  | 'jarabes'
  | 'lacteos'
  | 'salsas'
  | 'jugos'
  // Refrigerador (puerta derecha, de arriba a abajo)
  | 'frutas'
  | 'verduras'
  | 'proteinas'
  // Congelador
  | 'congelados'
  // Alacena (puerta izquierda / derecha, arriba y abajo)
  | 'cafe_polvos'
  | 'toppings'
  | 'panaderia'
  | 'abarrotes'
  // Repisa abierta
  | 'desechables_bebidas'
  | 'desechables_comida'
  | 'empaque'

export type Unidad = 'pz' | 'kg' | 'g' | 'L' | 'ml' | 'botella' | 'paquete' | 'caja'

export type TipoMovimiento = 'entrada' | 'salida' | 'merma' | 'ajuste'

/** Nivel de stock que define el color del insumo en la escena. */
export type NivelStock = 'ok' | 'bajo' | 'critico'

export interface Zona {
  id: ZonaId
  nombre: string
  mueble: MuebleId
}

export interface Insumo {
  id: string
  nombre: string
  zona_id: ZonaId
  unidad: Unidad
  stock_minimo: number
  costo_unitario: number
  proveedor: string | null
  activo: boolean
}

/** Fila de la vista stock_actual: el insumo más su stock calculado. */
export interface InsumoConStock extends Insumo {
  stock: number
}

export interface Movimiento {
  id: number
  insumo_id: string
  tipo: TipoMovimiento
  /** En 'ajuste' es el conteo físico real, no una diferencia. */
  cantidad: number
  nota: string | null
  usuario: string | null
  creado_en: string
}
