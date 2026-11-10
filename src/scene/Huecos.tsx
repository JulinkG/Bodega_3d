import { MUEBLES } from '@/data/catalogo'
import { useBodega } from '@/store/useBodega'
import type { MuebleId } from '@/types'
import { DIM, HUECOS } from './constantes'
import { soloClic } from './interaccion'

const sinRaycast = () => null

/**
 * Un volumen por zona dentro del mueble: permite tocar directo el nivel que
 * quieres ver y resalta con un brillo suave la zona abierta. Las puertas
 * cerradas quedan delante y reciben el clic primero. Con la zona ya abierta,
 * el clic pasa a los insumos.
 */
export function Huecos({ mueble }: { mueble: MuebleId }) {
  const zonaActiva = useBodega((s) => s.zonaActiva)
  const abrirZona = useBodega((s) => s.abrirZona)
  const d = DIM[mueble]
  const fondo = d.fondo - d.grosor - 0.04

  return (
    <group position={[0, 0, d.grosor / 2]}>
      {MUEBLES[mueble].zonas.map((zona) => {
        const h = HUECOS[zona]
        const base = h.niveles[0] + 0.012
        const alto = h.techo - base - 0.012
        const activa = zonaActiva === zona
        return (
          <mesh
            key={zona}
            position={[h.x, base + alto / 2, 0]}
            onClick={soloClic(() => abrirZona(zona))}
            // Con la zona abierta el volumen deja pasar los clics a los insumos.
            raycast={activa ? sinRaycast : undefined}
          >
            <boxGeometry args={[h.ancho - 0.01, alto, fondo]} />
            <meshBasicMaterial
              color="#ffd79a"
              transparent
              opacity={activa ? 0.18 : 0}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}
