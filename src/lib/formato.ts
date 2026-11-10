const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const numero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
const fecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

export const formatoMXN = (valor: number) => mxn.format(valor)
export const formatoNumero = (valor: number) => numero.format(valor)
export const formatoFecha = (iso: string) => fecha.format(new Date(iso))

const PLURAL: Partial<Record<string, string>> = {
  botella: 'botellas',
  paquete: 'paquetes',
  caja: 'cajas',
}

/** "12 L", "3 botellas", "1 paquete", "250 pz". */
export function formatoCantidad(valor: number, unidad: string): string {
  const u = valor === 1 ? unidad : (PLURAL[unidad] ?? unidad)
  return `${numero.format(valor)} ${u}`
}
