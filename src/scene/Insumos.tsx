import { Html, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type { Group, MeshStandardMaterial } from 'three'
import { MUEBLES } from '@/data/catalogo'
import { formatoCantidad } from '@/lib/formato'
import { COLOR_NIVEL, nivelDe } from '@/lib/inventario'
import { useBodega } from '@/store/useBodega'
import { useInventario } from '@/store/useInventario'
import type { InsumoConStock, MuebleId, NivelStock, ZonaId } from '@/types'
import { DIM, HUECOS } from './constantes'
import { ModeloInsumo } from './modelos'
import { soloClic } from './interaccion'

type Vec3 = [number, number, number]

const MAX_LADO = 0.2
/** Alto del modelo más alto, en múltiplos del lado (botellas con bomba). */
const ALTO_MODELO = 2.6

interface Lugar {
  insumo: InsumoConStock
  posicion: Vec3
  /** Lado de la "huella" del objeto. */
  lado: number
}

/**
 * Acomoda los insumos de una zona en sus niveles: se reparten parejo entre
 * niveles y se elige cuántas filas (hacia el fondo) dan los objetos más
 * grandes que todavía quepan a lo alto del nivel.
 */
function acomodar(zona: ZonaId, mueble: MuebleId, insumos: InsumoConStock[]): Lugar[] {
  const h = HUECOS[zona]
  const d = DIM[mueble]
  const fondoUtil = d.fondo - 2 * d.grosor - 0.06
  const porNivel = Math.max(1, Math.ceil(insumos.length / h.niveles.length))
  const altoNivel = (h.niveles[1] ?? h.techo) - h.niveles[0]
  const topeAlto = (altoNivel - 0.03) / ALTO_MODELO

  let mejor = { filas: 1, columnas: porNivel, lado: 0 }
  for (let filas = 1; filas <= 3; filas++) {
    const columnas = Math.ceil(porNivel / filas)
    const lado = Math.min(MAX_LADO, topeAlto, ((h.ancho - 0.02) / columnas) * 0.86, (fondoUtil / filas) * 0.8)
    if (lado > mejor.lado + 0.004) mejor = { filas, columnas, lado }
  }
  const { filas, columnas, lado } = mejor
  const pasoX = (h.ancho - 0.02) / columnas
  const pasoZ = fondoUtil / filas

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

// ─── Base de color: el nivel de stock ──────────────────────────────────────

/**
 * Posavasos de color debajo del producto: verde, ámbar o rojo según el stock.
 * Los rojos laten para llamar la atención; el seleccionado lleva un aro blanco.
 */
function BaseNivel({ s, nivel, seleccionado, encima }: { s: number; nivel: NivelStock; seleccionado: boolean; encima: boolean }) {
  const material = useRef<MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (!material.current) return
    const latido = nivel === 'critico' ? 0.35 + Math.sin(clock.elapsedTime * 4) * 0.3 : 0.15
    material.current.emissiveIntensity = latido + (encima || seleccionado ? 0.3 : 0)
  })
  return (
    <group>
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[s * 0.58, s * 0.6, 0.012, 24]} />
        <meshStandardMaterial ref={material} color={COLOR_NIVEL[nivel]} emissive={COLOR_NIVEL[nivel]} roughness={0.5} />
      </mesh>
      {seleccionado && (
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[s * 0.62, s * 0.72, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  )
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
      <BaseNivel s={lado} nivel={nivel} seleccionado={seleccionado} encima={encima} />
      <group position={[0, 0.012, 0]}>
        <ModeloInsumo nombre={insumo.nombre} s={lado} />
      </group>
      {(encima || seleccionado) && (
        <Html position={[0, lado * 2.9, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-cafe-900 shadow-md">
            <span
              className="mr-1.5 inline-block size-2 rounded-full align-middle"
              style={{ backgroundColor: COLOR_NIVEL[nivel] }}
            />
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
