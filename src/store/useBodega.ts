import { create } from 'zustand'
import { MUEBLES, ZONAS } from '@/data/catalogo'
import type { MuebleId, ZonaId } from '@/types'

interface EstadoBodega {
  /** Mueble abierto (solo uno a la vez). */
  muebleActivo: MuebleId | null
  /** Zona abierta dentro de ese mueble (puerta de arriba/abajo, izquierda/derecha). */
  zonaActiva: ZonaId | null
  /**
   * Contador que sube cada vez que se pide mover la cámara. Permite repetir
   * "Vista general" aunque ya no haya nada abierto.
   */
  solicitudCamara: number

  abrirZona: (zona: ZonaId) => void
  /** Abre la zona; si ya estaba abierta, la cierra. */
  alternarZona: (zona: ZonaId) => void
  /** Clic en el cuerpo del mueble: abre su primera zona o, si ya está abierto, lo cierra. */
  alternarMueble: (mueble: MuebleId) => void
  /** Clic en una puerta: si alguna de sus zonas está abierta la cierra; si no, abre la primera. */
  alternarPuerta: (zonas: ZonaId[]) => void
  /** Cierra todo y regresa la cámara a la vista general. */
  vistaGeneral: () => void
}

export const useBodega = create<EstadoBodega>()((set, get) => ({
  muebleActivo: null,
  zonaActiva: null,
  solicitudCamara: 0,

  abrirZona: (zona) =>
    set((s) => ({
      zonaActiva: zona,
      muebleActivo: ZONAS[zona].mueble,
      solicitudCamara: s.solicitudCamara + 1,
    })),

  alternarZona: (zona) => {
    if (get().zonaActiva === zona) get().vistaGeneral()
    else get().abrirZona(zona)
  },

  alternarMueble: (mueble) => {
    if (get().muebleActivo === mueble) get().vistaGeneral()
    else get().abrirZona(MUEBLES[mueble].zonas[0])
  },

  alternarPuerta: (zonas) => {
    const actual = get().zonaActiva
    if (actual && zonas.includes(actual)) get().vistaGeneral()
    else if (zonas[0]) get().abrirZona(zonas[0])
  },

  vistaGeneral: () =>
    set((s) => ({ muebleActivo: null, zonaActiva: null, solicitudCamara: s.solicitudCamara + 1 })),
}))
