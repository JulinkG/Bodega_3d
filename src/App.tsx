import { lazy, Suspense } from 'react'
import { MUEBLES, ORDEN_MUEBLES, ZONAS } from '@/data/catalogo'

// La escena 3D (three.js) se carga aparte para que la página aparezca rápido.
const Escena = lazy(() => import('@/scene/Escena'))

export default function App() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between bg-cafe-700 px-4 py-3 text-crema-50">
        <h1 className="text-lg font-bold">Bodega 3D · Relato Café</h1>
      </header>

      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section className="relative min-h-[55vh] flex-1 bg-crema-100 md:min-h-0">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-cafe-700">
                Cargando la cocina…
              </div>
            }
          >
            <Escena />
          </Suspense>
        </section>

        {/* Panel 2D: en la Fase 4 aquí van alertas, compras y valor del inventario */}
        <aside className="overflow-y-auto border-t border-crema-200 bg-white p-4 md:w-80 md:border-t-0 md:border-l">
          <h2 className="mb-3 font-semibold">Muebles y zonas</h2>
          <ul className="space-y-2">
            {ORDEN_MUEBLES.map((id) => (
              <li key={id} className="rounded-lg bg-crema-50 p-3">
                <p className="font-medium">{MUEBLES[id].nombre}</p>
                <p className="text-sm text-cafe-500">
                  {MUEBLES[id].zonas.map((z) => ZONAS[z].nombre).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  )
}
