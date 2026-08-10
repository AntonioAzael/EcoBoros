/* ========================================================================== */
/* ARCHIVO DE INICIALIZACIÓN DE LA BASE DE DATOS - ECOBOROS (init.sql)        */
/* Este script define la estructura relacional completa del marketplace B2B,  */
/* integrando control de accesos, gestión de residuos, contra-ofertas,        */
/* compras parciales y trazabilidad industrial.                               */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/* TABLA: Roles                                                               */
/* Lógica: Controla los perfiles de acceso y permisos dentro de la plataforma */
/* para restringir operaciones críticas (Publicar, Validar, Administrar).     */
/* -------------------------------------------------------------------------- */
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

/* Inserción de perfiles predeterminados requeridos por el modelo de negocio */
INSERT INTO roles (role_name) VALUES ('Empresa'), ('Usuario de Calidad'), ('Administrador Total');


/* -------------------------------------------------------------------------- */
/* TABLA: Users                                                               */
/* Lógica: Almacena los perfiles corporativos de las organizaciones (generas  */
/* o recicladoras) y administradores que interactúan en el sistema.           */
/* -------------------------------------------------------------------------- */
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    rfc VARCHAR(13) UNIQUE NULL, 
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    password VARCHAR(128) NULL,
    is_active BOOLEAN DEFAULT TRUE,    /* Lógica: Bandera para activar o desactivar cuentas de forma lógica */
    
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


/* -------------------------------------------------------------------------- */
/* TABLA: Categories                                                          */
/* Lógica: Catálogo estandarizado de materiales para estructurar los filtros  */
/* de búsqueda rápida en el marketplace.                                      */
/* -------------------------------------------------------------------------- */
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

/* Inserción de categorías ecológicas e industriales base */
INSERT INTO categories (category_name) VALUES ('Metales'), ('Plasticos'), ('Cartones'), ('Papeles'), ('Electronicos'), ('Maderas');


/* -------------------------------------------------------------------------- */
/* TABLA: Statuses                                                            */
/* Lógica: Catálogo de estados para los ciclos de vida de publicaciones y compras */
/* -------------------------------------------------------------------------- */
CREATE TABLE statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
);

/* Inserción de los registros de estado solicitados */
INSERT INTO statuses (status_name, description) VALUES 
('Revision', 'Cuando suben una publicacion'),
('Aprobado', 'Publicación validada por calidad'),
('Rechazado', 'Publicación rechazada por calidad'),
('Pendiente', 'Cuando la empresa hace la peticion para la compra'),
('Proceso', 'Calidad verifica documentos y cantidad real vendida'),
('Completado', 'Compra finalizada y dinero reflejado');


/* -------------------------------------------------------------------------- */
/* TABLA: Wastes                                                              */
/* Lógica: Es el núcleo del marketplace. Representa tanto el residuo físico   */
/* registrado como la oferta comercial publicada por las empresas.            */
/* -------------------------------------------------------------------------- */
CREATE TABLE wastes (
    waste_id SERIAL PRIMARY KEY,
    publisher_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    technical_description TEXT NOT NULL,
    
    weight_decimal DECIMAL(10,2) NOT NULL, /* Peso total disponible original del lote */
    quantity VARCHAR(100) NULL,

    /* CAMBIO NUEVO: Precio base unitario o por kg/pza, reflejado directamente 
       en las tarjetas visuales del dashboard de la interfaz (ej: $15.00 / pza). */
    unit_price DECIMAL(10,2) NULL,         
    
    generation_date DATE NOT NULL,
    availability_date DATE NOT NULL,
    status_id INT DEFAULT 1,    
    /* Lógica: Restringe y audita qué usuario con perfil de calidad aprobó 
       la veracidad y rigor técnico de la publicación. */
    quality_validator_id INT NULL,          
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (publisher_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (quality_validator_id) REFERENCES users(user_id),
    FOREIGN KEY (status_id) REFERENCES statuses(status_id) 
);


/* -------------------------------------------------------------------------- */
/* TABLA: WasteEvidences                                                      */
/* Lógica: Permite adjuntar múltiples archivos (fotografías del scrap, fichas */
/* técnicas) a una publicación para validar el estado físico del material.    */
/* -------------------------------------------------------------------------- */
CREATE TABLE waste_evidences (
    evidence_id SERIAL PRIMARY KEY,
    waste_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    UNIQUE (waste_id, file_path),
    FOREIGN KEY (waste_id) REFERENCES wastes(waste_id)
);


/* -------------------------------------------------------------------------- */
/* TABLA: PurchaseRequests                                                    */
/* Lógica: Gestiona el ciclo comercial y las transacciones B2B entre empresas. */
/* -------------------------------------------------------------------------- */
CREATE TABLE purchase_requests (
    request_id SERIAL PRIMARY KEY,
    waste_id INT NOT NULL,
    buyer_id INT NOT NULL,
    
    /* CAMBIO NUEVO: Permite comprar fracciones o porciones parciales del lote 
       en lugar de obligar a adquirir el peso total de la publicación. */
    requested_weight DECIMAL(10,2) NULL,   
    
    /* CAMBIO NUEVO: Soporte directo en base de datos para habilitar el motor 
       de contra-ofertas de precio propuesto por el comprador. */
    offered_price DECIMAL(10,2) NULL,        
    quantity VARCHAR(100) NULL,
    negotiation_comment TEXT NULL,
    quality_validator_id INT NULL,
    seller_payment_confirmed BOOLEAN DEFAULT FALSE,
    platform_fee_confirmed BOOLEAN DEFAULT FALSE,
    
    status_id INT DEFAULT 4,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP NULL,
    
    FOREIGN KEY (waste_id) REFERENCES wastes(waste_id),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (quality_validator_id) REFERENCES users(user_id),
    FOREIGN KEY (status_id) REFERENCES statuses(status_id)
);


/* -------------------------------------------------------------------------- */
/* TABLA: WasteStatusLogs                                                     */
/* Lógica: Bitácora de trazabilidad operativa para registrar cómo cambian     */
/* de estatus los lotes y qué porciones de peso parcial van sufriendo ventas. */
/* -------------------------------------------------------------------------- */
CREATE TABLE waste_status_logs (
    log_id SERIAL PRIMARY KEY,
    waste_id INT NOT NULL,
    purchase_request_id INT NULL,           /* Referencia a la solicitud de compra que originó el cambio de estado */
    previous_status VARCHAR(50) NOT NULL,   /* Descripción del estado anterior */
    status_changed VARCHAR(50) NOT NULL,    /* Descripción del nuevo estado aplicado */
    partial_weight DECIMAL(10,2) NULL,      /* Cantidad de peso específica afectada en este movimiento parcial */
    description TEXT NULL,                  /* Notas o bitácora detallada del movimiento operativo */
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (waste_id) REFERENCES wastes(waste_id),
    FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(request_id)
);


/* -------------------------------------------------------------------------- */
/* TABLA: AuditLogs                                                           */
/* Lógica: Bitácora de seguridad interna orientada al panel de administración.*/
/* Registra exhaustivamente qué usuario ejecutó una acción y sobre qué entidad.*/
/* -------------------------------------------------------------------------- */
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action_type VARCHAR(100) NOT NULL,    /* Tipo de acción (ej. CREAR_PUBLICACION, CAMBIAR_ESTATUS) */
    entity_affected VARCHAR(50) NOT NULL, /* Nombre de la entidad afectada (ej. wastes, users) */
    entity_id INT NOT NULL,               /* ID exacto del registro afectado */
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);