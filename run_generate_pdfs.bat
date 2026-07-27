@echo off
cd /d %~dp0

REM Crear entorno virtual si no existe
if not exist .venv\Scripts\activate.bat (
    echo Creando entorno virtual .venv...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: No se pudo crear el entorno virtual.
        pause
        exit /b 1
    )
)

REM Activar entorno virtual
call .venv\Scripts\activate.bat

REM Instalar dependencias
if not exist requirements.txt (
    echo ERROR: No se encontro requirements.txt
    pause
    exit /b 1
)
python -m pip install --upgrade pip >nul 2>&1
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Fallo la instalacion de dependencias.
    pause
    exit /b 1
)

REM Generar los PDFs
python generate_product_pdfs.py
if errorlevel 1 (
    echo ERROR: Fallo al generar los PDFs.
    pause
    exit /b 1
)

echo.
echo Los PDFs se generaron correctamente en la carpeta pdfs.
pause
