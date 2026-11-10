# Fase 5 · Base de datos en Supabase

Estos pasos se hacen en el navegador, con tu cuenta. Claude no puede crear cuentas ni escribir
contraseñas por ti. Tarda unos 15 minutos.

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. Nombre: `bodega-relato`. Región: la más cercana a México (por ejemplo, *East US*).
3. Escribe una contraseña para la base de datos y **guárdala en tu gestor de contraseñas**.
   No la vas a necesitar en la app, pero no se puede recuperar.
4. Espera a que el proyecto termine de crearse (1–2 minutos).

## 2. Crear las tablas

1. Menú izquierdo → **SQL Editor** → **New query**.
2. Abre [`supabase/schema.sql`](../supabase/schema.sql), copia **todo**, pégalo y presiona **Run**.
   Debe decir *Success. No rows returned*.
3. (Opcional, para probar) Nueva query → pega [`supabase/seed.sql`](../supabase/seed.sql) → **Run**.
   Carga los 89 insumos con datos **inventados** y su stock inicial.
4. Ve a **Table Editor**: deben aparecer `zonas` (15 filas), `insumos` y `movimientos`.

## 3. Usuarios (solo ustedes dos)

1. **Authentication → Users → Add user → Create new user**.
2. Escribe el correo y una contraseña, y marca **Auto Confirm User**.
3. Repite para tu compañera.
4. **Authentication → Sign In / Providers**: desactiva **Allow new users to sign up**
   (permitir registro). Así nadie más puede crear cuenta. Guarda.

## 4. Llaves para la app

1. **Project Settings → API Keys** (o **Data API**).
2. Copia la **URL del proyecto** y la llave **pública**: *publishable* (`sb_publishable_…`) o *anon*.
3. **Nunca** uses la llave *secret* / *service_role*: esa salta toda la seguridad.
4. Abre el archivo `.env.local` en la carpeta del proyecto (ya existe, con valores de ejemplo)
   y reemplázalos:

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxx
   ```

   No pegues estas llaves en el chat. `.env.local` no se sube a GitHub.

## 5. Verificar

En la terminal, dentro de la carpeta del proyecto:

```bash
npm run verificar:supabase
```

Debe salir ✔ en todo. Revisa que las tablas existen y que **sin iniciar sesión no se ve nada**
(la seguridad funciona). Si sale ✘, el mensaje dice qué falta.

## Qué cambió respecto a la guía original

- Las zonas son las 15 reales y los muebles incluyen la `repisa`.
- Los nombres de insumo no se pueden repetir y la unidad debe ser una de las conocidas.
- **Permisos más finos:** los movimientos no se pueden editar ni borrar. Un error se corrige con
  otro movimiento, por ejemplo un ajuste. Los insumos no se borran: se desactivan, para no
  perder su historial.
- Cada movimiento guarda el correo de quien lo registró, para mostrarlo en el historial.
- Realtime queda activado para `movimientos` e `insumos`.

## Ojo

El plan gratuito pausa el proyecto si pasa como una semana sin uso. Si te pasa, entra a
Supabase y dale **Restore**.
