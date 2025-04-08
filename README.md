# 🧠 Proyecto Zeta - Full Stack con React + Node + Prisma + MySQL

Base de proyecto para desarrollo interno del equipo. Tecnologías:

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **ORM:** Prisma
- **Base de datos:** MySQL (📍 ahora **local**, antes en Railway)
- **Estilos:** HTML + CSS básicos

---

## 📁 Estructura del Proyecto

```
Zeta-v2/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── routes/
│   │   └── utils/
│   ├── .env
│   ├── app.js
│   └── package.json
├── frontend/
│   └── package.json
├── package.json
```

---

## ⚠️ Verificación previa antes de empezar

Antes de correr el proyecto, asegurate de:

1. Tener **MySQL iniciado** (sea desde WAMP, XAMPP o servicio de Windows).
   - En Windows: ejecutá `services.msc` y asegurate que el servicio `MySQL` o `wampmysqld64` esté corriendo.
   - Si usás WAMP, el ícono debe estar **verde**.

2. Tener configurado correctamente el archivo `.env` dentro de `backend/src/prisma/.env`:
```env
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/zeta_local"
PORT=3001
```

---

## ⚙️ Inicio del proyecto (backend + frontend juntos)

Ya configurado para ejecutar ambos servicios en paralelo con un solo comando:

```bash
npm run dev
```

Este script utiliza `concurrently` para levantar:

- El backend con Express (`backend/app.js`)
- El frontend con Vite (`frontend/`)

### Scripts definidos

**En el `package.json` raíz:**
```json
"scripts": {
  "dev": "concurrently \"npm run server --prefix backend\" \"npm run dev --prefix frontend\""
}
```

**En `backend/package.json`:**
```json
"scripts": {
  "server": "node app.js"
}
```

**En `frontend/package.json`:**
```json
"scripts": {
  "dev": "vite"
}
```

---

## 🧪 Prisma CLI útil

```bash
npx prisma generate --schema backend/src/prisma/schema.prisma
npx prisma migrate dev --name init --schema backend/src/prisma/schema.prisma
npx prisma studio --schema backend/src/prisma/schema.prisma
```

Si Prisma tira errores por certificados SSL (usualmente por proxy o red corporativa), usá esto:
```bash
set NODE_TLS_REJECT_UNAUTHORIZED=0
npx prisma generate --schema backend/src/prisma/schema.prisma
```

---

## 🌐 Endpoints configurados

Todos empiezan con `/api`:

- `GET /api/` → últimos posts
- `GET /api/blog` → posts de usuario ID 1
- `GET /api/existeMail?email=` → verifica si existe email
- `GET /api/product?query=` → búsqueda de producto OpenFoodFacts
- `GET /api/searchProducts?query=` → resultados múltiples
- `POST /api/darLike` → like a un post
- `POST /api/darDislike` → dislike a un post
- `POST /api/publicarPost` → crea nuevo post
- `GET /api/obtenerPosts` → lista completa de posts

---

## 🗃️ Base de Datos

### 🏠 Local (actual)

Creamos la base `zeta_local` desde MySQL Workbench o DBeaver:
```sql
CREATE DATABASE zeta_local;
```

Para migrar y generar:
```bash
cd backend
set NODE_TLS_REJECT_UNAUTHORIZED=0
npx prisma generate --schema src/prisma/schema.prisma
npx prisma migrate dev --name init --schema src/prisma/schema.prisma
cd ..
```

Visualización en navegador:
```bash
npx prisma studio --schema backend/src/prisma/schema.prisma
```

### ☁️ Railway (anterior)

Se usaba esta URL:
```env
DATABASE_URL="mysql://user:pass@railway_host:port/db"
```

Solo hay que reemplazar en `.env` si se quiere volver a usar Railway.

---

## 🖥️ Guía de instalación (una vez por computadora)

```bash
git clone https://github.com/KanterAlon/Zeta-v2.git
cd Zeta-v2

npm install
npm install --prefix backend
npm install --prefix frontend
npm install concurrently --save-dev

cd backend
set NODE_TLS_REJECT_UNAUTHORIZED=0
npx prisma generate --schema prisma/schema.prisma 
npx prisma migrate dev --name init --schema prisma/schema.prisma 
cd ..

npm run dev
```

---

Hecho con 💻 por el equipo de Zeta.
