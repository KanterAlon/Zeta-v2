# 🧠 Proyecto Zeta - Full Stack con React + Node + Prisma + MySQL (Railway)

Este proyecto es una base sólida para una aplicación full stack. Utiliza:

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **ORM:** Prisma
- **Base de datos:** MySQL (hospedada en Railway)
- **Estilos:** HTML + CSS simples

---

## 📁 Estructura del Proyecto

```
my-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     # Definición de modelos y relaciones (migrado desde SQL Server)
│   ├── src/
│   │   └── index.js          # Servidor Express principal con rutas conectadas a Railway
│   ├── .env                  # Variables de entorno (Railway)
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.jsx           # App principal de React conectada al backend
│   ├── public/
│   ├── index.html
│   └── package.json
├── package.json              # Script raíz para iniciar backend + frontend en paralelo
```

---

## 🚀 Requisitos previos

- Node.js instalado
- Tener una cuenta en [Railway](https://railway.app/) con la base de datos configurada
- Tener el proyecto clonado en tu máquina
- Tener `.env` en `backend/` con la conexión a la base de datos

---

## 🔧 Configuración del entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd my-app
```

### 2. Configurar las variables de entorno

En el archivo `backend/.env`, agregá tu conexión a Railway:

```env
DATABASE_URL="mysql://usuario:password@host:puerto/nombre_db"
PORT=3001
```

> Ejemplo real:

```env
DATABASE_URL="mysql://root:pSJCZAwRWIuOJWIcytJlUNPiOQuStZDT@trolley.proxy.rlwy.net:19881/railway"
```

---

## ⚙️ Cómo levantar el proyecto

### ✅ Opción recomendada (una sola terminal para todo)

Desde la raíz (`my-app/`):

```bash
# Instalar dependencias
npm install
npm install --prefix backend
npm install --prefix frontend

# Iniciar backend y frontend en paralelo
npm run dev
```

### 🧠 ¿Cómo funciona esto?

Gracias al paquete [`concurrently`](https://www.npmjs.com/package/concurrently), usamos un script especial en el `package.json` raíz:

```json
"scripts": {
  "dev": "concurrently \"npm run server --prefix backend\" \"npm run dev --prefix frontend\""
}
```

Y en `backend/package.json`:

```json
"scripts": {
  "server": "node src/index.js"
}
```

Y en `frontend/package.json`:

```json
"scripts": {
  "dev": "vite"
}
```

---

## 🧱 Base de Datos y Prisma

- Todos los modelos están definidos en `backend/prisma/schema.prisma`
- Prisma se conecta automáticamente a Railway usando `.env`
- Se migró una base completa desde SQL Server
- Para aplicar cambios:

```bash
cd backend
npx prisma migrate dev --name init
```

- Para explorar los datos visualmente:

```bash
npx prisma studio
```

---

## 📬 API disponibles (por ahora)

### `GET /usuarios`
Lista todos los usuarios

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
Lista todos los posts

### `POST /posts`
Crea un nuevo post con:

```json
{
  "id_usuario": 1,
  "titulo_post": "Mi primer post",
  "contenido_post": "Hola mundo",
  "imagen_url": "imagen.jpg"
}
```

---

## 🧪 Desarrollo recomendado

- Usar el script `npm run dev` desde la raíz para levantar todo
- Usar Postman o ThunderClient para testear la API
- Usar `Prisma Studio` para ver los datos en tabla
- Sincronizar `schema.prisma` con migraciones (`migrate dev`)
- Siempre actualizar `.env` correctamente si se cambia Railway

---

## 🧠 Notas finales

Este proyecto incluye:

- Base completa migrada desde SQL Server
- Servidor Express funcional
- Conexión 100% real con Railway en producción
- Frontend React funcionando y comunicándose correctamente con el backend
- Código limpio y modular para expandir fácilmente

---

## 📌 Próximos pasos

- CRUD completo para todos los modelos
- Autenticación de usuarios
- UI con diseño pro (Tailwind, MUI o Bootstrap)
- Tests automáticos
- Deploy completo (Vercel + Railway)

---

## 🛠️ Stack resumido

| Tecnología | Rol                 |
|------------|---------------------|
| React      | Frontend (SPA)      |
| Express    | Backend (API REST)  |
| Prisma     | ORM                 |
| MySQL      | Base de datos       |
| Railway    | Hosting de la DB    |
| Vite       | Empaquetador React  |
| Concurrently | Script paralelo  |

---

Hecho con 💻 por Alon & ChatGPT.
