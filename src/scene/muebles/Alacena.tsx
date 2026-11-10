import { useBodega } from '@/store/useBodega'
import { Bloque, CuerpoHueco, Etiqueta, MuebleInteractivo, Puerta, Repisas } from '../piezas'
import { soloClic } from '../interaccion'
import { COLORES, nivelesZona } from '../constantes'

type Vec3 = [number, number, number]

const ANCHO = 1.2
const ALTO = 1.8
const FONDO = 0.5
const G = 0.035

/** Superficies de cada lado: izquierda Polvos, derecha Leches */
const NIVELES_ALACENA = nivelesZona(G, ALTO - G, 4)

/** Alacena de madera con dos puertas: izquierda Polvos, derecha Leches. */
export function Alacena({ position }: { position: Vec3 }) {
  const zona = useBodega((s) => s.zonaActiva)
  const alternarZona = useBodega((s) => s.alternarZona)
  const alternarMueble = useBodega((s) => s.alternarMueble)
  const mitad = ANCHO / 2
  const anchoRepisa = mitad - G - 0.02
  const xRepisa = (mitad - G / 2) / 2 + G / 4

  return (
    <MuebleInteractivo position={position} onClick={soloClic(() => alternarMueble('alacena'))}>
      <CuerpoHueco
        ancho={ANCHO}
        alto={ALTO}
        fondo={FONDO}
        grosor={G}
        color={COLORES.madera}
        colorInterior={COLORES.maderaInterior}
      />
      {/* Divisor vertical al centro */}
      <Bloque tam={[0.03, ALTO - 2 * G, FONDO - G]} position={[0, ALTO / 2, G / 2]} color={COLORES.madera} />
      {/* Cornisa */}
      <Bloque tam={[ANCHO + 0.06, 0.04, FONDO + 0.04]} position={[0, ALTO + 0.02, 0.01]} color={COLORES.maderaOscura} />

      <Repisas
        ancho={anchoRepisa}
        fondo={FONDO - G - 0.03}
        alturas={NIVELES_ALACENA.slice(1)}
        color={COLORES.madera}
        x={-xRepisa}
      />
      <Repisas
        ancho={anchoRepisa}
        fondo={FONDO - G - 0.03}
        alturas={NIVELES_ALACENA.slice(1)}
        color={COLORES.madera}
        x={xRepisa}
      />

      <Puerta
        bisagra="izquierda"
        jaladera="perilla"
        ancho={mitad - 0.005}
        alto={ALTO - 0.02}
        color={COLORES.madera}
        colorJaladera="#3b2418"
        position={[-mitad, 0.01, FONDO / 2]}
        abierta={zona === 'polvos'}
        onClick={soloClic(() => alternarZona('polvos'))}
      />
      <Puerta
        bisagra="derecha"
        jaladera="perilla"
        ancho={mitad - 0.005}
        alto={ALTO - 0.02}
        color={COLORES.madera}
        colorJaladera="#3b2418"
        position={[mitad, 0.01, FONDO / 2]}
        abierta={zona === 'leches'}
        onClick={soloClic(() => alternarZona('leches'))}
      />

      <Etiqueta mueble="alacena" y={ALTO + 0.32} />
    </MuebleInteractivo>
  )
}
