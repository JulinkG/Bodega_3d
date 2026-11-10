import type { ReactNode } from 'react'

// Modelos low-poly de cada insumo, con sus colores reales para que se
// reconozcan de un vistazo. Todos se arman con el origen en la base (y = 0)
// y escalan con `s` (el lado de la huella que les toca en la repisa).
// El nivel de stock NO va en el color del producto: va en la base (Insumos.tsx).

type Vec3 = [number, number, number]

interface MatProps {
  color: string
  /** Opacidad (0–1) para plástico o vidrio transparente. */
  transparente?: number
  metal?: boolean
}

function Mat({ color, transparente, metal }: MatProps) {
  const esTransparente = transparente !== undefined
  return (
    <meshStandardMaterial
      color={color}
      roughness={metal ? 0.3 : 0.6}
      metalness={metal ? 0.6 : 0}
      transparent={esTransparente}
      opacity={transparente ?? 1}
      depthWrite={!esTransparente}
    />
  )
}

interface Pos {
  x?: number
  y?: number
  z?: number
  rot?: Vec3
}

/** Cilindro apoyado en `y` (r = radio de abajo, r2 = de arriba). */
function Cil({ r, r2, h, seg = 14, x = 0, y = 0, z = 0, rot, ...m }: Pos & MatProps & { r: number; r2?: number; h: number; seg?: number }) {
  return (
    <mesh castShadow position={[x, y + h / 2, z]} rotation={rot}>
      <cylinderGeometry args={[r2 ?? r, r, h, seg]} />
      <Mat {...m} />
    </mesh>
  )
}

/** Caja apoyada en `y`. */
function Caja({ w, h, d, x = 0, y = 0, z = 0, rot, ...m }: Pos & MatProps & { w: number; h: number; d: number }) {
  return (
    <mesh castShadow position={[x, y + h / 2, z]} rotation={rot}>
      <boxGeometry args={[w, h, d]} />
      <Mat {...m} />
    </mesh>
  )
}

/** Esfera con centro en (x, y, z), deformable con `esc`. */
function Esf({ r, esc, seg = 12, x = 0, y = 0, z = 0, rot, ...m }: Pos & MatProps & { r: number; esc?: Vec3; seg?: number }) {
  return (
    <mesh castShadow position={[x, y, z]} rotation={rot} scale={esc}>
      <sphereGeometry args={[r, seg, Math.max(6, Math.round(seg * 0.7))]} />
      <Mat {...m} />
    </mesh>
  )
}

/** Cono con la punta hacia abajo (fresas) o hacia arriba (cebolla, ajo). */
function Cono({ r, h, abajo, x = 0, y = 0, z = 0, ...m }: Pos & MatProps & { r: number; h: number; abajo?: boolean }) {
  return (
    <mesh castShadow position={[x, y + h / 2, z]} rotation={abajo ? [Math.PI, 0, 0] : undefined}>
      <coneGeometry args={[r, h, 10]} />
      <Mat {...m} />
    </mesh>
  )
}

const BLANCO_ETIQUETA = '#fbf3e4'
const KRAFT = '#b8875a'
const PLATA = '#c9cdd1'

// ─── Arquetipos ─────────────────────────────────────────────────────────────

/** Botella alta de jarabe con bomba dosificadora (Chobani, vainilla). */
const botellaJarabe = (cuerpo: string) => (s: number) => (
  <group>
    <Cil r={s * 0.26} h={s * 1.9} color={cuerpo} />
    <Cil r={s * 0.27} h={s * 0.6} y={s * 0.6} color={BLANCO_ETIQUETA} />
    <Cil r={s * 0.1} h={s * 0.25} y={s * 1.9} color={cuerpo} />
    <Cil r={s * 0.06} h={s * 0.35} y={s * 2.15} color="#1e1e1e" />
    <Caja w={s * 0.28} h={s * 0.07} d={s * 0.08} x={s * 0.1} y={s * 2.45} color="#1e1e1e" />
  </group>
)

/** Botella apachurrable con tapa en punta (mayonesa, cátsup, chocolate líquido). */
const squeeze = (cuerpo: string, tapa: string) => (s: number) => (
  <group>
    <Cil r={s * 0.3} h={s * 1.5} color={cuerpo} />
    <Cil r={s * 0.3} r2={s * 0.12} h={s * 0.35} y={s * 1.5} color={cuerpo} />
    <Cil r={s * 0.12} r2={s * 0.03} h={s * 0.38} y={s * 1.85} color={tapa} />
  </group>
)

