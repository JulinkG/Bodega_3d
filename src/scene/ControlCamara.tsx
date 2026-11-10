import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useEffect, useRef } from 'react'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { ZONAS } from '@/data/catalogo'
import { useBodega } from '@/store/useBodega'
import { encuadreZona, VISTA_GENERAL, type Encuadre } from './constantes'
import { SUAVIZADO } from './interaccion'

interface Destino {
  posicion: Vector3
  objetivo: Vector3
}

/** Calcula dónde poner la cámara para que el encuadre quepa en esta pantalla. */
function calcularDestino(e: Encuadre, camera: PerspectiveCamera, aspecto: number): Destino {
  const tanMitadFov = Math.tan(MathUtils.degToRad(camera.fov / 2))
  const distancia = Math.max(
    e.anchoVisible / 2 / (tanMitadFov * aspecto),
    e.altoVisible / 2 / tanMitadFov,
  )
  const objetivo = new Vector3(...e.objetivo)
  const dir = new Vector3(...e.direccion).normalize()
  return { objetivo, posicion: objetivo.clone().addScaledVector(dir, distancia) }
}

/**
 * Mueve la cámara con suavidad: a la zona abierta, o a la vista general.
 * Si la persona empieza a girar o hacer zoom, se suelta la animación.
 */
export function ControlCamara() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  // Redondeado para no recalcular con cada pixel de resize.
  const aspecto = useThree((s) => Math.round((s.size.width / s.size.height) * 10) / 10)
  const zona = useBodega((s) => s.zonaActiva)
  const solicitud = useBodega((s) => s.solicitudCamara)

  const destino = useRef<Destino | null>(null)
  const primeraVez = useRef(true)

  useEffect(() => {
    if (!controls) return
    const d = calcularDestino(zona ? encuadreZona(zona, ZONAS[zona].mueble) : VISTA_GENERAL, camera, aspecto)
    if (primeraVez.current) {
      // Al cargar, se coloca de golpe; las demás veces se anima.
      primeraVez.current = false
      camera.position.copy(d.posicion)
      controls.target.copy(d.objetivo)
      controls.update()
      return
    }
    destino.current = d
  }, [zona, solicitud, aspecto, camera, controls])

  useEffect(() => {
    if (!controls) return
    const soltar = () => {
      destino.current = null
    }
    controls.addEventListener('start', soltar)
    return () => controls.removeEventListener('start', soltar)
  }, [controls])

  useFrame((_, delta) => {
    const d = destino.current
    if (!d || !controls) return
    easing.damp3(camera.position, d.posicion, SUAVIZADO * 1.3, delta)
    easing.damp3(controls.target, d.objetivo, SUAVIZADO * 1.3, delta)
    controls.update()
    if (camera.position.distanceTo(d.posicion) < 0.005 && controls.target.distanceTo(d.objetivo) < 0.005) {
      destino.current = null
    }
  })

  return null
}
