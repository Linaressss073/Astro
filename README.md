# Documentación del Proyecto Astro

## Introducción
El proyecto **Astro** es una aplicación web que utiliza un enfoque **Full Stack**, combinando **Astro** y **Tailwind CSS** en el frontend con **Node.js** y **Express** en el backend. La base de datos utilizada es **MongoDB**, proporcionando un almacenamiento NoSQL eficiente. 

Este documento describe la arquitectura del sistema, los requisitos de instalación, la configuración, el uso y las directrices para contribuciones.

---

## 1. Arquitectura del Proyecto
El proyecto está dividido en dos módulos principales:

- **Frontend:** Desarrollado con **Astro** y **Tailwind CSS**, ofrece una interfaz de usuario optimizada y rápida.
- **Backend:** Construido con **Node.js** y **Express**, maneja la lógica de negocio y la comunicación con la base de datos **MongoDB**.

### 1.1. Estructura del Proyecto
```
AstroProject/
│-- frontend/    # Contiene el código del frontend con Astro y Tailwind CSS
│-- backend/     # Contiene el código del backend con Node.js y Express
│-- README.md    # Documentación del proyecto
│-- package.json # Configuración de dependencias globales (si aplica)
```

---

## 2. Instalación y Configuración
### 2.1. Prerrequisitos
Antes de instalar y ejecutar el proyecto, asegúrate de tener instalados los siguientes componentes:
- **Node.js** (versión 16 o superior)
- **npm** (versión 8 o superior)
- **MongoDB** (en local o en la nube, por ejemplo, MongoDB Atlas)

### 2.2. Clonar el Repositorio
```bash
git clone https://github.com/Linaressss073/Astro.git
cd Astro
```

### 2.3. Configuración del Backend
1. Accede a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` y configura las variables necesarias, por ejemplo:
   ```env
   MONGODB_URI=mongodb://localhost:27017/astro_db
   PORT=5000
   ```
4. Inicia el servidor backend:
   ```bash
   npm start
   ```

### 2.4. Configuración del Frontend
1. Accede a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 3. Uso de la Aplicación
1. Asegúrate de que el servidor backend está en ejecución.
2. Inicia el servidor frontend.
3. Accede a la aplicación desde el navegador en `http://localhost:3000` (según configuración de Astro).

---

## 4. API del Backend
### 4.1. Endpoints
| Método | Ruta              | Descripción |
|--------|------------------|-------------|
| GET    | `/api/items`     | Obtiene todos los ítems |
| POST   | `/api/items`     | Crea un nuevo ítem |
| GET    | `/api/items/:id` | Obtiene un ítem por ID |
| PUT    | `/api/items/:id` | Actualiza un ítem por ID |
| DELETE | `/api/items/:id` | Elimina un ítem por ID |

---

## 5. Contribuciones
Las contribuciones son bienvenidas. Sigue estos pasos:
1. Realiza un fork del repositorio.
2. Crea una rama para tu nueva funcionalidad:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit con un mensaje claro.
4. Envía un pull request.

---

## 6. Licencia
Este proyecto está licenciado bajo [nombre de la licencia]. Consulta el archivo `LICENSE` para más detalles.