/** Botella de vidrio con cuello (salsas, aceite, agua mineral, limonada). */
const vidrio =
  (cuerpo: string, tapa: string, alto = 2.1, r = 0.26, etiqueta = BLANCO_ETIQUETA) =>
  (s: number) => {
    const h = s * alto * 0.62
    return (
      <group>
        <Cil r={s * r} h={h} color={cuerpo} />
        <Cil r={s * r * 1.03} h={h * 0.4} y={h * 0.3} color={etiqueta} />
        <Cil r={s * r} r2={s * 0.09} h={s * alto * 0.15} y={h} color={cuerpo} />
        <Cil r={s * 0.09} h={s * alto * 0.18} y={h + s * alto * 0.15} color={cuerpo} />
        <Cil r={s * 0.1} h={s * 0.14} y={s * alto * 0.95} color={tapa} />
      </group>
    )
  }

/** Lata (lechera, chipotle, agua tónica). */
const lata =
  (cuerpo: string, banda: string, alto = 1.2, r = 0.3) =>
  (s: number) => (
    <group>
      <Cil r={s * r} h={s * alto} color={cuerpo} />
      <Cil r={s * r * 1.02} h={s * alto * 0.35} y={s * alto * 0.35} color={banda} />
      <Cil r={s * r * 0.96} h={s * 0.05} y={s * alto} color={PLATA} metal />
    </group>
  )

/** Tetrapak con sello arriba (leche, jugos). */
const tetrapak =
  (cuerpo: string, banda: string, alto = 1.9, ancho = 0.62) =>
  (s: number) => (
    <group>
      <Caja w={s * ancho} h={s * alto} d={s * ancho} color={cuerpo} />
      <Caja w={s * ancho * 1.02} h={s * alto * 0.3} d={s * ancho * 1.02} y={s * alto * 0.3} color={banda} />
      <Caja w={s * ancho} h={s * 0.18} d={s * 0.06} y={s * alto} color={cuerpo} />
    </group>
  )

/** Frasco con tapa y etiqueta (Nutella, mermelada, Nescafé, orégano). */
const frasco =
  (contenido: string, tapa: string, alto = 1.1, r = 0.36, hexagonal = false) =>
  (s: number) => (
    <group>
      <Cil r={s * r} h={s * alto} seg={hexagonal ? 6 : 16} color={contenido} />
      <Cil r={s * r * 1.02} h={s * alto * 0.38} y={s * alto * 0.25} seg={hexagonal ? 6 : 16} color={BLANCO_ETIQUETA} />
      <Cil r={s * r * 1.05} h={s * 0.18} y={s * alto} color={tapa} />
    </group>
  )

/** Lata de polvo con tapa (matcha, chai, cacao, sal). */
const bote =
  (cuerpo: string, tapa: string, alto = 1.3, r = 0.34) =>
  (s: number) => (
    <group>
      <Cil r={s * r} h={s * alto} seg={18} color={cuerpo} />
      <Cil r={s * r * 1.05} h={s * 0.2} y={s * alto} seg={18} color={tapa} />
    </group>
  )

/** Bolsa parada con el borde doblado (café, azúcar, polvos, congelados). */
const bolsa =
  (color: string, alto = 1.3, ancho = 0.85, valvula = false) =>
  (s: number) => (
    <group rotation={[0, 0.15, 0]}>
      <Caja w={s * ancho} h={s * alto} d={s * 0.45} color={color} />
      <Caja w={s * ancho * 0.98} h={s * 0.12} d={s * 0.14} y={s * alto} color={color} />
      {valvula && <Cil r={s * 0.07} h={s * 0.03} y={s * alto * 0.7} z={s * 0.24} rot={[Math.PI / 2, 0, 0]} color="#1e1e1e" />}
    </group>
  )

/** Paquete rectangular (galletas, empaques). */
const paquete =
  (color: string, w = 0.9, h = 0.5, d = 0.5, banda?: string) =>
  (s: number) => (
    <group>
      <Caja w={s * w} h={s * h} d={s * d} color={color} />
      {banda && <Caja w={s * w * 0.4} h={s * h * 1.02} d={s * d * 1.02} color={banda} />}
    </group>
  )

