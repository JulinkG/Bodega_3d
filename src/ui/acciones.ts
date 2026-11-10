import { useBodega } from '@/store/useBodega'
import { useInventario } from '@/store/useInventario'
import type { InsumoConStock } from '@/types'

/** Desde el panel 2D: abre el mueble del insumo, enfoca su zona y muestra su ficha. */
export function abrirInsumo(insumo: InsumoConStock) {
  if (useBodega.getState().zonaActiva !== insumo.zona_id) useBodega.getState().abrirZona(insumo.zona_id)
  useInventario.getState().seleccionar(insumo.id)
}

/** "Vista general" también cierra la ficha del insumo. */
export function irAVistaGeneral() {
  useInventario.getState().seleccionar(null)
  useBodega.getState().vistaGeneral()
}
