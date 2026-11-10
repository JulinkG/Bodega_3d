import { COLORES, PARED_Z } from './constantes'
import { Mural } from './Mural'
import { Bloque } from './piezas'

const ANCHO = 16
const FONDO = 18
const TABLON = 0.5

const ALTO_PARED = 6

/** Piso de tablones de madera clara, paredes granada con el mural de la marca. */
export function Cocina() {
  const tablones = Math.ceil(ANCHO / TABLON)

  return (
    <group>
      {/* Piso: tablones alternando dos tonos */}
      {Array.from({ length: tablones }, (_, i) => (
        <mesh
          key={i}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-ANCHO / 2 + TABLON * (i + 0.5), 0, PARED_Z + FONDO / 2]}
        >
          <planeGeometry args={[TABLON - 0.008, FONDO]} />
          <meshStandardMaterial color={i % 2 ? COLORES.pisoOscuro : COLORES.pisoClaro} roughness={0.9} />
        </mesh>
      ))}
      {/* Junta oscura entre tablones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, PARED_Z + FONDO / 2]}>
        <planeGeometry args={[ANCHO, FONDO]} />
        <meshStandardMaterial color={COLORES.zoclo} />
      </mesh>

      {/* Pared de fondo color granada */}
      <mesh receiveShadow position={[0, ALTO_PARED / 2, PARED_Z]}>
        <planeGeometry args={[ANCHO, ALTO_PARED]} />
        <meshStandardMaterial color={COLORES.pared} roughness={1} />
      </mesh>
      {/* Paredes laterales: cierran el cuarto al girar la cámara */}
      {[-1, 1].map((lado) => (
        <mesh
          key={lado}
          receiveShadow
          position={[(lado * ANCHO) / 2, ALTO_PARED / 2, PARED_Z + FONDO / 2]}
          rotation={[0, (-lado * Math.PI) / 2, 0]}
        >
          <planeGeometry args={[FONDO, ALTO_PARED]} />
          <meshStandardMaterial color={COLORES.paredLateral} roughness={1} />
        </mesh>
      ))}
      {/* Zoclo */}
      <Bloque tam={[ANCHO, 0.1, 0.02]} position={[0, 0.05, PARED_Z + 0.01]} color={COLORES.zoclo} />

      <Mural />
    </group>
  )
}

/** Luz cálida: ambiental suave + direccional con sombras. */
export function Iluminacion({ sombras }: { sombras: boolean }) {
  return (
    <>
      <hemisphereLight args={['#fff4e6', '#d9c2a8', 1.1]} />
      <directionalLight
        color="#ffe9cc"
        intensity={1.8}
        position={[3, 6, 4]}
        castShadow={sombras}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={4}
        shadow-camera-bottom={-2}
        shadow-camera-near={1}
        shadow-camera-far={15}
      />
      {/* Relleno frontal para que el interior de los muebles no quede negro */}
      <directionalLight color="#fff7ee" intensity={0.35} position={[-2, 2, 6]} />
    </>
  )
}
