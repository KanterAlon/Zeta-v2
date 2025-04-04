
# 🧠 Proyecto Zeta - Full Stack con React + Node + Prisma + MySQL

Base de proyecto para desarrollo interno del equipo. Tecnologías:

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **ORM:** Prisma
- **Base de datos:** MySQL (📍 ahora **local** con opción previa en Railway)
- **Estilos:** HTML + CSS básicos

---

## 📁 Estructura del Proyecto

```
my-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── package.json
```

---

## ⚙️ Inicio del proyecto (backend + frontend juntos)

Ya configurado para ejecutar ambos servicios en paralelo con un solo comando:

```bash
npm run dev
```

Este script utiliza `concurrently` para levantar:

- El backend con Express (desde `backend/src/index.js`)
- El frontend con Vite (desde `frontend/`)

### Scripts definidos

**En el package.json raíz:**

```json
"scripts": {
  "dev": "concurrently \"npm run server --prefix backend\" \"npm run dev --prefix frontend\""
}
```

**En `backend/package.json`:**

```json
"scripts": {
  "server": "node src/index.js"
}
```

**En `frontend/package.json`:**

```json
"scripts": {
  "dev": "vite"
}
```

---

## 🌐 Endpoints configurados

### `GET /`
Mensaje de confirmación: API funcionando

### `GET /usuarios`
Devuelve todos los usuarios

### `POST /usuarios`
Crea un nuevo usuario. Body esperado:

```json
{
  "nombre": "Alon",
  "email": "alon@ejemplo.com",
  "edad": 25,
  "sexo": true,
  "peso": 70,
  "altura": 180,
  "password": "1234"
}
```

### `GET /posts`
Devuelve todos los posts (con info de usuario)

### `POST /posts`
Crea un nuevo post. Body:

```json
{
  "id_usuario": 1,
  "titulo_post": "Título",
  "contenido_post": "Contenido del post",
  "imagen_url": "imagen.jpg"
}
```

---

## 🗃️ Base de Datos

### ✅ Modo actual: **Local** (MySQL)

Usamos una instancia local de MySQL (ej: instalada con WAMP o como servicio en Windows/Mac/Linux).

**Conexión en `.env`:**

```env
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/zeta_local"
PORT=3001
```

### 📥 Cómo crear la base desde cero:

1. Abrí DBeaver
2. Conectate a `localhost:3306` con usuario `root`
3. Ejecutá:

```sql
CREATE DATABASE zeta_local;
```

4. Luego:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

---

### 🧠 Visualización de datos (DBeaver)

1. Abrí DBeaver y conectate a `zeta_local`
2. Explorá tablas y hacé clic derecho → "Ver datos"
3. Insertá filas con clic derecho → "Agregar fila" → `Ctrl + S` para guardar

---

### 🕸 Modo anterior (opcional): **Railway**

La conexión antes estaba definida con:

```env
DATABASE_URL="mysql://root:contraseña@host.railway.internal:puerto/railway"
```

Railway levantaba MySQL en la nube y Prisma funcionaba igual. Si algún miembro del equipo quiere volver a Railway, solo debe reemplazar el `DATABASE_URL`.

---

## 🧪 Prisma CLI útil

### Migrar schema y generar tablas

```bash
npx prisma migrate dev --name nombre
```

### Ver estructura en navegador

```bash
npx prisma studio
```

---

## 🖥️ Instalación completa desde cero (una sola vez por compu)

```bash
git clone https://github.com/KanterAlon/Zeta-v2.git
cd Zeta-v2

:: Instalar dependencias raíz
npm install

:: Instalar dependencias del backend
npm install --prefix backend

:: Instalar dependencias del frontend
npm install --prefix frontend

:: (Opcional) Crear archivo de entorno
echo DATABASE_URL="mysql://root:tu_password@localhost:3306/zeta_local" > backend/.env
echo PORT=3001 >> backend/.env

:: Generar Prisma Client y aplicar migración
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..

:: Ejecutar proyecto completo (front + back)
npm run dev
```

---

Hecho con 💻 por el equipo de Zeta.
