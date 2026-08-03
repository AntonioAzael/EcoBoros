-- db/data_inserts.sql
-- Inserciones idempotentes para los productos simulados del repo EcoBoros
BEGIN;

-- ====== USERS (publishers) ======
INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Otay Industrial Recycling S.A. de C.V.',
       'OIR123456ABC',
       'contacto@otayindustrial.mx',
       '664-000-0001',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Otay Industrial Recycling S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Alumina El Florido S.A. de C.V.',
       'ALF123456ABC',
       'ventas@aluminioflorido.mx',
       '664-000-0002',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Alumina El Florido S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Pallets Pacifico S.A. de C.V.',
       'PAC123456ABC',
       'logistica@palletspacifico.mx',
       '664-000-0003',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Pallets Pacifico S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Cartones La Mesa S.A. de C.V.',
       'CME123456ABC',
       'operaciones@cartoneslamesa.mx',
       '664-000-0004',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Cartones La Mesa S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Nordika Electronics Scrap S.A. de C.V.',
       'NORD123456ABC',
       'scrap@nordika.mx',
       '664-000-0005',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Nordika Electronics Scrap S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Zona Centro Papeles S.A. de C.V.',
       'ZCP123456ABC',
       'contacto@zonacentro.mx',
       '664-000-0006',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Zona Centro Papeles S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'Cobre Otay S.A. de C.V.',
       'COB123456ABC',
       'ventas@cobreotay.mx',
       '664-000-0007',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'Cobre Otay S.A. de C.V.');

INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Empresa' LIMIT 1),
       'PET Rosarito Reciclaje S.A. de C.V.',
       'PET123456ABC',
       'contacto@petrosarito.mx',
       '664-000-0008',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE company_name = 'PET Rosarito Reciclaje S.A. de C.V.');

-- Usuario de calidad (validator)
INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, is_active)
SELECT (SELECT role_id FROM roles WHERE role_name = 'Usuario de Calidad' LIMIT 1),
       'Equipo Calidad EcoBoros',
       NULL,
       'calidad@ecoboros.mx',
       '664-000-0099',
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE contact_email = 'calidad@ecoboros.mx');

-- ====== WASTES (productos) ======
/*
Notes:
- Mapeos de categoría: Plásticos -> Plasticos, Cartón -> Cartones, Electrónicos -> Electronicos, Papel -> Papeles
- unit_price se almacena como decimal (si en el script era "A Tratar" lo dejamos NULL)
- Agrego cantidad y la forma de precio al technical_description para no perder esa info textual
*/

-- 1) Bidones HDPE Tricapa
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Otay Industrial Recycling S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Plasticos') LIMIT 1),
  $$Bidones HDPE Tricapa. Cantidad disponible: 850 Pzas. Precio mostrado: $ 15.00 / pza.
Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos.$$,
  850.00,
  15.00,
  '2023-10-01',
  '2023-10-01',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w
  WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Otay Industrial Recycling S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Bidones HDPE Tricapa%'
);

-- 2) Recortes de Aluminio 6061
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Alumina El Florido S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Metales') LIMIT 1),
  $$Recortes de Aluminio 6061. Cantidad disponible: 2.5 Ton (2500 kg). Precio mostrado: $ 28.50 / kg.
Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión.$$,
  2500.00,
  28.50,
  '2023-10-05',
  '2023-10-05',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Alumina El Florido S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Recortes de Aluminio 6061%'
);

-- 3) Pallets de Pino (Reparables)
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Pallets Pacifico S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Maderas') LIMIT 1),
  $$Pallets de Pino (Reparables). Cantidad disponible: 200 Uds. Peso total aproximado: 4000 kg. Precio mostrado: $ 45.00 / ud.
Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno.$$,
  4000.00,
  45.00,
  '2023-09-28',
  '2023-09-28',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Pallets Pacifico S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Pallets de Pino (Reparables)%'
);

-- 4) Pacas de Cartón Corrugado
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Cartones La Mesa S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Cartones') LIMIT 1),
  $$Pacas de Cartón Corrugado. Cantidad disponible: 5 Ton (5000 kg). Precio mostrado: $ 3.20 / kg.
Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical.$$,
  5000.00,
  3.20,
  '2023-10-10',
  '2023-10-10',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Cartones La Mesa S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Pacas de Cartón Corrugado%'
);

-- 5) Tarjetas Madre (Scrap)
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Nordika Electronics Scrap S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Electronicos') LIMIT 1),
  $$Tarjetas Madre (Scrap). Cantidad disponible: 500 kg. Precio: A Tratar.
Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales.$$,
  500.00,
  NULL,
  '2023-10-12',
  '2023-10-12',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Nordika Electronics Scrap S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Tarjetas Madre (Scrap)%'
);

-- 6) Archivo Muerto (Triturado)
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Zona Centro Papeles S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Papeles') LIMIT 1),
  $$Archivo Muerto (Triturado). Cantidad disponible: 1.2 Ton (1200 kg). Precio mostrado: $ 2.10 / kg.
Papelería triturada de oficina, mezcla de papel bond y cartulina.$$,
  1200.00,
  2.10,
  '2023-09-15',
  '2023-09-15',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Zona Centro Papeles S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Archivo Muerto (Triturado)%'
);

-- 7) Cobre de Primera (Pelado)
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'Cobre Otay S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Metales') LIMIT 1),
  $$Cobre de Primera (Pelado). Cantidad disponible: 300 kg. Precio mostrado: $ 140.00 / kg.
