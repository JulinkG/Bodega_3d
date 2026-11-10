import { useBodega } from '@/store/useBodega'
import { COLORES, DIM, NIVELES_REPISA } from '../constantes'
import { Huecos } from '../Huecos'
import { IndicadorAlerta } from '../IndicadorAlerta'
import { Insumos } from '../Insumos'
import { soloClic } from '../interaccion'
import { Bloque, Etiqueta, MuebleInteractivo } from '../piezas'

type Vec3 = [number, number, number]

const { ancho: ANCHO, alto: ALTO, fondo: FONDO, grosor: G } = DIM.repisa
const POSTE = 0.035
const TABLA = 0.03

/**
 * Repisa abierta (postes de metal y tablas de madera), sin puertas para que
 * se vea todo. De arriba a abajo: desechables para bebidas, para comida y
 * empaque y etiquetado.
 */
export function Repisa({ position }: { position: Vec3 }) {
  const alternarMueble = useBodega((s) => s.alternarMueble)
  const xPoste = ANCHO / 2 - POSTE / 2
  const zPoste = FONDO / 2 - POSTE / 2
  // Tablas: una en cada nivel y otra arriba como remate.
  const tablas = [...NIVELES_REPISA, ALTO]

  return (
    <MuebleInteractivo position={position} onClick={soloClic(() => alternarMueble('repisa'))}>
      {/* Cuatro postes */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Bloque
            key={`${sx}${sz}`}
            tam={[POSTE, ALTO, POSTE]}
            position={[sx * xPoste, ALTO / 2, sz * zPoste]}
            color={COLORES.metalOscuro}
          />
        )),
      )}
      {/* Tablas */}
      {tablas.map((y) => (
        <Bloque
          key={y}
          tam={[ANCHO - 0.01, TABLA, FONDO - 0.01]}
          position={[0, y - TABLA / 2, 0]}
          color={COLORES.maderaClara}
        />
      ))}
      {/* Travesaños traseros para que se lea como mueble */}
      {tablas.slice(0, -1).map((y) => (
        <Bloque
          key={`t${y}`}
          tam={[ANCHO - 2 * POSTE, 0.025, G / 2]}
          position={[0, y + 0.18, -FONDO / 2 + G / 4]}
          color={COLORES.metalOscuro}
        />
      ))}
      <Huecos mueble="repisa" />
      <Insumos mueble="repisa" />

      <Etiqueta mueble="repisa" y={ALTO + 0.3} />
      <IndicadorAlerta mueble="repisa" />
    </MuebleInteractivo>
  )
}
