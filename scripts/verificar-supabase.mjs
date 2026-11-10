// Revisa que .env.local esté bien y que el esquema exista en Supabase.
// Uso: npm run verificar:supabase
//
// Solo usa la llave pública y NO inicia sesión: por eso, si la seguridad (RLS)
// está bien puesta, las tablas responden sin error pero vacías.

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const llave = process.env.VITE_SUPABASE_ANON_KEY

const ok = (t) => console.log(`  ✔ ${t}`)
const mal = (t) => {
  console.log(`  ✘ ${t}`)
  process.exitCode = 1
}

console.log('\nRevisando Supabase…\n')

if (!url || url.includes('TU-PROYECTO')) mal('Falta VITE_SUPABASE_URL en .env.local')
else ok(`URL: ${new URL(url).host}`)

if (!llave || llave.includes('tu_llave')) mal('Falta VITE_SUPABASE_ANON_KEY en .env.local')
else if (llave.startsWith('sb_secret_') || /service_role/.test(atobSeguro(llave)))
  mal('¡Esa es la llave SECRETA (service_role)! Usa la pública (anon / publishable).')
else ok('Llave pública presente')

if (process.exitCode) {
  console.log('\nCorrige .env.local y vuelve a correr el comando.\n')
  process.exit()
}

const supabase = createClient(url, llave, { auth: { persistSession: false } })

for (const tabla of ['zonas', 'insumos', 'movimientos', 'stock_actual']) {
  const { data, error } = await supabase.from(tabla).select('*').limit(1)
  if (error) mal(`${tabla}: ${error.message}`)
  else if (data.length > 0) mal(`${tabla}: se puede leer SIN iniciar sesión. Revisa que RLS esté activado.`)
  else ok(`${tabla}: existe y está protegida (sin sesión no se ve nada)`)
}

console.log(process.exitCode ? '\nHay algo por corregir (mira las ✘).\n' : '\nTodo listo para la Fase 6.\n')

/** Decodifica el payload de una llave JWT vieja (anon/service_role) sin fallar. */
function atobSeguro(jwt) {
  try {
    return Buffer.from(jwt.split('.')[1] ?? '', 'base64').toString()
  } catch {
    return ''
  }
}
