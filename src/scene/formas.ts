import type { ZonaId } from '@/types'

/** Objeto simple con el que se dibuja cada insumo en la repisa. */
export type Forma =
  | 'botella' // jarabes, salsas, jugos, aceite
  | 'frasco' // polvos, toppings, condimentos, latas
  | 'caja' // tetrapak de leche y jugo
  | 'bloque' // quesos y mantequilla
  | 'bolsa' // congelados, pan, café en grano
  | 'fruta' // frutas y verduras
  | 'charola' // proteínas
  | 'pila' // vasos y bowls apilados
  | 'paquete' // empaques, cajas de galletas

const POR_ZONA: Record<ZonaId, Forma> = {
  jarabes: 'botella',
  lacteos: 'caja',
  salsas: 'botella',
  jugos: 'botella',
  frutas: 'fruta',
  verduras: 'fruta',
  proteinas: 'charola',
  congelados: 'bolsa',
  cafe_polvos: 'frasco',
  toppings: 'frasco',
  panaderia: 'bolsa',
  abarrotes: 'frasco',
  desechables_bebidas: 'pila',
  desechables_comida: 'pila',
  empaque: 'paquete',
}

const POR_INSUMO: Record<string, Forma> = {
  'Café en grano': 'bolsa',
  Miel: 'frasco',
  Cajeta: 'frasco',
  Lechera: 'frasco',
  Nutella: 'frasco',
  'Mermelada de fresa': 'frasco',
  Mantequilla: 'bloque',
  Mozzarella: 'bloque',
  'Queso fresco': 'bloque',
  'Crema batida': 'botella',
  Chipotle: 'frasco',
  'Jugo de uva blanca': 'caja',
  'Jugo de naranja': 'caja',
  'Mix jugo verde': 'caja',
  'Piña colada': 'caja',
  'Helado de vainilla': 'caja',
  'Ensalada italiana': 'bolsa',
  Azúcar: 'bolsa',
  Oreo: 'paquete',
  Galletas: 'paquete',
  Tortilla: 'paquete',
  'Aceite de oliva': 'botella',
  'Vinagre de manzana': 'botella',
  Tenedores: 'paquete',
  'Papel encerado': 'paquete',
}

export function formaDe(nombre: string, zona: ZonaId): Forma {
  return POR_INSUMO[nombre] ?? POR_ZONA[zona]
}