/** Torre de vasos apilados, con tapa plana o domo opcional. */
const vasos =
  (color: string, { r = 0.32, r2 = 0.42, alto = 1.8, transparente, tapa, domo, manga }: {
    r?: number
    r2?: number
    alto?: number
    transparente?: number
    tapa?: string
    domo?: boolean
    manga?: string
  } = {}) =>
  (s: number) => (
    <group>
      <Cil r={s * r} r2={s * r2} h={s * alto} color={color} transparente={transparente} />
      {[0.35, 0.6, 0.85].map((f) => (
        <Cil key={f} r={s * (r + (r2 - r) * f) + s * 0.012} h={s * 0.035} y={s * alto * f} color={color} transparente={transparente === undefined ? undefined : Math.min(1, transparente + 0.3)} />
      ))}
      {manga && <Cil r={s * (r + (r2 - r) * 0.45) + s * 0.01} h={s * alto * 0.25} y={s * alto * 0.3} color={manga} />}
      {tapa && <Cil r={s * r2 * 1.05} h={s * 0.08} y={s * alto} color={tapa} />}
      {domo && <Esf r={s * r2} y={s * alto} esc={[1, 0.6, 1]} color="#eef7fc" transparente={0.45} />}
    </group>
  )

/** Torre de bowls anchos. */
const bowls = (color: string, r = 0.48) => (s: number) => (
  <group>
    {[0, 1, 2, 3].map((i) => (
      <Cil key={i} r={s * r * 0.6} r2={s * r} h={s * 0.32} y={s * i * 0.14} color={color} />
    ))}
  </group>
)

/** Varios objetos iguales repartidos (frutas, verduras). */
function grupo(posiciones: Vec3[], s: number, pieza: (p: Vec3, i: number) => ReactNode) {
  return <group>{posiciones.map((p, i) => pieza([p[0] * s, p[1] * s, p[2] * s], i))}</group>
}

const TRES: Vec3[] = [
  [-0.22, 0, 0.1],
  [0.22, 0, 0.08],
  [0, 0, -0.18],
]

// ─── Modelos especiales ─────────────────────────────────────────────────────

/** Mano de plátanos: 4 plátanos curvos con puntas cafés y tallo común. */
function Platanos(s: number) {
  const R = s * 0.48
  const tubo = s * 0.1
  const arco = 1.75
  const extremo = (lado: 1 | -1): Vec3 => [lado * R * Math.sin(arco / 2), -R * Math.cos(arco / 2), 0]
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        // Abiertos en abanico desde el tallo, como una mano de plátanos real.
        <group key={i} position={[0, R + tubo + i * s * 0.07, (i - 1.5) * s * 0.12]} rotation={[0.18 * (i - 1.5), (i - 1.5) * 0.42, 0]}>
          <mesh castShadow rotation={[0, 0, -Math.PI / 2 - arco / 2]}>
            <torusGeometry args={[R, tubo, 8, 18, arco]} />
            <Mat color={i === 3 ? '#e9c43a' : '#f2d046'} />
          </mesh>
          <Esf r={tubo * 0.8} x={extremo(-1)[0]} y={extremo(-1)[1]} color="#3f2b1a" />
          <Esf r={tubo * 0.9} x={extremo(1)[0]} y={extremo(1)[1]} color="#7a8a2e" />
        </group>
      ))}
      {/* Tallo que une la mano */}
      <Cil r={s * 0.07} h={s * 0.32} x={R * Math.sin(arco / 2) + s * 0.04} y={R * (1 - Math.cos(arco / 2)) + s * 0.08} color="#6b5a2a" rot={[0, 0, -0.5]} />
    </group>
  )
}

/** Fresas en su clamshell transparente. */
function Fresas(s: number) {
  const pos: Vec3[] = [
    [-0.25, 0, 0.12],
    [0, 0, 0.15],
    [0.25, 0, 0.1],
    [-0.13, 0.08, -0.12],
    [0.15, 0.08, -0.12],
  ]
  return (
    <group>
      {grupo(pos, s, (p, i) => (
        <group key={i} position={p}>
          <Cono r={s * 0.14} h={s * 0.26} y={s * 0.02} abajo color="#d42a3a" />
          <Cil r={s * 0.12} h={s * 0.03} y={s * 0.28} color="#3f8a2f" seg={6} />
        </group>
      ))}
      <Caja w={s * 0.95} h={s * 0.5} d={s * 0.7} color="#eaf6ff" transparente={0.25} />
    </group>
  )
}

