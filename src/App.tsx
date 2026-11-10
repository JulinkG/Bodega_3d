import { MUEBLES, ORDEN_MUEBLES, ZONAS } from '@/data/catalogo'

// Cascarón de la app. La escena 3D (src/scene/) entra en la Fase 2 y el
// panel de alertas/compras (src/ui/) en la Fase 4.
export default function App() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between bg-cafe-700 px-4 py-3 text-crema-50">
        <h1 className="text-lg font-bold">Bodega 3D · Relato Café</h1>
        <span className="text-sm opacity-80">Fase 1</span>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        <section className="flex flex-1 items-center justify-center bg-crema-100 p-6">
          <p className="text-center text-cafe-700">Aquí va la cocina en 3D (Fase 2).</p>
        </section>

        <aside className="border-t border-crema-200 bg-white p-4 md:w-80 md:border-t-0 md:border-l">
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
