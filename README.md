# 🧠 Proyecto Zeta - Full Stack con React + Node + Prisma + MySQL (Railway)

Base de proyecto para desarrollo interno del equipo. Tecnologías:

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **ORM:** Prisma
- **Base de datos:** MySQL en Railway
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

## 🗃️ Base de Datos (Railway)

La conexión está definida en `backend/.env` bajo `DATABASE_URL`, apuntando al proyecto de Railway ya activo.

Para aplicar cambios en el esquema Prisma:

```bash
cd backend
npx prisma migrate dev --name nombre
```

Para visualizar los datos:

```bash
npx prisma studio
```

---



Hecho con 💻 por el equipo de Zeta.
