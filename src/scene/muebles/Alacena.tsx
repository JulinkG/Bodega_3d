import { useBodega } from '@/store/useBodega'
import { COLORES, DIM, DIVISOR, NIVELES_ALACENA, zonasDePuerta } from '../constantes'
import { Huecos } from '../Huecos'
import { soloClic } from '../interaccion'
import { Bloque, CuerpoHueco, Etiqueta, MuebleInteractivo, Puerta, Repisas } from '../piezas'

type Vec3 = [number, number, number]

const { ancho: ANCHO, alto: ALTO, fondo: FONDO, grosor: G } = DIM.alacena
const ZONAS_IZQ = zonasDePuerta('alacena', 'izquierda')
const ZONAS_DER = zonasDePuerta('alacena', 'derecha')

/**
 * Alacena de madera con dos puertas y 4 niveles por lado.
 * Izquierda: café y polvos (arriba), toppings (abajo).
 * Derecha: panadería (arriba), abarrotes (abajo).
 */
export function Alacena({ position }: { position: Vec3 }) {
  const zona = useBodega((s) => s.zonaActiva)
  const alternarPuerta = useBodega((s) => s.alternarPuerta)
  const alternarMueble = useBodega((s) => s.alternarMueble)
  const mitad = ANCHO / 2
  const anchoRepisa = mitad - G - DIVISOR / 2 - 0.01
  const xRepisa = DIVISOR / 2 + anchoRepisa / 2 + 0.005

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
      <Bloque tam={[DIVISOR, ALTO - 2 * G, FONDO - G]} position={[0, ALTO / 2, G / 2]} color={COLORES.madera} />
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
      <Huecos mueble="alacena" />

      <Puerta
        bisagra="izquierda"
        jaladera="perilla"
        ancho={mitad - 0.005}
        alto={ALTO - 0.02}
        color={COLORES.madera}
        colorJaladera="#3b2418"
        position={[-mitad, 0.01, FONDO / 2]}
        abierta={!!zona && ZONAS_IZQ.includes(zona)}
        onClick={soloClic(() => alternarPuerta(ZONAS_IZQ))}
      />
      <Puerta
        bisagra="derecha"
        jaladera="perilla"
        ancho={mitad - 0.005}
        alto={ALTO - 0.02}
        color={COLORES.madera}
        colorJaladera="#3b2418"
        position={[mitad, 0.01, FONDO / 2]}
        abierta={!!zona && ZONAS_DER.includes(zona)}
        onClick={soloClic(() => alternarPuerta(ZONAS_DER))}
      />

      <Etiqueta mueble="alacena" y={ALTO + 0.32} />
    </MuebleInteractivo>
  )
}