function Kiwis(s: number) {
  return (
    <group>
      {grupo(TRES, s, (p, i) => (
        <Esf key={i} r={s * 0.2} x={p[0]} y={s * 0.17} z={p[2]} esc={[1.25, 0.85, 0.9]} color="#8b6a3f" />
      ))}
      {/* Un kiwi partido encima */}
      <Cil r={s * 0.17} h={s * 0.05} y={s * 0.33} x={s * 0.02} rot={[0.5, 0, 0]} color="#79b23a" />
      <Cil r={s * 0.05} h={s * 0.055} y={s * 0.33} x={s * 0.02} rot={[0.5, 0, 0]} color="#f3efd2" />
    </group>
  )
}

function Mangos(s: number) {
  return (
    <group>
      <Esf r={s * 0.24} x={-s * 0.15} y={s * 0.2} esc={[1.3, 0.85, 0.85]} rot={[0, 0.4, 0.2]} color="#f2a43a" />
      <Esf r={s * 0.24} x={s * 0.18} y={s * 0.2} z={-s * 0.05} esc={[1.3, 0.85, 0.85]} rot={[0, -0.3, -0.15]} color="#e6bf3a" />
      <Esf r={s * 0.12} x={s * 0.25} y={s * 0.24} z={s * 0.05} color="#d8562a" />
    </group>
  )
}

function Maracuyas(s: number) {
  return grupo(TRES, s, (p, i) => <Esf key={i} r={s * 0.21} x={p[0]} y={s * 0.21} z={p[2]} color="#5d2b4f" />)
}

function Cebollas(s: number) {
  return grupo(TRES, s, (p, i) => (
    <group key={i} position={p}>
      <Esf r={s * 0.21} y={s * 0.19} esc={[1, 0.9, 1]} color="#8a2f6b" />
      <Cono r={s * 0.06} h={s * 0.12} y={s * 0.36} color="#c99a7a" />
    </group>
  ))
}

function Ajos(s: number) {
  return grupo(TRES, s, (p, i) => (
    <group key={i} position={p}>
      <Esf r={s * 0.16} y={s * 0.14} esc={[1, 0.85, 1]} color="#f3eee2" />
      <Cono r={s * 0.05} h={s * 0.12} y={s * 0.25} color="#e2d8c0" />
    </group>
  ))
}

/** Manojo de hierbas: tallos y hojas. */
const hierbas = (hoja: string) => (s: number) => (
  <group>
    {[-0.12, -0.04, 0.04, 0.12].map((dx, i) => (
      <Cil key={i} r={s * 0.025} h={s * 0.9} x={dx * s} z={(i % 2 ? 0.04 : -0.04) * s} color="#6aa04a" />
    ))}
    <Cil r={s * 0.09} h={s * 0.06} y={s * 0.25} color="#d84a3a" />
    {[
      [0, 1.05, 0],
      [-0.16, 0.98, 0.08],
      [0.16, 0.98, -0.06],
      [-0.08, 1.15, -0.08],
      [0.1, 1.17, 0.08],
      [0, 0.92, -0.16],
    ].map((p, i) => (
      <mesh key={i} castShadow position={[p[0] * s, p[1] * s, p[2] * s]}>
        <icosahedronGeometry args={[s * 0.15, 0]} />
        <Mat color={hoja} />
      </mesh>
    ))}
  </group>
)

function Huevos(s: number) {
  return (
    <group>
      <Caja w={s * 0.98} h={s * 0.24} d={s * 0.68} color="#c9c2b5" />
      {[-0.3, 0, 0.3].flatMap((x) =>
        [-0.16, 0.16].map((z) => (
          <Esf key={`${x}${z}`} r={s * 0.13} x={x * s} y={s * 0.33} z={z * s} esc={[1, 1.25, 1]} color="#f6efe1" />
        )),
      )}
    </group>
  )
}

/** Charola blanca con lo que lleve encima. */
function Charola({ s, children }: { s: number; children: ReactNode }) {
  return (
    <group>
      <Caja w={s * 0.98} h={s * 0.07} d={s * 0.72} color="#f4f4f2" />
      {children}
    </group>
  )
}

