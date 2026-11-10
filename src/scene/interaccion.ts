import type { ThreeEvent } from '@react-three/fiber'
import { createContext, useContext } from 'react'

/** true dentro de un mueble que tiene el cursor encima: sus piezas brillan un poco. */
export const ResaltadoContext = createContext(false)
export const useResaltado = () => useContext(ResaltadoContext)

/** Brillo cálido que se suma al color de las piezas resaltadas. */
export const BRILLO = { color: '#ffcf8a', intensidad: 0.18 } as const

/** Duración aproximada de la animación de puertas y cámara (s). */
export const SUAVIZADO = 0.15 // smoothTime de maath: ~0.6 s hasta asentarse

/**
 * Convierte un manejador en uno que ignora "clics" que en realidad fueron
 * arrastres para girar la cámara (con mouse o con el dedo).
 */
export function soloClic(fn: () => void) {
  return (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.delta > 6) return
    fn()
  }
}
