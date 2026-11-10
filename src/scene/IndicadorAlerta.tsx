import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import nunitoUrl from '@fontsource/nunito/files/nunito-latin-800-normal.woff?url'
import { Suspense, useMemo, useRef } from 'react'
import type { Group } from 'three'
import { ZONAS } from '@/data/catalogo'
import { COLOR_NIVEL, nivelDe } from '@/lib/inventario'
import { useBodega } from '@/store/useBodega'
import { useInventario } from '@/store/useInventario'
import type { MuebleId } from '@/types'
import { DIM } from './constantes'

/**
 * Globito rojo en la esquina superior del mueble con cuántos insumos están
 * bajo el mínimo. Se ve aunque el mueble esté cerrado.
 */
export function IndicadorAlerta({ mueble }: { mueble: MuebleId }) {
  const insumos = useInventario((s) => s.insumos)
  const criticos = useMemo(
    () => insumos.filter((i) => ZONAS[i.zona_id].mueble === mueble && nivelDe(i) === 'critico').length,
    [insumos, mueble],
  )
  // Con el mueble abierto, la cámara está muy cerca: el globito estorbaría.
  const abierto = useBodega((s) => s.muebleActivo === mueble)
  const grupo = useRef<Group>(null)
  const d = DIM[mueble]

  useFrame(({ clock }) => {
    if (grupo.current) grupo.current.position.y = d.alto + 0.14 + Math.sin(clock.elapsedTime * 2.5) * 0.025
  })

  if (criticos === 0 || abierto) return null

  return (
    <group ref={grupo} position={[d.ancho / 2 - 0.02, d.alto + 0.14, d.fondo / 2]}>
      <Billboard>
        <mesh>
          <circleGeometry args={[0.1, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <circleGeometry args={[0.085, 24]} />
          <meshBasicMaterial color={COLOR_NIVEL.critico} />
        </mesh>
        <Suspense fallback={null}>
          <Text font={nunitoUrl} fontSize={0.11} color="#ffffff" position={[0, 0.004, 0.002]} anchorX="center" anchorY="middle">
            {String(criticos)}
          </Text>
        </Suspense>
      </Billboard>
    </group>
  )
}