function Pechuga(s: number) {
  return (
    <Charola s={s}>
      <Esf r={s * 0.22} x={-s * 0.18} y={s * 0.12} esc={[1.4, 0.4, 1]} color="#eaa79e" />
      <Esf r={s * 0.22} x={s * 0.18} y={s * 0.13} esc={[1.4, 0.4, 1]} rot={[0, 0.4, 0]} color="#e39b92" />
    </Charola>
  )
}

function Milanesa(s: number) {
  return (
    <Charola s={s}>
      {[0, 1, 2].map((i) => (
        <Esf key={i} r={s * 0.3} y={s * (0.09 + i * 0.04)} x={(i - 1) * s * 0.05} esc={[1.35, 0.1, 1]} rot={[0, i * 0.5, 0]} color={i % 2 ? '#9b3b36' : '#a8463e'} />
      ))}
    </Charola>
  )
}

function Jamon(s: number) {
  return (
    <Charola s={s}>
      <Cil r={s * 0.32} h={s * 0.26} y={s * 0.07} seg={18} color="#f2a7ad" />
      <Cil r={s * 0.25} h={s * 0.265} y={s * 0.07} seg={18} color="#f6c3c6" />
    </Charola>
  )
}

function Pepperoni(s: number) {
  return (
    <group>
      <Cil r={s * 0.13} h={s * 0.95} y={-s * 0.475 + s * 0.13} x={0} rot={[0, 0, Math.PI / 2]} color="#8c2a22" />
      {[-0.25, 0, 0.25].map((x, i) => (
        <Cil key={i} r={s * 0.12} h={s * 0.025} x={x * s} z={s * 0.25} color="#b9402f" />
      ))}
    </group>
  )
}

function Mozzarella(s: number) {
  return (
    <group>
      <Esf r={s * 0.21} x={-s * 0.17} y={s * 0.2} color="#f8f5ec" />
      <Esf r={s * 0.21} x={s * 0.17} y={s * 0.2} color="#f4f0e4" />
      <Caja w={s * 0.95} h={s * 0.45} d={s * 0.5} color="#e8f3fb" transparente={0.25} />
    </group>
  )
}

function QuesoFresco(s: number) {
  return (
    <group>
      <Cil r={s * 0.38} h={s * 0.32} seg={20} color="#f6f2e6" />
      <Caja w={s * 0.3} h={s * 0.33} d={s * 0.8} x={s * 0.05} color="#7bb04a" transparente={0.6} />
    </group>
  )
}

function Mantequilla(s: number) {
  return (
    <group>
      <Caja w={s * 0.9} h={s * 0.3} d={s * 0.45} color="#f3d36a" />
      <Caja w={s * 0.5} h={s * 0.31} d={s * 0.46} x={s * 0.2} color="#ffffff" />
      <Caja w={s * 0.15} h={s * 0.315} d={s * 0.465} x={s * 0.2} color="#2f6db5" />
    </group>
  )
}

function Baguettes(s: number) {
  return (
    <group>
      {[0, 1].map((i) => (
        <group key={i} position={[0, s * (0.12 + i * 0.2), (i - 0.5) * s * 0.18]} rotation={[0, (i - 0.5) * 0.25, Math.PI / 2]}>
          <mesh castShadow>
            <capsuleGeometry args={[s * 0.11, s * 1.6, 4, 10]} />
            <Mat color={i ? '#d79a4a' : '#c8863a'} />
          </mesh>
        </group>
      ))}
      <Caja w={s * 0.55} h={s * 0.55} d={s * 0.5} color={KRAFT} />
    </group>
  )
}

function Brioches(s: number) {
  return grupo(TRES, s, (p, i) => (
    <Esf key={i} r={s * 0.21} x={p[0]} y={s * 0.14} z={p[2]} esc={[1, 0.7, 1]} color={i % 2 ? '#c9772f' : '#d4873a'} />
  ))
}

function Tortillas(s: number) {
  return (
    <group>
      <Cil r={s * 0.42} h={s * 0.26} seg={22} color="#f1e3b5" />
      <Cil r={s * 0.43} h={s * 0.1} y={s * 0.08} seg={22} color={BLANCO_ETIQUETA} />
    </group>
  )
}

