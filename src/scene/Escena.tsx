import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { Cocina, Iluminacion } from './Cocina'
import { COLORES, lugarMueble } from './constantes'
import { ControlCamara } from './ControlCamara'
import { Alacena } from './muebles/Alacena'
import { Congelador } from './muebles/Congelador'
import { Refrigerador } from './muebles/Refrigerador'
import { Repisa } from './muebles/Repisa'

export default function Escena() {
  // En pantallas chicas se apagan las sombras para que vaya fluido.
  const sombras = useMemo(() => !window.matchMedia('(max-width: 640px)').matches, [])

  return (
    <Canvas
      // 'percentage' = PCFShadowMap (three r18x ya no tiene PCFSoftShadowMap)
      shadows={sombras ? 'percentage' : false}
      dpr={[1, 1.5]}
      camera={{ fov: 45, near: 0.1, far: 50, position: [0, 3, 8] }}
      className="touch-none"
      aria-label="Cocina de Relato Café en 3D"
    >
      <color attach="background" args={[COLORES.fondo]} />

      <Iluminacion sombras={sombras} />
      <Cocina />

      <Refrigerador position={lugarMueble('refrigerador')} />
      <Congelador position={lugarMueble('congelador')} />
      <Alacena position={lugarMueble('alacena')} />
      <Repisa position={lugarMueble('repisa')} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={1}
        maxDistance={16}
        // No ver por debajo del piso ni desde arriba del todo
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.08}
        // No rodear la pared por detrás
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
      <ControlCamara />
    </Canvas>
  )
}
