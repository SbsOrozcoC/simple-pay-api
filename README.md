# 🧾 Simple Pay API

Aplicación de ejemplo Full Stack para simular **suscripciones a un plan Premium**, desarrollada con:
- **Laravel 12** (API REST)
- **React + Vite** (Frontend)
- **MySQL 8**
- **Docker / Docker Compose**

---

## 🚀 Objetivo del proyecto
Simular un flujo de suscripción **Premium** con autenticación, manejo de usuarios, y comunicación entre **Frontend (React)** y **Backend (Laravel)** a través de **APIs REST**.  
El sistema puede integrarse con pasarelas como Stripe o PayPal de forma simulada.

---

## 🧩 Tecnologías utilizadas
| Módulo | Tecnología | Descripción |
|:-------|:------------|:-------------|
| Backend | Laravel 12 (PHP 8.2) | API REST con autenticación y controladores para usuarios y suscripciones |
| Frontend | React + Vite (Node 22) | Interfaz SPA con conexión a la API |
| Base de datos | MySQL 8 | Almacenamiento de usuarios y suscripciones |
| Infraestructura | Docker / Docker Compose | Orquestación de contenedores y dependencias |

---

## ⚙️ Requisitos previos
NOTA: No necesitas instalar PHP, Node ni MySQL localmente: todo se ejecuta dentro de los contenedores Docker.
Antes de iniciar asegúrate de tener instalados:
- 🐳 **Docker** y **Docker Compose**  
```bash
    docker --version
    docker compose version
    git --version
```

## Estructura del proyecto
El proyecto esta con un encarpetado modular.
simple-pay-api/
├── backend/               # API REST con Laravel
│   ├── Dockerfile
│   ├── composer.json
│   └── ...
│
├── frontend/              # Interfaz React + Vite
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── mysql/                 # Configuración inicial de la base de datos
│   └── init.sql
│
├── docker-compose.yml     # Orquestador principal
├── .env
└── README.md


## 🚀 GUÍA RÁPIDA DE INSTALACIÓN

### ✅ Prerrequisitos
- [ ] Tener Docker Desktop instalado y ejecutándose
- [ ] Tener Git instalado

### ✅ Pasos de instalación
1. [ ] `git clone https://github.com/SbsOrozcoC/simple-pay-api.git`
2. [ ] `cd simple-pay-api`
3. [ ] `cp backend/.env backend/.env`
Asegúrate de que las variables de conexión sean las siguientes:
```bash
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=simplepay
    DB_USERNAME=simplepay
    DB_PASSWORD=simplepay
```
4. [ ] `docker compose up --build`
5. [ ] **En NUEVA terminal:** `docker exec -it simplepay_backend php artisan key:generate`
6. [ ] `docker exec -it simplepay_backend php artisan migrate`
Esto generará la clave de aplicación y creará las tablas necesarias en la base de datos.
7. [ ] **Abrir en navegador:** http://localhost:5173

### ✅ Verificar instalación
- [ ] Frontend funciona en: 
```bash
    http://localhost:5173
```
- [ ] Backend responde en: 
```bash
    http://localhost:8000
```

## Comandos útiles de Docker
Comando	-- Descripción
```bash
    docker compose up --build                ---  Levanta y reconstruye todos los contenedores
    docker compose down -v                   ---  Detiene y elimina contenedores + volúmenes
    docker compose ps	                     ---  Lista contenedores y puertos
    docker logs <nombre_contenedor>	         ---  Muestra logs del contenedor (ej: simplepay_frontend)
    docker exec -it simplepay_backend bash   ---  Ingresa al contenedor del backend
    docker exec -it simplepay_frontend bash  ---  Ingresa al contenedor del frontend
    docker compose restart backend           ---  Reinicia el contenedor del backend
    docker compose restart frontend          ---  Reinicia el contenedor del frontend
    docker compose up -d --build frontend    ---  Reconstruye solo el frontend
```

### Gestión de Estado con Zustand
El frontend utiliza **Zustand** como gestor de estado global

### Notas finales
Este entorno está diseñado para ejecutarse en cualquier sistema operativo con Docker instalado (Linux, macOS o Windows).
Todos los servicios son auto-contenidos, por lo que no requieren configuraciones adicionales.

# Autor
Sebastian Orozco
Desarrollador Full Stack