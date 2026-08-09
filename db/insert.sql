-- ==============================================================================
-- db/insert.sql — Datos semilla idempotentes para EcoBoros
-- Estructura: Un único bloque INSERT multifila estructurado por cada tabla.
-- Las evidencias (waste_evidences) las inserta automáticamente Scripts/seed_data.py
-- después de copiar las imágenes y PDFs generados.
-- ==============================================================================
BEGIN;

-- Asegurar columna password en users (migración segura)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(128);

-- ==============================================================================
-- 1. TABLA: USERS (Empresas publicadoras, compradoras y cuentas del sistema)
-- ==============================================================================
INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, password, is_active)
SELECT r.role_id, u.company_name, u.rfc, u.contact_email, u.contact_phone, u.password, u.is_active
FROM (VALUES
    -- Cuentas principales del sistema
    ('Empresa',            'Empresa Demo EcoBoros S.A.',                 'ECO123456789', 'empresa@ecoboros.com',            '664-000-0099', '123456', TRUE),
    ('Administrador Total','Administrador EcoBoros',                     NULL,           'admin@ecoboros.com',              '664-000-0000', '123456', TRUE),
    ('Usuario de Calidad', 'Equipo Calidad EcoBoros',                    NULL,           'calidad@ecoboros.com',            '664-000-0088', '123456', TRUE),
    -- Empresas asociadas a publicaciones y compras
    ('Empresa',            'Otay Industrial Recycling S.A. de C.V.',    'OIR123456789', 'contacto@otayindustrial.mx',      '664-000-0001', '123456', TRUE),
    ('Empresa',            'Alumina El Florido S.A. de C.V.',           'ALF123456789', 'ventas@aluminioflorido.mx',       '664-000-0002', '123456', TRUE),
    ('Empresa',            'Pallets Pacifico S.A. de C.V.',             'PAC123456789', 'logistica@palletspacifico.mx',    '664-000-0003', '123456', TRUE),
    ('Empresa',            'Cartones La Mesa S.A. de C.V.',             'CME123456789', 'operaciones@cartoneslamesa.mx',   '664-000-0004', '123456', TRUE),
    ('Empresa',            'Nordika Electronics Scrap S.A. de C.V.',    'NOR123456789', 'scrap@nordika.mx',               '664-000-0005', '123456', TRUE),
    ('Empresa',            'Zona Centro Papeles S.A. de C.V.',          'ZCP123456789', 'contacto@zonacentro.mx',          '664-000-0006', '123456', TRUE),
    ('Empresa',            'Cobre Otay S.A. de C.V.',                   'COB123456789', 'ventas@cobreotay.mx',             '664-000-0007', '123456', TRUE),
    ('Empresa',            'PET Rosarito Reciclaje S.A. de C.V.',       'PET123456789', 'contacto@petrosarito.mx',         '664-000-0008', '123456', TRUE),
    ('Empresa',            'Perfiles Tijuana S.A. de C.V.',             'PTJ123456789', 'ventas@perfilestijuana.mx',       '664-000-0009', '123456', TRUE),
    ('Empresa',            'Recicladora del Norte S.A. de C.V.',        'RNO123456789', 'compras@recicladnorte.mx',        '664-100-0001', '123456', TRUE),
    ('Empresa',            'Fundidora Baja S.A. de C.V.',               'FBJ123456789', 'adquisiciones@fundidorabaja.mx',  '664-100-0002', '123456', TRUE),
    ('Empresa',            'EcoPlast Mexicali S.A. de C.V.',            'EPM123456789', 'compras@ecoplast.mx',             '664-100-0003', '123456', TRUE)
) AS u(role_name, company_name, rfc, contact_email, contact_phone, password, is_active)
JOIN roles r ON r.role_name = u.role_name
WHERE NOT EXISTS (
    SELECT 1 FROM users ex WHERE ex.contact_email = u.contact_email
);

