import { useBodega } from '@/store/useBodega'
import { Bloque, CuerpoHueco, Etiqueta, MuebleInteractivo, Puerta, Repisas } from '../piezas'
import { soloClic } from '../interaccion'
import { COLORES, nivelesZona } from '../constantes'

type Vec3 = [number, number, number]

const ANCHO = 0.8
const ALTO = 1.9
const FONDO = 0.7
const G = 0.04
/** Altura del entrepaño que separa Jarabes (arriba) de Verduras (abajo). */
const DIVISION = 1.0

/** Superficies donde se acomodan los insumos de cada zona  */
const NIVELES_REFRIGERADOR = {
  jarabes: nivelesZona(DIVISION + G / 2, ALTO - G, 3),
  verduras: nivelesZona(G, DIVISION - G / 2, 3),
}

/** Refrigerador alto de dos zonas, cada una con su puerta y 3 niveles. */
export function Refrigerador({ position }: { position: Vec3 }) {
  const zona = useBodega((s) => s.zonaActiva)
  const alternarZona = useBodega((s) => s.alternarZona)
  const alternarMueble = useBodega((s) => s.alternarMueble)
  const anchoInterior = ANCHO - 2 * G - 0.01
  const fondoRepisa = FONDO - G - 0.06

  return (
    <MuebleInteractivo position={position} onClick={soloClic(() => alternarMueble('refrigerador'))}>
      <CuerpoHueco
        ancho={ANCHO}
        alto={ALTO}
        fondo={FONDO}
        grosor={G}
        color={COLORES.electro}
        colorInterior={COLORES.electroInterior}
      />
      {/* Entrepaño divisor */}
      <Bloque tam={[anchoInterior, G, FONDO - G]} position={[0, DIVISION, G / 2]} color={COLORES.electro} />

      {/* Repisas de vidrio (el piso de cada zona ya es el primer nivel) */}
      <group position={[0, 0, -0.01]}>
        <Repisas
          ancho={anchoInterior}
          fondo={fondoRepisa}
          alturas={NIVELES_REFRIGERADOR.jarabes.slice(1)}
          color={COLORES.vidrio}
          transparente={0.55}
        />
        <Repisas
          ancho={anchoInterior}
          fondo={fondoRepisa}
          alturas={NIVELES_REFRIGERADOR.verduras.slice(1)}
          color={COLORES.vidrio}
          transparente={0.55}
        />
      </group>

      {/* Puertas: bisagra a la derecha, jaladera a la izquierda */}
      <Puerta
        bisagra="derecha"
        ancho={ANCHO}
        alto={ALTO - DIVISION - 0.01}
        color={COLORES.electro}
        position={[ANCHO / 2, DIVISION + 0.005, FONDO / 2]}
        abierta={zona === 'jarabes'}
        onClick={soloClic(() => alternarZona('jarabes'))}
      />
      <Puerta
        bisagra="derecha"
        ancho={ANCHO}
        alto={DIVISION - 0.015}
        color={COLORES.electro}
        position={[ANCHO / 2, 0.005, FONDO / 2]}
        abierta={zona === 'verduras'}
        onClick={soloClic(() => alternarZona('verduras'))}
      />

      <Etiqueta mueble="refrigerador" y={ALTO + 0.3} />
    </MuebleInteractivo>
  )
}
