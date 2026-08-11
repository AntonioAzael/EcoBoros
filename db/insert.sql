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