function Canela(s: number) {
  return (
    <group>
      {[
        [-0.1, 0],
        [0.1, 0.02],
        [0, 0.12],
        [0, -0.1],
        [-0.12, -0.1],
        [0.12, -0.1],
      ].map(([x, z], i) => (
        <Cil key={i} r={s * 0.055} h={s * 1.35} x={x * s} z={z * s} seg={8} color={i % 2 ? '#9b5a2b' : '#8a4c22'} />
      ))}
      <Cil r={s * 0.2} h={s * 0.12} y={s * 0.55} color="#d8452f" />
    </group>
  )
}

function TablillasChocolate(s: number) {
  return (
    <group>
      <Cil r={s * 0.4} h={s * 0.7} seg={6} color="#d8452f" />
      <Cil r={s * 0.41} h={s * 0.22} y={s * 0.25} seg={6} color="#f2c94c" />
    </group>
  )
}

function Hielo(s: number) {
  return (
    <group>
      {[
        [-0.2, 0.1, 0.05],
        [0.12, 0.1, 0.08],
        [-0.02, 0.1, -0.1],
        [-0.12, 0.32, 0],
        [0.16, 0.32, -0.05],
        [0.02, 0.52, 0.04],
      ].map((p, i) => (
        <Caja key={i} w={s * 0.18} h={s * 0.18} d={s * 0.18} x={p[0] * s} y={p[1] * s} z={p[2] * s} rot={[0.3 * i, 0.5 * i, 0]} color="#e9f7ff" transparente={0.85} />
      ))}
      <Caja w={s * 0.85} h={s * 0.8} d={s * 0.5} color="#d9f1ff" transparente={0.3} />
    </group>
  )
}

function Helado(s: number) {
  return (
    <group>
      <Cil r={s * 0.32} r2={s * 0.38} h={s * 0.7} seg={18} color="#fbf3df" />
      <Cil r={s * 0.33} r2={s * 0.385} h={s * 0.22} y={s * 0.2} seg={18} color="#f2c879" />
      <Cil r={s * 0.4} h={s * 0.08} y={s * 0.7} seg={18} color="#7a4b2a" />
    </group>
  )
}

function Aerosol(cuerpo: string, banda: string, tapa: string) {
  return (s: number) => (
    <group>
      <Cil r={s * 0.22} h={s * 1.7} color={cuerpo} />
      <Cil r={s * 0.225} h={s * 0.5} y={s * 0.6} color={banda} />
      <Cil r={s * 0.22} r2={s * 0.1} h={s * 0.2} y={s * 1.7} color={PLATA} metal />
      <Cil r={s * 0.08} r2={s * 0.03} h={s * 0.3} y={s * 1.9} color={tapa} />
    </group>
  )
}

function Tenedores(s: number) {
  return (
    <group>
      <Cil r={s * 0.28} h={s * 0.6} color={KRAFT} />
      {[-0.12, -0.04, 0.04, 0.12, 0].map((x, i) => (
        <group key={i} position={[x * s, s * 0.5, (i === 4 ? 0.1 : 0) * s]} rotation={[0, 0, x * 1.2]}>
          <Caja w={s * 0.05} h={s * 0.7} d={s * 0.02} color="#ffffff" />
          <Caja w={s * 0.12} h={s * 0.14} d={s * 0.02} y={s * 0.62} color="#ffffff" />
        </group>
      ))}
    </group>
  )
}

function PapelEncerado(s: number) {
  return (
    <group>
      <Caja w={s * 1.0} h={s * 0.32} d={s * 0.36} color="#f2efe7" />
      <Caja w={s * 0.3} h={s * 0.33} d={s * 0.37} x={-s * 0.2} color="#d8452f" />
      <Cil r={s * 0.1} h={s * 0.95} y={-s * 0.475 + s * 0.42} rot={[0, 0, Math.PI / 2]} color="#f7f4ec" />
    </group>
  )
}

const bolsasPlanas = (color: string, w = 0.85, d = 0.55, transparente?: number) => (s: number) => (
  <group>
    {[0, 1, 2, 3].map((i) => (
      <Caja key={i} w={s * w} h={s * 0.06} d={s * d} y={i * s * 0.065} rot={[0, i * 0.06, 0]} color={color} transparente={transparente} />
    ))}
    <Caja w={s * w * 0.6} h={s * 0.01} d={s * d * 0.3} y={s * 0.26} color={transparente ? '#ffffff' : '#9a6b40'} />
  </group>
)

