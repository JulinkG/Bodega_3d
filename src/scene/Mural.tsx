import { useTexture } from '@react-three/drei'
import { Suspense } from 'react'
import type { Texture } from 'three'
import { PARED_Z } from './constantes'

// Logo y gráficos de Relato Café pegados en la pared granada.
// Las imágenes están en public/marca/ (PNG con fondo transparente).

const ARCHIVOS = {
  logo: '/marca/logo.png',
  vasoCaliente: '/marca/vaso-caliente.png',
  vasoFrio: '/marca/vaso-frio.png',
  huella: '/marca/huella.png',
} as const

type Grafico = keyof typeof ARCHIVOS

interface Pieza {
  grafico: Grafico
  x: number
  y: number
  /** Alto en metros; el ancho sale de la proporción de la imagen. */
  alto: number
  giro?: number
}

/** Composición de la pared, con huecos para las etiquetas de los muebles. */
const COMPOSICION: Pieza[] = [
  { grafico: 'logo', x: -0.7, y: 2.25, alto: 1.15 },
  { grafico: 'vasoCaliente', x: 0.85, y: 2.78, alto: 0.7, giro: 0.08 },
  { grafico: 'vasoFrio', x: 2.3, y: 2.55, alto: 0.8, giro: -0.06 },
  // Rastro de huellitas que sube del logo hacia el vaso
  { grafico: 'huella', x: 0.12, y: 2.45, alto: 0.15, giro: -0.7 },
  { grafico: 'huella', x: 0.27, y: 2.68, alto: 0.15, giro: -0.55 },
  { grafico: 'huella', x: 0.37, y: 2.93, alto: 0.15, giro: -0.75 },
  // Dos huellitas junto al refrigerador
  { grafico: 'huella', x: -3.15, y: 2.45, alto: 0.15, giro: 0.35 },
  { grafico: 'huella', x: -3.0, y: 2.7, alto: 0.15, giro: 0.2 },
]

function Calcomania({ textura, pieza, capa }: { textura: Texture; pieza: Pieza; capa: number }) {
  const img = textura.image as { width: number; height: number }
  const ancho = pieza.alto * (img.width / img.height)
  return (
    <mesh position={[pieza.x, pieza.y, PARED_Z + 0.004 + capa * 0.0005]} rotation={[0, 0, pieza.giro ?? 0]}>
      <planeGeometry args={[ancho, pieza.alto]} />
      <meshStandardMaterial map={textura} transparent alphaTest={0.05} roughness={0.95} />
    </mesh>
  )
}

function Calcomanias() {
  const texturas = useTexture(ARCHIVOS)
  return (
    <group>
      {COMPOSICION.map((p, i) => (
        <Calcomania key={i} textura={texturas[p.grafico]} pieza={p} capa={i} />
      ))}
    </group>
  )
}

export function Mural() {
  // Suspense propio: la cocina se ve aunque las imágenes tarden en cargar.
  return (
    <Suspense fallback={null}>
      <Calcomanias />
    </Suspense>
  )
}
