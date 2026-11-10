import type { InsumoConStock, Unidad, ZonaId } from '@/types'
import { INSUMOS_BASE } from './insumosBase'

// Datos de prueba (Fase 4). Los nombres salen de INSUMOS_BASE; aquí solo se
// agregan unidad, mínimo, costo, proveedor y un stock inicial con mezcla de
// niveles (verde, ámbar, rojo) para probar alertas y compras.
// En la Fase 6 se reemplazan por los datos de Supabase.

const P = {
  costco: 'Costco',
  abasto: 'Central de Abasto',
  cafe: 'Tostador de café',
  jarabes: 'Distribuidora de jarabes',
  desechables: 'Desechables mayoreo',
  panaderia: 'Panadería local',
} as const

/** [unidad, mínimo, costo unitario MXN, stock inicial, proveedor] */
type Detalle = [Unidad, number, number, number, string]

const DETALLES: Record<string, Detalle> = {
  // Café y polvos para bebidas
  'Café en grano': ['kg', 3, 380, 5, P.cafe],
  Nescafé: ['pz', 2, 210, 1, P.costco],
  'Matcha orgánico': ['paquete', 2, 450, 2, P.cafe],
  Chai: ['paquete', 2, 280, 4, P.cafe],
  'Cacao en polvo': ['kg', 1, 190, 2, P.costco],
  Chocomio: ['kg', 1, 160, 0.5, P.costco],
  Chocolate: ['kg', 1, 220, 1.8, P.costco],
  Canela: ['kg', 0.5, 300, 0.9, P.abasto],
  'Jengibre molido': ['kg', 0.25, 260, 0.3, P.abasto],
  Horchata: ['kg', 2, 95, 4, P.costco],
  Jamaica: ['kg', 1, 140, 2, P.abasto],
  // Lácteos
  'Leche entera': ['L', 24, 26, 30, P.costco],
  'Crema para batir': ['L', 2, 95, 3, P.costco],
  'Crema batida': ['pz', 3, 75, 2, P.costco],
  Crema: ['L', 2, 60, 4, P.costco],
  Mantequilla: ['kg', 1, 210, 2, P.costco],
  Mozzarella: ['kg', 2, 180, 3.5, P.costco],
  'Queso fresco': ['kg', 1, 150, 1.2, P.costco],
  // Jarabes y salsas dulces
  'Caramelo Chobani': ['botella', 2, 230, 3, P.jarabes],
  'Chocolate blanco Chobani': ['botella', 2, 230, 1, P.jarabes],
  'Pumpkin spice Chobani': ['botella', 1, 240, 2, P.jarabes],
  'Jarabe pink lemon': ['botella', 1, 210, 1, P.jarabes],
  'Chocolate líquido': ['botella', 2, 120, 4, P.costco],
  Vainilla: ['botella', 2, 210, 4, P.jarabes],
  Miel: ['botella', 1, 140, 2, P.costco],
  Cajeta: ['pz', 1, 85, 2, P.costco],
  Lechera: ['pz', 4, 32, 6, P.costco],
  Nutella: ['pz', 1, 160, 1, P.costco],
  'Mermelada de fresa': ['pz', 1, 70, 2, P.costco],
  // Toppings y endulzantes
  Azúcar: ['kg', 5, 28, 8, P.costco],
  'Chispitas de chocolate': ['kg', 0.5, 180, 1, P.costco],
  'Cacao nibs': ['kg', 0.25, 420, 0.2, P.cafe],
  Oreo: ['paquete', 3, 55, 5, P.costco],
  Galletas: ['paquete', 3, 45, 6, P.costco],
  // Frutas frescas
  Fresas: ['kg', 2, 70, 3, P.abasto],
  Plátano: ['kg', 2, 25, 1.5, P.abasto],
  Kiwi: ['kg', 1, 90, 2, P.abasto],
  Mango: ['kg', 2, 40, 4, P.abasto],
  Maracuyá: ['kg', 1, 80, 1.2, P.abasto],
  // Jugos y bebidas listas
  'Agua tónica': ['pz', 12, 18, 20, P.costco],
  'Agua mineral': ['pz', 24, 14, 30, P.costco],
  'Limonada orgánica': ['botella', 4, 65, 6, P.costco],
  'Jugo de uva blanca': ['L', 2, 55, 4, P.costco],
  'Jugo de naranja': ['L', 4, 40, 3, P.abasto],
  'Mix jugo verde': ['L', 2, 70, 3, P.costco],
  'Piña colada': ['L', 1, 90, 2, P.costco],
  // Congelados
  Hielo: ['paquete', 4, 35, 6, P.costco],
  'Moras congeladas': ['kg', 3, 95, 2, P.costco],
  'Helado de vainilla': ['L', 2, 120, 4, P.costco],
  'Palomitas de pollo': ['kg', 2, 160, 3, P.costco],
  'Masa hojaldre': ['kg', 1, 110, 2, P.costco],
  // Proteínas
  'Pechuga de pollo': ['kg', 3, 140, 5, P.costco],
  'Milanesa de pulpa negra de res': ['kg', 2, 230, 2.5, P.costco],
  Jamón: ['kg', 1, 160, 2, P.costco],
  Pepperoni: ['kg', 0.5, 280, 1, P.costco],
  Huevos: ['pz', 30, 3.5, 60, P.costco],
  // Panadería
  Baguette: ['pz', 6, 25, 8, P.panaderia],
  'Pan brioche': ['pz', 6, 30, 12, P.panaderia],
  Tortilla: ['paquete', 2, 40, 3, P.panaderia],
  // Verduras y hierbas
  'Ensalada italiana': ['paquete', 2, 45, 3, P.abasto],
  'Cebolla morada': ['kg', 1, 35, 2, P.abasto],
  Ajo: ['kg', 0.25, 120, 0.5, P.abasto],
  Cilantro: ['pz', 2, 10, 1, P.abasto],
  Perejil: ['pz', 2, 10, 3, P.abasto],
  // Salsas y aderezos
  Mayonesa: ['botella', 1, 90, 2, P.costco],
  'Salsa césar': ['botella', 1, 110, 1, P.costco],
  Chipotle: ['pz', 2, 35, 4, P.costco],
  'Salsa roja': ['botella', 1, 45, 3, P.costco],
  'Salsa verde': ['botella', 1, 45, 0, P.costco],
  'Salsa búfalo': ['botella', 1, 95, 2, P.costco],
  'Salsa de tomate': ['botella', 1, 55, 2, P.costco],
  // Abarrotes y condimentos
  'Aceite de oliva': ['botella', 1, 230, 2, P.costco],
  'Vinagre de manzana': ['botella', 1, 60, 2, P.costco],
  Sal: ['kg', 1, 20, 2, P.costco],
  Orégano: ['kg', 0.1, 400, 0.2, P.abasto],
  // Desechables para bebidas
  'Vaso 14 oz con tapa': ['pz', 200, 2.8, 350, P.desechables],
  'Vaso 16 oz frío': ['pz', 200, 2.5, 150, P.desechables],
  'Vaso 16 oz frappé': ['pz', 150, 3.2, 200, P.desechables],
  'Vaso 1 oz': ['pz', 100, 0.6, 300, P.desechables],
  // Desechables para comida
  'Vasos de postre': ['pz', 50, 2.2, 90, P.desechables],
  'Bowl grande': ['pz', 50, 4.5, 60, P.desechables],
  'Bowl pequeño': ['pz', 50, 3, 100, P.desechables],
  Tenedores: ['pz', 100, 0.5, 250, P.desechables],
  'Papel encerado': ['paquete', 1, 85, 2, P.desechables],
  // Empaque y etiquetado
  'Bolsa de papel': ['pz', 100, 1.5, 180, P.desechables],
  'Bolsa transparente': ['pz', 100, 0.8, 60, P.desechables],
  'Bolsa #1': ['pz', 100, 0.4, 200, P.desechables],
  Hilo: ['pz', 1, 60, 2, P.desechables],
  Etiquetas: ['pz', 1, 120, 1, P.desechables],
}

/** Convierte "Café en grano" en "cafe-en-grano" para usarlo como id estable. */
function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function crearInsumosDePrueba(): InsumoConStock[] {
  return (Object.entries(INSUMOS_BASE) as [ZonaId, string[]][]).flatMap(([zona, nombres]) =>
    nombres.map((nombre) => {
      const d = DETALLES[nombre] ?? (['pz', 1, 0, 0, P.costco] as Detalle)
      if (!DETALLES[nombre]) console.warn(`[mock] Falta el detalle de "${nombre}"`)
      const [unidad, stock_minimo, costo_unitario, stock, proveedor] = d
      return {
        id: slug(nombre),
        nombre,
        zona_id: zona,
        unidad,
        stock_minimo,
        costo_unitario,
        proveedor,
        activo: true,
        stock,
      }
    }),
  )
}
