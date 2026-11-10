import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { MuebleId } from '@/types'
import { Cocina, Iluminacion } from './Cocina'
import { COLORES, PARED_Z, POSICION_X, PROFUNDIDAD, VISTA_GENERAL } from './constantes'
import { Alacena } from './muebles/Alacena'
import { CajaCarton } from './muebles/CajaCarton'
import { Congelador } from './muebles/Congelador'
import { Refrigerador } from './muebles/Refrigerador'

/** Posición de un mueble: en su lugar de la fila y recargado en la pared. */
function lugar(id: MuebleId): [number, number, number] {
  return [POSICION_X[id], 0, PARED_Z + PROFUNDIDAD[id] / 2 + 0.03]
}

/** Distancia para que quepa todo el ancho de la cocina con este aspecto de pantalla. */
function distanciaVistaGeneral(camera: PerspectiveCamera, aspecto: number): number {
  const mitadFov = MathUtils.degToRad(camera.fov / 2)
  const porAncho = VISTA_GENERAL.anchoVisible / 2 / (Math.tan(mitadFov) * aspecto)
  const porAlto = VISTA_GENERAL.altoVisible / 2 / Math.tan(mitadFov)
  return Math.max(porAncho, porAlto)
}

/** Coloca la cámara en la vista general, ajustada al tamaño de la pantalla. */
function CamaraInicial() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  // Se redondea para no reposicionar la cámara con cada pixel de resize.
  const aspecto = useThree((s) => Math.round((s.size.width / s.size.height) * 10) / 10)

  useEffect(() => {
    const [x, y, z] = VISTA_GENERAL.objetivo
    const dir = new Vector3(...VISTA_GENERAL.direccion).normalize()
    const dist = distanciaVistaGeneral(camera, aspecto)
    camera.position.set(x, y, z).addScaledVector(dir, dist)
    if (controls) {
      controls.target.set(x, y, z)
      controls.update()
    } else {
      camera.lookAt(x, y, z)
    }
  }, [camera, controls, aspecto])

  return null
}

export default function Escena() {
  // En pantallas chicas se apagan las sombras para que vaya fluido.
  const sombras = useMemo(() => !window.matchMedia('(max-width: 640px)').matches, [])

  return (
    <Canvas
      shadows={sombras}
      dpr={[1, 1.5]}
      camera={{ fov: 45, near: 0.1, far: 50, position: [0, 3, 8] }}
      className="touch-none"
      aria-label="Cocina de Relato Café en 3D"
    >
      <color attach="background" args={[COLORES.pared]} />
      <fog attach="fog" args={[COLORES.pared, 14, 26]} />

      <Iluminacion sombras={sombras} />
      <Cocina />

      <Refrigerador position={lugar('refrigerador')} />
      <Congelador position={lugar('congelador')} />
      <Alacena position={lugar('alacena')} />
      <CajaCarton position={lugar('caja')} />

      <OrbitControls
        makeDefault
        target={[...VISTA_GENERAL.objetivo]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={16}
        // No ver por debajo del piso ni desde arriba del todo
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.08}
        // No rodear la pared por detrás
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
      <CamaraInicial />
    </Canvas>
  )
}
