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
    # METALES
    {"script_id":  1,"title":"Recortes de Aluminio 6061",       "category":"Metales","publisher_email":"ventas@aluminioflorido.mx",     "location":"El Florido",        "qty":"2.5 Ton", "weightKg":2500,"price":"$ 28.50 / kg","date":"2025-10-05","image":"Aluminio.jpeg",
     "docs":[("Especificaciones","Aleacion 6061-T6 ideal para mecanizado."),("Calidad","Material limpio sin oxido.")]},
    {"script_id":  2,"title":"Viruta y Rebaba de Aluminio",     "category":"Metales","publisher_email":"ventas@aluminioflorido.mx",     "location":"El Florido",        "qty":"1.5 Ton", "weightKg":1500,"price":"$ 22.00 / kg","date":"2025-10-12","image":"Aluminio.jpeg",
     "docs":[("Proceso","Rebaba de fresado CNC prensada."),("Manejo","Briquetado de alta densidad.")]},
    {"script_id":  3,"title":"Aluminio 1100 en Lamina",         "category":"Metales","publisher_email":"ventas@aluminioflorido.mx",     "location":"El Florido",        "qty":"800 kg",  "weightKg":800, "price":"$ 26.00 / kg","date":"2025-11-02","image":"Aluminio.jpeg",
     "docs":[("Tipo","Lamina 1100 alta pureza calibre 16."),("Uso","Conformado en frio.")]},
    {"script_id":  4,"title":"Alambre de Aluminio para Fusion", "category":"Metales","publisher_email":"ventas@aluminioflorido.mx",     "location":"El Florido",        "qty":"600 kg",  "weightKg":600, "price":"$ 20.00 / kg","date":"2025-11-20","image":"Aluminio.jpeg",
     "docs":[("Tipo","Alambre Al 1350 para fundicion."),("Calidad","Sin oxido superficial.")]},
    {"script_id":  5,"title":"Cobre de Primera (Pelado)",       "category":"Metales","publisher_email":"ventas@cobreotay.mx",           "location":"Otay",              "qty":"300 kg",  "weightKg":300, "price":"$ 140.00 / kg","date":"2025-10-15","image":"Cobre.jpeg",
     "docs":[("Calidad","Cobre limpio pelado grado comercial A."),("Aplicacion","Reciclaje metalurgico.")]},
    {"script_id":  6,"title":"Placas de Cobre Electrolitico",   "category":"Metales","publisher_email":"ventas@cobreotay.mx",           "location":"Otay",              "qty":"750 kg",  "weightKg":750, "price":"$ 145.00 / kg","date":"2025-10-22","image":"Cobre.jpeg",
     "docs":[("Pureza","Cobre electrolitico 99.9%."),("Fundicion","Apto fundicion especial.")]},
    {"script_id":  7,"title":"Cobre Rojo N2 con Aislante",      "category":"Metales","publisher_email":"ventas@cobreotay.mx",           "location":"Otay",              "qty":"900 kg",  "weightKg":900, "price":"$ 72.00 / kg","date":"2025-11-08","image":"Cobre.jpeg",
     "docs":[("Contenido","~70% cobre cable industrial."),("Estado","Cubierta PVC retirada.")]},
    {"script_id":  8,"title":"Tuberia de Cobre Tipo L",         "category":"Metales","publisher_email":"ventas@cobreotay.mx",           "location":"Otay",              "qty":"420 kg",  "weightKg":420, "price":"$ 130.00 / kg","date":"2025-11-15","image":"Cobre.jpeg",
     "docs":[("Tipo","Tuberia Cu tipo L 1/2 a 2 pulgadas."),("Estado","Sin fugas previas.")]},
    {"script_id":  9,"title":"Perfiles de Aluminio Estructural","category":"Metales","publisher_email":"ventas@perfilestijuana.mx",     "location":"Tijuana Industrial","qty":"1.4 Ton", "weightKg":1400,"price":"$ 34.00 / kg","date":"2025-10-11","image":"PerfilesAluminio.png",
     "docs":[("Anodizado","Tramos 3-6 m sin corrosion."),("Estado","Superficie limpia en estiba.")]},
    {"script_id": 10,"title":"Angulos de Aluminio 6063",        "category":"Metales","publisher_email":"ventas@perfilestijuana.mx",     "location":"Tijuana Industrial","qty":"950 kg",  "weightKg":950, "price":"$ 30.00 / kg","date":"2025-11-05","image":"PerfilesAluminio.png",
     "docs":[("Tipo","Angulo extruido 6063-T5."),("Uso","Estructuras ligeras.")]},
    {"script_id": 11,"title":"Tubos Cuadrados de Aluminio",     "category":"Metales","publisher_email":"ventas@perfilestijuana.mx",     "location":"Tijuana Industrial","qty":"700 kg",  "weightKg":700, "price":"$ 32.00 / kg","date":"2025-11-18","image":"PerfilesAluminio.png",
     "docs":[("Medida","40x40 mm seccion completa."),("Estado","Sin deformaciones.")]},
    {"script_id": 12,"title":"Tiras de Laton Industrial",       "category":"Metales","publisher_email":"adquisiciones@fundidorabaja.mx","location":"Fundidora Baja",   "qty":"650 kg",  "weightKg":650, "price":"$ 55.00 / kg","date":"2025-10-17","image":"Cobre.jpeg",
     "docs":[("Composicion","Laton 70/30 de troquelado."),("Limpieza","Libre de grasas pesadas.")]},
    {"script_id": 13,"title":"Lingotes de Aluminio Reciclado",  "category":"Metales","publisher_email":"adquisiciones@fundidorabaja.mx","location":"Fundidora Baja",   "qty":"4.5 Ton", "weightKg":4500,"price":"$ 31.00 / kg","date":"2025-10-25","image":"Aluminio.jpeg",
     "docs":[("Aleacion","A380 lingote secundario."),("Certificado","Espectrometria adjunta.")]},
    {"script_id": 14,"title":"Bronce Fosforado en Chatarra",    "category":"Metales","publisher_email":"adquisiciones@fundidorabaja.mx","location":"Fundidora Baja",   "qty":"380 kg",  "weightKg":380, "price":"$ 88.00 / kg","date":"2025-11-10","image":"Cobre.jpeg",
     "docs":[("Material","Bronce C544 fuera de servicio."),("Uso","Refundicion de alta calidad.")]},
    {"script_id": 15,"title":"Scrap de Cable Electrico Mixto",  "category":"Metales","publisher_email":"compras@recicladnorte.mx",      "location":"Recicladora Norte", "qty":"2.1 Ton", "weightKg":2100,"price":"$ 62.00 / kg","date":"2025-10-14","image":"Cobre.jpeg",
     "docs":[("Rendimiento","55% cobre recuperable."),("Origen","Desmantelamiento electrico.")]},
    {"script_id": 16,"title":"Chatarra Estructural de Acero",   "category":"Metales","publisher_email":"compras@recicladnorte.mx",      "location":"Recicladora Norte", "qty":"8 Ton",   "weightKg":8000,"price":"$ 4.80 / kg","date":"2025-10-23","image":"PerfilesAluminio.png",
     "docs":[("Formato","Vigas I y placa cortada a 1.5m."),("Calidad","Acero A36 estructural.")]},
    {"script_id": 17,"title":"Acero Inoxidable 304 en Recortes","category":"Metales","publisher_email":"compras@recicladnorte.mx",      "location":"Recicladora Norte", "qty":"1.1 Ton", "weightKg":1100,"price":"$ 38.00 / kg","date":"2025-11-12","image":"PerfilesAluminio.png",
     "docs":[("Tipo","Chapa 304 de troqueleria."),("Estado","Sin oxido, espesor 1-3 mm.")]},
    {"script_id": 18,"title":"Lamina de Acero Inoxidable (Saldos)","category":"Metales","publisher_email":"acero@pacifico.com",         "location":"Aceros del Pacifico","qty":"1.25 Ton","weightKg":1250,"price":"$ 25.00 / kg","date":"2025-10-28","image":"PerfilesAluminio.png",
     "docs":[("Tipo","Inoxidable 304 varios calibres."),("Aplicacion","Proyectos industriales.")]},
    {"script_id": 19,"title":"Tuberia de Acero al Carbon",      "category":"Metales","publisher_email":"acero@pacifico.com",            "location":"Aceros del Pacifico","qty":"3 Ton",   "weightKg":3000,"price":"$ 6.50 / kg","date":"2025-11-05","image":"PerfilesAluminio.png",
     "docs":[("Diametro","4 y 6 pulgadas sobrantes."),("Estado","Sin oxido excesivo.")]},
    {"script_id": 20,"title":"Herrajes de Acero Galvanizado",   "category":"Metales","publisher_email":"acero@pacifico.com",            "location":"Aceros del Pacifico","qty":"500 kg",  "weightKg":500, "price":"$ 18.00 / kg","date":"2025-11-12","image":"PerfilesAluminio.png",
     "docs":[("Tipo","Tornillos, pernos y escuadras."),("Origen","Saldos de construccion.")]},
    {"script_id": 21,"title":"Acero de Refuerzo (Varilla)",     "category":"Metales","publisher_email":"acero@pacifico.com",            "location":"Aceros del Pacifico","qty":"2 Ton",   "weightKg":2000,"price":"$ 5.50 / kg","date":"2025-11-22","image":"PerfilesAluminio.png",
     "docs":[("Tipo","Varilla corrugada grado 42."),("Longitud","Tramos de 6 metros.")]},
    {"script_id": 22,"title":"Perfiles de Aluminio Extruido",   "category":"Metales","publisher_email":"empresa@ecoboros.com",          "location":"Otay Industrial",   "qty":"500 kg",  "weightKg":500, "price":"$ 32.00 / kg","date":"2025-10-20","image":"Aluminio.jpeg",
     "docs":[("Tipo","Seccion rectangular limpia."),("Condicion","Sin corrosion visible.")]},
    # PLASTICOS
    {"script_id": 23,"title":"Bidones HDPE Tricapa",            "category":"Plasticos","publisher_email":"empresa@ecoboros.com",        "location":"Otay Industrial",   "qty":"850 Pzas","weightKg":850, "price":"$ 15.00 / pza","date":"2025-10-01","image":"Plasticos.png",
     "docs":[("Capacidad","220 L resistencia industrial."),("Estado","Sin deformaciones visibles.")]},
    {"script_id": 24,"title":"Botellas PET Cristal",            "category":"Plasticos","publisher_email":"contacto@petrosarito.mx",     "location":"Rosarito",          "qty":"1 Ton",   "weightKg":1000,"price":"$ 8.00 / kg","date":"2025-10-02","image":"Plasticos.png",
     "docs":[("Material","PET alimenticio limpio."),("Certificacion","Normas de reciclaje.")]},
    {"script_id": 25,"title":"Envases HDPE Triturados (Molienda)","category":"Plasticos","publisher_email":"contacto@petrosarito.mx",  "location":"Rosarito",          "qty":"2.2 Ton", "weightKg":2200,"price":"$ 11.50 / kg","date":"2025-10-16","image":"Plasticos.png",
     "docs":[("Proceso","Flakes molienda HDPE limpia."),("Color","Mezcla clasificada.")]},
    {"script_id": 26,"title":"Lamina de PET Transparente",      "category":"Plasticos","publisher_email":"contacto@petrosarito.mx",     "location":"Rosarito",          "qty":"600 kg",  "weightKg":600, "price":"$ 12.00 / kg","date":"2025-11-10","image":"Plasticos.png",
     "docs":[("Tipo","PET termoformable 0.5 mm."),("Uso","Envases y blisters.")]},
    {"script_id": 27,"title":"PET Verde Molido Post-Consumo",   "category":"Plasticos","publisher_email":"contacto@petrosarito.mx",     "location":"Rosarito",          "qty":"900 kg",  "weightKg":900, "price":"$ 7.50 / kg","date":"2025-11-22","image":"Plasticos.png",
     "docs":[("Color","Verde lavado y clasificado."),("Fluidez","Buena para extrusion.")]},
    {"script_id": 28,"title":"Polietileno de Alta Densidad (Pellet)","category":"Plasticos","publisher_email":"contacto@otayindustrial.mx","location":"Otay Industrial","qty":"3.5 Ton", "weightKg":3500,"price":"$ 18.50 / kg","date":"2025-10-09","image":"Plasticos.png",
     "docs":[("Grado","Pellet HDPE negro industrial."),("Proceso","Filtrado 100 mallas.")]},
    {"script_id": 29,"title":"Polietileno de Baja Densidad (LDPE)","category":"Plasticos","publisher_email":"contacto@otayindustrial.mx","location":"Otay Industrial","qty":"1.8 Ton", "weightKg":1800,"price":"$ 9.00 / kg","date":"2025-11-04","image":"Plasticos.png",
     "docs":[("Tipo","Film agricola LDPE molido."),("Calidad","Propiedades mecanicas preservadas.")]},
    {"script_id": 30,"title":"Tambores de Plastico 200L",       "category":"Plasticos","publisher_email":"compras@ecoplast.mx",         "location":"Mexicali",          "qty":"120 Pzas","weightKg":600, "price":"$ 120.00 / pza","date":"2025-10-07","image":"Plasticos.png",
     "docs":[("Sanitizacion","Lavados y desinfectados."),("Tapon","Rosca 2 pulgadas hermetica.")]},
    {"script_id": 31,"title":"Contenedores IBC 1000L Limpios",  "category":"Plasticos","publisher_email":"compras@ecoplast.mx",         "location":"Mexicali",          "qty":"15 Uds",  "weightKg":1500,"price":"$ 1,100.00 / ud","date":"2025-10-19","image":"Plasticos.png",
     "docs":[("Estructura","Tote IBC reja metalica."),("Valvula","Bola 2 pulgadas probada.")]},
    {"script_id": 32,"title":"Pelicula Stretch de Polipropileno","category":"Plasticos","publisher_email":"compras@ecoplast.mx",        "location":"Mexicali",          "qty":"400 kg",  "weightKg":400, "price":"$ 14.00 / kg","date":"2025-11-08","image":"Plasticos.png",
     "docs":[("Tipo","PP stretch sin marca."),("Uso","Empaque secundario industrial.")]},
    {"script_id": 33,"title":"Tapas y Tapones PP Mixtos",       "category":"Plasticos","publisher_email":"compras@ecoplast.mx",         "location":"Mexicali",          "qty":"350 kg",  "weightKg":350, "price":"$ 10.00 / kg","date":"2025-11-18","image":"Plasticos.png",
     "docs":[("Material","Polipropileno clasificado."),("Estado","Limpias por color.")]},
    {"script_id": 34,"title":"Polipropileno en Hojuelas (PP)",  "category":"Plasticos","publisher_email":"polimeros@frontera.com",      "location":"Frontera",          "qty":"4 Ton",   "weightKg":4000,"price":"$ 14.00 / kg","date":"2025-10-30","image":"Plasticos.png",
     "docs":[("Calidad","Hojuelas post-industriales limpias."),("Uso","Extrusion y moldeo.")]},
    {"script_id": 35,"title":"PVC Rigido Molido",               "category":"Plasticos","publisher_email":"polimeros@frontera.com",      "location":"Frontera",          "qty":"2 Ton",   "weightKg":2000,"price":"$ 9.00 / kg","date":"2025-11-08","image":"Plasticos.png",
     "docs":[("Origen","Perfiles de ventanas."),("Pureza","Libre de contaminantes.")]},
    {"script_id": 36,"title":"Nylon 6 Molido Post-Industrial",  "category":"Plasticos","publisher_email":"polimeros@frontera.com",      "location":"Frontera",          "qty":"500 kg",  "weightKg":500, "price":"$ 22.00 / kg","date":"2025-11-20","image":"Plasticos.png",
     "docs":[("Material","Nylon 6 piezas tecnicas."),("Limpieza","Libre de aceite.")]},
    {"script_id": 37,"title":"ABS Molido Clasificado",          "category":"Plasticos","publisher_email":"polimeros@frontera.com",      "location":"Frontera",          "qty":"700 kg",  "weightKg":700, "price":"$ 18.00 / kg","date":"2025-11-28","image":"Plasticos.png",
     "docs":[("Calidad","ABS post-industrial."),("Color","Clasificado por tono.")]},
    # CARTONES
    {"script_id": 38,"title":"Pacas de Carton Corrugado",       "category":"Carton","publisher_email":"operaciones@cartoneslamesa.mx",  "location":"La Mesa",           "qty":"5 Ton",   "weightKg":5000,"price":"$ 3.20 / kg","date":"2025-10-10","image":"CartonCorrugado.png",
     "docs":[("Tipo","Corrugado reciclado densidad media."),("Uso","Embalaje y empaque.")]},
    {"script_id": 39,"title":"Carton Plegadizo Grado Industrial","category":"Carton","publisher_email":"operaciones@cartoneslamesa.mx", "location":"La Mesa",           "qty":"3.2 Ton", "weightKg":3200,"price":"$ 2.80 / kg","date":"2025-10-18","image":"CartonCorrugado.png",
     "docs":[("Calidad","Plegadizo seco enfardado."),("Uso","Reaprovechamiento papelero.")]},
    {"script_id": 40,"title":"Carton Liner Blanco Prensado",    "category":"Carton","publisher_email":"operaciones@cartoneslamesa.mx",  "location":"La Mesa",           "qty":"2 Ton",   "weightKg":2000,"price":"$ 3.80 / kg","date":"2025-11-01","image":"CartonCorrugado.png",
     "docs":[("Tipo","Liner blanco alto gramaje."),("Uso","Empaque de alimentos.")]},
    {"script_id": 41,"title":"Carton Micro-Corrugado Residual", "category":"Carton","publisher_email":"operaciones@cartoneslamesa.mx",  "location":"La Mesa",           "qty":"1.5 Ton", "weightKg":1500,"price":"$ 2.60 / kg","date":"2025-11-15","image":"CartonCorrugado.png",
     "docs":[("Tipo","Micro-corrugado de imprentas."),("Estado","Seco sin barniz.")]},
    {"script_id": 42,"title":"Carton Gris Multicapa",           "category":"Carton","publisher_email":"operaciones@cartoneslamesa.mx",  "location":"La Mesa",           "qty":"800 kg",  "weightKg":800, "price":"$ 2.20 / kg","date":"2025-11-25","image":"CartonCorrugado.png",
     "docs":[("Uso","Carpetas y encuadernacion."),("Estado","Buen estado.")]},
    {"script_id": 43,"title":"Carton Kraft para Cajas de Envio","category":"Carton","publisher_email":"operaciones@cartoneslamesa.mx",  "location":"La Mesa",           "qty":"2.8 Ton", "weightKg":2800,"price":"$ 2.50 / kg","date":"2025-12-01","image":"CartonCorrugado.png",
     "docs":[("Tipo","Cajas kraft desarmadas."),("Estado","Aptas re-empaque.")]},
    {"script_id": 44,"title":"Carton Gris de Empaque Mixto",    "category":"Carton","publisher_email":"contacto@zonacentro.mx",         "location":"Zona Centro",       "qty":"2 Ton",   "weightKg":2000,"price":"$ 2.50 / kg","date":"2025-11-22","image":"CartonCorrugado.png",
     "docs":[("Origen","Empaque farmaceutico."),("Estado","Limpio y clasificado.")]},
    {"script_id": 45,"title":"Cajas de Carton para Exportacion","category":"Carton","publisher_email":"contacto@zonacentro.mx",         "location":"Zona Centro",       "qty":"3.5 Ton", "weightKg":3500,"price":"$ 2.90 / kg","date":"2025-11-28","image":"CartonCorrugado.png",
     "docs":[("Tipo","Doble cara exportacion."),("Estado","Buen estado estructural.")]},
    {"script_id": 46,"title":"Carton Plastificado Residual",    "category":"Carton","publisher_email":"contacto@zonacentro.mx",         "location":"Zona Centro",       "qty":"1.2 Ton", "weightKg":1200,"price":"$ 1.80 / kg","date":"2025-12-05","image":"CartonCorrugado.png",
     "docs":[("Tipo","Carton con capa plastica."),("Reciclaje","Especializado.")]},
    {"script_id": 47,"title":"Separadores de Carton Industrial","category":"Carton","publisher_email":"empresa@ecoboros.com",           "location":"Otay Industrial",   "qty":"600 kg",  "weightKg":600, "price":"$ 1.50 / kg","date":"2025-12-08","image":"CartonCorrugado.png",
     "docs":[("Uso","Logistica de piezas."),("Estado","Reutilizables.")]},
    {"script_id": 48,"title":"Tubos de Carton para Bobinas",    "category":"Carton","publisher_email":"adquisiciones@fundidorabaja.mx","location":"Fundidora Baja",    "qty":"450 kg",  "weightKg":450, "price":"$ 3.00 / kg","date":"2025-12-10","image":"CartonCorrugado.png",
     "docs":[("Tipo","Nucleos tubulares varios diametros."),("Uso","Rebobinado industrial.")]},
    # PAPELES
    {"script_id": 49,"title":"Archivo Muerto (Triturado)",      "category":"Papel","publisher_email":"contacto@zonacentro.mx",          "location":"Zona Centro",       "qty":"1.2 Ton", "weightKg":1200,"price":"$ 2.10 / kg","date":"2025-09-15","image":"Papel.png",
     "docs":[("Material","Papeleria triturada bond y cartulina."),("Seguridad","Libre de datos sensibles.")]},
    {"script_id": 50,"title":"Bobinas de Papel Kraft Residual", "category":"Papel","publisher_email":"contacto@zonacentro.mx",          "location":"Zona Centro",       "qty":"2.8 Ton", "weightKg":2800,"price":"$ 4.50 / kg","date":"2025-10-08","image":"Papel.png",
     "docs":[("Gramaje","Kraft pesado residual."),("Uso","Conversion a cartoncillo.")]},
    {"script_id": 51,"title":"Papel Bond de Impresion (Recortes)","category":"Papel","publisher_email":"contacto@zonacentro.mx",       "location":"Zona Centro",       "qty":"900 kg",  "weightKg":900, "price":"$ 1.80 / kg","date":"2025-10-25","image":"Papel.png",
     "docs":[("Tipo","Bond 75 g/m2 corte digital."),("Estado","Libre de humedad.")]},
    {"script_id": 52,"title":"Papel Periodico Residual",        "category":"Papel","publisher_email":"contacto@zonacentro.mx",          "location":"Zona Centro",       "qty":"4 Ton",   "weightKg":4000,"price":"$ 1.20 / kg","date":"2025-11-05","image":"Papel.png",
     "docs":[("Tipo","Bobinas de imprenta."),("Fibra","Corta apta para reciclaje.")]},
    {"script_id": 53,"title":"Papel Couche Sin Barniz",         "category":"Papel","publisher_email":"contacto@zonacentro.mx",          "location":"Zona Centro",       "qty":"1.5 Ton", "weightKg":1500,"price":"$ 2.40 / kg","date":"2025-11-15","image":"Papel.png",
     "docs":[("Tipo","Couche mate 135 g/m2."),("Uso","Reciclado de fibra larga.")]},
    {"script_id": 54,"title":"Papel Tissue Post-Consumo",       "category":"Papel","publisher_email":"contacto@zonacentro.mx",          "location":"Zona Centro",       "qty":"700 kg",  "weightKg":700, "price":"$ 1.00 / kg","date":"2025-11-28","image":"Papel.png",
     "docs":[("Origen","Hoteles y hospitales."),("Fibra","Corta apta para repulpeo.")]},
    {"script_id": 55,"title":"Papel Kraft Para Empaque",        "category":"Papel","publisher_email":"compras@recicladnorte.mx",        "location":"Recicladora Norte", "qty":"800 kg",  "weightKg":800, "price":"$ 3.50 / kg","date":"2025-11-15","image":"Papel.png",
     "docs":[("Tipo","Kraft de imprenta."),("Uso","Empaque industrial secundario.")]},
    {"script_id": 56,"title":"Papel Reciclado Mixto (Mezcla de Oficina)","category":"Papel","publisher_email":"compras@recicladnorte.mx","location":"Recicladora Norte","qty":"2 Ton","weightKg":2000,"price":"$ 1.60 / kg","date":"2025-11-22","image":"Papel.png",
     "docs":[("Mezcla","Bond, fax y color."),("Estado","Sin clips ni espirales.")]},
    {"script_id": 57,"title":"Papel Satinado Residual de Revista","category":"Papel","publisher_email":"empresa@ecoboros.com",         "location":"Otay Industrial",   "qty":"1.1 Ton", "weightKg":1100,"price":"$ 2.00 / kg","date":"2025-12-01","image":"Papel.png",
     "docs":[("Origen","Editorial sobrante."),("Fibra","Larga alta calidad.")]},
    {"script_id": 58,"title":"Papel para Envolver (Saldos de Imprenta)","category":"Papel","publisher_email":"logistica@palletspacifico.mx","location":"Pacifico","qty":"550 kg","weightKg":550,"price":"$ 2.80 / kg","date":"2025-12-05","image":"Papel.png",
     "docs":[("Tipo","Kraft sin estampado 70 cm."),("Origen","Excedente de produccion.")]},
    {"script_id": 59,"title":"Papel Siliconado Residual",       "category":"Papel","publisher_email":"polimeros@frontera.com",          "location":"Frontera",          "qty":"300 kg",  "weightKg":300, "price":"$ 0.90 / kg","date":"2025-12-08","image":"Papel.png",
     "docs":[("Tipo","Release liner de etiquetas."),("Reciclaje","Especializado.")]},
    {"script_id": 60,"title":"Papel Estucado para Impresion Offset","category":"Papel","publisher_email":"madera@pinosolitario.com",   "location":"El Pino Solitario", "qty":"650 kg",  "weightKg":650, "price":"$ 2.20 / kg","date":"2025-12-10","image":"Papel.png",
     "docs":[("Tipo","Estucado 170 g/m2 alto brillo."),("Estado","Lote clasificado.")]},
    # MADERAS
    {"script_id": 61,"title":"Pallets de Pino (Reparables)",    "category":"Maderas","publisher_email":"empresa@ecoboros.com",         "location":"Otay Industrial",   "qty":"200 Uds", "weightKg":4000,"price":"$ 45.00 / ud","date":"2025-09-28","image":"Madera.png",
     "docs":[("Condicion","Listos para reparacion."),("Material","Pino tratado sin humedad.")]},
    {"script_id": 62,"title":"Tarimas Europallet Usadas",       "category":"Maderas","publisher_email":"logistica@palletspacifico.mx", "location":"Pacifico",          "qty":"60 Uds",  "weightKg":1200,"price":"$ 85.00 / ud","date":"2025-10-13","image":"Madera.png",
     "docs":[("Estandar","Europallet HT."),("Resistencia","1.5 Ton carga.")]},
    {"script_id": 63,"title":"Rejas de Madera para Empaque",    "category":"Maderas","publisher_email":"logistica@palletspacifico.mx", "location":"Pacifico",          "qty":"90 Uds",  "weightKg":900, "price":"$ 25.00 / ud","date":"2025-10-21","image":"Madera.png",
     "docs":[("Uso","Embalaje pesado."),("Estado","Buen estado general.")]},
    {"script_id": 64,"title":"Tablas de Pino Cepillado (Saldos)","category":"Maderas","publisher_email":"logistica@palletspacifico.mx","location":"Pacifico",         "qty":"250 Uds", "weightKg":2500,"price":"$ 18.00 / ud","date":"2025-11-03","image":"Madera.png",
     "docs":[("Tipo","Pino 2x6 largo 1.5-3 m."),("Estado","Sin nudos grandes.")]},
    {"script_id": 65,"title":"Marcos de Madera de Empaque Industrial","category":"Maderas","publisher_email":"logistica@palletspacifico.mx","location":"Pacifico",   "qty":"120 Uds", "weightKg":1800,"price":"$ 30.00 / ud","date":"2025-11-15","image":"Madera.png",
     "docs":[("Tipo","Marcos para maquinaria pesada."),("Estado","Sin fracturas.")]},
    {"script_id": 66,"title":"Postes de Madera Tratada",        "category":"Maderas","publisher_email":"madera@pinosolitario.com",      "location":"El Pino Solitario", "qty":"50 Uds",  "weightKg":2500,"price":"$ 150.00 / ud","date":"2025-11-01","image":"Madera.png",
     "docs":[("Tratamiento","Pino tratado exterior."),("Condicion","Excelente estado.")]},
    {"script_id": 67,"title":"Vigas de Madera de Pino Estructural","category":"Maderas","publisher_email":"madera@pinosolitario.com",  "location":"El Pino Solitario", "qty":"80 Uds",  "weightKg":3200,"price":"$ 120.00 / ud","date":"2025-11-10","image":"Madera.png",
     "docs":[("Tipo","Pino 4x8 largo 4 m."),("Origen","Demolicion controlada.")]},
    {"script_id": 68,"title":"Triplay de Madera (Recortes)",    "category":"Maderas","publisher_email":"madera@pinosolitario.com",      "location":"El Pino Solitario", "qty":"700 kg",  "weightKg":700, "price":"$ 8.00 / kg","date":"2025-11-20","image":"Madera.png",
     "docs":[("Tipo","Recortes varios espesores."),("Uso","Muebleria y artesania.")]},
    {"script_id": 69,"title":"Duela de Pino para Reciclaje",    "category":"Maderas","publisher_email":"madera@pinosolitario.com",      "location":"El Pino Solitario", "qty":"1.5 Ton", "weightKg":1500,"price":"$ 12.00 / kg","date":"2025-12-01","image":"Madera.png",
     "docs":[("Tipo","Duela piso nave industrial."),("Estado","Sin clavos, 80 cm.")]},
    {"script_id": 70,"title":"Cajones de Madera para Fruta",    "category":"Maderas","publisher_email":"compras@recicladnorte.mx",      "location":"Recicladora Norte", "qty":"300 Pzas","weightKg":600, "price":"$ 5.00 / pza","date":"2025-12-05","image":"Madera.png",
     "docs":[("Tipo","Cajones de alamo."),("Uso","Segunda vida re-empaque.")]},
    {"script_id": 71,"title":"Cunas y Calzas de Madera Industrial","category":"Maderas","publisher_email":"contacto@otayindustrial.mx","location":"Otay Industrial",  "qty":"400 kg",  "weightKg":400, "price":"$ 6.00 / kg","date":"2025-12-08","image":"Madera.png",
     "docs":[("Tipo","Madera dura para carga pesada."),("Estado","Sin fracturas.")]},
    {"script_id": 72,"title":"Madera Aglomerada (MDF Recortes)", "category":"Maderas","publisher_email":"acero@pacifico.com",           "location":"Aceros del Pacifico","qty":"900 kg",  "weightKg":900, "price":"$ 4.50 / kg","date":"2025-12-10","image":"Madera.png",
     "docs":[("Tipo","MDF 15 mm de imprentas."),("Estado","Sin pintura activa.")]},
    # ELECTRONICOS
    {"script_id": 73,"title":"Tarjetas Madre (Scrap)",          "category":"Electronicos","publisher_email":"scrap@nordika.mx",        "location":"Nordika",           "qty":"500 kg",  "weightKg":500, "price":"$ 48.00 / kg","date":"2025-10-12","image":"Electronicos.png",
     "docs":[("Tipo","Scrap tarjetas madre."),("Inspeccion","Revision visual previa.")]},
    {"script_id": 74,"title":"Motores Electricos Desmantelados","category":"Electronicos","publisher_email":"scrap@nordika.mx",        "location":"Nordika",           "qty":"1.8 Ton", "weightKg":1800,"price":"$ 35.00 / kg","date":"2025-10-14","image":"Electronicos.png",
     "docs":[("Material","Trifasicos para Cu/Fe."),("Estado","Carcasas sin aceite.")]},
    {"script_id": 75,"title":"Discos Duros HDD para Reciclaje", "category":"Electronicos","publisher_email":"scrap@nordika.mx",        "location":"Nordika",           "qty":"500 Pzas","weightKg":120, "price":"$ 15.00 / kg","date":"2025-10-28","image":"Electronicos.png",
     "docs":[("Borrado","Certificado NOM-027."),("Tipo","3.5 y 2.5 pulgadas.")]},
    {"script_id": 76,"title":"Fuentes de Poder ATX (Lote)",     "category":"Electronicos","publisher_email":"scrap@nordika.mx",        "location":"Nordika",           "qty":"350 kg",  "weightKg":350, "price":"$ 12.00 / kg","date":"2025-11-10","image":"Electronicos.png",
     "docs":[("Tipo","Fuentes PC escritorio."),("Finalidad","Recuperacion de metales.")]},
    {"script_id": 77,"title":"Monitores CRT para Reciclaje Regulado","category":"Electronicos","publisher_email":"scrap@nordika.mx",  "location":"Nordika",           "qty":"80 Uds",  "weightKg":800, "price":"$ 5.00 / kg","date":"2025-11-18","image":"Electronicos.png",
     "docs":[("Tipo","CRT con plomo."),("Norma","NOM-052-SEMARNAT.")]},
    {"script_id": 78,"title":"Tablets y Smartphones Fuera de Uso","category":"Electronicos","publisher_email":"scrap@nordika.mx",     "location":"Nordika",           "qty":"300 Pzas","weightKg":90,  "price":"$ 25.00 / kg","date":"2025-11-25","image":"Electronicos.png",
     "docs":[("Origen","Flotilla corporativa."),("Borrado","Certificado de datos.")]},
    {"script_id": 79,"title":"Lote de Fuentes de Poder ATX",    "category":"Electronicos","publisher_email":"empresa@ecoboros.com",   "location":"Otay Industrial",   "qty":"350 kg",  "weightKg":350, "price":"$ 12.00 / kg","date":"2025-11-10","image":"Electronicos.png",
     "docs":[("Tipo","Fuentes PC scrap."),("Finalidad","Recuperacion metales.")]},
    {"script_id": 80,"title":"Impresoras Multifuncion (Desecho)","category":"Electronicos","publisher_email":"empresa@ecoboros.com",  "location":"Otay Industrial",   "qty":"40 Uds",  "weightKg":200, "price":"$ 8.00 / ud","date":"2025-11-28","image":"Electronicos.png",
     "docs":[("Tipo","Laser y tinta fuera de vida util."),("Recuperacion","Metales y plasticos.")]},
    {"script_id": 81,"title":"Transformadores Electricos de Distribucion","category":"Electronicos","publisher_email":"contacto@otayindustrial.mx","location":"Otay Industrial","qty":"10 Uds","weightKg":2500,"price":"$ 45.00 / kg","date":"2025-12-02","image":"Electronicos.png",
     "docs":[("Tipo","Monofasicos 15-50 kVA."),("Estado","Fuera de servicio.")]},
    {"script_id": 82,"title":"Baterias Industriales (Plomo-Acido)","category":"Electronicos","publisher_email":"adquisiciones@fundidorabaja.mx","location":"Fundidora Baja","qty":"900 kg","weightKg":900,"price":"$ 22.00 / kg","date":"2025-11-20","image":"Electronicos.png",
     "docs":[("Tipo","Plomo-acido UPS."),("Normativa","SEMARNAT regulado.")]},
    {"script_id": 83,"title":"Cables de Datos y Red (Cobre)",   "category":"Electronicos","publisher_email":"ventas@aluminioflorido.mx","location":"El Florido",       "qty":"300 kg",  "weightKg":300, "price":"$ 18.00 / kg","date":"2025-12-05","image":"Electronicos.png",
     "docs":[("Tipo","Cat5e y Cat6."),("Cobre","~30% contenido.")]},
    {"script_id": 84,"title":"Rack de Servidores Desmantelados","category":"Electronicos","publisher_email":"acero@pacifico.com",     "location":"Aceros del Pacifico","qty":"15 Pzas", "weightKg":450, "price":"$ 30.00 / kg","date":"2025-12-08","image":"Electronicos.png",
     "docs":[("Tipo","Rack 42U con equipo de red."),("Material","Acero y aluminio.")]}
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
        input=sql.encode('utf-8'),
        capture_output=True
    )
    return result.returncode, result.stdout.decode('utf-8', errors='replace'), result.stderr.decode('utf-8', errors='replace')


def step0_reset():
    print('\n[0/4] Limpiando tablas y reseteando secuencias...')
    reset_sql = ROOT_DIR / 'db' / 'reset_and_seed.sql'
    if not reset_sql.exists():
        print('  [WARN] reset_and_seed.sql no encontrado, omitiendo reset.')
        return
    code, out, err = run_psql(reset_sql.read_text(encoding='utf-8'))
    if code == 0:
        print('  [OK] Reset completado. IDs reiniciados desde 1.')
    else:
        print(f'  [ERROR] Reset fallido:\n{err[:400]}')


def step2_sql():
    print('\n[2/4] Ejecutando insert.sql...')
    insert_sql = ROOT_DIR / 'db' / 'insert.sql'
    code, out, err = run_psql(insert_sql.read_text(encoding='utf-8'))
    if code == 0:
        print('  [OK] insert.sql ejecutado OK')
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
    step0_reset()      # Limpia tablas y resetea secuencias (IDs desde 1)
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
