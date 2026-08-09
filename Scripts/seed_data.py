#!/usr/bin/env python3
"""
seed_data.py â€” EcoBoros data seeder
Acciones:
  1. Genera PDFs de ficha tÃ©cnica con fpdf2 para los 9 productos.
  2. Ejecuta insert.sql dentro del contenedor de DB (users + wastes + purchase_requests).
  3. Copia imÃ¡genes existentes y PDFs generados a Public/Imagenes/<waste_id>/ (volumen Docker).
  4. Inserta registros de waste_evidences en la BD con las rutas reales resueltas.

Uso:
  python Scripts/seed_data.py

Requisitos:
  pip install fpdf2 requests
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

# ---------------------------------------------------------------------------
# Dependencias opcionales
# ---------------------------------------------------------------------------
try:
    from fpdf import FPDF
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'fpdf2', '-q'])
    from fpdf import FPDF

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests', '-q'])
    import requests

# ---------------------------------------------------------------------------
# Rutas base
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR   = SCRIPT_DIR.parent
IMAGES_DIR = ROOT_DIR / 'Public' / 'Imagenes'   # mapeado en Docker â†’ /app/media/waste_evidences
PDFS_DIR   = SCRIPT_DIR / 'pdfs'
API_BASE   = 'http://localhost:8000/api-ecoboros-v1'
DB_CONTAINER = 'ecoboros-db-1'

PDFS_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# CatÃ¡logo de productos â€” alineados con insert.sql
# ---------------------------------------------------------------------------
PRODUCTS = [
    {
        "script_id": 1, "title": "Bidones HDPE Tricapa", "category": "Plásticos", "publisher_email": "empresa@ecoboros.com", "location": "Otay Industrial", "qty": "850 Pzas", "weightKg": 850, "price": "$ 15.00 / pza", "date": "2025-10-01", "image": "BotellasPetCristal.png",
        "docs": [("Ficha técnica", "Bidones HDPE de alta resistencia; capacidad 220 L."), ("Condición", "Excelente estado con cierre hermético.")]
    },
    {
        "script_id": 2, "title": "Recortes de Aluminio 6061", "category": "Metales", "publisher_email": "ventas@aluminioflorido.mx", "location": "El Florido", "qty": "2.5 Ton", "weightKg": 2500, "price": "$ 28.50 / kg", "date": "2025-10-05", "image": "Aluminio.jpeg",
        "docs": [("Especificaciones", "Aleación 6061-T6 ideal para mecanizado."), ("Calidad", "Material limpio sin óxido.")]
    },
    {
        "script_id": 3, "title": "Pallets de Pino (Reparables)", "category": "Maderas", "publisher_email": "empresa@ecoboros.com", "location": "Pacifico", "qty": "200 Uds", "weightKg": 4000, "price": "$ 45.00 / ud", "date": "2025-09-28", "image": "Madera.png",
        "docs": [("Condición", "Pallets reutilizados para reparación y reciclaje."), ("Material", "Pino tratado sin humedad.")]
    },
    {
        "script_id": 4, "title": "Pacas de Cartón Corrugado", "category": "Cartón", "publisher_email": "operaciones@cartoneslamesa.mx", "location": "La Mesa", "qty": "5 Ton", "weightKg": 5000, "price": "$ 3.20 / kg", "date": "2025-10-10", "image": "CartonCorrugado.png",
        "docs": [("Ficha técnica", "Cartón corrugado reciclado densidad media."), ("Uso", "Excelente para embalaje y empaque.")]
    },
    {
        "script_id": 5, "title": "Tarjetas Madre (Scrap)", "category": "Electrónicos", "publisher_email": "scrap@nordika.mx", "location": "Nordika", "qty": "500 kg", "weightKg": 500, "price": "$ 48.00 / kg", "date": "2025-10-12", "image": "PerfilesAluminio.png",
        "docs": [("Descripción", "Scrap electrónico para recuperación metales."), ("Inspección", "Revisión técnica realizada.")]
    },
    {
        "script_id": 6, "title": "Archivo Muerto (Triturado)", "category": "Papel", "publisher_email": "contacto@zonacentro.mx", "location": "Zona Centro", "qty": "1.2 Ton", "weightKg": 1200, "price": "$ 2.10 / kg", "date": "2025-09-15", "image": "CartonCorrugado.png",
        "docs": [("Tipo de material", "Papelería de oficina triturada bond y cartulina."), ("Seguridad", "Libre de datos sensibles.")]
    },
    {
        "script_id": 7, "title": "Cobre de Primera (Pelado)", "category": "Metales", "publisher_email": "ventas@cobreotay.mx", "location": "Otay", "qty": "300 kg", "weightKg": 300, "price": "$ 140.00 / kg", "date": "2025-10-15", "image": "Aluminio.jpeg",
        "docs": [("Calidad", "Cobre limpio pelado grado comercial A."), ("Aplicación", "Reciclaje metalúrgico componentes.")]
    },
    {
        "script_id": 8, "title": "Botellas PET Cristal", "category": "Plásticos", "publisher_email": "contacto@petrosarito.mx", "location": "Rosarito", "qty": "1 Ton", "weightKg": 1000, "price": "$ 8.00 / kg", "date": "2025-10-02", "image": "BotellasPetCristal.png",
        "docs": [("Material", "PET transparente alimenticio limpio."), ("Certificación", "Normas de reciclaje cumplidas.")]
    },
    {
        "script_id": 9, "title": "Perfiles de Aluminio Extruido", "category": "Metales", "publisher_email": "empresa@ecoboros.com", "location": "Tijuana Industrial", "qty": "500 kg", "weightKg": 500, "price": "$ 32.00 / kg", "date": "2025-10-20", "image": "PerfilesAluminio.png",
        "docs": [("Especificaciones", "Perfiles extruidos sección rectangular."), ("Condición", "Sin corrosión estructural.")]
    },
    {
        "script_id": 10, "title": "Viruta y Rebaba de Aluminio", "category": "Metales", "publisher_email": "ventas@aluminioflorido.mx", "location": "El Florido", "qty": "1.5 Ton", "weightKg": 1500, "price": "$ 22.00 / kg", "date": "2025-10-12", "image": "PerfilesAluminio.png",
        "docs": [("Especificaciones", "Rebaba de fresado CNC prensada."), ("Manejo", "Briquetado de alta densidad.")]
    },
    {
        "script_id": 11, "title": "Cartón Plegadizo Grado Industrial", "category": "Cartón", "publisher_email": "operaciones@cartoneslamesa.mx", "location": "La Mesa", "qty": "3.2 Ton", "weightKg": 3200, "price": "$ 2.80 / kg", "date": "2025-10-18", "image": "CartonCorrugado.png",
        "docs": [("Calidad", "Plegadizo seco enfardado."), ("Uso", "Reaprovechamiento papelero.")]
    },
    {
        "script_id": 12, "title": "Motores Eléctricos Desmantelados", "category": "Electrónicos", "publisher_email": "scrap@nordika.mx", "location": "Nordika", "qty": "1.8 Ton", "weightKg": 1800, "price": "$ 35.00 / kg", "date": "2025-10-14", "image": "PerfilesAluminio.png",
        "docs": [("Material", "Motores trifásicos para cobre/hierro."), ("Estado", "Carcasas completas sin aceite.")]
    },
    {
        "script_id": 13, "title": "Bobinas de Papel Kraft Residual", "category": "Papel", "publisher_email": "contacto@zonacentro.mx", "location": "Zona Centro", "qty": "2.8 Ton", "weightKg": 2800, "price": "$ 4.50 / kg", "date": "2025-10-08", "image": "CartonCorrugado.png",
        "docs": [("Gramaje", "Kraft pesado residual de corte."), ("Uso", "Conversión a empaque flexible.")]
    },
    {
        "script_id": 14, "title": "Placas de Cobre Electrolítico", "category": "Metales", "publisher_email": "ventas@cobreotay.mx", "location": "Otay", "qty": "750 kg", "weightKg": 750, "price": "$ 145.00 / kg", "date": "2025-10-22", "image": "Aluminio.jpeg",
        "docs": [("Pureza", "Cobre electrolítico 99.9%."), ("Fundición", "Apto fundición especial.")]
    },
    {
        "script_id": 15, "title": "Envases HDPE Triturados (Molienda)", "category": "Plásticos", "publisher_email": "contacto@petrosarito.mx", "location": "Rosarito", "qty": "2.2 Ton", "weightKg": 2200, "price": "$ 11.50 / kg", "date": "2025-10-16", "image": "BotellasPetCristal.png",
        "docs": [("Proceso", "Flakes molienda limpia HDPE."), ("Color", "Mezcla triturada clasificada.")]
    },
    {
        "script_id": 16, "title": "Perfiles de Aluminio Estructural", "category": "Metales", "publisher_email": "ventas@perfilestijuana.mx", "location": "Tijuana Industrial", "qty": "1.4 Ton", "weightKg": 1400, "price": "$ 34.00 / kg", "date": "2025-10-11", "image": "PerfilesAluminio.png",
        "docs": [("Anodizado", "Tramos de 3m a 6m estructurales."), ("Estado", "Superficie limpia en estiba.")]
    },
    {
        "script_id": 17, "title": "Polietileno de Alta Densidad (Pellet)", "category": "Plásticos", "publisher_email": "contacto@otayindustrial.mx", "location": "Otay Industrial", "qty": "3.5 Ton", "weightKg": 3500, "price": "$ 18.50 / kg", "date": "2025-10-09", "image": "BotellasPetCristal.png",
        "docs": [("Grado", "Pellet HDPE extruido y filtrado."), ("Color", "Negro industrial uniforme.")]
    },
    {
        "script_id": 18, "title": "Tarimas Europallet Usadas", "category": "Maderas", "publisher_email": "logistica@palletspacifico.mx", "location": "Pacifico", "qty": "60 Uds", "weightKg": 1200, "price": "$ 85.00 / ud", "date": "2025-10-13", "image": "Madera.png",
        "docs": [("Estándar", "Europallet HT tratamiento térmico."), ("Resistencia", "Capacidad carga 1.5 Ton.")]
    },
    {
        "script_id": 19, "title": "Rejas de Madera para Empaque", "category": "Maderas", "publisher_email": "logistica@palletspacifico.mx", "location": "Pacifico", "qty": "90 Uds", "weightKg": 900, "price": "$ 25.00 / ud", "date": "2025-10-21", "image": "Madera.png",
        "docs": [("Uso", "Cajas de pino para transporte pesado."), ("Reutilización", "Excelente estado general.")]
    },
    {
        "script_id": 20, "title": "Tiras de Latón Industrial", "category": "Metales", "publisher_email": "adquisiciones@fundidorabaja.mx", "location": "Fundidora Baja", "qty": "650 kg", "weightKg": 650, "price": "$ 55.00 / kg", "date": "2025-10-17", "image": "Aluminio.jpeg",
        "docs": [("Composición", "Latón 70/30 de troquelado."), ("Limpieza", "Libre de grasas pesadas.")]
    },
    {
        "script_id": 21, "title": "Lingotes de Aluminio Reciclado", "category": "Metales", "publisher_email": "adquisiciones@fundidorabaja.mx", "location": "Fundidora Baja", "qty": "4.5 Ton", "weightKg": 4500, "price": "$ 31.00 / kg", "date": "2025-10-25", "image": "PerfilesAluminio.png",
        "docs": [("Aleación", "A380 lingote secundario."), ("Certificado", "Espectrometría adjunta.")]
    },
    {
        "script_id": 22, "title": "Tambores de Plástico 200L", "category": "Plásticos", "publisher_email": "compras@ecoplast.mx", "location": "Mexicali", "qty": "120 Pzas", "weightKg": 600, "price": "$ 120.00 / pza", "date": "2025-10-07", "image": "BotellasPetCristal.png",
        "docs": [("Sanitización", "Lavados y desinfectados."), ("Doble tapón", "Rosca 2 pulgadas hermética.")]
    },
    {
        "script_id": 23, "title": "Contenedores IBC 1000L Limpios", "category": "Plásticos", "publisher_email": "compras@ecoplast.mx", "location": "Mexicali", "qty": "15 Uds", "weightKg": 1500, "price": "$ 1,100.00 / ud", "date": "2025-10-19", "image": "BotellasPetCristal.png",
        "docs": [("Estructura", "Tote IBC reja metálica."), ("Válvula", "Válvula bola 2 pulgadas probada.")]
    },
    {
        "script_id": 24, "title": "Scrap de Cable Eléctrico Mixto", "category": "Metales", "publisher_email": "compras@recicladnorte.mx", "location": "Recicladora Norte", "qty": "2.1 Ton", "weightKg": 2100, "price": "$ 62.00 / kg", "date": "2025-10-14", "image": "Aluminio.jpeg",
        "docs": [("Rendimiento", "55% cobre recuperable."), ("Origen", "Desmantelamiento eléctrico.")]
    },
    {
        "script_id": 25, "title": "Chatarra Estructural de Acero", "category": "Metales", "publisher_email": "compras@recicladnorte.mx", "location": "Recicladora Norte", "qty": "8 Ton", "weightKg": 8000, "price": "$ 4.80 / kg", "date": "2025-10-23", "image": "PerfilesAluminio.png",
        "docs": [("Formato", "Vigas I y placa cortada a 1.5m."), ("Calidad", "Acero A36 estructural.")]
    }
]


# ---------------------------------------------------------------------------
# PASO 1 â€” Generar PDFs
# ---------------------------------------------------------------------------
def create_pdf(product: dict) -> Path:
    pdf_path = PDFS_DIR / f"product_{product['script_id']}.pdf"
    pdf = FPDF(format='letter')
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 20)
    pdf.cell(0, 10, f"Ficha Tecnica - {product['title']}")
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 12)
    for label, value in [
        ('Categoria', product['category']),
        ('Ubicacion', product['location']),
        ('Fecha de publicacion', product['date']),
        ('Cantidad disponible', product['qty']),
        ('Peso total', f"{product['weightKg']} kg"),
        ('Precio', product['price']),
    ]:
        pdf.cell(0, 8, f"{label}: {value}")
        pdf.ln(8)
    pdf.ln(4)
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, 'Documentacion')
    pdf.ln(10)
    for title, text in product['docs']:
        pdf.set_font('Helvetica', 'B', 12)
        pdf.multi_cell(180, 7, title)
        pdf.set_font('Helvetica', '', 11)
        pdf.multi_cell(180, 6, text)
        pdf.ln(3)
    pdf.output(str(pdf_path))
    return pdf_path


def step1_pdfs():
    print('\n[1/4] Generando PDFs de fichas tecnicas...')
    for p in PRODUCTS:
        path = create_pdf(p)
        print(f'  [OK] {path.name}')


# ---------------------------------------------------------------------------
# PASO 2 — Ejecutar insert.sql en el contenedor DB
# ---------------------------------------------------------------------------
def run_psql(sql: str) -> tuple[int, str, str]:
    result = subprocess.run(
        ['docker', 'exec', '-i', DB_CONTAINER,
         'psql', '-U', 'postgres', '-d', 'ecoboros'],
        input=sql, capture_output=True, text=True
    )
    return result.returncode, result.stdout, result.stderr


def step2_sql():
    print('\n[2/4] Ejecutando insert.sql...')
    insert_sql = ROOT_DIR / 'db' / 'insert.sql'
    code, out, err = run_psql(insert_sql.read_text(encoding='utf-8'))
    if code == 0:
        print('  [OK] insert.sql ejecutado OK')
        # Mostrar resumen de filas insertadas
        for line in out.strip().split('\n'):
            if line.strip() and not line.startswith('psql') and 'INSERT' in line:
                print(f'    {line.strip()}')
    else:
        print(f'  [ERROR] Error:\n{err[:600]}')


# ---------------------------------------------------------------------------
# PASO 3 — Copiar archivos a carpetas de evidencia por waste_id
# ---------------------------------------------------------------------------
import unicodedata

def norm_title(s: str) -> str:
    if not s:
        return ""
    # Quitar acentos y caracteres especiales para comparación segura
    nfkd = unicodedata.normalize('NFKD', s)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).strip().lower()


def get_waste_title_map() -> dict:
    """Llama a la API y devuelve {title_normalizado: waste_id}."""
    try:
        resp = requests.get(f'{API_BASE}/wastes/', timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict):
            data = data.get('results', data.get('value', []))
        mapping = {}
        for w in data:
            title = w['title']
            mapping[title] = w['waste_id']
            mapping[title.strip().lower()] = w['waste_id']
            mapping[norm_title(title)] = w['waste_id']
        return mapping
    except Exception as e:
        print(f'  [ERROR] No se pudo obtener wastes de la API: {e}')
        return {}


def step3_copy(title_map: dict):
    print('\n[3/4] Copiando imagenes y PDFs a carpetas de evidencia...')
    for p in PRODUCTS:
        waste_id = title_map.get(p['title']) or title_map.get(p['title'].strip().lower()) or title_map.get(norm_title(p['title']))
        if not waste_id:
            print(f'  [WARN] Sin waste_id para: "{p["title"]}" - omitido')
            continue

        dest_dir = IMAGES_DIR / str(waste_id)
        dest_dir.mkdir(exist_ok=True)

        # Imagen
        if p['image']:
            src = IMAGES_DIR / p['image']
            dst = dest_dir / p['image']
            if src.exists() and not dst.exists():
                shutil.copy2(src, dst)
                print(f'  [OK] waste {waste_id} imagen -> {p["image"]}')
            elif dst.exists():
                print(f'  [INFO] waste {waste_id} imagen ya existe: {p["image"]}')
            else:
                print(f'  [WARN] Imagen fuente no encontrada: {src}')

        # PDF de ficha tecnica
        pdf_name = f"product_{p['script_id']}.pdf"
        src_pdf  = PDFS_DIR / pdf_name
        dst_pdf  = dest_dir / pdf_name
        if src_pdf.exists() and not dst_pdf.exists():
            shutil.copy2(src_pdf, dst_pdf)
            print(f'  [OK] waste {waste_id} PDF    -> {pdf_name}')
        elif dst_pdf.exists():
            print(f'  [INFO] waste {waste_id} PDF ya existe: {pdf_name}')
        else:
            print(f'  [WARN] PDF fuente no encontrado: {src_pdf}')


# ---------------------------------------------------------------------------
# PASO 4 — Insertar evidencias en la BD con rutas reales
# ---------------------------------------------------------------------------
def step4_evidences(title_map: dict):
    """
    Rutas relativas a MEDIA_ROOT (/app/media en Docker).
    El volumen Docker mapea:  Public/Imagenes/ -> /app/media/waste_evidences/
    Por eso la ruta es:  waste_evidences/<waste_id>/<filename>
    """
    print('\n[4/4] Insertando evidencias en la base de datos...')

    evidence_rows = []  # (waste_id, file_path, file_type)

    for p in PRODUCTS:
        waste_id = title_map.get(p['title']) or title_map.get(p['title'].strip().lower()) or title_map.get(norm_title(p['title']))
        if not waste_id:
            continue

        # Imagen
        if p['image']:
            img_dst = IMAGES_DIR / str(waste_id) / p['image']
            if img_dst.exists():
                rel = f"waste_evidences/{waste_id}/{p['image']}"
                evidence_rows.append((waste_id, rel, 'image'))

        # PDF
        pdf_name = f"product_{p['script_id']}.pdf"
        pdf_dst  = IMAGES_DIR / str(waste_id) / pdf_name
        if pdf_dst.exists():
            rel = f"waste_evidences/{waste_id}/{pdf_name}"
            evidence_rows.append((waste_id, rel, 'pdf'))

    if not evidence_rows:
        print('  [WARN] No hay evidencias para insertar.')
        return

    # Construir un unico INSERT ... VALUES (...)
    values_sql = ',\n  '.join(
        f"({wid}, '{fp}', '{ft}')"
        for wid, fp, ft in evidence_rows
    )
    sql = f"""
INSERT INTO waste_evidences (waste_id, file_path, file_type)
VALUES
  {values_sql}
ON CONFLICT DO NOTHING;
"""
    code, out, err = run_psql(sql)
    if code == 0:
        print(f'  [OK] {len(evidence_rows)} evidencias insertadas (o ya existian)')
    else:
        print(f'  [ERROR] Error insertando evidencias:\n{err[:600]}')


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
if __name__ == '__main__':
    step1_pdfs()
    step2_sql()
    title_map = get_waste_title_map()
    if title_map:
        step3_copy(title_map)
        step4_evidences(title_map)
    else:
        print('\n[WARN] No se pudo resolver title_map. Pasos 3 y 4 omitidos.')
        print('   Asegurate de que la API esta corriendo en http://localhost:8000')

    print('\n[OK] Seeding completo.')
    print('   Si los cambios no aparecen en la web, reinicia: docker restart ecoboros-back-1')

