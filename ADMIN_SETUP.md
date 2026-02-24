# 🔐 RAÍZ E-commerce - Admin Setup Guide

## Credenciales de Administrador

### Usuario Por Defecto

```
Username: admin
Password: admin123
Email: admin@raiz.com
Role: admin
```

> ⚠️ **IMPORTANTE**: Cambiar estas credenciales antes de ir a producción

## Acceso al Panel Admin

1. **URL**: `http://localhost:5500/admin.html` (desarrollo)
2. **Ingresar credenciales por defecto**
3. **Dashboard se abre con 3 módulos**

## 📋 Módulos de Administración

### 1️⃣ Inventario (Pestaña de Productos)

**Agregar Producto:**
- Nombre (required)
- Descripción (required)
- Categoría (select)
- Subcategoría (select desublacida)
- Precio (decimal)
- Stock (cantidad)
- URL de Imagen (opcional)

**Listar Productos:**
- Tabla con nombre, precio, stock, categoría
- Botón eliminar por producto

**Validaciones:**
- Todos los campos requeridos deben llenarse
- Precio debe ser número válido
- Stock debe ser número entero
- Subcategoría solo si categoría seleccionada

### 2️⃣ Órdenes (Pestaña de Órdenes)

**Información Visible:**
- ID de orden
- Nombre cliente
- Total a pagar
- Estado actual
- Fecha creación
- Botón ver detalles

**Gestionar Estado:**
- Dropdown con opciones:
  - Pendiente
  - Pagado
  - Enviado
  - Entregado
  - Cancelado

**Disponible para Admin:**
- Cambiar estado sin restricciones
- Ver historial de órdenes
- Buscar por cliente

### 3️⃣ Configuración (Pestaña Configuración)

**Parámetros Configurables:**
- Costo de Envío (formato: $10.00)

**Cómo Cambiar:**
1. Ingresar nuevo valor
2. Click en "Guardar"
3. Confirmación en toast

**Aplicación:**
- Afecta a TODAS las nuevas órdenes
- No afecta órdenes existentes

## 🔄 Flujo de Trabajo Admin

### Gestión de Inventario

```
1. Inicias sesión
2. Tab: Inventario
3. Scroll abajo → Agregar Nuevo Producto
4. Rellenas formulario
5. Click "Agregar Producto"
6. OK → Recarga página, aparece en tabla
```

### Procesamiento de Órdenes

```
1. Inicias sesión
2. Tab: Órdenes
3. Ves tabla con últimas órdenes
4. Click dropdown de estado
5. Selecciona nuevo estado
6. Automáticamente se guarda
7. Notifications confirma cambio
```

## 🔐 Seguridad Admin

**Protecciones:**
- Solo usuarios con rol 'admin' pueden acceder
- Token JWT necesario para todas las operaciones
- Las modificaciones quedan registradas en BD
- CORS y Helmet protegen backend

**Mejores Prácticas:**
- Cambiar contraseña admin regularmente
- No compartir credenciales
- Usar contraseña fuerte en producción
- Revisar logs regularmente

## 📊 Datos Disponibles

### Categorías Por Defecto
1. Lujo Orgánico
2. Artesanía
3. Contemporáneo
4. Colecciones

### Subcategorías Por Defecto
- Aceites esenciales
- Cosméticos naturales
- Cerámica
- Textiles
- Mobiliario
- Accesorios
- Ediciones limitadas
- Colaboraciones

## 🚨 Troubleshooting Admin

**Problema: "Credenciales inválidas"**
- Verificar usuario: `admin`
- Verificar contraseña: `admin123`
- Verificar que backend está corriendo

**Problema: No se agregan productos**
- Verificar que seleccionaste categoría Y subcategoría
- Verificar que el precio es válido (ej: 99.99)
- Ver console para errores

**Problema: No se ven órdenes**
- Verificar que backend está corriendo
- Verificar que hay órdenes en BD (hacer una compra)
- Revisar token JWT en localStorage

**Problema: No se actualiza estado orden**
- Verificar que el estado es válido
- Verificar que tienes privilegios admin
- Revisar console para errores

## 🔑 Cambiar Contraseña Admin

### Método 1: Base de Datos

```sql
-- MySQL CLI
use raiz_db;

-- Usar herramienta online para hashear
-- Genera bcrypt hash de tu nueva contraseña
-- Ejemplo: contraseña "nuevacontraseña123" hashea a:
-- $2b$10$...hash largo...

UPDATE users 
SET password = '$2b$10$...hash...' 
WHERE username = 'admin';
```

### Método 2: Panel (Futuro)
- Actualmente no implementado
- Se puede agregar endpoint de cambio de contraseña

## 📈 Reportes

**Órdenes Vistas en Admin:**
- Todas las órdenes creadas
- Filtradas por estado si se implementa
- Ordenadas por fecha (más reciente primero)

**Información de Orden:**
- ID (único)
- Nombre cliente
- Email cliente
- Teléfono cliente
- Dirección
- Subtotal
- Costo envío
- Total
- Estado
- Fecha creación

## 🎯 Next Steps para Admin

1. **Agregar búsqueda** en órdenes y productos
2. **Implementar cambio de contraseña**
3. **Exportar reportes** a CSV
4. **Gráficos de ventas**
5. **Gestión de usuarios**
6. **Auditoría de cambios**

## 📞 Soporte

Si encuentras problemas:
1. Revisar console (F12)
2. Revisar logs del backend
3. Verificar .env configurado
4. Verificar MySQL corriendo
5. Releer esta guía

---

**Última actualización**: February 24, 2026
**Rol admin otorgado a**: admin@raiz.com
