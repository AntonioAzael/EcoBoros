-- ==============================================================================
-- db/insert.sql — Datos semilla idempotentes para EcoBoros v3
-- >=10 wastes Aprobados por categoría · cada empresa tiene 1-2 wastes variados
-- purchase_requests con compras reales por buyer
-- ==============================================================================
BEGIN;

-- Migración segura de columna password
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(128);

-- ==============================================================================
-- 1. USERS  (solo los 16 existentes, sin nuevas empresas)
-- ==============================================================================
INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, password, is_active)
SELECT r.role_id, u.company_name, u.rfc, u.contact_email, u.contact_phone, u.password, u.is_active
FROM (VALUES
    ('Empresa',            'Empresa Demo EcoBoros S.A.',               'ECO123456789', 'empresa@ecoboros.com',          '664-000-0099', '123456', TRUE),
    ('Administrador Total','Administrador EcoBoros',                   NULL,           'admin@ecoboros.com',            '664-000-0000', '123456', TRUE),
    ('Usuario de Calidad', 'Equipo Calidad EcoBoros',                  NULL,           'calidad@ecoboros.com',          '664-000-0088', '123456', TRUE),
    ('Empresa',            'Otay Industrial Recycling S.A. de C.V.',  'OIR123456789', 'contacto@otayindustrial.mx',    '664-000-0001', '123456', TRUE),
    ('Empresa',            'Alumina El Florido S.A. de C.V.',         'ALF123456789', 'ventas@aluminioflorido.mx',     '664-000-0002', '123456', TRUE),
    ('Empresa',            'Pallets Pacifico S.A. de C.V.',           'PAC123456789', 'logistica@palletspacifico.mx',  '664-000-0003', '123456', TRUE),
    ('Empresa',            'Cartones La Mesa S.A. de C.V.',           'CME123456789', 'operaciones@cartoneslamesa.mx', '664-000-0004', '123456', TRUE),
    ('Empresa',            'Nordika Electronics Scrap S.A. de C.V.', 'NOR123456789', 'scrap@nordika.mx',              '664-000-0005', '123456', TRUE),
    ('Empresa',            'Zona Centro Papeles S.A. de C.V.',        'ZCP123456789', 'contacto@zonacentro.mx',        '664-000-0006', '123456', TRUE),
    ('Empresa',            'Cobre Otay S.A. de C.V.',                 'COB123456789', 'ventas@cobreotay.mx',           '664-000-0007', '123456', TRUE),
    ('Empresa',            'PET Rosarito Reciclaje S.A. de C.V.',    'PET123456789', 'contacto@petrosarito.mx',       '664-000-0008', '123456', TRUE),
    ('Empresa',            'Perfiles Tijuana S.A. de C.V.',           'PTJ123456789', 'ventas@perfilestijuana.mx',     '664-000-0009', '123456', TRUE),
    ('Empresa',            'Recicladora del Norte S.A. de C.V.',      'RNO123456789', 'compras@recicladnorte.mx',      '664-100-0001', '123456', TRUE),
    ('Empresa',            'Fundidora Baja S.A. de C.V.',             'FBJ123456789', 'adquisiciones@fundidorabaja.mx','664-100-0002', '123456', TRUE),
    ('Empresa',            'EcoPlast Mexicali S.A. de C.V.',          'EPM123456789', 'compras@ecoplast.mx',           '664-100-0003', '123456', TRUE),
    ('Empresa',            'Aceros del Pacifico S. de R.L.',          'APA987654321', 'acero@pacifico.com',            '686-200-0001', '123456', TRUE),
    ('Empresa',            'Polimeros de la Frontera S.A.',           'PFR987654321', 'polimeros@frontera.com',        '664-200-0002', '123456', TRUE),
    ('Empresa',            'Madereria El Pino Solitario S.A.',        'MPS987654321', 'madera@pinosolitario.com',      '664-200-0003', '123456', TRUE)
) AS u(role_name, company_name, rfc, contact_email, contact_phone, password, is_active)
JOIN roles r ON r.role_name = u.role_name
WHERE NOT EXISTS (SELECT 1 FROM users ex WHERE ex.contact_email = u.contact_email);

-- ==============================================================================
-- 2. WASTES  — mínimo 10 Aprobados por categoría  +  variedad de estatus
-- ==============================================================================
INSERT INTO wastes (publisher_id, category_id, title, technical_description,
                    weight_decimal, quantity, unit_price, generation_date,
                    availability_date, status_id, quality_validator_id)
