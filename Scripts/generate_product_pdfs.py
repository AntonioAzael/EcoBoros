from pathlib import Path
from fpdf import FPDF

PRODUCTS = [
    {
        "id": 1,
        "title": "Bidones HDPE Tricapa",
        "category": "Plásticos",
        "location": "Otay Industrial",
        "qty": "850 Pzas",
        "weightKg": 850,
        "price": "$ 15.00 / pza",
        "date": "2023-10-01",
        "documentation": [
            {"title": "Ficha técnica", "text": "Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos."},
            {"title": "Condición", "text": "Unidad usada en buen estado, sin deformaciones visibles y con cierre hermético probado."},
            {"title": "Certificado", "text": "Disponible certificado de reciclaje y trazabilidad de plástico."}
        ]
    },
    {
        "id": 2,
        "title": "Recortes de Aluminio 6061",
        "category": "Metales",
        "location": "El Florido",
        "qty": "2.5 Ton",
        "weightKg": 2500,
        "price": "$ 28.50 / kg",
        "date": "2023-10-05",
        "documentation": [
            {"title": "Especificaciones", "text": "Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión."},
            {"title": "Calidad", "text": "Material limpio, sin óxido, con pieza de prueba incluida."},
            {"title": "Certificado", "text": "Informe de composición química entregable bajo solicitud."}
        ]
    },
    {
        "id": 3,
        "title": "Pallets de Pino (Reparables)",
        "category": "Maderas",
        "location": "Pacifico",
        "qty": "200 Uds",
        "weightKg": 4000,
        "price": "$ 45.00 / ud",
        "date": "2023-09-28",
        "documentation": [
            {"title": "Condición", "text": "Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno."},
            {"title": "Material", "text": "Pino tratado, sin humedad excesiva, apto para almacenamiento y carga moderada."},
            {"title": "Recomendación", "text": "Ideal para uso en bodegas o transporte de piezas ligeras."}
        ]
    },
    {
        "id": 4,
        "title": "Pacas de Cartón Corrugado",
        "category": "Cartón",
        "location": "La Mesa",
        "qty": "5 Ton",
        "weightKg": 5000,
        "price": "$ 3.20 / kg",
        "date": "2023-10-10",
        "documentation": [
            {"title": "Ficha técnica", "text": "Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical."},
            {"title": "Uso recomendado", "text": "Recomendado para empaques, relleno y proyectos de reciclaje industrial."},
            {"title": "Condición", "text": "Material limpio, con algunas imperfecciones menores de almacenamiento."}
        ]
    },
    {
        "id": 5,
        "title": "Tarjetas Madre (Scrap)",
        "category": "Electrónicos",
        "location": "Nordika",
        "qty": "500 kg",
        "weightKg": 500,
        "price": "A Tratar",
        "date": "2023-10-12",
        "documentation": [
            {"title": "Descripción", "text": "Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales."},
            {"title": "Inspección", "text": "Revisión visual previa; sin garantías de funcionalidad."},
            {"title": "Manejo seguro", "text": "Usar equipo de protección y separar elementos tóxicos antes de procesar."}
        ]
    },
    {
        "id": 6,
        "title": "Archivo Muerto (Triturado)",
        "category": "Papel",
        "location": "Zona Centro",
        "qty": "1.2 Ton",
        "weightKg": 1200,
        "price": "$ 2.10 / kg",
        "date": "2023-09-15",
        "documentation": [
            {"title": "Tipo de material", "text": "Papelería triturada de oficina, mezcla de papel bond y cartulina."},
            {"title": "Protección", "text": "Libre de datos sensibles y lista para reprocesamiento o compostaje industrial."},
            {"title": "Uso", "text": "Ideal para reciclaje de papel o relleno de embalajes."}
        ]
    },
    {
        "id": 7,
        "title": "Cobre de Primera (Pelado)",
        "category": "Metales",
        "location": "Otay",
        "qty": "300 kg",
        "weightKg": 300,
        "price": "$ 140.00 / kg",
        "date": "2023-10-15",
        "documentation": [
            {"title": "Calidad", "text": "Cobre limpio pelado, sin aislamiento, grado comercial de primera."},
            {"title": "Aplicación", "text": "Adecuado para reciclaje metalúrgico y fabricación de componentes eléctricos."},
            {"title": "Certificado", "text": "Informe de pureza disponible según solicitud."}
        ]
    },
    {
        "id": 8,
        "title": "Botellas PET Cristal",
        "category": "Plásticos",
        "location": "Rosarito",
        "qty": "1 Ton",
        "weightKg": 1000,
        "price": "$ 8.00 / kg",
        "date": "2023-10-02",
        "documentation": [
            {"title": "Material", "text": "PET transparente de grado alimenticio triturado, limpio y sin etiquetas."},
            {"title": "Uso", "text": "Perfecto para reprocesado y fabricación de fibra o envases reciclados."},
            {"title": "Certificación", "text": "Cumple con normas básicas de separación y limpieza para reciclaje."}
        ]
    }
]

OUTPUT_DIR = Path(__file__).parent / 'pdfs'
OUTPUT_DIR.mkdir(exist_ok=True)


def create_pdf(product: dict) -> Path:
    pdf_path = OUTPUT_DIR / f"product_{product['id']}.pdf"
    pdf = FPDF(format='letter')
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.set_font('Helvetica', 'B', 20)
    pdf.cell(0, 10, f"Ficha Técnica - {product['title']}")
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 12)
    pdf.cell(0, 8, f"Categoría: {product['category']}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Ubicación: {product['location']}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Fecha de publicación: {product['date']}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Cantidad disponible: {product['qty']}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Peso total: {product['weightKg']} kg")
    pdf.ln(8)
    pdf.cell(0, 8, f"Precio: {product['price']}")
    pdf.ln(12)

    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, 'Documentación')
    pdf.ln(10)

    pdf.set_font('Helvetica', '', 12)
    for item in product['documentation']:
        pdf.set_font('Helvetica', 'B', 12)
        pdf.multi_cell(180, 7, item['title'])
        pdf.set_font('Helvetica', '', 11)
        pdf.multi_cell(180, 6, item['text'])
        pdf.ln(3)

    pdf.output(str(pdf_path))
    return pdf_path


def main() -> None:
    print('Generando PDFs de productos...')
    for product in PRODUCTS:
        path = create_pdf(product)
        print(f'  - {path}')
    print('Generación completa.')


if __name__ == '__main__':
    main()
