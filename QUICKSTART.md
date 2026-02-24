# 🚀 RAÍZ E-commerce - Quick Start Guide
## 5 Minutos para tener la plataforma funcionando

### 📋 Requisitos
- Node.js 18+ instalado
- MySQL 8+ corriendo localmente
- Git (opcional)

### ⚡ Pasos Rápidos

#### 1️⃣ Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/raiz-ecommerce.git
cd raiz-ecommerce
```

#### 2️⃣ Backend Setup (2 minutos)
```bash
cd backend
npm install
cp .env.example .env
```

**Edita `backend/.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=raiz_db
DB_PORT=3306
JWT_SECRET=tu_secreto_aleatorio
FORMSPREE_ENDPOINT=https://formspree.io/f/TU_FORM_ID
PORT=3000
NODE_ENV=development
```

#### 3️⃣ Inicializar Base de Datos (1 minuto)
```bash
npm run init-db
```

Output esperado:
```
✅ Database initialized successfully
```

#### 4️⃣ Iniciar Backend (30 segundos)
```bash
npm start
```

Output esperado:
```
🌿 Raíz E-commerce Server running at http://localhost:3000
Environment: development
✅ MySQL connection successful
```

#### 5️⃣ Frontend (1 minuto)
Opción A - Live Server (VS Code):
```bash
# Instalar extensión: Live Server
# Click derecho en frontend/index.html → Open with Live Server
```

Opcion B - Python HTTP Server:
```bash
cd frontend
python3 -m http.server 5500
# Ir a http://localhost:5500
```

Opción C - Node HTTP Server:
```bash
npx http-server frontend -p 5500
```

### 🧪 Verificar que Funciona

1. **Frontend**: http://localhost:5500
   - ✓ Ver página de inicio
   - ✓ Navegar a Tienda
   - ✓ Ver productos

2. **Admin**: http://localhost:5500/admin.html
   - Usuario: `admin`
   - Contraseña: `admin123`
   - ✓ Agregar producto
   - ✓ Ver órdenes

3. **API**: http://localhost:3000
   - Respuesta JSON esperada:
   ```json
   {
     "message": "Welcome to Raíz E-commerce API",
     "version": "1.0.0",
     "endpoints": { ... }
   }
   ```

### 🛒 Prueba Completa de Flujo

1. Ir a Tienda
2. Filtrar productos
3. Clickear producto → Ver detalle
4. Agregar al carrito
5. Ir a carrito
6. Completar checkout:
   - Nombre: Test User
   - Email: test@example.com
   - Teléfono: +573001234567
   - Dirección: Calle 1 #2-3
   - Click "Completar Compra"
7. Ver confirmación de orden

### 🔧 Troubleshooting

**Error: Cannot find module 'mysql2'**
```bash
cd backend && npm install
```

**Error: ECONNREFUSED (MySQL no conecta)**
```bash
# Verificar que MySQL está corriendo
# macOS: brew services start mysql
# Windows: buscar MySQL en Servicios
# Linux: sudo systemctl start mysql
```

**Error: PORT 3000 already in use**
```bash
# Cambiar puerto en backend/.env
PORT=3001
```

**CORS errors en frontend**
```bash
# Verificar que backend está corriendo en http://localhost:3000
# Verificar que API_BASE_URL sea correcto en frontend/js/services/api.js
```

### 📚 Documentación Completa

- [README.md](README.md) - Overview completo
- [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) - Especificaciones técnicas
- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Guía admin

### 💡 Tips

- Les cambios en backend requieren reiniciar servidor
- El carrito se guarda 32 horas en localStorage
- Las órdenes se guardan en base de datos
- Las contraseñas se hashean con bcrypt
- Los tokens JWT expiran en 24 horas

### 🎯 Próximos Pasos

1. Agregar más productos en Admin
2. Configurar Formspree para emails
3. Deploy a producción
4. Integrar pasarela de pago

---

**¿Preguntas?** Revisar logs en:
- Backend: Terminal donde corrió `npm start`
- Frontend: DevTools → Console

Happy coding! 🌿