Cobre limpio pelado, sin aislamiento, grado comercial de primera.$$,
  300.00,
  140.00,
  '2023-10-15',
  '2023-10-15',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'Cobre Otay S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Cobre de Primera (Pelado)%'
);

-- 8) Botellas PET Cristal
INSERT INTO wastes (publisher_id, category_id, technical_description, weight_decimal, unit_price, generation_date, availability_date, status_id, quality_validator_id)
SELECT
  (SELECT user_id FROM users WHERE company_name = 'PET Rosarito Reciclaje S.A. de C.V.' LIMIT 1),
  (SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER('Plasticos') LIMIT 1),
  $$Botellas PET Cristal. Cantidad disponible: 1 Ton (1000 kg). Precio mostrado: $ 8.00 / kg.
PET transparente de grado alimenticio triturado, limpio y sin etiquetas.$$,
  1000.00,
  8.00,
  '2023-10-02',
  '2023-10-02',
  (SELECT status_id FROM statuses WHERE status_name = 'Revision' LIMIT 1),
  (SELECT user_id FROM users WHERE contact_email = 'calidad@ecoboros.mx' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM wastes w WHERE w.publisher_id = (SELECT user_id FROM users WHERE company_name = 'PET Rosarito Reciclaje S.A. de C.V.' LIMIT 1)
    AND w.technical_description ILIKE '%Botellas PET Cristal%'
);

-- ====== WASTE EVIDENCES (documentación) ======
-- Cada inserción de evidence es idempotente (se comprueba file_path)
-- Bidones HDPE Tricapa
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Ficha técnica :: Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Bidones HDPE Tricapa%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Ficha técnica :: Bidones HDPE%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Condición :: Unidad usada en buen estado, sin deformaciones visibles y con cierre hermético probado.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Bidones HDPE Tricapa%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Condición ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Certificado :: Disponible certificado de reciclaje y trazabilidad de plástico.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Bidones HDPE Tricapa%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Certificado ::%');

-- Recortes de Aluminio 6061
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Especificaciones :: Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Recortes de Aluminio 6061%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Especificaciones ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Calidad :: Material limpio, sin óxido, con pieza de prueba incluida.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Recortes de Aluminio 6061%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Calidad ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Certificado :: Informe de composición química entregable bajo solicitud.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Recortes de Aluminio 6061%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Certificado ::%');

-- Pallets de Pino (Reparables)
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Condición :: Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Pallets de Pino (Reparables)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Condición :: Pallets reutilizados%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Material :: Pino tratado, sin humedad excesiva, apto para almacenamiento y carga moderada.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Pallets de Pino (Reparables)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Material ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Recomendación :: Ideal para uso en bodegas o transporte de piezas ligeras.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Pallets de Pino (Reparables)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Recomendación ::%');

-- Pacas de Cartón Corrugado
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Ficha técnica :: Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Pacas de Cartón Corrugado%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Ficha técnica :: Cartón corrugado%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Uso recomendado :: Recomendado para empaques, relleno y proyectos de reciclaje industrial.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Pacas de Cartón Corrugado%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Uso recomendado ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Condición :: Material limpio, con algunas imperfecciones menores de almacenamiento.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Pacas de Cartón Corrugado%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Condición :: Material limpio%');

-- Tarjetas Madre (Scrap)
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Descripción :: Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Tarjetas Madre (Scrap)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Descripción :: Scrap%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Inspección :: Revisión visual previa; sin garantías de funcionalidad.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Tarjetas Madre (Scrap)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Inspección ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Manejo seguro :: Usar equipo de protección y separar elementos tóxicos antes de procesar.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Tarjetas Madre (Scrap)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Manejo seguro ::%');

-- Archivo Muerto (Triturado)
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Tipo de material :: Papelería triturada de oficina, mezcla de papel bond y cartulina.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Archivo Muerto (Triturado)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Tipo de material ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Protección :: Libre de datos sensibles y lista para reprocesamiento o compostaje industrial.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Archivo Muerto (Triturado)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Protección ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Uso :: Ideal para reciclaje de papel o relleno de embalajes.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Archivo Muerto (Triturado)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Uso ::%');

-- Cobre de Primera (Pelado)
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Calidad :: Cobre limpio pelado, sin aislamiento, grado comercial de primera.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Cobre de Primera (Pelado)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Calidad ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Aplicación :: Adecuado para reciclaje metalúrgico y fabricación de componentes eléctricos.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Cobre de Primera (Pelado)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Aplicación ::%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Certificado :: Informe de pureza disponible según solicitud.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Cobre de Primera (Pelado)%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Certificado ::%');

-- Botellas PET Cristal
INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Material :: PET transparente de grado alimenticio triturado, limpio y sin etiquetas.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Botellas PET Cristal%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Material :: PET%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Uso :: Perfecto para reprocesado y fabricación de fibra o envases reciclados.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Botellas PET Cristal%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Uso :: Perfecto%');

INSERT INTO waste_evidences (waste_id, file_path, file_type)
SELECT w.waste_id, 'Certificación :: Cumple con normas básicas de separación y limpieza para reciclaje.', 'doc_text'
FROM wastes w WHERE w.technical_description ILIKE '%Botellas PET Cristal%'
AND NOT EXISTS (SELECT 1 FROM waste_evidences we WHERE we.waste_id = w.waste_id AND we.file_path ILIKE 'Certificación ::%');

COMMIT;