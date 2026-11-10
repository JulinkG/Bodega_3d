import type { MuebleId, Zona, ZonaId } from '@/types'

// Catálogo fijo de muebles y zonas. Debe coincidir con el insert de
// supabase/schema.sql. Es la única fuente de verdad en el frontend.
// El orden de `zonas` es el orden en el panel lateral.

export const MUEBLES: Record<MuebleId, { nombre: string; zonas: ZonaId[] }> = {
  refrigerador: {
    nombre: 'Refrigerador',
    zonas: ['jarabes', 'lacteos', 'salsas', 'jugos', 'frutas', 'verduras', 'proteinas'],
  },
  congelador: { nombre: 'Congelador', zonas: ['congelados'] },
  alacena: { nombre: 'Alacena', zonas: ['cafe_polvos', 'toppings', 'panaderia', 'abarrotes'] },
  repisa: { nombre: 'Repisa', zonas: ['desechables_bebidas', 'desechables_comida', 'empaque'] },
}

const zona = (id: ZonaId, nombre: string, mueble: MuebleId): Zona => ({ id, nombre, mueble })

export const ZONAS: Record<ZonaId, Zona> = {
  jarabes: zona('jarabes', 'Jarabes y salsas dulces', 'refrigerador'),
  lacteos: zona('lacteos', 'Lácteos', 'refrigerador'),
  salsas: zona('salsas', 'Salsas y aderezos', 'refrigerador'),
  jugos: zona('jugos', 'Jugos y bebidas listas', 'refrigerador'),
  frutas: zona('frutas', 'Frutas frescas', 'refrigerador'),
  verduras: zona('verduras', 'Verduras y hierbas', 'refrigerador'),
  proteinas: zona('proteinas', 'Proteínas', 'refrigerador'),
  congelados: zona('congelados', 'Congelados', 'congelador'),
  cafe_polvos: zona('cafe_polvos', 'Café y polvos para bebidas', 'alacena'),
  toppings: zona('toppings', 'Toppings y endulzantes', 'alacena'),
  panaderia: zona('panaderia', 'Panadería', 'alacena'),
  abarrotes: zona('abarrotes', 'Abarrotes y condimentos', 'alacena'),
  desechables_bebidas: zona('desechables_bebidas', 'Desechables para bebidas', 'repisa'),
  desechables_comida: zona('desechables_comida', 'Desechables para comida', 'repisa'),
  empaque: zona('empaque', 'Empaque y etiquetado', 'repisa'),
}

export const ORDEN_MUEBLES: MuebleId[] = ['refrigerador', 'congelador', 'alacena', 'repisa']