SELECT
    (SELECT user_id FROM users WHERE contact_email = d.pub_email LIMIT 1),
    (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER(d.cat) LIMIT 1),
    d.title, d.description,
    d.weight::DECIMAL(10,2), d.qty,
    CASE WHEN d.price = 'NULL' THEN NULL ELSE d.price::DECIMAL(10,2) END,
    d.gen_date::DATE, d.avail_date::DATE,
    (SELECT status_id FROM statuses WHERE status_name = d.status LIMIT 1),
    (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.com' LIMIT 1)
FROM (VALUES

-- ============================================================
-- METALES (>=10 Aprobados)  — Alumina, CobreOtay, Perfiles TJ,
--   Fundidora, RecicladNorte, AcerosPacifico, empresa demo
-- ============================================================
('ventas@aluminioflorido.mx',     'Metales','Recortes de Aluminio 6061',
 'Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión. Material limpio, sin óxido.',
 '2500.00','2.5 Ton','28.50','2025-10-05','2025-10-20','Aprobado'),
('ventas@aluminioflorido.mx',     'Metales','Viruta y Rebaba de Aluminio',
 'Rebaba industrial limpia de fresado CNC. Prensada en briquetes para fácil fundición.',
 '1500.00','1.5 Ton','22.00','2025-10-12','2025-10-27','Aprobado'),
('ventas@aluminioflorido.mx',     'Metales','Aluminio 1100 en Lámina',
 'Lámina de aluminio serie 1100 de alta pureza, calibre 16. Apta para conformado en frío.',
 '800.00','800 kg','26.00','2025-11-02','2025-11-17','Aprobado'),
('ventas@aluminioflorido.mx',     'Metales','Alambre de Aluminio para Fusión',
 'Carrete de alambre de aluminio 1350 para proceso de fundición secundaria.',
 '600.00','600 kg','20.00','2025-11-20','2025-12-05','Revision'),

('ventas@cobreotay.mx',           'Metales','Cobre de Primera (Pelado)',
 'Cobre limpio pelado, sin aislamiento, grado comercial de primera. Adecuado para reciclaje metalúrgico.',
 '300.00','300 kg','140.00','2025-10-15','2025-10-30','Aprobado'),
('ventas@cobreotay.mx',           'Metales','Placas de Cobre Electrolítico',
 'Recortes de placas de cobre de alta pureza 99.9%. Material ideal para fundición de alta especificación.',
 '750.00','750 kg','145.00','2025-10-22','2025-11-06','Aprobado'),
('ventas@cobreotay.mx',           'Metales','Cobre Rojo N°2 con Aislante',
 'Cable cobre con cubierta PVC retirado de instalación industrial. Contenido ~70% cobre.',
 '900.00','900 kg','72.00','2025-11-08','2025-11-23','Aprobado'),
('ventas@cobreotay.mx',           'Metales','Tubería de Cobre Tipo L',
 'Secciones de tubería de cobre tipo L de 1/2 a 2 pulgadas, estado recto sin fugas previas.',
 '420.00','420 kg','130.00','2025-11-15','2025-11-30','Pendiente'),

('ventas@perfilestijuana.mx',     'Metales','Perfiles de Aluminio Estructural',
 'Saldos de producción de perfiles extruidos anodizados. Tramos de 3 a 6 metros sin corrosión.',
 '1400.00','1.4 Ton','34.00','2025-10-11','2025-10-26','Aprobado'),
('ventas@perfilestijuana.mx',     'Metales','Ángulos de Aluminio 6063',
 'Ángulos extruidos de aluminio 6063-T5. Longitudes de 3 m. Aptos para estructuras ligeras.',
 '950.00','950 kg','30.00','2025-11-05','2025-11-20','Aprobado'),
('ventas@perfilestijuana.mx',     'Metales','Tubos Cuadrados de Aluminio',
 'Tubos cuadrados de aluminio extruido 40×40 mm. Sin deformaciones, sección completa.',
 '700.00','700 kg','32.00','2025-11-18','2025-12-03','Aprobado'),

('adquisiciones@fundidorabaja.mx','Metales','Tiras de Latón Industrial',
 'Recortes de lámina de latón industrial 70/30 libre de contaminantes.',
 '650.00','650 kg','55.00','2025-10-17','2025-11-01','Aprobado'),
('adquisiciones@fundidorabaja.mx','Metales','Lingotes de Aluminio Reciclado',
 'Lingotes secundarios de aluminio aleación A380 para inyección a presión. Certificado incluido.',
 '4500.00','4.5 Ton','31.00','2025-10-25','2025-11-09','Aprobado'),
('adquisiciones@fundidorabaja.mx','Metales','Bronce Fosforado en Chatarra',
 'Piezas y bujes de bronce fosforado C544 fuera de servicio. Excelente para refundición.',
 '380.00','380 kg','88.00','2025-11-10','2025-11-25','Aprobado'),

('compras@recicladnorte.mx',      'Metales','Scrap de Cable Eléctrico Mixto',
 'Cable eléctrico retirado de instalaciones industriales. Contenido estimado de cobre del 55%.',
 '2100.00','2.1 Ton','62.00','2025-10-14','2025-10-29','Aprobado'),
('compras@recicladnorte.mx',      'Metales','Chatarra Estructural de Acero',
 'Vigas I, canales C y placa de acero estructural cortados a tramos de 1.5 metros.',
 '8000.00','8 Ton','4.80','2025-10-23','2025-11-07','Aprobado'),
('compras@recicladnorte.mx',      'Metales','Acero Inoxidable 304 en Recortes',
 'Recortes de chapa inoxidable 304 de troquelería. Sin óxido, espesor 1-3 mm.',
 '1100.00','1.1 Ton','38.00','2025-11-12','2025-11-27','Aprobado'),

('acero@pacifico.com',            'Metales','Lámina de Acero Inoxidable (Saldos)',
 'Saldos de lámina de acero inoxidable tipo 304 en varios calibres. Ideal para proyectos industriales.',
 '1250.00','1.25 Ton','25.00','2025-10-28','2025-11-12','Aprobado'),
('acero@pacifico.com',            'Metales','Tubería de Acero al Carbón',
 'Tramos sobrantes de tubería de acero al carbón de 4 y 6 pulgadas de diámetro. Sin óxido excesivo.',
 '3000.00','3 Ton','6.50','2025-11-05','2025-11-20','Aprobado'),
('acero@pacifico.com',            'Metales','Herrajes de Acero Galvanizado',
 'Saldos de herrajes galvanizados: tornillos, pernos y escuadras de construcción.',
 '500.00','500 kg','18.00','2025-11-12','2025-11-27','Aprobado'),
('acero@pacifico.com',            'Metales','Acero de Refuerzo (Varilla)',
 'Varilla corrugada de acero grado 42 en tramos de 6 metros. Sin oxidación superficial.',
 '2000.00','2 Ton','5.50','2025-11-22','2025-12-07','Revision'),

('empresa@ecoboros.com',          'Metales','Perfiles de Aluminio Extruido',
 'Perfiles extruidos de aluminio, sección rectangular, superficie limpia. Sin corrosión visible.',
 '500.00','500 kg','32.00','2025-10-20','2025-11-05','Aprobado'),

-- ============================================================
-- PLÁSTICOS (>=10 Aprobados)
-- ============================================================
('empresa@ecoboros.com',          'Plasticos','Bidones HDPE Tricapa',
 'Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos.',
 '850.00','850 Pzas','15.00','2025-10-01','2025-10-15','Aprobado'),
('contacto@petrosarito.mx',       'Plasticos','Botellas PET Cristal',
 'PET transparente de grado alimenticio triturado, limpio y sin etiquetas. Para reprocesado.',
 '1000.00','1 Ton','8.00','2025-10-02','2025-10-17','Aprobado'),
('contacto@petrosarito.mx',       'Plasticos','Envases HDPE Triturados (Molienda)',
 'Flakes molienda HDPE limpia procedente de envases lácteos y detergentes. Color mixto.',
 '2200.00','2.2 Ton','11.50','2025-10-16','2025-10-31','Aprobado'),
('contacto@petrosarito.mx',       'Plasticos','Lámina de PET Transparente',
 'Recortes de lámina PET termoformable calibre 0.5 mm. Apta para envases y blísters.',
 '600.00','600 kg','12.00','2025-11-10','2025-11-25','Aprobado'),
('contacto@petrosarito.mx',       'Plasticos','PET Verde Molido Post-Consumo',
 'Hojuelas de botella PET color verde lavadas y clasificadas. Buena fluidez para extrusión.',
 '900.00','900 kg','7.50','2025-11-22','2025-12-07','Revision'),
('contacto@otayindustrial.mx',    'Plasticos','Polietileno de Alta Densidad (Pellet)',
 'Pellet reciclado HDPE de color negro filtrado a 100 mallas. Fluidez media para inyección.',
 '3500.00','3.5 Ton','18.50','2025-10-09','2025-10-24','Aprobado'),
('contacto@otayindustrial.mx',    'Plasticos','Polietileno de Baja Densidad (LDPE)',
 'Film agrícola LDPE molido limpio. Propiedades mecánicas preservadas, apto para extrusión.',
 '1800.00','1.8 Ton','9.00','2025-11-04','2025-11-19','Aprobado'),
('compras@ecoplast.mx',           'Plasticos','Tambores de Plástico 200L',
 'Tambores cerrados de polietileno con dos tapones de 2 pulgadas. Lavados y neutralizados.',
 '600.00','120 Pzas','120.00','2025-10-07','2025-10-22','Aprobado'),
('compras@ecoplast.mx',           'Plasticos','Contenedores IBC 1000L Limpios',
 'Contenedores tipo tote de 1000 litros sobre estiba metálica. Lavados con certificación.',
 '1500.00','15 Uds','1100.00','2025-10-19','2025-11-03','Aprobado'),
('compras@ecoplast.mx',           'Plasticos','Película Stretch de Polipropileno',
 'Rollos de película stretch PP sin marca. Apta para empaque secundario industrial.',
 '400.00','400 kg','14.00','2025-11-08','2025-11-23','Aprobado'),
('compras@ecoplast.mx',           'Plasticos','Tapas y Tapones PP Mixtos',
 'Tapas de envase y tapones roscados de polipropileno. Limpias y clasificadas por color.',
 '350.00','350 kg','10.00','2025-11-18','2025-12-03','Pendiente'),
('polimeros@frontera.com',        'Plasticos','Polipropileno en Hojuelas (PP)',
 'Hojuelas de polipropileno post-industrial, limpias y secas. Aptas para extrusión y moldeo.',
 '4000.00','4 Ton','14.00','2025-10-30','2025-11-14','Aprobado'),
('polimeros@frontera.com',        'Plasticos','PVC Rígido Molido',
 'Scrap de PVC rígido proveniente de perfiles de ventanas, molido y listo para reciclar.',
 '2000.00','2 Ton','9.00','2025-11-08','2025-11-23','Aprobado'),
('polimeros@frontera.com',        'Plasticos','Nylon 6 Molido Post-Industrial',
 'Scrap de nylon 6 molido procedente de piezas técnicas rechazadas. Libre de aceite.',
 '500.00','500 kg','22.00','2025-11-20','2025-12-05','Aprobado'),
('polimeros@frontera.com',        'Plasticos','ABS Molido Clasificado',
 'ABS post-industrial molido y clasificado por color. Calidad constante para inyección.',
 '700.00','700 kg','18.00','2025-11-28','2025-12-13','Aprobado'),

-- ============================================================
-- CARTONES (>=10 Aprobados)
-- ============================================================
('operaciones@cartoneslamesa.mx', 'Cartones','Pacas de Cartón Corrugado',
 'Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical.',
 '5000.00','5 Ton','3.20','2025-10-10','2025-10-25','Aprobado'),
('operaciones@cartoneslamesa.mx', 'Cartones','Cartón Plegadizo Grado Industrial',
 'Plegadizo sobrante de imprenta y empaque primario. Material seco, clasificado y enfardado.',
 '3200.00','3.2 Ton','2.80','2025-10-18','2025-11-02','Aprobado'),
('operaciones@cartoneslamesa.mx', 'Cartones','Cartón Liner Blanco Prensado',
 'Cartón liner blanco de alta gramaje, prensado en pacas. Apto para empaque de alimentos.',
 '2000.00','2 Ton','3.80','2025-11-01','2025-11-16','Aprobado'),
('operaciones@cartoneslamesa.mx', 'Cartones','Cartón Micro-Corrugado Residual',
 'Residuos de cartón micro-corrugado de imprentas. Seco y sin barniz de alto peso.',
 '1500.00','1.5 Ton','2.60','2025-11-15','2025-11-30','Aprobado'),
('operaciones@cartoneslamesa.mx', 'Cartones','Cartón Gris Multicapa',
 'Cartón gris de múltiples capas para carpetas y encuadernación. En buen estado.',
 '800.00','800 kg','2.20','2025-11-25','2025-12-10','Aprobado'),
('operaciones@cartoneslamesa.mx', 'Cartones','Cartón Kraft para Cajas de Envío',
 'Cajas de cartón kraft usadas, desarmadas y apiladas. Aptas para re-empaque o reciclaje.',
 '2800.00','2.8 Ton','2.50','2025-12-01','2025-12-16','Aprobado'),
('contacto@zonacentro.mx',        'Cartones','Cartón Gris de Empaque Mixto',
 'Cartón gris residual de líneas de empaque farmacéutico. Material limpio y clasificado.',
 '2000.00','2 Ton','2.50','2025-11-22','2025-12-07','Aprobado'),
('contacto@zonacentro.mx',        'Cartones','Cajas de Cartón para Exportación',
 'Cajas grandes de cartón doble cara para exportación marítima. En buen estado estructural.',
 '3500.00','3.5 Ton','2.90','2025-11-28','2025-12-13','Aprobado'),
('contacto@zonacentro.mx',        'Cartones','Cartón Plastificado Residual',
 'Recortes de cartón con capa plástica de empaque secundario. Para reciclaje especializado.',
 '1200.00','1.2 Ton','1.80','2025-12-05','2025-12-20','Revision'),
('empresa@ecoboros.com',          'Cartones','Separadores de Cartón Industrial',
 'Láminas separadoras de cartón usadas en logística de piezas. Reutilizables.',
 '600.00','600 kg','1.50','2025-12-08','2025-12-23','Aprobado'),
('adquisiciones@fundidorabaja.mx','Cartones','Tubos de Cartón para Bobinas',
 'Núcleos tubulares de cartón de distintos diámetros. Para rebobinado industrial.',
 '450.00','450 kg','3.00','2025-12-10','2025-12-25','Aprobado'),

-- ============================================================
-- PAPELES (>=10 Aprobados)
-- ============================================================
('contacto@zonacentro.mx',        'Papeles','Archivo Muerto (Triturado)',
 'Papelería triturada de oficina, mezcla de papel bond y cartulina. Libre de datos sensibles.',
 '1200.00','1.2 Ton','2.10','2025-09-15','2025-10-01','Aprobado'),
('contacto@zonacentro.mx',        'Papeles','Bobinas de Papel Kraft Residual',
 'Saldos de bobinas de papel kraft de alto gramaje para embalaje o conversión a cartoncillo.',
 '2800.00','2.8 Ton','4.50','2025-10-08','2025-10-22','Aprobado'),
('contacto@zonacentro.mx',        'Papeles','Papel Bond de Impresión (Recortes)',
 'Recortes de papel bond 75 g/m² de corte digital. Paquetes de 1 kg, libres de humedad.',
 '900.00','900 kg','1.80','2025-10-25','2025-11-09','Aprobado'),
('contacto@zonacentro.mx',        'Papeles','Papel Periódico Residual',
 'Bobinas y pliegos de papel periódico de imprenta. Apto para reciclaje de fibra corta.',
 '4000.00','4 Ton','1.20','2025-11-05','2025-11-20','Aprobado'),
('contacto@zonacentro.mx',        'Papeles','Papel Couché Sin Barniz',
 'Recortes de papel couché mate sin barniz UV. Gramaje 135 g/m², ideal para reciclado.',
 '1500.00','1.5 Ton','2.40','2025-11-15','2025-11-30','Aprobado'),
('contacto@zonacentro.mx',        'Papeles','Papel Tissue Post-Consumo',
 'Rollos de papel tissue agotado de hoteles y hospitales. Fibra corta apta para repulpeo.',
 '700.00','700 kg','1.00','2025-11-28','2025-12-13','Revision'),
('compras@recicladnorte.mx',      'Papeles','Papel Kraft Para Empaque',
 'Rollos de papel kraft de desecho de imprenta, apto para empaque industrial secundario.',
 '800.00','800 kg','3.50','2025-11-15','2025-11-30','Aprobado'),
('compras@recicladnorte.mx',      'Papeles','Papel Reciclado Mixto (Mezcla de Oficina)',
 'Mezcla de papeles de oficina: bond, fax y papel de color. Sin clips ni espirales.',
 '2000.00','2 Ton','1.60','2025-11-22','2025-12-07','Aprobado'),
('empresa@ecoboros.com',          'Papeles','Papel Satinado Residual de Revista',
 'Revistas y catálogos de sobra de editorial. Fibra larga de alta calidad para reciclaje.',
 '1100.00','1.1 Ton','2.00','2025-12-01','2025-12-16','Aprobado'),
('logistica@palletspacifico.mx',  'Papeles','Papel para Envolver (Saldos de Imprenta)',
 'Rollo de papel para envolver sin estampado, ancho 70 cm. Excedente de producción.',
 '550.00','550 kg','2.80','2025-12-05','2025-12-20','Aprobado'),
('polimeros@frontera.com',        'Papeles','Papel Siliconado Residual',
 'Papel siliconado de respaldo (release liner) de etiquetas. Difícil reciclaje normal.',
 '300.00','300 kg','0.90','2025-12-08','2025-12-23','Pendiente'),
('madera@pinosolitario.com',      'Papeles','Papel Estucado para Impresión Offset',
 'Recortes de papel estucado de alto brillo. Gramaje 170 g/m², lote clasificado.',
 '650.00','650 kg','2.20','2025-12-10','2025-12-25','Aprobado'),

-- ============================================================
-- MADERAS (>=10 Aprobados)
-- ============================================================
('empresa@ecoboros.com',          'Maderas','Pallets de Pino (Reparables)',
 'Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno.',
 '4000.00','200 Uds','45.00','2025-09-28','2025-10-10','Aprobado'),
('logistica@palletspacifico.mx',  'Maderas','Tarimas Europallet Usadas',
 'Tarimas tipo Europallet en buen estado estructural, de pino tratado térmicamente HT.',
 '1200.00','60 Uds','85.00','2025-10-13','2025-10-28','Aprobado'),
('logistica@palletspacifico.mx',  'Maderas','Rejas de Madera para Empaque',
 'Cajas y rejas de madera de pino para embalaje pesado o reutilización artesanal.',
 '900.00','90 Uds','25.00','2025-10-21','2025-11-05','Revision'),
('logistica@palletspacifico.mx',  'Maderas','Tablas de Pino Cepillado (Saldos)',
 'Tablas de pino cepillado de 2×6 pulgadas, largo variable 1.5-3 m. Sin nudos grandes.',
 '2500.00','250 Uds','18.00','2025-11-03','2025-11-18','Aprobado'),
('logistica@palletspacifico.mx',  'Maderas','Marcos de Madera de Empaque Industrial',
 'Marcos cuadrados de madera usados en embalaje de maquinaria pesada importada.',
 '1800.00','120 Uds','30.00','2025-11-15','2025-11-30','Aprobado'),
('madera@pinosolitario.com',      'Maderas','Postes de Madera Tratada',
 'Postes de pino de 3 metros, tratados para exterior. Usados pero en excelente condición.',
 '2500.00','50 Uds','150.00','2025-11-01','2025-11-16','Aprobado'),
('madera@pinosolitario.com',      'Maderas','Vigas de Madera de Pino Estructural',
 'Vigas de pino 4×8 pulgadas, largo 4 m. Procedentes de demolición controlada.',
 '3200.00','80 Uds','120.00','2025-11-10','2025-11-25','Aprobado'),
('madera@pinosolitario.com',      'Maderas','Triplay de Madera (Recortes)',
 'Recortes de triplay de madera de diferentes espesores. Útil para mueblería y artesanía.',
 '700.00','700 kg','8.00','2025-11-20','2025-12-05','Aprobado'),
('madera@pinosolitario.com',      'Maderas','Duela de Pino para Reciclaje',
 'Duelas de pino retiradas de piso de nave industrial. Largo estándar 80 cm, sin clavos.',
 '1500.00','1.5 Ton','12.00','2025-12-01','2025-12-16','Aprobado'),
('compras@recicladnorte.mx',      'Maderas','Cajones de Madera para Fruta',
 'Cajones de madera de álamo usados en transporte de frutas. Aptos para segunda vida.',
 '600.00','300 Pzas','5.00','2025-12-05','2025-12-20','Aprobado'),
('contacto@otayindustrial.mx',    'Maderas','Cuñas y Calzas de Madera Industrial',
 'Cuñas de madera dura usadas en afianzamiento de carga pesada. Sin fracturas.',
 '400.00','400 kg','6.00','2025-12-08','2025-12-23','Aprobado'),
('acero@pacifico.com',            'Maderas','Madera Aglomerada (MDF Recortes)',
 'Recortes de tablero MDF de 15 mm de imprenta y señalética. Sin pintura activa.',
 '900.00','900 kg','4.50','2025-12-10','2025-12-25','Pendiente'),

-- ============================================================
-- ELECTRÓNICOS (>=10 Aprobados)
-- ============================================================
('scrap@nordika.mx',              'Electronicos','Tarjetas Madre (Scrap)',
 'Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales.',
 '500.00','500 kg','48.00','2025-10-12','2025-10-26','Revision'),
('scrap@nordika.mx',              'Electronicos','Motores Eléctricos Desmantelados',
 'Motores trifásicos fuera de servicio para recuperación de cobre y hierro. Carcasas completas.',
 '1800.00','1.8 Ton','35.00','2025-10-14','2025-10-29','Aprobado'),
('scrap@nordika.mx',              'Electronicos','Discos Duros HDD para Reciclaje',
 'Discos duros de 3.5 y 2.5 pulgadas, borrado certificado conforme NOM-027. Lote de 500 pzas.',
 '120.00','500 Pzas','15.00','2025-10-28','2025-11-12','Aprobado'),
('scrap@nordika.mx',              'Electronicos','Fuentes de Poder ATX (Lote)',
 'Fuentes de poder de PC de escritorio. Se venden como scrap para recuperación de metales.',
 '350.00','350 kg','12.00','2025-11-10','2025-11-25','Aprobado'),
('scrap@nordika.mx',              'Electronicos','Monitores CRT para Reciclaje Regulado',
 'Monitores CRT que contienen plomo. Reciclaje debe cumplir NOM-052-SEMARNAT.',
 '800.00','80 Uds','5.00','2025-11-18','2025-12-03','Aprobado'),
('scrap@nordika.mx',              'Electronicos','Tablets y Smartphones Fuera de Uso',
 'Dispositivos móviles retirados de flotilla corporativa. Borrado certificado de datos.',
 '90.00','300 Pzas','25.00','2025-11-25','2025-12-10','Aprobado'),
('empresa@ecoboros.com',          'Electronicos','Lote de Fuentes de Poder ATX',
 'Fuentes de poder de computadoras de escritorio. Scrap para recuperación de metales y componentes.',
 '350.00','350 kg','12.00','2025-11-10','2025-11-25','Aprobado'),
('empresa@ecoboros.com',          'Electronicos','Impresoras Multifunción (Desecho)',
 'Impresoras láser y de tinta fuera de vida útil. Para recuperación de metales y plásticos.',
 '200.00','40 Uds','8.00','2025-11-28','2025-12-13','Aprobado'),
('contacto@otayindustrial.mx',    'Electronicos','Transformadores Eléctricos de Distribución',
 'Transformadores monofásicos de distribución 15-50 kVA fuera de servicio.',
 '2500.00','10 Uds','45.00','2025-12-02','2025-12-17','Aprobado'),
('adquisiciones@fundidorabaja.mx','Electronicos','Baterías Industriales (Plomo-Ácido)',
 'Baterías plomo-ácido de sistemas UPS fuera de servicio. Reciclaje regulado SEMARNAT.',
 '900.00','900 kg','22.00','2025-11-20','2025-12-05','Aprobado'),
('ventas@aluminioflorido.mx',     'Electronicos','Cables de Datos y Red (Cobre)',
 'Cables Cat5e y Cat6 retirados de edificio. Sin conectores, solo cable. ~30% cobre.',
 '300.00','300 kg','18.00','2025-12-05','2025-12-20','Aprobado'),
('acero@pacifico.com',            'Electronicos','Rack de Servidores Desmantelados',
 'Racks metálicos de 42U con equipo de red retirado. Acero y aluminio estructural.',
 '450.00','15 Pzas','30.00','2025-12-08','2025-12-23','Pendiente')

) AS d(pub_email, cat, title, description, weight, qty, price, gen_date, avail_date, status)
WHERE NOT EXISTS (
    SELECT 1 FROM wastes w
    WHERE w.publisher_id = (SELECT user_id FROM users WHERE contact_email = d.pub_email LIMIT 1)
      AND w.title = d.title
);

-- ==============================================================================
-- 3. PURCHASE_REQUESTS  — compras reales por empresa compradora
-- ==============================================================================
INSERT INTO purchase_requests (waste_id, buyer_id, requested_weight, offered_price, status_id, request_date, response_date)
SELECT
    (SELECT w.waste_id FROM wastes w
     JOIN users u ON u.user_id = w.publisher_id
     WHERE u.contact_email = d.pub_email AND w.title = d.waste_title LIMIT 1),
    (SELECT user_id FROM users WHERE contact_email = d.buyer_email LIMIT 1),
    d.weight::DECIMAL(10,2),
    d.price::DECIMAL(10,2),
    (SELECT status_id FROM statuses WHERE status_name = d.status_name LIMIT 1),
    d.req_date::TIMESTAMP,
    CASE WHEN d.resp_date = 'NULL' THEN NULL ELSE d.resp_date::TIMESTAMP END
FROM (VALUES

-- ── empresa@ecoboros.com como COMPRADOR ────────────────────────────────────
('ventas@aluminioflorido.mx','Recortes de Aluminio 6061',        'empresa@ecoboros.com','500.00','28.50','Completado','2025-11-03 09:00:00','2025-11-08 11:00:00'),
('contacto@petrosarito.mx',  'Botellas PET Cristal',             'empresa@ecoboros.com','300.00','8.00', 'Proceso',   '2025-11-18 13:00:00','NULL'),
('operaciones@cartoneslamesa.mx','Pacas de Cartón Corrugado',    'empresa@ecoboros.com','2000.00','3.20','Completado','2025-10-28 11:00:00','2025-11-02 09:00:00'),
('scrap@nordika.mx',         'Motores Eléctricos Desmantelados', 'empresa@ecoboros.com','500.00','35.00','Completado','2025-11-14 10:00:00','2025-11-18 15:00:00'),
('polimeros@frontera.com',   'Polipropileno en Hojuelas (PP)',   'empresa@ecoboros.com','1000.00','14.00','Completado','2025-11-18 10:00:00','2025-11-21 12:00:00'),
('acero@pacifico.com',       'Lámina de Acero Inoxidable (Saldos)','empresa@ecoboros.com','500.00','25.00','Completado','2025-11-20 09:00:00','2025-11-24 11:00:00'),
('contacto@zonacentro.mx',   'Bobinas de Papel Kraft Residual',  'empresa@ecoboros.com','800.00','4.50', 'Pendiente', '2025-12-01 10:00:00','NULL'),
('logistica@palletspacifico.mx','Tablas de Pino Cepillado (Saldos)','empresa@ecoboros.com','500.00','18.00','Proceso', '2025-12-05 09:00:00','NULL'),

-- ── ventas@aluminioflorido.mx como COMPRADOR ─────────────────────────────
('ventas@cobreotay.mx',      'Cobre de Primera (Pelado)',         'ventas@aluminioflorido.mx','150.00','140.00','Completado','2025-11-05 09:00:00','2025-11-09 14:00:00'),
('adquisiciones@fundidorabaja.mx','Tiras de Latón Industrial',   'ventas@aluminioflorido.mx','300.00','54.00','Proceso',   '2025-11-12 14:45:00','NULL'),

-- ── operaciones@cartoneslamesa.mx como COMPRADOR ─────────────────────────
('contacto@zonacentro.mx',   'Archivo Muerto (Triturado)',        'operaciones@cartoneslamesa.mx','600.00','2.10','Completado','2025-11-10 08:00:00','2025-11-14 11:00:00'),
('logistica@palletspacifico.mx','Tarimas Europallet Usadas',      'operaciones@cartoneslamesa.mx','20.00','85.00','Pendiente', '2025-11-22 10:00:00','NULL'),

-- ── scrap@nordika.mx como COMPRADOR ──────────────────────────────────────
('ventas@aluminioflorido.mx','Viruta y Rebaba de Aluminio',       'scrap@nordika.mx','800.00','22.00','Completado','2025-11-15 10:20:00','2025-11-18 15:40:00'),
('acero@pacifico.com',       'Tubería de Acero al Carbón',       'scrap@nordika.mx','1000.00','6.50','Completado','2025-11-20 09:00:00','2025-11-24 12:00:00'),

-- ── contacto@zonacentro.mx como COMPRADOR ────────────────────────────────
('operaciones@cartoneslamesa.mx','Cartón Plegadizo Grado Industrial','contacto@zonacentro.mx','1500.00','2.80','Completado','2025-11-08 10:00:00','2025-11-12 14:00:00'),
('contacto@petrosarito.mx',  'Envases HDPE Triturados (Molienda)','contacto@zonacentro.mx','500.00','11.50','Proceso',  '2025-11-25 11:00:00','NULL'),

-- ── ventas@cobreotay.mx como COMPRADOR ───────────────────────────────────
('compras@recicladnorte.mx', 'Scrap de Cable Eléctrico Mixto',   'ventas@cobreotay.mx','1500.00','60.00','Proceso',   '2025-11-20 12:00:00','NULL'),
('adquisiciones@fundidorabaja.mx','Lingotes de Aluminio Reciclado','ventas@cobreotay.mx','2000.00','31.00','Completado','2025-11-12 09:00:00','2025-11-16 15:00:00'),

-- ── contacto@petrosarito.mx como COMPRADOR ───────────────────────────────
('polimeros@frontera.com',   'PVC Rígido Molido',                 'contacto@petrosarito.mx','500.00','9.00','Completado','2025-11-22 10:00:00','2025-11-26 12:00:00'),
('compras@ecoplast.mx',      'Película Stretch de Polipropileno', 'contacto@petrosarito.mx','200.00','14.00','Pendiente','2025-12-02 09:00:00','NULL'),

-- ── ventas@perfilestijuana.mx como COMPRADOR ─────────────────────────────
('ventas@aluminioflorido.mx','Aluminio 1100 en Lámina',           'ventas@perfilestijuana.mx','400.00','26.00','Completado','2025-11-18 09:00:00','2025-11-22 14:00:00'),
('acero@pacifico.com',       'Herrajes de Acero Galvanizado',    'ventas@perfilestijuana.mx','250.00','18.00','Proceso',   '2025-11-28 10:00:00','NULL'),

-- ── compras@recicladnorte.mx como COMPRADOR ──────────────────────────────
('logistica@palletspacifico.mx','Tarimas Europallet Usadas',      'compras@recicladnorte.mx','30.00','85.00','Completado','2025-11-08 09:15:00','2025-11-12 10:00:00'),
('contacto@zonacentro.mx',   'Papel Periódico Residual',         'compras@recicladnorte.mx','2000.00','1.20','Completado','2025-11-20 08:00:00','2025-11-24 11:00:00'),
('madera@pinosolitario.com', 'Postes de Madera Tratada',         'compras@recicladnorte.mx','500.00','150.00','Pendiente','2025-12-01 09:00:00','NULL'),

-- ── adquisiciones@fundidorabaja.mx como COMPRADOR ────────────────────────
('scrap@nordika.mx',         'Motores Eléctricos Desmantelados', 'adquisiciones@fundidorabaja.mx','1000.00','35.00','Completado','2025-11-14 16:00:00','2025-11-17 11:10:00'),
('ventas@cobreotay.mx',      'Placas de Cobre Electrolítico',   'adquisiciones@fundidorabaja.mx','400.00','145.00','Proceso',  '2025-11-22 10:00:00','NULL'),
('compras@recicladnorte.mx', 'Chatarra Estructural de Acero',   'adquisiciones@fundidorabaja.mx','3000.00','4.80','Completado','2025-11-05 08:00:00','2025-11-09 14:00:00'),

-- ── compras@ecoplast.mx como COMPRADOR ───────────────────────────────────
('contacto@otayindustrial.mx','Polietileno de Alta Densidad (Pellet)','compras@ecoplast.mx','1000.00','18.00','Completado','2025-11-05 11:30:00','2025-11-09 16:20:00'),
('polimeros@frontera.com',   'Nylon 6 Molido Post-Industrial',   'compras@ecoplast.mx','200.00','22.00','Pendiente',  '2025-12-01 11:00:00','NULL'),
('contacto@petrosarito.mx',  'Botellas PET Cristal',             'compras@ecoplast.mx','500.00','8.00', 'Completado','2025-11-28 09:00:00','2025-12-02 14:00:00'),

-- ── logistica@palletspacifico.mx como COMPRADOR ──────────────────────────
('madera@pinosolitario.com', 'Vigas de Madera de Pino Estructural','logistica@palletspacifico.mx','500.00','120.00','Completado','2025-11-20 10:00:00','2025-11-24 14:00:00'),
('contacto@zonacentro.mx',   'Papel Bond de Impresión (Recortes)','logistica@palletspacifico.mx','300.00','1.80','Pendiente','2025-12-03 09:00:00','NULL'),

-- ── contacto@otayindustrial.mx como COMPRADOR ────────────────────────────
('compras@ecoplast.mx',      'Contenedores IBC 1000L Limpios',   'contacto@otayindustrial.mx','5.00','1100.00','Completado','2025-11-21 08:30:00','2025-11-25 12:00:00'),
('acero@pacifico.com',       'Lámina de Acero Inoxidable (Saldos)','contacto@otayindustrial.mx','300.00','25.00','Proceso',  '2025-11-28 10:00:00','NULL'),

-- ── acero@pacifico.com como COMPRADOR ────────────────────────────────────
('ventas@aluminioflorido.mx','Recortes de Aluminio 6061',        'acero@pacifico.com','1000.00','28.50','Completado','2025-11-10 09:00:00','2025-11-14 15:00:00'),
('compras@recicladnorte.mx', 'Scrap de Cable Eléctrico Mixto',   'acero@pacifico.com','500.00','62.00','Pendiente',  '2025-12-02 10:00:00','NULL'),

-- ── polimeros@frontera.com como COMPRADOR ────────────────────────────────
('contacto@otayindustrial.mx','Polietileno de Baja Densidad (LDPE)','polimeros@frontera.com','800.00','9.00','Completado','2025-11-18 09:00:00','2025-11-22 14:00:00'),
('compras@ecoplast.mx',      'Tambores de Plástico 200L',        'polimeros@frontera.com','50.00','120.00','Proceso',  '2025-11-28 10:00:00','NULL'),

-- ── madera@pinosolitario.com como COMPRADOR ──────────────────────────────
('logistica@palletspacifico.mx','Tablas de Pino Cepillado (Saldos)','madera@pinosolitario.com','600.00','18.00','Completado','2025-11-22 09:00:00','2025-11-26 13:00:00'),
('operaciones@cartoneslamesa.mx','Tubos de Cartón para Bobinas', 'madera@pinosolitario.com','200.00','3.00','Pendiente', '2025-12-05 10:00:00','NULL')

) AS d(pub_email, waste_title, buyer_email, weight, price, status_name, req_date, resp_date)
WHERE
    (SELECT w.waste_id FROM wastes w JOIN users u ON u.user_id = w.publisher_id
     WHERE u.contact_email = d.pub_email AND w.title = d.waste_title LIMIT 1) IS NOT NULL
    AND (SELECT user_id FROM users WHERE contact_email = d.buyer_email LIMIT 1) IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM purchase_requests pr
        WHERE pr.waste_id = (
            SELECT w2.waste_id FROM wastes w2 JOIN users u2 ON u2.user_id = w2.publisher_id
            WHERE u2.contact_email = d.pub_email AND w2.title = d.waste_title LIMIT 1
        ) AND pr.buyer_id = (SELECT user_id FROM users WHERE contact_email = d.buyer_email LIMIT 1)
    );

COMMIT;
