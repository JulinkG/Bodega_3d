import { useBodega } from '@/store/useBodega'
import { Bloque, CuerpoHueco, Etiqueta, MuebleInteractivo } from '../piezas'
import { soloClic } from '../interaccion'
import { COLORES } from '../constantes'

type Vec3 = [number, number, number]

const ANCHO = 0.6
const ALTO = 0.45
const FONDO = 0.45
const G = 0.015
const SOLAPA = 0.2

/** Caja de cartón abierta con las solapas dobladas hacia afuera. */
export function CajaCarton({ position }: { position: Vec3 }) {
  const alternarMueble = useBodega((s) => s.alternarMueble)
  return (
    <MuebleInteractivo position={position} onClick={soloClic(() => alternarMueble('caja'))}>
      <CuerpoHueco
        ancho={ANCHO}
        alto={ALTO}
        fondo={FONDO}
        grosor={G}
        color={COLORES.carton}
        colorInterior={COLORES.cartonOscuro}
        abierto="arriba"
      />
      {/* Cinta canela */}
      <Bloque tam={[0.08, ALTO * 0.5, 0.004]} position={[0, ALTO * 0.75, FONDO / 2 + 0.002]} color="#d9b57c" />

      {/* Solapas: cada grupo está en el borde superior y gira hacia afuera */}
      <group position={[0, ALTO, FONDO / 2]} rotation={[1.15, 0, 0]}>
        <Bloque tam={[ANCHO, SOLAPA, G]} position={[0, SOLAPA / 2, 0]} color={COLORES.carton} />
      </group>
      <group position={[0, ALTO, -FONDO / 2]} rotation={[-0.25, 0, 0]}>
        <Bloque tam={[ANCHO, SOLAPA, G]} position={[0, SOLAPA / 2, 0]} color={COLORES.carton} />
      </group>
      <group position={[-ANCHO / 2, ALTO, 0]} rotation={[0, 0, 0.95]}>
        <Bloque tam={[G, SOLAPA, FONDO]} position={[0, SOLAPA / 2, 0]} color={COLORES.cartonOscuro} />
      </group>
      <group position={[ANCHO / 2, ALTO, 0]} rotation={[0, 0, -0.95]}>
        <Bloque tam={[G, SOLAPA, FONDO]} position={[0, SOLAPA / 2, 0]} color={COLORES.cartonOscuro} />
      </group>

      <Etiqueta mueble="caja" y={ALTO + 0.42} />
    </MuebleInteractivo>
  )
}