function Hilo(s: number) {
  return (
    <group>
      <Cil r={s * 0.3} h={s * 0.06} color="#e9dcc5" />
      <Cil r={s * 0.25} h={s * 0.42} y={s * 0.06} color="#c9473a" />
      <Cil r={s * 0.255} h={s * 0.06} y={s * 0.2} color="#f6f1e6" />
      <Cil r={s * 0.255} h={s * 0.06} y={s * 0.34} color="#f6f1e6" />
      <Cil r={s * 0.3} h={s * 0.06} y={s * 0.48} color="#e9dcc5" />
    </group>
  )
}

function Etiquetas(s: number) {
  return (
    <group>
      <Cil r={s * 0.34} h={s * 0.32} seg={20} color="#ffffff" />
      <Cil r={s * 0.13} h={s * 0.33} seg={14} color={KRAFT} />
    </group>
  )
}

// ─── Catálogo: nombre del insumo → modelo ───────────────────────────────────

type Modelo = (s: number) => ReactNode

const MODELOS: Record<string, Modelo> = {
  // Café y polvos para bebidas
  'Café en grano': bolsa('#3b2418', 1.5, 0.85, true),
  Nescafé: frasco('#3a2116', '#c8202c', 1.3, 0.34),
  'Matcha orgánico': bote('#6fa84a', '#e6f0d8'),
  Chai: bote('#c9772f', '#7a3e17'),
  'Cacao en polvo': bote('#6b3a22', '#d9b38c'),
  Chocomio: bolsa('#8a3f5a', 1.2, 0.8),
  Chocolate: TablillasChocolate,
  Canela,
  'Jengibre molido': frasco('#d8b26a', '#3a2a1a', 0.9, 0.28),
  Horchata: bolsa('#f4ede0', 1.2, 0.8),
  Jamaica: bolsa('#7d1e3a', 1.2, 0.8),
  // Lácteos
  'Leche entera': tetrapak('#fbfbf8', '#2f80c9'),
  'Crema para batir': tetrapak('#fbfbf8', '#1f4f8f', 1.3, 0.55),
  'Crema batida': Aerosol('#fbfbf8', '#2f6db5', '#d8392f'),
  Crema: (s) => (
    <group>
      <Cil r={s * 0.36} h={s * 0.6} color="#fbfbf8" />
      <Cil r={s * 0.38} h={s * 0.08} y={s * 0.6} color="#3b78c2" />
    </group>
  ),
  Mantequilla,
  Mozzarella,
  'Queso fresco': QuesoFresco,
  // Jarabes y salsas dulces
  'Caramelo Chobani': botellaJarabe('#b8682a'),
  'Chocolate blanco Chobani': botellaJarabe('#efe3c8'),
  'Pumpkin spice Chobani': botellaJarabe('#d66a28'),
  'Jarabe pink lemon': botellaJarabe('#f59ab5'),
  'Chocolate líquido': squeeze('#4a2a1a', '#2b1810'),
  Vainilla: botellaJarabe('#f0dcaa'),
  Miel: frasco('#e2a12b', '#f5e6c0', 1.1, 0.34, true),
  Cajeta: frasco('#9b5a25', '#d4402f'),
  Lechera: lata('#2f5ea8', '#f7f3e8', 0.9, 0.3),
  Nutella: frasco('#4b2a1a', '#ffffff', 1.0, 0.38),
  'Mermelada de fresa': frasco('#c3283a', '#f3f0ea', 0.95, 0.34),
  // Toppings y endulzantes
  Azúcar: bolsa('#fbfaf5', 1.4, 0.8),
  'Chispitas de chocolate': frasco('#5a3320', '#f2c94c', 1.0, 0.34),
  'Cacao nibs': bolsa('#6b3d24', 0.9, 0.7),
  Oreo: paquete('#1f3f8f', 1.0, 0.42, 0.45, '#ffffff'),
  Galletas: paquete('#d9a441', 0.9, 0.5, 0.45, '#8a4c22'),
  // Frutas frescas
  Fresas,
  Plátano: Platanos,
  Kiwi: Kiwis,
  Mango: Mangos,
  Maracuyá: Maracuyas,
  // Jugos y bebidas listas
  'Agua tónica': lata('#e9e4c6', '#d3a83a', 1.3, 0.24),
  'Agua mineral': vidrio('#2f7a4a', '#d0d0d0', 2.1, 0.24, '#f2c94c'),
  'Limonada orgánica': vidrio('#f1e27a', '#3c8a3c', 2.0, 0.27, '#3c8a3c'),
  'Jugo de uva blanca': tetrapak('#e7e2a5', '#8bb04a'),
  'Jugo de naranja': tetrapak('#f39a28', '#ffffff'),
  'Mix jugo verde': tetrapak('#5aa843', '#d6efc0'),
  'Piña colada': tetrapak('#f7dc6f', '#ffffff'),
  // Congelados
  Hielo,
  'Moras congeladas': bolsa('#4b2a5c', 1.3, 0.9),
  'Helado de vainilla': Helado,
  'Palomitas de pollo': bolsa('#e07a2a', 1.3, 0.9),
  'Masa hojaldre': paquete('#f2c94c', 0.95, 0.3, 0.6, '#d8452f'),
  // Proteínas
  'Pechuga de pollo': Pechuga,
  'Milanesa de pulpa negra de res': Milanesa,
  Jamón: Jamon,
  Pepperoni,
  Huevos,
  // Panadería
  Baguette: Baguettes,
  'Pan brioche': Brioches,
  Tortilla: Tortillas,
  // Verduras y hierbas
  'Ensalada italiana': bolsa('#9ccc65', 1.1, 0.9),
  'Cebolla morada': Cebollas,
  Ajo: Ajos,
  Cilantro: hierbas('#5fae3c'),
  Perejil: hierbas('#2f7a2a'),
  // Salsas y aderezos
  Mayonesa: squeeze('#f7f1df', '#2f6db5'),
  'Salsa césar': vidrio('#efe4c4', '#2e4a2e', 1.8, 0.28),
  Chipotle: lata('#c4482b', '#f2d24a', 0.7, 0.3),
  'Salsa roja': vidrio('#b5201f', '#f2c94c', 2.0, 0.2),
  'Salsa verde': vidrio('#3f8a2f', '#f2f2f2', 2.0, 0.2),
  'Salsa búfalo': squeeze('#e1622a', '#1e1e1e'),
  'Salsa de tomate': squeeze('#c8241f', '#ffffff'),
  // Abarrotes y condimentos
  'Aceite de oliva': vidrio('#3d5a1e', '#d4a93a', 2.4, 0.22),
  'Vinagre de manzana': vidrio('#c08a3e', '#d23c2e', 2.1, 0.22),
  Sal: bote('#2f63b6', '#ffffff', 1.2, 0.32),
  Orégano: frasco('#6b8f3a', '#2e2e2e', 0.9, 0.26),
  // Desechables para bebidas
  'Vaso 14 oz con tapa': vasos('#fbf7ef', { tapa: '#3b2418', manga: KRAFT }),
  'Vaso 16 oz frío': vasos('#e8f4fb', { transparente: 0.5, alto: 2.0 }),
  'Vaso 16 oz frappé': vasos('#e8f4fb', { transparente: 0.5, alto: 1.7, domo: true }),
  'Vaso 1 oz': vasos('#eef7fc', { r: 0.16, r2: 0.22, alto: 0.7, transparente: 0.55 }),
  // Desechables para comida
  'Vasos de postre': vasos('#eef7fc', { r: 0.28, r2: 0.36, alto: 0.8, transparente: 0.55 }),
  'Bowl grande': bowls('#f7f3ea', 0.48),
  'Bowl pequeño': bowls('#c8a274', 0.36),
  Tenedores,
  'Papel encerado': PapelEncerado,
  // Empaque y etiquetado
  'Bolsa de papel': bolsasPlanas(KRAFT),
  'Bolsa transparente': bolsasPlanas('#e6f2fa', 0.85, 0.55, 0.5),
  'Bolsa #1': bolsasPlanas('#a9774a', 0.6, 0.4),
  Hilo,
  Etiquetas,
}

/** Modelo del insumo; si es uno nuevo sin modelo propio, una bolsa kraft genérica. */
export function ModeloInsumo({ nombre, s }: { nombre: string; s: number }) {
  const modelo = MODELOS[nombre] ?? bolsa(KRAFT)
  return <>{modelo(s)}</>
}

