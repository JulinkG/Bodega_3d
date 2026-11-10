import { MUEBLES } from '@/data/catalogo'
import { Bloque, CuerpoHueco, Etiqueta } from '../piezas'
import { COLORES } from '../constantes'

type Vec3 = [number, number, number]

const ANCHO = 1.2
const ALTO = 0.85
const FONDO = 0.7
const G = 0.05
const TAPA = 0.07

/** Congelador horizontal tipo cofre. La tapa gira hacia arriba desde atrás. */
export function Congelador({ position, anguloTapa = 0 }: { position: Vec3; anguloTapa?: number }) {
  return (
    <group position={position}>
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
      <group position={[0, ALTO, -FONDO / 2]} rotation={[-anguloTapa, 0, 0]}>
        <Bloque tam={[ANCHO, TAPA, FONDO]} position={[0, TAPA / 2, FONDO / 2]} color={COLORES.electro} />
        <Bloque
          tam={[0.32, 0.035, 0.035]}
          position={[0, TAPA / 2, FONDO + 0.017]}
          color={COLORES.metal}
        />
      </group>

      <Etiqueta texto={MUEBLES.congelador.nombre} y={ALTO + 0.45} />
    </group>
  )
}
