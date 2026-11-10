import { lazy, Suspense } from 'react'
import { BarraEscena } from '@/ui/BarraEscena'
import { PanelLateral } from '@/ui/PanelLateral'

// La escena 3D (three.js) se carga aparte para que la página aparezca rápido.
const Escena = lazy(() => import('@/scene/Escena'))

export default function App() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between bg-granada px-4 py-2 text-crema-50">
        <h1 className="flex items-center gap-2 text-lg font-bold">
          <img src="/marca/logo.png" alt="" className="h-8 w-auto" />
          Bodega 3D · Relato Café
        </h1>
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
          <BarraEscena />
        </section>

        <PanelLateral />
      </main>
    </div>
  )
}
