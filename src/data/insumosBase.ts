import type { ZonaId } from '@/types'

// Insumos reales de Relato Café por zona. La Fase 4 los usa para los datos
// de prueba (agregando unidad, mínimo, costo y proveedor) y la Fase 6 para
// cargarlos a Supabase.

export const INSUMOS_BASE: Record<ZonaId, string[]> = {
  cafe_polvos: [
    'Café en grano',
    'Nescafé',
    'Matcha orgánico',
    'Chai',
    'Cacao en polvo',
    'Chocomio',
    'Chocolate',
    'Canela',
    'Jengibre molido',
    'Horchata',
    'Jamaica',
  ],
  lacteos: ['Leche entera', 'Crema para batir', 'Crema batida', 'Crema', 'Mantequilla', 'Mozzarella', 'Queso fresco'],
  jarabes: [
    'Caramelo Chobani',
    'Chocolate blanco Chobani',
    'Pumpkin spice Chobani',
    'Jarabe pink lemon',
    'Chocolate líquido',
    'Vainilla',
    'Miel',
    'Cajeta',
    'Lechera',
    'Nutella',
    'Mermelada de fresa',
  ],
  toppings: ['Azúcar', 'Chispitas de chocolate', 'Cacao nibs', 'Oreo', 'Galletas'],
  frutas: ['Fresas', 'Plátano', 'Kiwi', 'Mango', 'Maracuyá'],
  jugos: [
    'Agua tónica',
    'Agua mineral',
    'Limonada orgánica',
    'Jugo de uva blanca',
    'Jugo de naranja',
    'Mix jugo verde',
    'Piña colada',
  ],
  congelados: ['Hielo', 'Moras congeladas', 'Helado de vainilla', 'Palomitas de pollo', 'Masa hojaldre'],
  proteinas: ['Pechuga de pollo', 'Milanesa de pulpa negra de res', 'Jamón', 'Pepperoni', 'Huevos'],
  panaderia: ['Baguette', 'Pan brioche', 'Tortilla'],
  verduras: ['Ensalada italiana', 'Cebolla morada', 'Ajo', 'Cilantro', 'Perejil'],
  salsas: ['Mayonesa', 'Salsa césar', 'Chipotle', 'Salsa roja', 'Salsa verde', 'Salsa búfalo', 'Salsa de tomate'],
  abarrotes: ['Aceite de oliva', 'Vinagre de manzana', 'Sal', 'Orégano'],
  desechables_bebidas: ['Vaso 14 oz con tapa', 'Vaso 16 oz frío', 'Vaso 16 oz frappé', 'Vaso 1 oz'],
  desechables_comida: ['Vasos de postre', 'Bowl grande', 'Bowl pequeño', 'Tenedores', 'Papel encerado'],
  empaque: ['Bolsa de papel', 'Bolsa transparente', 'Bolsa #1', 'Hilo', 'Etiquetas'],
}
