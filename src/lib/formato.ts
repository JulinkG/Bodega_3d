const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const numero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
const fecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

export const formatoMXN = (valor: number) => mxn.format(valor)
export const formatoNumero = (valor: number) => numero.format(valor)
export const formatoFecha = (iso: string) => fecha.format(new Date(iso))
