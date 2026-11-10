import { Billboard, Text, useCursor } from '@react-three/drei'
import { useFrame, type ThreeElements, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import { Suspense, useRef, useState, type ReactNode } from 'react'
import type { Group } from 'three'
import nunitoUrl from '@fontsource/nunito/files/nunito-latin-800-normal.woff?url'
import { MUEBLES } from '@/data/catalogo'
import { useBodega } from '@/store/useBodega'
import type { MuebleId } from '@/types'
import { COLORES } from './constantes'
import { BRILLO, ResaltadoContext, SUAVIZADO, useResaltado } from './interaccion'

type Vec3 = [number, number, number]

// ─── Bloque: caja sólida con sombras ────────────────────────────────────────

type BloqueProps = Omit<ThreeElements['mesh'], 'args'> & {
  tam: Vec3
  color: string
  transparente?: number
}

export function Bloque({ tam, color, transparente, ...props }: BloqueProps) {
  const resaltado = useResaltado()
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={tam} />
      <meshStandardMaterial
        color={color}
        emissive={BRILLO.color}
        emissiveIntensity={resaltado ? BRILLO.intensidad : 0}
        roughness={0.75}
        transparent={transparente !== undefined}
        opacity={transparente ?? 1}
      />
    </mesh>
  )
}

// ─── Cuerpo hueco: gabinete con frente (o tapa) abierto ────────────────────

interface CuerpoHuecoProps {
  ancho: number
  alto: number
  fondo: number
  grosor?: number
  color: string
  colorInterior?: string
  /** Qué cara queda abierta: el frente (refrigerador, alacena) o arriba (congelador, caja). */
  abierto?: 'frente' | 'arriba'
}

/** Caja hueca, base en y = 0 y centrada en x/z. */
export function CuerpoHueco({
  ancho,
  alto,
  fondo,
  grosor = 0.04,
  color,
  colorInterior = color,
  abierto = 'frente',
}: CuerpoHuecoProps) {
  const g = grosor
  const conTecho = abierto === 'frente'
  const conFrente = abierto === 'arriba'

  return (
    <group>
      {/* Laterales */}
      <Bloque tam={[g, alto, fondo]} position={[-ancho / 2 + g / 2, alto / 2, 0]} color={color} />
      <Bloque tam={[g, alto, fondo]} position={[ancho / 2 - g / 2, alto / 2, 0]} color={color} />
      {/* Fondo (espalda) */}
      <Bloque
        tam={[ancho - 2 * g, alto, g]}
        position={[0, alto / 2, -fondo / 2 + g / 2]}
        color={colorInterior}
      />
      {/* Piso */}
      <Bloque tam={[ancho - 2 * g, g, fondo - g]} position={[0, g / 2, g / 2]} color={colorInterior} />
      {conTecho && (
        <Bloque
          tam={[ancho - 2 * g, g, fondo - g]}
          position={[0, alto - g / 2, g / 2]}
          color={color}
        />
      )}
      {conFrente && (
        <Bloque
          tam={[ancho - 2 * g, alto, g]}
          position={[0, alto / 2, fondo / 2 - g / 2]}
          color={color}
        />
      )}
    </group>
  )
}

// ─── Repisas ────────────────────────────────────────────────────────────────

interface RepisasProps {
  ancho: number
  fondo: number
  /** Alturas (y) de cada repisa. */
  alturas: number[]
  color: string
  transparente?: number
  x?: number
}

export function Repisas({ ancho, fondo, alturas, color, transparente, x = 0 }: RepisasProps) {
  return (
    <group>
      {alturas.map((y) => (
        <Bloque
          key={y}
          tam={[ancho, 0.02, fondo]}
          position={[x, y, 0]}
          color={color}
          transparente={transparente}
        />
      ))}
    </group>
  )
}

// ─── Puerta con bisagra ─────────────────────────────────────────────────────

interface PuertaProps {
  ancho: number
  alto: number
  grosor?: number
  color: string
  /** Lado de la bisagra, visto de frente. */
  bisagra: 'izquierda' | 'derecha'
  /** Posición de la bisagra (esquina inferior, cara frontal del mueble). */
  position: Vec3
  abierta?: boolean
  /** Cuánto gira al abrirse (radianes). */
  anguloAbierta?: number
  colorJaladera?: string
  jaladera?: 'barra' | 'perilla'
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

/**
 * Puerta que gira sobre una bisagra vertical. El grupo exterior está en la
 * bisagra, así la rotación en Y abre la puerta hacia el frente (+z).
 */
export function Puerta({
  ancho,
  alto,
  grosor = 0.04,
  color,
  bisagra,
  position,
  abierta = false,
  anguloAbierta = 1.9,
  colorJaladera = COLORES.metal,
  jaladera = 'barra',
  onClick,
}: PuertaProps) {
  const dir = bisagra === 'izquierda' ? 1 : -1
  const xJaladera = dir * (ancho - 0.07)
  const bisagraRef = useRef<Group>(null)

  // Gira hacia el ángulo objetivo con easing (sin saltos aunque se interrumpa).
  useFrame((_, delta) => {
    if (!bisagraRef.current) return
    const objetivo = abierta ? -dir * anguloAbierta : 0
    easing.damp(bisagraRef.current.rotation, 'y', objetivo, SUAVIZADO, delta)
  })

  return (
    <group ref={bisagraRef} position={position} onClick={onClick}>
      <Bloque tam={[ancho, alto, grosor]} position={[(dir * ancho) / 2, alto / 2, grosor / 2]} color={color} />
      {jaladera === 'barra' ? (
        <mesh castShadow position={[xJaladera, alto / 2, grosor + 0.03]}>
          <cylinderGeometry args={[0.012, 0.012, Math.min(0.45, alto * 0.5), 8]} />
          <meshStandardMaterial color={colorJaladera} metalness={0.6} roughness={0.35} />
        </mesh>
      ) : (
        <mesh castShadow position={[xJaladera + dir * 0.02, alto / 2, grosor + 0.015]}>
          <sphereGeometry args={[0.022, 10, 8]} />
          <meshStandardMaterial color={colorJaladera} metalness={0.4} roughness={0.4} />
        </mesh>
      )}
    </group>
  )
}

// ─── Etiqueta flotante ──────────────────────────────────────────────────────

/** Nombre del mueble flotando encima. Se oculta mientras hay un mueble abierto. */
export function Etiqueta({ mueble, y }: { mueble: MuebleId; y: number }) {
  const visible = useBodega((s) => s.muebleActivo === null)
  // Suspense propio: mientras carga la fuente, el mueble ya se ve.
  return (
    <Suspense fallback={null}>
      <Billboard position={[0, y, 0]} visible={visible}>
        <Text
          font={nunitoUrl}
          fontSize={0.17}
          color={COLORES.etiqueta}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#fbf6ef"
        >
          {MUEBLES[mueble].nombre}
        </Text>
      </Billboard>
    </Suspense>
  )
}

// ─── Mueble interactivo: hover (cursor + brillo) y clic ─────────────────────

interface MuebleInteractivoProps {
  position: Vec3
  onClick: (e: ThreeEvent<MouseEvent>) => void
  children: ReactNode
}

/** Envuelve un mueble: con el cursor encima brilla un poco y muestra la manita. */
export function MuebleInteractivo({ position, onClick, children }: MuebleInteractivoProps) {
  const [encima, setEncima] = useState(false)
  useCursor(encima)

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setEncima(true)
      }}
      onPointerOut={() => setEncima(false)}
    >
      <ResaltadoContext.Provider value={encima}>{children}</ResaltadoContext.Provider>
    </group>
  )
}
