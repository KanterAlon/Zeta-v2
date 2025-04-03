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
│   │   └── schema.prisma     # Definición de modelos y relaciones
│   ├── src/
│   │   └── index.js          # Servidor Express principal
│   ├── .env                  # Variables de entorno (Railway)
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.jsx           # App principal de React
│   ├── public/
│   ├── index.html
│   └── package.json
```

---

## 🚀 Requisitos previos

- Node.js instalado
- Tener una cuenta en [Railway](https://railway.app/) y tu base de datos configurada
- Tener el proyecto clonado en tu máquina
- Tener `.env` con la variable `DATABASE_URL` configurada

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

> Ejemplo con Railway:

```env
DATABASE_URL="mysql://root:pSJCZAwRWIuOJWIcytJlUNPiOQuStZDT@trolley.proxy.rlwy.net:19881/railway"
```

---

## ⚙️ Cómo levantar el proyecto

### 🔁 Opción recomendada (una terminal con dos procesos en paralelo)

Desde la raíz (`my-app`):

```bash
# Instalar dependencias
npm install --prefix backend
npm install --prefix frontend

# Iniciar ambos con un solo comando
npm run dev
```

> Para que esto funcione, creá un archivo `package.json` en la raíz con estos scripts 👇 (podés pedirme que te lo genere)

---

### 💡 Opción común (2 terminales separadas)

#### 🖥️ Terminal 1 – Backend

```bash
cd backend
npx prisma migrate dev --name init   # Solo la primera vez
node src/index.js
```

#### 🌐 Terminal 2 – Frontend

```bash
cd frontend
npm run dev
```

> React estará disponible en: [http://localhost:5173](http://localhost:5173)  
> Backend estará corriendo en: [http://localhost:3001](http://localhost:3001)

---

## 🧱 Base de Datos y Prisma

- Todos los modelos están definidos en `backend/prisma/schema.prisma`
- Prisma se conecta automáticamente a Railway usando la variable `DATABASE_URL`
- Usamos relaciones entre modelos (1:N, N:M) y claves foráneas
- Podés ver y editar la base con:

```bash
npx prisma studio
```

---

## 📬 API disponibles

Por ahora, las rutas disponibles son:

### `GET /usuarios`
Devuelve todos los usuarios

### `POST /usuarios`
Crea un nuevo usuario (requiere `{ nombre, email }`)

> Más endpoints se van agregando a medida que se avanza el desarrollo.

---

## 🧪 Desarrollo recomendado

- Usar dos terminales para separar backend y frontend
- O usar herramientas como [concurrently](https://www.npmjs.com/package/concurrently) para correr ambos con un solo comando
- Usar Postman o ThunderClient para probar la API
- Usar Prisma Studio para ver los datos fácilmente

---

## 🧠 Notas del autor

Este proyecto comenzó con una migración de una base SQL Server. Las tablas y datos fueron convertidos manualmente al esquema de Prisma y están listos para escalar.  
El objetivo es tener una app limpia, mantenible y conectada 100% a servicios modernos en la nube.

---

## 📌 Próximos pasos (ideas para el equipo)

- Crear endpoints CRUD para el resto de los modelos (`posts`, `comentarios`, `notificaciones`, etc.)
- Implementar login / autenticación
- Agregar validaciones
- Añadir UI bonita con Tailwind o MUI

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

---

Hecho con 💻 por Alon & ChatGPT.
