import { useBodega } from '@/store/useBodega'
import { BASE_REFRI, COLORES, DIM, DIVISOR, NIVELES_REFRI, zonasDePuerta } from '../constantes'
import { Huecos } from '../Huecos'
import { soloClic } from '../interaccion'
import { Bloque, CuerpoHueco, Etiqueta, MuebleInteractivo, Puerta, Repisas } from '../piezas'

type Vec3 = [number, number, number]

const { ancho: ANCHO, alto: ALTO, fondo: FONDO, grosor: G } = DIM.refrigerador
const ZONAS_IZQ = zonasDePuerta('refrigerador', 'izquierda')
const ZONAS_DER = zonasDePuerta('refrigerador', 'derecha')

/**
 * Refrigerador comercial de dos puertas. Izquierda (arriba → abajo): jarabes,
 * lácteos, salsas, jugos. Derecha: frutas, verduras, proteínas.
 */
export function Refrigerador({ position }: { position: Vec3 }) {
  const zona = useBodega((s) => s.zonaActiva)
  const alternarPuerta = useBodega((s) => s.alternarPuerta)
  const alternarMueble = useBodega((s) => s.alternarMueble)

  const mitad = ANCHO / 2
  const altoCuerpo = ALTO - BASE_REFRI
  const anchoRepisa = mitad - G - DIVISOR / 2 - 0.01
  const xRepisa = DIVISOR / 2 + anchoRepisa / 2 + 0.005
  const fondoRepisa = FONDO - G - 0.06

  return (
    <MuebleInteractivo position={position} onClick={soloClic(() => alternarMueble('refrigerador'))}>
      {/* Base con rejilla */}
      <Bloque
        tam={[ANCHO - 0.02, BASE_REFRI, FONDO - 0.04]}
        position={[0, BASE_REFRI / 2, 0]}
        color={COLORES.metalOscuro}
      />
      <group position={[0, BASE_REFRI, 0]}>
        <CuerpoHueco
          ancho={ANCHO}
          alto={altoCuerpo}
          fondo={FONDO}
          grosor={G}
          color={COLORES.electro}
          colorInterior={COLORES.electroInterior}
        />
        {/* Divisor vertical */}
        <Bloque
          tam={[DIVISOR, altoCuerpo - 2 * G, FONDO - G]}
          position={[0, altoCuerpo / 2, G / 2]}
          color={COLORES.electroInterior}
        />
      </group>

      {/* Repisas de vidrio (el piso de cada columna ya es el primer nivel) */}
      <group position={[0, 0, -0.01]}>
        <Repisas
          ancho={anchoRepisa}
          fondo={fondoRepisa}
          alturas={NIVELES_REFRI.izquierda.slice(1)}
          color={COLORES.vidrio}
          transparente={0.55}
          x={-xRepisa}
        />
        <Repisas
          ancho={anchoRepisa}
          fondo={fondoRepisa}
          alturas={NIVELES_REFRI.derecha.slice(1)}
          color={COLORES.vidrio}
          transparente={0.55}
          x={xRepisa}
        />
      </group>
      <Huecos mueble="refrigerador" />

      {/* Puertas: jaladeras al centro */}
      <Puerta
        bisagra="izquierda"
        ancho={mitad - 0.005}
        alto={altoCuerpo - 0.01}
        color={COLORES.electro}
        position={[-mitad, BASE_REFRI + 0.005, FONDO / 2]}
        abierta={!!zona && ZONAS_IZQ.includes(zona)}
        onClick={soloClic(() => alternarPuerta(ZONAS_IZQ))}
      />
      <Puerta
        bisagra="derecha"
        ancho={mitad - 0.005}
        alto={altoCuerpo - 0.01}
        color={COLORES.electro}
        position={[mitad, BASE_REFRI + 0.005, FONDO / 2]}
        abierta={!!zona && ZONAS_DER.includes(zona)}
        onClick={soloClic(() => alternarPuerta(ZONAS_DER))}
      />

      <Etiqueta mueble="refrigerador" y={ALTO + 0.28} />
    </MuebleInteractivo>
  )
}
