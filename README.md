# 🌿 ECOBOROS - Plataforma de Comercialización y Trazabilidad de Residuos Industriales

Bienvenido al repositorio oficial de **ECOBOROS**. Esta guía está diseñada para que cualquier desarrollador nuevo que se incorpore al equipo pueda configurar el entorno local, entender las credenciales de prueba, ejecutar el proyecto por primera vez y conocer el flujo real del software.

> 📖 **Para una arquitectura detallada, diagrama de estados y desglose financiero del 2.5%, consulta:**
> 📄 [README_FLUJO_PROYECTO.md](file:///C:/Users/bauti/OneDrive/Documentos/classroom/8B/EcoBoros/README_FLUJO_PROYECTO.md)

---

## 🔐 Cuentas Oficiales de Prueba para Iniciar Sesión

Todas las cuentas del entorno de desarrollo utilizan la contraseña estándar: **`eco472`**.

| Rol | Empresa / Inspector | Correo Electrónico (`email`) | Contraseña | Propósito y Flujo en el Software |
| :--- | :--- | :--- | :---: | :--- |
| 🏢 **Empresa Compradora (Empresa A)** | Empresa Demo EcoBoros S.A. | `empresa@ecoboros.com` | `eco472` | Explora publicaciones, genera peticiones de compra (`purchase_requests`), negocia volúmenes y simula confirmaciones de pago en "Mis Compras". |
| 🏬 **Empresa Vendedora (Empresa B)** | Cartones La Mesa S.A. de C.V. | `operaciones@cartoneslamesa.mx` | `eco472` | Publica residuos industriales, negocia en estado `Pendiente`, edita campos variables (`cantidad`, `peso`, `precio`) y registra comentarios explicativos. |
| 🏬 **Empresa Vendedora (Empresa B2)** | Alumina El Florido S.A. de C.V. | `ventas@aluminioflorido.mx` | `eco472` | Segunda empresa vendedora para probar ventas de metales y aluminios. |
| 🔍 **Usuario de Calidad (Inspector A)** | Inspector Carlos Mendoza (Calidad A) | `calidad@ecoboros.com` | `eco472` | Visualiza solicitudes en **Pendientes Generales**, presiona **"📌 Asignarme"**, audita en **Mis Asignaciones** y dicta el pase a **En Proceso**. |
| 🔍 **Usuario de Calidad (Inspector B)** | Inspectora Sofía Ruiz (Calidad B) | `calidad.b@ecoboros.com` | `eco472` | Segunda inspectora para validar asignación exclusiva y evitar interferencias entre auditores. |
| 🔍 **Usuario de Calidad (Inspector C)** | Inspector Fernando Gómez (Calidad C) | `calidad.c@ecoboros.com` | `eco472` | Tercer inspector de calidad para auditorías simultáneas. |
| 🛡️ **Administrador Total** | Administrador EcoBoros | `admin@ecoboros.com` | `eco472` | Supervisión global de la plataforma y trazabilidad completa de auditores. |

---

## 🚀 Proceso de Configuración e Inicialización por Primera Vez

Sigue estos pasos en orden para levantar el sistema en un entorno nuevo:

### 1. Requisitos Previos
* **Docker Desktop** (con Docker Compose activo)
* **Python 3.10+** (para ejecutar scripts de prueba)
* Terminal de comandos (PowerShell / Bash)

### 2. Levantar la Infraestructura de Docker
En la raíz del proyecto, ejecuta el siguiente comando para construir e iniciar los contenedores de base de datos PostgreSQL (`ecoboros-db-1`) y la API Django (`ecoboros-back-1`):

```powershell
docker compose up -d
```

Verifica que los contenedores estén corriendo correctamente:
```powershell
docker ps
```
* PostgreSQL estará expuesto en el puerto host `5434` (interno `5432`).
* Django API estará escuchando en `http://localhost:8000/api-ecoboros-v1/`.

### 3. Abrir la Aplicación Web (Frontend)
No requiere compilación especial. Puedes abrir directamente en el navegador la pantalla de Inicio de Sesión:

```text
file:///C:/Users/bauti/OneDrive/Documentos/classroom/8B/EcoBoros/Components/login/login.html
```
*(O a través de tu servidor HTTP local / XAMPP / Live Server).*

### 4. Ejecutar Pruebas Automatizadas del Flujo Real en Consola
Para verificar la comunicación con la base de datos, creación de solicitudes, negociación, asignación por calidad, desglose del 2.5% e inmutabilidad final:

```powershell
python Scripts/test_purchase_workflow.py
```

---

## 🔄 Cómo Probar el Flujo Real del Software Paso a Paso

Si quieres experimentar el flujo completo desde el navegador:

1. **Inicio de Sesión como Empresa A (Compradora)**:
   * Inicia sesión con `empresa@ecoboros.com` / `eco472`.
   * Navega por las publicaciones disponibles y haz clic en **Contactar Vendedor / Crear Petición de Compra**. Se creará una solicitud en estado **Pendiente** (`status_id = 4`).

2. **Inicio de Sesión como Empresa B (Vendedora)**:
   * Inicia sesión con `operaciones@cartoneslamesa.mx` / `eco472`.
   * Ve a **Mis Compras / Negociaciones**, abre la solicitud pendiente y edita la cantidad acordada (ej. `25k kg`) agregando un comentario de negociación (ej. *"Se acordó en llamada vender únicamente 25 toneladas"*).
   * Al guardar, comprueba que **sigue en estatus Pendiente** hasta que Calidad la audite.

3. **Inicio de Sesión como Inspector de Calidad (Calidad A)**:
   * Inicia sesión con `calidad@ecoboros.com` / `eco472`.
   * En la pestaña **📥 Pendientes Generales (Sin Asignar)**, verás la solicitud. Haz clic en **"📌 Asignarme"**.
   * Pasa a la pestaña **📋 Mis Asignaciones**, abre la solicitud, revisa el comentario de negociación y haz clic en **"✅ Validar Dictamen y Pasar a EN PROCESO"**.

4. **Verificación de Desglose Financiero y Cierre**:
   * En **En Proceso** (`status_id = 5`), observa el desglose automático: **2.5% para el Software Intermediario** y **97.5% para la Empresa B**.
   * Al confirmar pagos y pasar a **Completado** (`status_id = 6`), comprueba que el registro queda **inmutable y bloqueado** para edición.