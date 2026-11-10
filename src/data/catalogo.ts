import type { MuebleId, Zona, ZonaId } from '@/types'

// Catálogo fijo de muebles y zonas. Debe coincidir con el insert de
// supabase/schema.sql. Es la única fuente de verdad en el frontend.

export const MUEBLES: Record<MuebleId, { nombre: string; zonas: ZonaId[] }> = {
  refrigerador: { nombre: 'Refrigerador', zonas: ['jarabes', 'verduras'] },
  congelador: { nombre: 'Congelador', zonas: ['congelados'] },
  alacena: { nombre: 'Alacena', zonas: ['polvos', 'leches'] },
  caja: { nombre: 'Caja de cartón', zonas: ['desechables'] },
}

export const ZONAS: Record<ZonaId, Zona> = {
  jarabes: { id: 'jarabes', nombre: 'Jarabes', mueble: 'refrigerador' },
  verduras: { id: 'verduras', nombre: 'Verduras', mueble: 'refrigerador' },
  congelados: { id: 'congelados', nombre: 'Congelados', mueble: 'congelador' },
  polvos: { id: 'polvos', nombre: 'Polvos', mueble: 'alacena' },
  leches: { id: 'leches', nombre: 'Leches', mueble: 'alacena' },
  desechables: { id: 'desechables', nombre: 'Desechables', mueble: 'caja' },
}

export const ORDEN_MUEBLES: MuebleId[] = ['refrigerador', 'congelador', 'alacena', 'caja']
