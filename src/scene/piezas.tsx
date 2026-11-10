import { Billboard, Text } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { Suspense } from 'react'
import nunitoUrl from '@fontsource/nunito/files/nunito-latin-800-normal.woff?url'
import { COLORES } from './constantes'

type Vec3 = [number, number, number]

// ─── Bloque: caja sólida con sombras ────────────────────────────────────────

type BloqueProps = Omit<ThreeElements['mesh'], 'args'> & {
  tam: Vec3
  color: string
  transparente?: number
}

export function Bloque({ tam, color, transparente, ...props }: BloqueProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={tam} />
      <meshStandardMaterial
        color={color}
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
  /** 0 = cerrada. En radianes; la Fase 3 lo anima. */
  angulo?: number
  colorJaladera?: string
  jaladera?: 'barra' | 'perilla'
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
  angulo = 0,
  colorJaladera = COLORES.metal,
  jaladera = 'barra',
}: PuertaProps) {
  const dir = bisagra === 'izquierda' ? 1 : -1
  const rotY = bisagra === 'izquierda' ? -angulo : angulo
  const xJaladera = dir * (ancho - 0.07)

  return (
    <group position={position} rotation={[0, rotY, 0]}>
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

export function Etiqueta({ texto, y }: { texto: string; y: number }) {
  // Suspense propio: mientras carga la fuente, el mueble ya se ve.
  return (
    <Suspense fallback={null}>
      <Billboard position={[0, y, 0]}>
      <Text
        font={nunitoUrl}
        fontSize={0.17}
        color={COLORES.etiqueta}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#fbf6ef"
      >
        {texto}
      </Text>
      </Billboard>
    </Suspense>
  )
}