-- ==============================================================================
-- 2. TABLA: WASTES (Publicaciones de Residuos Industriales para Todos los Usuarios)
-- ==============================================================================
INSERT INTO wastes (publisher_id, category_id, title, technical_description, weight_decimal, quantity, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
    (SELECT user_id FROM users WHERE contact_email = d.pub_email LIMIT 1),
    (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER(d.cat) LIMIT 1),
    d.title,
    d.description,
    d.weight::DECIMAL(10,2),
    d.qty,
    CASE WHEN d.price = 'NULL' THEN NULL ELSE d.price::DECIMAL(10,2) END,
    d.gen_date::DATE,
    d.avail_date::DATE,
    (SELECT status_id FROM statuses WHERE status_name = d.status LIMIT 1),
    (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.com' LIMIT 1)
FROM (VALUES
    -- Empresa Demo EcoBoros S.A.
    ('empresa@ecoboros.com',          'Plasticos',   'Bidones HDPE Tricapa',           'Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos. Unidad usada en buen estado, sin deformaciones visibles.',                                 '850.00',  '850 Pzas','15.00','2025-10-01','2025-10-15','Aprobado'),
    ('empresa@ecoboros.com',          'Maderas',     'Pallets de Pino (Reparables)',   'Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno. Pino tratado, sin humedad excesiva, apto para almacenamiento.',                                         '4000.00', '200 Uds', '45.00','2025-09-28','2025-10-10','Aprobado'),
    ('empresa@ecoboros.com',          'Metales',     'Perfiles de Aluminio Extruido',  'Perfiles extruidos de aluminio, sección rectangular, superficie limpia. Buen estado estructural, sin corrosión visible.',                                                                        '500.00',  '500 kg',  '32.00','2025-10-20','2025-11-05','Aprobado'),
    -- Alumina El Florido S.A. de C.V.
    ('ventas@aluminioflorido.mx',     'Metales',     'Recortes de Aluminio 6061',      'Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión. Material limpio, sin óxido, con pieza de prueba incluida.',                                                            '2500.00', '2.5 Ton', '28.50','2025-10-05','2025-10-20','Aprobado'),
    ('ventas@aluminioflorido.mx',     'Metales',     'Viruta y Rebaba de Aluminio',   'Rebaba industrial limpia resultante de fresado CNC. Prensada en briquetes para fácil fundición y manejo.',                                                                                          '1500.00', '1.5 Ton', '22.00','2025-10-12','2025-10-27','Aprobado'),
    -- Cartones La Mesa S.A. de C.V.
    ('operaciones@cartoneslamesa.mx', 'Cartones',    'Pacas de Cartón Corrugado',      'Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical. Recomendado para empaques y relleno industrial.',                                                       '5000.00', '5 Ton',   '3.20', '2025-10-10','2025-10-25','Aprobado'),
    ('operaciones@cartoneslamesa.mx', 'Cartones',    'Cartón Plegadizo Grado Industrial','Plegadizo sobrante de imprenta y empaque primario. Material seco, clasificado y enfardado.',                                                                                                    '3200.00', '3.2 Ton', '2.80', '2025-10-18','2025-11-02','Aprobado'),
    -- Nordika Electronics Scrap S.A. de C.V.
    ('scrap@nordika.mx',              'Electronicos','Tarjetas Madre (Scrap)',          'Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales. Revisión visual previa.',                                                                      '500.00',  '500 kg',  '48.00','2025-10-12','2025-10-26','Revision'),
    ('scrap@nordika.mx',              'Electronicos','Motores Eléctricos Desmantelados','Motores trifásicos fuera de servicio para recuperación de cobre y hierro. Carcasas completas.',                                                                                                  '1800.00', '1.8 Ton', '35.00','2025-10-14','2025-10-29','Aprobado'),
    -- Zona Centro Papeles S.A. de C.V.
    ('contacto@zonacentro.mx',        'Papeles',     'Archivo Muerto (Triturado)',      'Papelería triturada de oficina, mezcla de papel bond y cartulina. Libre de datos sensibles y lista para reprocesamiento.',                                                                   '1200.00', '1.2 Ton', '2.10', '2025-09-15','2025-10-01','Aprobado'),
    ('contacto@zonacentro.mx',        'Papeles',     'Bobinas de Papel Kraft Residual', 'Saldos de bobinas de papel kraft de alto gramaje para embalaje o conversión a cartoncillo.',                                                                                                  '2800.00', '2.8 Ton', '4.50', '2025-10-08','2025-10-22','Aprobado'),
    -- Cobre Otay S.A. de C.V.
    ('ventas@cobreotay.mx',           'Metales',     'Cobre de Primera (Pelado)',       'Cobre limpio pelado, sin aislamiento, grado comercial de primera. Adecuado para reciclaje metalúrgico y fabricación eléctrica.',                                                              '300.00',  '300 kg',  '140.00','2025-10-15','2025-10-30','Aprobado'),
    ('ventas@cobreotay.mx',           'Metales',     'Placas de Cobre Electrolítico',   'Recortes de placas de cobre de alta pureza 99.9%. Material ideal para fundición de alta especificación.',                                                                                           '750.00',  '750 kg',   '145.00','2025-10-22','2025-11-06','Aprobado'),
    -- PET Rosarito Reciclaje S.A. de C.V.
    ('contacto@petrosarito.mx',       'Plasticos',   'Botellas PET Cristal',           'PET transparente de grado alimenticio triturado, limpio y sin etiquetas. Perfecto para reprocesado y fabricación de envases reciclados.',                                                    '1000.00', '1 Ton',   '8.00', '2025-10-02','2025-10-17','Aprobado'),
    ('contacto@petrosarito.mx',       'Plasticos',   'Envases HDPE Triturados (Molienda)','Flakes molienda HDPE limpia procedente de envases lácteos y detergentes. Color mixto.',                                                                                                        '2200.00', '2.2 Ton', '11.50','2025-10-16','2025-10-31','Aprobado'),
    -- Perfiles Tijuana S.A. de C.V.
    ('ventas@perfilestijuana.mx',     'Metales',     'Perfiles de Aluminio Estructural','Saldos de producción de perfiles extruidos anodizados. Tramos de 3 a 6 metros sin corrosión.',                                                                                                  '1400.00', '1.4 Ton', '34.00','2025-10-11','2025-10-26','Aprobado'),
    -- Otay Industrial Recycling S.A. de C.V.
    ('contacto@otayindustrial.mx',    'Plasticos',   'Polietileno de Alta Densidad (Pellet)','Pellet reciclado HDPE de color negro filtrado a 100 mallas. Fluidez media para inyección.',                                                                                               '3500.00', '3.5 Ton', '18.50','2025-10-09','2025-10-24','Aprobado'),
    -- Pallets Pacifico S.A. de C.V.
    ('logistica@palletspacifico.mx',  'Maderas',     'Tarimas Europallet Usadas',      'Tarimas tipo Europallet en buen estado estructural, de pino tratado térmicamente HT.',                                                                                                       '1200.00', '60 Uds',  '85.00','2025-10-13','2025-10-28','Aprobado'),
    ('logistica@palletspacifico.mx',  'Maderas',     'Rejas de Madera para Empaque',   'Cajas y rejas de madera de pino para embalaje pesado o reutilización artesanal.',                                                                                                            '900.00',  '90 Uds',   '25.00','2025-10-21','2025-11-05','Revision'),
    -- Fundidora Baja S.A. de C.V.
    ('adquisiciones@fundidorabaja.mx','Metales',     'Tiras de Latón Industrial',      'Recortes de lámina de latón industrial 70/30 libre de contaminantes. Excelente para reciclaje metalúrgico.',                                                                                       '650.00',  '650 kg',  '55.00','2025-10-17','2025-11-01','Aprobado'),
    ('adquisiciones@fundidorabaja.mx','Metales',     'Lingotes de Aluminio Reciclado', 'Lingotes secundarios de aluminio aleación A380 para inyección a presión. Certificado de análisis incluido.',                                                                                 '4500.00', '4.5 Ton', '31.00','2025-10-25','2025-11-09','Aprobado'),
    -- EcoPlast Mexicali S.A. de C.V.
    ('compras@ecoplast.mx',            'Plasticos',   'Tambores de Plástico 200L',      'Tambores cerrados de polietileno con dos tapones de 2 pulgadas. Lavados y neutralizados.',                                                                                                   '600.00',  '120 Pzas','120.00','2025-10-07','2025-10-22','Aprobado'),
    ('compras@ecoplast.mx',            'Plasticos',   'Contenedores IBC 1000L Limpios', 'Contenedores tipo tote de 1000 litros sobre estiba metálica. Lavados con certificación de limpieza.',                                                                                        '1500.00', '15 Uds',  '1100.00','2025-10-19','2025-11-03','Aprobado'),
    -- Recicladora del Norte S.A. de C.V.
    ('compras@recicladnorte.mx',       'Metales',     'Scrap de Cable Eléctrico Mixto', 'Cable eléctrico retirado de instalaciones industriales. Contenido estimado de cobre del 55%.',                                                                                                '2100.00', '2.1 Ton', '62.00','2025-10-14','2025-10-29','Aprobado'),
    ('compras@recicladnorte.mx',       'Metales',     'Chatarra Estructural de Acero',  'Vigas I, canales C y placa de acero estructural cortado a tramos de 1.5 metros.',                                                                                                            '8000.00', '8 Ton',   '4.80', '2025-10-23','2025-11-07','Aprobado')
) AS d(pub_email, cat, title, description, weight, qty, price, gen_date, avail_date, status)
WHERE NOT EXISTS (
    SELECT 1 FROM wastes w
    WHERE w.publisher_id = (SELECT user_id FROM users WHERE contact_email = d.pub_email LIMIT 1)
      AND w.title = d.title
);

-- ==============================================================================
-- 3. TABLA: PURCHASE_REQUESTS (Solicitudes de Compra y Transacciones para Todas las Empresas)
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
    -- Transacciones de la Empresa Demo
    ('empresa@ecoboros.com',          'Bidones HDPE Tricapa',           'compras@recicladnorte.mx',       '85.00',   '15.00', 'Completado','2025-11-01 10:00:00','2025-11-05 14:00:00'),
    ('ventas@aluminioflorido.mx',     'Recortes de Aluminio 6061',      'empresa@ecoboros.com',           '500.00',  '28.50', 'Completado','2025-11-03 09:00:00','2025-11-08 11:00:00'),
    ('empresa@ecoboros.com',          'Pallets de Pino (Reparables)',   'compras@recicladnorte.mx',       '1000.00', '45.00', 'Completado','2025-11-10 08:00:00','2025-11-15 16:00:00'),
    ('contacto@petrosarito.mx',       'Botellas PET Cristal',           'empresa@ecoboros.com',           '300.00',  '8.00',  'Proceso',   '2025-11-18 13:00:00','NULL'),
    ('operaciones@cartoneslamesa.mx', 'Pacas de Cartón Corrugado',      'empresa@ecoboros.com',           '2000.00', '3.20',  'Completado','2025-10-28 11:00:00','2025-11-02 09:00:00'),
    -- Transacciones entre otras empresas del sistema
    ('ventas@cobreotay.mx',           'Cobre de Primera (Pelado)',      'adquisiciones@fundidorabaja.mx', '150.00',  '135.00','Pendiente', '2025-11-20 15:00:00','NULL'),
    ('empresa@ecoboros.com',          'Perfiles de Aluminio Extruido',  'adquisiciones@fundidorabaja.mx', '200.00',  '30.00', 'Pendiente', '2025-11-22 10:30:00','NULL'),
    ('contacto@zonacentro.mx',        'Archivo Muerto (Triturado)',      'compras@ecoplast.mx',            '600.00',  '2.10',  'Proceso',   '2025-11-19 14:00:00','NULL'),
    ('contacto@otayindustrial.mx',    'Polietileno de Alta Densidad (Pellet)','compras@ecoplast.mx',      '1000.00', '18.00', 'Completado','2025-11-05 11:30:00','2025-11-09 16:20:00'),
    ('logistica@palletspacifico.mx',  'Tarimas Europallet Usadas',      'compras@recicladnorte.mx',       '30.00',   '85.00', 'Completado','2025-11-08 09:15:00','2025-11-12 10:00:00'),
    ('adquisiciones@fundidorabaja.mx','Tiras de Latón Industrial',      'ventas@aluminioflorido.mx',      '300.00',  '54.00', 'Proceso',   '2025-11-12 14:45:00','NULL'),
    ('scrap@nordika.mx',              'Motores Eléctricos Desmantelados','adquisiciones@fundidorabaja.mx','1000.00', '35.00', 'Completado','2025-11-14 16:00:00','2025-11-17 11:10:00'),
    ('compras@ecoplast.mx',            'Contenedores IBC 1000L Limpios', 'contacto@otayindustrial.mx',     '5.00',    '1100.00','Pendiente','2025-11-21 08:30:00','NULL'),
    ('ventas@aluminioflorido.mx',     'Viruta y Rebaba de Aluminio',   'adquisiciones@fundidorabaja.mx', '800.00',  '22.00', 'Completado','2025-11-15 10:20:00','2025-11-18 15:40:00'),
    ('compras@recicladnorte.mx',       'Scrap de Cable Eléctrico Mixto', 'ventas@cobreotay.mx',            '1500.00', '60.00', 'Proceso',   '2025-11-20 12:00:00','NULL')
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


