import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef } from 'react'
import type { Group } from 'three'
import { useBodega } from '@/store/useBodega'
import { Bloque, CuerpoHueco, Etiqueta, MuebleInteractivo } from '../piezas'
import { COLORES, DIM } from '../constantes'
import { SUAVIZADO, soloClic } from '../interaccion'

type Vec3 = [number, number, number]

const { ancho: ANCHO, alto: ALTO, fondo: FONDO, grosor: G } = DIM.congelador
const TAPA = 0.07
const ANGULO_ABIERTA = 1.4

/** Congelador horizontal tipo cofre. La tapa gira hacia arriba desde atrás. */
export function Congelador({ position }: { position: Vec3 }) {
  const abierto = useBodega((s) => s.muebleActivo === 'congelador')
  const alternarMueble = useBodega((s) => s.alternarMueble)
  const tapaRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!tapaRef.current) return
    easing.damp(tapaRef.current.rotation, 'x', abierto ? -ANGULO_ABIERTA : 0, SUAVIZADO, delta)
  })

  return (
    <MuebleInteractivo position={position} onClick={soloClic(() => alternarMueble('congelador'))}>
      {/* Zócalo oscuro */}
      <Bloque tam={[ANCHO - 0.04, 0.06, FONDO - 0.04]} position={[0, 0.03, 0]} color="#5b6266" />
      <group position={[0, 0.06, 0]}>
        <CuerpoHueco
          ancho={ANCHO}
          alto={ALTO - 0.06}
          fondo={FONDO}
          grosor={G}
          color={COLORES.electro}
          colorInterior={COLORES.congeladorInterior}
          abierto="arriba"
        />
        {/* Franja decorativa */}
        <Bloque tam={[ANCHO - 0.1, 0.03, 0.006]} position={[0, ALTO - 0.22, FONDO / 2 + 0.003]} color="#7fb6c9" />
      </group>

      {/* Tapa: el grupo está en la bisagra (arriba, atrás) */}
      <group ref={tapaRef} position={[0, ALTO, -FONDO / 2]}>
        <Bloque tam={[ANCHO, TAPA, FONDO]} position={[0, TAPA / 2, FONDO / 2]} color={COLORES.electro} />
        <Bloque tam={[0.32, 0.035, 0.035]} position={[0, TAPA / 2, FONDO + 0.017]} color={COLORES.metal} />
      </group>

      <Etiqueta mueble="congelador" y={ALTO + 0.45} />
    </MuebleInteractivo>
  )
}
