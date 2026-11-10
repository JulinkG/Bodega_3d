import { Html, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type { Group } from 'three'
import { MUEBLES } from '@/data/catalogo'
import { formatoCantidad } from '@/lib/formato'
import { COLOR_NIVEL, nivelDe } from '@/lib/inventario'
import { useBodega } from '@/store/useBodega'
import { useInventario } from '@/store/useInventario'
import type { InsumoConStock, MuebleId, ZonaId } from '@/types'
import { DIM, HUECOS } from './constantes'
import { formaDe, type Forma } from './formas'
import { soloClic } from './interaccion'

type Vec3 = [number, number, number]

const TAPA = '#3b2418'
const MAX_LADO = 0.12

interface Lugar {
  insumo: InsumoConStock
  posicion: Vec3
  /** Lado de la "huella" del objeto. */
  lado: number
}

/**
 * Acomoda los insumos de una zona en sus niveles: se reparten parejo entre
 * niveles y, si no caben en una fila, en filas hacia el fondo.
 */
function acomodar(zona: ZonaId, mueble: MuebleId, insumos: InsumoConStock[]): Lugar[] {
  const h = HUECOS[zona]
  const d = DIM[mueble]
  const fondoUtil = d.fondo - 2 * d.grosor - 0.06
  const porNivel = Math.ceil(insumos.length / h.niveles.length)
  const filas = porNivel > 12 ? 3 : porNivel > 5 ? 2 : 1
  const columnas = Math.ceil(porNivel / filas)
  const pasoX = (h.ancho - 0.02) / columnas
  const pasoZ = fondoUtil / filas
  const lado = Math.min(MAX_LADO, pasoX * 0.82, pasoZ * 0.82)

  return insumos.map((insumo, i) => {
    const nivel = Math.floor(i / porNivel)
    const k = i % porNivel
    const fila = Math.floor(k / columnas) // 0 = enfrente
    const col = k % columnas
    // Niveles de arriba hacia abajo, para que lo primero de la lista quede a la vista.
    const y = h.niveles[h.niveles.length - 1 - nivel] + 0.011
    const x = h.x - (h.ancho - 0.02) / 2 + pasoX * (col + 0.5)
    const z = fondoUtil / 2 - pasoZ * (fila + 0.5) + d.grosor / 2 - 0.02
    return { insumo, posicion: [x, y, z], lado }
  })
}

// ─── Formas ─────────────────────────────────────────────────────────────────

function Material({ color, brillo }: { color: string; brillo: number }) {
  // El brillo usa el mismo color para que el seleccionado no se vea deslavado.
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={brillo} roughness={0.55} />
}

function Objeto({ forma, s, color, brillo }: { forma: Forma; s: number; color: string; brillo: number }) {
  switch (forma) {
    case 'botella':
      return (
        <group>
          <mesh castShadow position={[0, s * 1.05, 0]}>
            <cylinderGeometry args={[s * 0.32, s * 0.34, s * 2.1, 12]} />
            <Material color={color} brillo={brillo} />
          </mesh>
          <mesh castShadow position={[0, s * 2.35, 0]}>
            <cylinderGeometry args={[s * 0.13, s * 0.18, s * 0.5, 10]} />
            <meshStandardMaterial color={TAPA} />
          </mesh>
        </group>
      )
    case 'frasco':
      return (
        <group>
          <mesh castShadow position={[0, s * 0.6, 0]}>
            <cylinderGeometry args={[s * 0.4, s * 0.4, s * 1.2, 14]} />
            <Material color={color} brillo={brillo} />
          </mesh>
          <mesh castShadow position={[0, s * 1.27, 0]}>
            <cylinderGeometry args={[s * 0.42, s * 0.42, s * 0.16, 14]} />
            <meshStandardMaterial color={TAPA} />
          </mesh>
        </group>
      )
    case 'caja':
      return (
        <mesh castShadow position={[0, s * 0.95, 0]}>
          <boxGeometry args={[s * 0.68, s * 1.9, s * 0.68]} />
          <Material color={color} brillo={brillo} />
        </mesh>
      )
    case 'bloque':
      return (
        <mesh castShadow position={[0, s * 0.25, 0]}>
          <boxGeometry args={[s * 0.9, s * 0.5, s * 0.7]} />
          <Material color={color} brillo={brillo} />
        </mesh>
      )
    case 'bolsa':
      return (
        <mesh castShadow position={[0, s * 0.6, 0]} rotation={[0.12, 0.2, 0]}>
          <boxGeometry args={[s * 0.85, s * 1.2, s * 0.5]} />
          <Material color={color} brillo={brillo} />
        </mesh>
      )
    case 'fruta':
      return (
        <group>
          <mesh castShadow position={[0, s * 0.4, 0]}>
            <sphereGeometry args={[s * 0.42, 14, 10]} />
            <Material color={color} brillo={brillo} />
          </mesh>
          <mesh position={[0, s * 0.86, 0]}>
            <cylinderGeometry args={[s * 0.04, s * 0.04, s * 0.14, 6]} />
            <meshStandardMaterial color={TAPA} />
          </mesh>
        </group>
      )
    case 'charola':
      return (
        <mesh castShadow position={[0, s * 0.17, 0]}>
          <boxGeometry args={[s * 0.95, s * 0.34, s * 0.8]} />
          <Material color={color} brillo={brillo} />
        </mesh>
      )
    case 'pila':
      return (
        <mesh castShadow position={[0, s * 1.0, 0]}>
          <cylinderGeometry args={[s * 0.44, s * 0.32, s * 2.0, 14]} />
          <Material color={color} brillo={brillo} />
        </mesh>
      )
    case 'paquete':
      return (
        <mesh castShadow position={[0, s * 0.45, 0]}>
          <boxGeometry args={[s * 0.9, s * 0.9, s * 0.6]} />
          <Material color={color} brillo={brillo} />
        </mesh>
      )
  }
}

// ─── Un insumo ──────────────────────────────────────────────────────────────

function ObjetoInsumo({ lugar, zonaAbierta }: { lugar: Lugar; zonaAbierta: boolean }) {
  const { insumo, posicion, lado } = lugar
  const seleccionado = useInventario((s) => s.seleccionado === insumo.id)
  const seleccionar = useInventario((s) => s.seleccionar)
  const abrirZona = useBodega((s) => s.abrirZona)
  const [encima, setEncima] = useState(false)
  const grupo = useRef<Group>(null)
  useCursor(encima)

  const nivel = nivelDe(insumo)
  const forma = formaDe(insumo.nombre, insumo.zona_id)

  // El seleccionado "respira" un poco para que se encuentre en la repisa.
  useFrame(({ clock }) => {
    if (!grupo.current) return
    const escala = seleccionado ? 1.08 + Math.sin(clock.elapsedTime * 4) * 0.04 : encima ? 1.06 : 1
    grupo.current.scale.setScalar(escala)
  })

  return (
    <group
      ref={grupo}
      position={posicion}
      onClick={soloClic(() => {
        if (!zonaAbierta) abrirZona(insumo.zona_id)
        seleccionar(insumo.id)
      })}
      onPointerOver={(e) => {
        e.stopPropagation()
        setEncima(true)
      }}
      onPointerOut={() => setEncima(false)}
    >
      <Objeto forma={forma} s={lado} color={COLOR_NIVEL[nivel]} brillo={seleccionado ? 0.45 : encima ? 0.25 : 0} />
      {(encima || seleccionado) && (
        <Html position={[0, lado * 2.9, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-cafe-900 shadow-md">
            {insumo.nombre} · {formatoCantidad(insumo.stock, insumo.unidad)}
          </div>
        </Html>
      )}
    </group>
  )
}

/** Todos los insumos de un mueble, acomodados en sus zonas. */
export function Insumos({ mueble }: { mueble: MuebleId }) {
  const insumos = useInventario((s) => s.insumos)
  const zonaActiva = useBodega((s) => s.zonaActiva)

  const lugares = useMemo(
    () =>
      MUEBLES[mueble].zonas.flatMap((zona) =>
        acomodar(
          zona,
          mueble,
          insumos.filter((i) => i.zona_id === zona && i.activo),
        ),
      ),
    [insumos, mueble],
  )

  return (
    <group>
      {lugares.map((l) => (
        <ObjetoInsumo key={l.insumo.id} lugar={l} zonaAbierta={zonaActiva === l.insumo.zona_id} />
      ))}
    </group>
  )
}
