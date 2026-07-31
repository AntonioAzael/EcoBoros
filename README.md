# ECOBOROS - Generación de PDFs de Documentación

Este proyecto contiene un script Python para generar PDFs de documentación técnica de los productos y mostrarlos en la página `Publicacion.html`.

## Requisitos

- Python 3.10+ instalado
- Acceso al proyecto en `c:\xampp\htdocs\Proyecto-Ecoboros1`
- XAMPP o servidor local si quieres abrir las páginas desde `http://localhost`

## Instalación rápida

1. Abre una terminal en `c:\xampp\htdocs\Proyecto-Ecoboros1`.
2. Crea un entorno virtual (opcional pero recomendado):

```powershell
python -m venv .venv
```

3. Activa el entorno virtual:

```powershell
.venv\Scripts\Activate.ps1
```

Si usas `cmd.exe`:

```cmd
.venv\Scripts\activate.bat
```

4. Instala las dependencias:

```powershell
pip install -r requirements.txt
```

## Generar los PDFs

Ejecuta el script de generación:

```powershell
.venv\Scripts\python.exe generate_product_pdfs.py
```

Esto creará los archivos:

- `pdfs/product_1.pdf`
- `pdfs/product_2.pdf`
- ...
- `pdfs/product_8.pdf`

## Ver los PDFs en el navegador

Abre `Publicacion.html` con un ID de producto:

```text
http://localhost/Proyecto-Ecoboros1/Publicacion.html?id=2
```

La documentación se mostrará en el visor PDF embebido justo debajo de las miniaturas.

## Notas

- El script `generate_product_pdfs.py` crea la carpeta `pdfs/` automáticamente si no existe.
- Si se actualiza la documentación en el código, vuelve a ejecutar `generate_product_pdfs.py` para regenerar los archivos.



---

# Ejecución del Backend y Docker (API)

### Opción 1: Con Docker (Recomendado)
Para levantar todo el entorno de forma automatizada:

1. Construye y levanta los contenedores:
   ```bash
   docker compose up --build -d
   ```
2. Aplica las migraciones de Django:

   ```bash
   docker exec -it ecoboros_back python manage.py migrate
   ```

3. Accede a la documentación (Swagger):

   ```bash
   http://127.0.0.1:8000/swagger/
   ```

### Opción 2: Desarrollo Local (Entorno Virtual)
   Si prefieres correr el backend de forma nativa:

1. Levantar la base de datos:
   ```BASH
   cd db && docker compose up -d && cd ..
   ```

2. Configurar y arrancar el backend(Linux / macOS):
   ```BASH
   cd back
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver


3. Configurar y arrancar el backend(CMD o PowerShell):
   ```BASH
   cd back
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver