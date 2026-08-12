-- ==============================================================================
-- db/insert.sql — Datos semilla idempotentes para EcoBoros v3 (Password: eco472)
-- >=10 wastes Aprobados por categoría · cada empresa tiene 1-2 wastes variados
-- purchase_requests con compras reales por buyer
-- ==============================================================================
BEGIN;

-- Migración segura de columna password
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(128);

-- ==============================================================================
-- 1. USERS  (password unificado: eco472)
-- ==============================================================================
INSERT INTO users (role_id, company_name, rfc, contact_email, contact_phone, password, is_active)
SELECT r.role_id, u.company_name, u.rfc, u.contact_email, u.contact_phone, u.password, u.is_active
FROM (VALUES
    ('Empresa',            'Empresa Demo EcoBoros S.A.',               'ECO123456789', 'empresa@ecoboros.com',          '664-000-0099', 'eco472', TRUE),
    ('Administrador Total','Administrador EcoBoros',                   NULL,           'admin@ecoboros.com',            '664-000-0000', 'eco472', TRUE),
    ('Usuario de Calidad', 'Inspector Carlos Mendoza (Calidad A)',    NULL,           'calidad@ecoboros.com',          '664-000-0088', 'eco472', TRUE),
    ('Usuario de Calidad', 'Inspectora Sofia Ruiz (Calidad B)',       NULL,           'calidad.b@ecoboros.com',        '664-000-0089', 'eco472', TRUE),
    ('Usuario de Calidad', 'Inspector Fernando Gomez (Calidad C)',    NULL,           'calidad.c@ecoboros.com',        '664-000-0090', 'eco472', TRUE),
    ('Empresa',            'Otay Industrial Recycling S.A. de C.V.',  'OIR123456789', 'contacto@otayindustrial.mx',    '664-000-0001', 'eco472', TRUE),
    ('Empresa',            'Alumina El Florido S.A. de C.V.',         'ALF123456789', 'ventas@aluminioflorido.mx',     '664-000-0002', 'eco472', TRUE),
    ('Empresa',            'Pallets Pacifico S.A. de C.V.',           'PAC123456789', 'logistica@palletspacifico.mx',  '664-000-0003', 'eco472', TRUE),
    ('Empresa',            'Cartones La Mesa S.A. de C.V.',           'CME123456789', 'operaciones@cartoneslamesa.mx', '664-000-0004', 'eco472', TRUE),
    ('Empresa',            'Nordika Electronics Scrap S.A. de C.V.', 'NOR123456789', 'scrap@nordika.mx',              '664-000-0005', 'eco472', TRUE),
    ('Empresa',            'Zona Centro Papeles S.A. de C.V.',        'ZCP123456789', 'contacto@zonacentro.mx',        '664-000-0006', 'eco472', TRUE),
    ('Empresa',            'Cobre Otay S.A. de C.V.',                 'COB123456789', 'ventas@cobreotay.mx',           '664-000-0007', 'eco472', TRUE),
    ('Empresa',            'PET Rosarito Reciclaje S.A. de C.V.',    'PET123456789', 'contacto@petrosarito.mx',       '664-000-0008', 'eco472', TRUE),
    ('Empresa',            'Perfiles Tijuana S.A. de C.V.',           'PTJ123456789', 'ventas@perfilestijuana.mx',     '664-000-0009', 'eco472', TRUE),
    ('Empresa',            'Recicladora del Norte S.A. de C.V.',      'RNO123456789', 'compras@recicladnorte.mx',      '664-100-0001', 'eco472', TRUE),
    ('Empresa',            'Fundidora Baja S.A. de C.V.',             'FBJ123456789', 'adquisiciones@fundidorabaja.mx','664-100-0002', 'eco472', TRUE),
    ('Empresa',            'EcoPlast Mexicali S.A. de C.V.',          'EPM123456789', 'compras@ecoplast.mx',           '664-100-0003', 'eco472', TRUE),
    ('Empresa',            'Aceros del Pacifico S. de R.L.',          'APA987654321', 'acero@pacifico.com',            '686-200-0001', 'eco472', TRUE),
    ('Empresa',            'Polimeros de la Frontera S.A.',           'PFR987654321', 'polimeros@frontera.com',        '664-200-0002', 'eco472', TRUE),
    ('Empresa',            'Madereria El Pino Solitario S.A.',        'MPS987654321', 'madera@pinosolitario.com',      '664-200-0003', 'eco472', TRUE)
) AS u(role_name, company_name, rfc, contact_email, contact_phone, password, is_active)
JOIN roles r ON r.role_name = u.role_name
ON CONFLICT (contact_email) DO UPDATE SET password = EXCLUDED.password;

COMMIT;

-- ==============================================================================
-- 2. WASTES (Generados dinamicamente desde seed_data.py)
-- ==============================================================================
INSERT INTO wastes (waste_id, publisher_id, category_id, title, technical_description, weight_decimal, quantity, unit_price, generation_date, availability_date, status_id, quality_validator_id)
VALUES
(1, 7, 1, 'Recortes de Aluminio 6061', 'Especificaciones: Aleacion 6061-T6 ideal para mecanizado. | Calidad: Material limpio sin oxido.', 2500.0, '2.5 Ton', 28.5, '2025-10-05', '2025-10-05', 2, 4),
(2, 7, 1, 'Viruta y Rebaba de Aluminio', 'Proceso: Rebaba de fresado CNC prensada. | Manejo: Briquetado de alta densidad.', 1500.0, '1.5 Ton', 22.0, '2025-10-12', '2025-10-12', 2, 5),
(3, 7, 1, 'Aluminio 1100 en Lamina', 'Tipo: Lamina 1100 alta pureza calibre 16. | Uso: Conformado en frio.', 800.0, '800 kg', 26.0, '2025-11-02', '2025-11-02', 2, 3),
(4, 7, 1, 'Alambre de Aluminio para Fusion', 'Tipo: Alambre Al 1350 para fundicion. | Calidad: Sin oxido superficial.', 600.0, '600 kg', 20.0, '2025-11-20', '2025-11-20', 2, 4),
(5, 12, 1, 'Cobre de Primera (Pelado)', 'Calidad: Cobre limpio pelado grado comercial A. | Aplicacion: Reciclaje metalurgico.', 300.0, '300 kg', 140.0, '2025-10-15', '2025-10-15', 2, 5),
(6, 12, 1, 'Placas de Cobre Electrolitico', 'Pureza: Cobre electrolitico 99.9%. | Fundicion: Apto fundicion especial.', 750.0, '750 kg', 145.0, '2025-10-22', '2025-10-22', 2, 3),
(7, 12, 1, 'Cobre Rojo N2 con Aislante', 'Contenido: ~70% cobre cable industrial. | Estado: Cubierta PVC retirada.', 900.0, '900 kg', 72.0, '2025-11-08', '2025-11-08', 2, 4),
(8, 12, 1, 'Tuberia de Cobre Tipo L', 'Tipo: Tuberia Cu tipo L 1/2 a 2 pulgadas. | Estado: Sin fugas previas.', 420.0, '420 kg', 130.0, '2025-11-15', '2025-11-15', 2, 5),
(9, 14, 1, 'Perfiles de Aluminio Estructural', 'Anodizado: Tramos 3-6 m sin corrosion. | Estado: Superficie limpia en estiba.', 1400.0, '1.4 Ton', 34.0, '2025-10-11', '2025-10-11', 2, 3),
(10, 14, 1, 'Angulos de Aluminio 6063', 'Tipo: Angulo extruido 6063-T5. | Uso: Estructuras ligeras.', 950.0, '950 kg', 30.0, '2025-11-05', '2025-11-05', 2, 4),
(11, 14, 1, 'Tubos Cuadrados de Aluminio', 'Medida: 40x40 mm seccion completa. | Estado: Sin deformaciones.', 700.0, '700 kg', 32.0, '2025-11-18', '2025-11-18', 2, 5),
(12, 16, 1, 'Tiras de Laton Industrial', 'Composicion: Laton 70/30 de troquelado. | Limpieza: Libre de grasas pesadas.', 650.0, '650 kg', 55.0, '2025-10-17', '2025-10-17', 2, 3),
(13, 16, 1, 'Lingotes de Aluminio Reciclado', 'Aleacion: A380 lingote secundario. | Certificado: Espectrometria adjunta.', 4500.0, '4.5 Ton', 31.0, '2025-10-25', '2025-10-25', 2, 4),
(14, 16, 1, 'Bronce Fosforado en Chatarra', 'Material: Bronce C544 fuera de servicio. | Uso: Refundicion de alta calidad.', 380.0, '380 kg', 88.0, '2025-11-10', '2025-11-10', 2, 5),
(15, 15, 1, 'Scrap de Cable Electrico Mixto', 'Rendimiento: 55% cobre recuperable. | Origen: Desmantelamiento electrico.', 2100.0, '2.1 Ton', 62.0, '2025-10-14', '2025-10-14', 2, 3),
(16, 15, 1, 'Chatarra Estructural de Acero', 'Formato: Vigas I y placa cortada a 1.5m. | Calidad: Acero A36 estructural.', 8000.0, '8 Ton', 4.8, '2025-10-23', '2025-10-23', 2, 4),
(17, 15, 1, 'Acero Inoxidable 304 en Recortes', 'Tipo: Chapa 304 de troqueleria. | Estado: Sin oxido, espesor 1-3 mm.', 1100.0, '1.1 Ton', 38.0, '2025-11-12', '2025-11-12', 2, 5),
(18, 18, 1, 'Lamina de Acero Inoxidable (Saldos)', 'Tipo: Inoxidable 304 varios calibres. | Aplicacion: Proyectos industriales.', 1250.0, '1.25 Ton', 25.0, '2025-10-28', '2025-10-28', 2, 3),
(19, 18, 1, 'Tuberia de Acero al Carbon', 'Diametro: 4 y 6 pulgadas sobrantes. | Estado: Sin oxido excesivo.', 3000.0, '3 Ton', 6.5, '2025-11-05', '2025-11-05', 2, 4),
(20, 18, 1, 'Herrajes de Acero Galvanizado', 'Tipo: Tornillos, pernos y escuadras. | Origen: Saldos de construccion.', 500.0, '500 kg', 18.0, '2025-11-12', '2025-11-12', 2, 5),
(21, 18, 1, 'Acero de Refuerzo (Varilla)', 'Tipo: Varilla corrugada grado 42. | Longitud: Tramos de 6 metros.', 2000.0, '2 Ton', 5.5, '2025-11-22', '2025-11-22', 2, 3),
(22, 1, 1, 'Perfiles de Aluminio Extruido', 'Tipo: Seccion rectangular limpia. | Condicion: Sin corrosion visible.', 500.0, '500 kg', 32.0, '2025-10-20', '2025-10-20', 2, 4),
(23, 1, 2, 'Bidones HDPE Tricapa', 'Capacidad: 220 L resistencia industrial. | Estado: Sin deformaciones visibles.', 850.0, '850 Pzas', 15.0, '2025-10-01', '2025-10-01', 2, 5),
(24, 13, 2, 'Botellas PET Cristal', 'Material: PET alimenticio limpio. | Certificacion: Normas de reciclaje.', 1000.0, '1 Ton', 8.0, '2025-10-02', '2025-10-02', 2, 3),
(25, 13, 2, 'Envases HDPE Triturados (Molienda)', 'Proceso: Flakes molienda HDPE limpia. | Color: Mezcla clasificada.', 2200.0, '2.2 Ton', 11.5, '2025-10-16', '2025-10-16', 2, 4),
(26, 13, 2, 'Lamina de PET Transparente', 'Tipo: PET termoformable 0.5 mm. | Uso: Envases y blisters.', 600.0, '600 kg', 12.0, '2025-11-10', '2025-11-10', 2, 5),
(27, 13, 2, 'PET Verde Molido Post-Consumo', 'Color: Verde lavado y clasificado. | Fluidez: Buena para extrusion.', 900.0, '900 kg', 7.5, '2025-11-22', '2025-11-22', 2, 3),
(28, 6, 2, 'Polietileno de Alta Densidad (Pellet)', 'Grado: Pellet HDPE negro industrial. | Proceso: Filtrado 100 mallas.', 3500.0, '3.5 Ton', 18.5, '2025-10-09', '2025-10-09', 2, 4),
(29, 6, 2, 'Polietileno de Baja Densidad (LDPE)', 'Tipo: Film agricola LDPE molido. | Calidad: Propiedades mecanicas preservadas.', 1800.0, '1.8 Ton', 9.0, '2025-11-04', '2025-11-04', 2, 5),
(30, 17, 2, 'Tambores de Plastico 200L', 'Sanitizacion: Lavados y desinfectados. | Tapon: Rosca 2 pulgadas hermetica.', 600.0, '120 Pzas', 120.0, '2025-10-07', '2025-10-07', 2, 3),
(31, 17, 2, 'Contenedores IBC 1000L Limpios', 'Estructura: Tote IBC reja metalica. | Valvula: Bola 2 pulgadas probada.', 1500.0, '15 Uds', 1100.0, '2025-10-19', '2025-10-19', 2, 4),
(32, 17, 2, 'Pelicula Stretch de Polipropileno', 'Tipo: PP stretch sin marca. | Uso: Empaque secundario industrial.', 400.0, '400 kg', 14.0, '2025-11-08', '2025-11-08', 2, 5),
(33, 17, 2, 'Tapas y Tapones PP Mixtos', 'Material: Polipropileno clasificado. | Estado: Limpias por color.', 350.0, '350 kg', 10.0, '2025-11-18', '2025-11-18', 2, 3),
(34, 19, 2, 'Polipropileno en Hojuelas (PP)', 'Calidad: Hojuelas post-industriales limpias. | Uso: Extrusion y moldeo.', 4000.0, '4 Ton', 14.0, '2025-10-30', '2025-10-30', 2, 4),
(35, 19, 2, 'PVC Rigido Molido', 'Origen: Perfiles de ventanas. | Pureza: Libre de contaminantes.', 2000.0, '2 Ton', 9.0, '2025-11-08', '2025-11-08', 2, 5),
(36, 19, 2, 'Nylon 6 Molido Post-Industrial', 'Material: Nylon 6 piezas tecnicas. | Limpieza: Libre de aceite.', 500.0, '500 kg', 22.0, '2025-11-20', '2025-11-20', 2, 3),
(37, 19, 2, 'ABS Molido Clasificado', 'Calidad: ABS post-industrial. | Color: Clasificado por tono.', 700.0, '700 kg', 18.0, '2025-11-28', '2025-11-28', 2, 4),
(38, 9, 3, 'Pacas de Carton Corrugado', 'Tipo: Corrugado reciclado densidad media. | Uso: Embalaje y empaque.', 5000.0, '5 Ton', 3.2, '2025-10-10', '2025-10-10', 1, NULL),
(39, 9, 3, 'Carton Plegadizo Grado Industrial', 'Calidad: Plegadizo seco enfardado. | Uso: Reaprovechamiento papelero.', 3200.0, '3.2 Ton', 2.8, '2025-10-18', '2025-10-18', 2, 3),
(40, 9, 3, 'Carton Liner Blanco Prensado', 'Tipo: Liner blanco alto gramaje. | Uso: Empaque de alimentos.', 2000.0, '2 Ton', 3.8, '2025-11-01', '2025-11-01', 3, 3),
(41, 9, 3, 'Carton Micro-Corrugado Residual', 'Tipo: Micro-corrugado de imprentas. | Estado: Seco sin barniz.', 1500.0, '1.5 Ton', 2.6, '2025-11-15', '2025-11-15', 2, 5),
(42, 9, 3, 'Carton Gris Multicapa', 'Uso: Carpetas y encuadernacion. | Estado: Buen estado.', 800.0, '800 kg', 2.2, '2025-11-25', '2025-11-25', 2, 3),
(43, 9, 3, 'Carton Kraft para Cajas de Envio', 'Tipo: Cajas kraft desarmadas. | Estado: Aptas re-empaque.', 2800.0, '2.8 Ton', 2.5, '2025-12-01', '2025-12-01', 2, 4),
(44, 11, 3, 'Carton Gris de Empaque Mixto', 'Origen: Empaque farmaceutico. | Estado: Limpio y clasificado.', 2000.0, '2 Ton', 2.5, '2025-11-22', '2025-11-22', 2, 5),
(45, 11, 3, 'Cajas de Carton para Exportacion', 'Tipo: Doble cara exportacion. | Estado: Buen estado estructural.', 3500.0, '3.5 Ton', 2.9, '2025-11-28', '2025-11-28', 2, 3),
(46, 11, 3, 'Carton Plastificado Residual', 'Tipo: Carton con capa plastica. | Reciclaje: Especializado.', 1200.0, '1.2 Ton', 1.8, '2025-12-05', '2025-12-05', 2, 4),
(47, 1, 3, 'Separadores de Carton Industrial', 'Uso: Logistica de piezas. | Estado: Reutilizables.', 600.0, '600 kg', 1.5, '2025-12-08', '2025-12-08', 2, 5),
(48, 16, 3, 'Tubos de Carton para Bobinas', 'Tipo: Nucleos tubulares varios diametros. | Uso: Rebobinado industrial.', 450.0, '450 kg', 3.0, '2025-12-10', '2025-12-10', 2, 3),
(49, 11, 4, 'Archivo Muerto (Triturado)', 'Material: Papeleria triturada bond y cartulina. | Seguridad: Libre de datos sensibles.', 1200.0, '1.2 Ton', 2.1, '2025-09-15', '2025-09-15', 2, 4),
(50, 11, 4, 'Bobinas de Papel Kraft Residual', 'Gramaje: Kraft pesado residual. | Uso: Conversion a cartoncillo.', 2800.0, '2.8 Ton', 4.5, '2025-10-08', '2025-10-08', 2, 5),
(51, 11, 4, 'Papel Bond de Impresion (Recortes)', 'Tipo: Bond 75 g/m2 corte digital. | Estado: Libre de humedad.', 900.0, '900 kg', 1.8, '2025-10-25', '2025-10-25', 2, 3),
(52, 11, 4, 'Papel Periodico Residual', 'Tipo: Bobinas de imprenta. | Fibra: Corta apta para reciclaje.', 4000.0, '4 Ton', 1.2, '2025-11-05', '2025-11-05', 2, 4),
(53, 11, 4, 'Papel Couche Sin Barniz', 'Tipo: Couche mate 135 g/m2. | Uso: Reciclado de fibra larga.', 1500.0, '1.5 Ton', 2.4, '2025-11-15', '2025-11-15', 2, 5),
(54, 11, 4, 'Papel Tissue Post-Consumo', 'Origen: Hoteles y hospitales. | Fibra: Corta apta para repulpeo.', 700.0, '700 kg', 1.0, '2025-11-28', '2025-11-28', 2, 3),
(55, 15, 4, 'Papel Kraft Para Empaque', 'Tipo: Kraft de imprenta. | Uso: Empaque industrial secundario.', 800.0, '800 kg', 3.5, '2025-11-15', '2025-11-15', 2, 4),
(56, 15, 4, 'Papel Reciclado Mixto (Mezcla de Oficina)', 'Mezcla: Bond, fax y color. | Estado: Sin clips ni espirales.', 2000.0, '2 Ton', 1.6, '2025-11-22', '2025-11-22', 2, 5),
(57, 1, 4, 'Papel Satinado Residual de Revista', 'Origen: Editorial sobrante. | Fibra: Larga alta calidad.', 1100.0, '1.1 Ton', 2.0, '2025-12-01', '2025-12-01', 2, 3),
(58, 8, 4, 'Papel para Envolver (Saldos de Imprenta)', 'Tipo: Kraft sin estampado 70 cm. | Origen: Excedente de produccion.', 550.0, '550 kg', 2.8, '2025-12-05', '2025-12-05', 2, 4),
(59, 19, 4, 'Papel Siliconado Residual', 'Tipo: Release liner de etiquetas. | Reciclaje: Especializado.', 300.0, '300 kg', 0.9, '2025-12-08', '2025-12-08', 2, 5),
(60, 20, 4, 'Papel Estucado para Impresion Offset', 'Tipo: Estucado 170 g/m2 alto brillo. | Estado: Lote clasificado.', 650.0, '650 kg', 2.2, '2025-12-10', '2025-12-10', 2, 3),
(61, 1, 6, 'Pallets de Pino (Reparables)', 'Condicion: Listos para reparacion. | Material: Pino tratado sin humedad.', 4000.0, '200 Uds', 45.0, '2025-09-28', '2025-09-28', 2, 4),
(62, 8, 6, 'Tarimas Europallet Usadas', 'Estandar: Europallet HT. | Resistencia: 1.5 Ton carga.', 1200.0, '60 Uds', 85.0, '2025-10-13', '2025-10-13', 2, 5),
(63, 8, 6, 'Rejas de Madera para Empaque', 'Uso: Embalaje pesado. | Estado: Buen estado general.', 900.0, '90 Uds', 25.0, '2025-10-21', '2025-10-21', 2, 3),
(64, 8, 6, 'Tablas de Pino Cepillado (Saldos)', 'Tipo: Pino 2x6 largo 1.5-3 m. | Estado: Sin nudos grandes.', 2500.0, '250 Uds', 18.0, '2025-11-03', '2025-11-03', 2, 4),
(65, 8, 6, 'Marcos de Madera de Empaque Industrial', 'Tipo: Marcos para maquinaria pesada. | Estado: Sin fracturas.', 1800.0, '120 Uds', 30.0, '2025-11-15', '2025-11-15', 2, 5),
(66, 20, 6, 'Postes de Madera Tratada', 'Tratamiento: Pino tratado exterior. | Condicion: Excelente estado.', 2500.0, '50 Uds', 150.0, '2025-11-01', '2025-11-01', 2, 3),
(67, 20, 6, 'Vigas de Madera de Pino Estructural', 'Tipo: Pino 4x8 largo 4 m. | Origen: Demolicion controlada.', 3200.0, '80 Uds', 120.0, '2025-11-10', '2025-11-10', 2, 4),
(68, 20, 6, 'Triplay de Madera (Recortes)', 'Tipo: Recortes varios espesores. | Uso: Muebleria y artesania.', 700.0, '700 kg', 8.0, '2025-11-20', '2025-11-20', 2, 5),
(69, 20, 6, 'Duela de Pino para Reciclaje', 'Tipo: Duela piso nave industrial. | Estado: Sin clavos, 80 cm.', 1500.0, '1.5 Ton', 12.0, '2025-12-01', '2025-12-01', 2, 3),
(70, 15, 6, 'Cajones de Madera para Fruta', 'Tipo: Cajones de alamo. | Uso: Segunda vida re-empaque.', 600.0, '300 Pzas', 5.0, '2025-12-05', '2025-12-05', 2, 4),
(71, 6, 6, 'Cunas y Calzas de Madera Industrial', 'Tipo: Madera dura para carga pesada. | Estado: Sin fracturas.', 400.0, '400 kg', 6.0, '2025-12-08', '2025-12-08', 2, 5),
(72, 18, 6, 'Madera Aglomerada (MDF Recortes)', 'Tipo: MDF 15 mm de imprentas. | Estado: Sin pintura activa.', 900.0, '900 kg', 4.5, '2025-12-10', '2025-12-10', 2, 3),
(73, 10, 5, 'Tarjetas Madre (Scrap)', 'Tipo: Scrap tarjetas madre. | Inspeccion: Revision visual previa.', 500.0, '500 kg', 48.0, '2025-10-12', '2025-10-12', 2, 4),
(74, 10, 5, 'Motores Electricos Desmantelados', 'Material: Trifasicos para Cu/Fe. | Estado: Carcasas sin aceite.', 1800.0, '1.8 Ton', 35.0, '2025-10-14', '2025-10-14', 2, 5),
(75, 10, 5, 'Discos Duros HDD para Reciclaje', 'Borrado: Certificado NOM-027. | Tipo: 3.5 y 2.5 pulgadas.', 120.0, '500 Pzas', 15.0, '2025-10-28', '2025-10-28', 2, 3),
(76, 10, 5, 'Fuentes de Poder ATX (Lote)', 'Tipo: Fuentes PC escritorio. | Finalidad: Recuperacion de metales.', 350.0, '350 kg', 12.0, '2025-11-10', '2025-11-10', 2, 4),
(77, 10, 5, 'Monitores CRT para Reciclaje Regulado', 'Tipo: CRT con plomo. | Norma: NOM-052-SEMARNAT.', 800.0, '80 Uds', 5.0, '2025-11-18', '2025-11-18', 2, 5),
(78, 10, 5, 'Tablets y Smartphones Fuera de Uso', 'Origen: Flotilla corporativa. | Borrado: Certificado de datos.', 90.0, '300 Pzas', 25.0, '2025-11-25', '2025-11-25', 2, 3),
(79, 1, 5, 'Lote de Fuentes de Poder ATX', 'Tipo: Fuentes PC scrap. | Finalidad: Recuperacion metales.', 350.0, '350 kg', 12.0, '2025-11-10', '2025-11-10', 2, 4),
(80, 1, 5, 'Impresoras Multifuncion (Desecho)', 'Tipo: Laser y tinta fuera de vida util. | Recuperacion: Metales y plasticos.', 200.0, '40 Uds', 8.0, '2025-11-28', '2025-11-28', 2, 5),
(81, 6, 5, 'Transformadores Electricos de Distribucion', 'Tipo: Monofasicos 15-50 kVA. | Estado: Fuera de servicio.', 2500.0, '10 Uds', 45.0, '2025-12-02', '2025-12-02', 2, 3),
(82, 16, 5, 'Baterias Industriales (Plomo-Acido)', 'Tipo: Plomo-acido UPS. | Normativa: SEMARNAT regulado.', 900.0, '900 kg', 22.0, '2025-11-20', '2025-11-20', 2, 4),
(83, 7, 5, 'Cables de Datos y Red (Cobre)', 'Tipo: Cat5e y Cat6. | Cobre: ~30% contenido.', 300.0, '300 kg', 18.0, '2025-12-05', '2025-12-05', 2, 5),
(84, 18, 5, 'Rack de Servidores Desmantelados', 'Tipo: Rack 42U con equipo de red. | Material: Acero y aluminio.', 450.0, '15 Pzas', 30.0, '2025-12-08', '2025-12-08', 2, 3);

ALTER SEQUENCE wastes_waste_id_seq RESTART WITH 85;

-- ==============================================================================
-- 3. PURCHASE REQUESTS
-- ==============================================================================
INSERT INTO purchase_requests (request_id, waste_id, buyer_id, requested_weight, offered_price, quantity, negotiation_comment, quality_validator_id, status_id)
VALUES
(1, 39, 1, 3200.00, 2.80, '3.2 Ton', 'Me interesa comprar las 3.2 toneladas para reaprovechamiento papelero.', NULL, 4),
(2, 1, 1, 2500.00, 28.50, '2.5 Ton', 'Se acordó en llamada vender únicamente 2.5 toneladas para mantener inventario.', 3, 4),
(3, 2, 1, 1500.00, 20.00, '1.5 Ton', 'Precio final de $20 el kilo cerrado por chat debido al volumen.', 4, 5),
(4, 41, 1, 1500.00, 2.60, '1.5 Ton', 'Venta exitosa de todo el lote de micro-corrugado sin barniz.', 3, 6),
(5, 83, 1, 300.00, 15.00, '300 kg', 'Material no cumple con los estándares de pureza mostrados en las fotos.', 5, 3);

ALTER SEQUENCE purchase_requests_request_id_seq RESTART WITH 6;

-- ==============================================================================
-- 4. WASTE EVIDENCES
-- ==============================================================================
INSERT INTO waste_evidences (evidence_id, waste_id, file_path, file_type)
VALUES
(1, 1, 'waste_evidences/Aluminio.jpeg', 'image'),
(2, 2, 'waste_evidences/Aluminio.jpeg', 'image'),
(3, 3, 'waste_evidences/Aluminio.jpeg', 'image'),
(4, 4, 'waste_evidences/Aluminio.jpeg', 'image'),
(5, 5, 'waste_evidences/Aluminio2.jpg', 'image'),
(6, 6, 'waste_evidences/Aluminio2.jpg', 'image'),
(7, 7, 'waste_evidences/Aluminio2.jpg', 'image'),
(8, 8, 'waste_evidences/Aluminio2.jpg', 'image'),
(9, 9, 'waste_evidences/Aluminio3.png', 'image'),
(10, 10, 'waste_evidences/Aluminio3.png', 'image'),
(11, 11, 'waste_evidences/Aluminio3.png', 'image'),
(12, 12, 'waste_evidences/Aluminio2.jpg', 'image'),
(13, 13, 'waste_evidences/Aluminio.jpeg', 'image'),
(14, 14, 'waste_evidences/Aluminio2.jpg', 'image'),
(15, 15, 'waste_evidences/Aluminio2.jpg', 'image'),
(16, 16, 'waste_evidences/Aluminio3.png', 'image'),
(17, 17, 'waste_evidences/Aluminio3.png', 'image'),
(18, 18, 'waste_evidences/Aluminio3.png', 'image'),
(19, 19, 'waste_evidences/Aluminio3.png', 'image'),
(20, 20, 'waste_evidences/Aluminio3.png', 'image'),
(21, 21, 'waste_evidences/Aluminio3.png', 'image'),
(22, 22, 'waste_evidences/Aluminio.jpeg', 'image'),
(23, 23, 'waste_evidences/Plasticos.png', 'image'),
(24, 24, 'waste_evidences/Plasticos.png', 'image'),
(25, 25, 'waste_evidences/Plasticos.png', 'image'),
(26, 26, 'waste_evidences/Plasticos.png', 'image'),
(27, 27, 'waste_evidences/Plasticos.png', 'image'),
(28, 28, 'waste_evidences/Plasticos.png', 'image'),
(29, 29, 'waste_evidences/Plasticos.png', 'image'),
(30, 30, 'waste_evidences/Plasticos.png', 'image'),
(31, 31, 'waste_evidences/Plasticos.png', 'image'),
(32, 32, 'waste_evidences/Plasticos.png', 'image'),
(33, 33, 'waste_evidences/Plasticos.png', 'image'),
(34, 34, 'waste_evidences/Plasticos.png', 'image'),
(35, 35, 'waste_evidences/Plasticos.png', 'image'),
(36, 36, 'waste_evidences/Plasticos.png', 'image'),
(37, 37, 'waste_evidences/Plasticos.png', 'image'),
(38, 38, 'waste_evidences/Carton.png', 'image'),
(39, 39, 'waste_evidences/Carton.png', 'image'),
(40, 40, 'waste_evidences/Carton.png', 'image'),
(41, 41, 'waste_evidences/Carton.png', 'image'),
(42, 42, 'waste_evidences/Carton.png', 'image'),
(43, 43, 'waste_evidences/Carton.png', 'image'),
(44, 44, 'waste_evidences/Carton.png', 'image'),
(45, 45, 'waste_evidences/Carton.png', 'image'),
(46, 46, 'waste_evidences/Carton.png', 'image'),
(47, 47, 'waste_evidences/Carton.png', 'image'),
(48, 48, 'waste_evidences/Carton.png', 'image'),
(49, 49, 'waste_evidences/papel.png', 'image'),
(50, 50, 'waste_evidences/papel.png', 'image'),
(51, 51, 'waste_evidences/papel.png', 'image'),
(52, 52, 'waste_evidences/papel.png', 'image'),
(53, 53, 'waste_evidences/papel.png', 'image'),
(54, 54, 'waste_evidences/papel.png', 'image'),
(55, 55, 'waste_evidences/papel.png', 'image'),
(56, 56, 'waste_evidences/papel.png', 'image'),
(57, 57, 'waste_evidences/papel.png', 'image'),
(58, 58, 'waste_evidences/papel.png', 'image'),
(59, 59, 'waste_evidences/papel.png', 'image'),
(60, 60, 'waste_evidences/papel.png', 'image'),
(61, 61, 'waste_evidences/Madera.png', 'image'),
(62, 62, 'waste_evidences/Madera.png', 'image'),
(63, 63, 'waste_evidences/Madera.png', 'image'),
(64, 64, 'waste_evidences/Madera.png', 'image'),
(65, 65, 'waste_evidences/Madera.png', 'image'),
(66, 66, 'waste_evidences/Madera.png', 'image'),
(67, 67, 'waste_evidences/Madera.png', 'image'),
(68, 68, 'waste_evidences/Madera.png', 'image'),
(69, 69, 'waste_evidences/Madera.png', 'image'),
(70, 70, 'waste_evidences/Madera.png', 'image'),
(71, 71, 'waste_evidences/Madera.png', 'image'),
(72, 72, 'waste_evidences/Madera.png', 'image'),
(73, 73, 'waste_evidences/electronicos.jpg', 'image'),
(74, 74, 'waste_evidences/electronicos.jpg', 'image'),
(75, 75, 'waste_evidences/electronicos.jpg', 'image'),
(76, 76, 'waste_evidences/electronicos.jpg', 'image'),
(77, 77, 'waste_evidences/electronicos.jpg', 'image'),
(78, 78, 'waste_evidences/electronicos.jpg', 'image'),
(79, 79, 'waste_evidences/electronicos.jpg', 'image'),
(80, 80, 'waste_evidences/electronicos.jpg', 'image'),
(81, 81, 'waste_evidences/electronicos.jpg', 'image'),
(82, 82, 'waste_evidences/electronicos.jpg', 'image'),
(83, 83, 'waste_evidences/electronicos.jpg', 'image'),
(84, 84, 'waste_evidences/electronicos.jpg', 'image');

ALTER SEQUENCE waste_evidences_evidence_id_seq RESTART WITH 85;
