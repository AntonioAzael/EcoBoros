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
CREATE TABLE Roles (
    RoleId SERIAL PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

/* Inserción de perfiles predeterminados requeridos por el modelo de negocio */
INSERT INTO Roles (RoleName) VALUES ('Empresa'), ('Usuario de Calidad'), ('Administrador Total');


/* -------------------------------------------------------------------------- */
/* TABLA: Users                                                               */
/* Lógica: Almacena los perfiles corporativos de las organizaciones (generas  */
/* o recicladoras) y administradores que interactúan en el sistema.           */
/* -------------------------------------------------------------------------- */
CREATE TABLE Users (
    UserId SERIAL PRIMARY KEY,
    RoleId INT NOT NULL,
    CompanyName VARCHAR(150) NOT NULL,
    
    /* CAMBIO NUEVO: Se añade el RFC para cumplir con la identificación fiscal 
       formal de las empresas mexicanas en transacciones de tipo B2B. */
    RFC VARCHAR(13) UNIQUE NULL, 
    
    ContactEmail VARCHAR(100) NOT NULL,
    ContactPhone VARCHAR(20) NOT NULL,
    
    /* Lógica: Bandera para activar o desactivar cuentas de forma lógica */
    IsActive BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);


/* -------------------------------------------------------------------------- */
/* TABLA: Categories                                                          */
/* Lógica: Catálogo estandarizado de materiales para estructurar los filtros  */
/* de búsqueda rápida en el marketplace.                                      */
/* -------------------------------------------------------------------------- */
CREATE TABLE Categories (
    CategoryId SERIAL PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL UNIQUE
);

/* Inserción de categorías ecológicas e industriales base */
INSERT INTO Categories (CategoryName) VALUES ('Metales'), ('Plasticos'), ('Cartones'), ('Papeles'), ('Electronicos'), ('Maderas');
CREATE TABLE Statuses (
    StatusId SERIAL PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL UNIQUE,
    Description TEXT NULL
);

/* Inserción de los registros de estado solicitados */
INSERT INTO Statuses (StatusName, Description) VALUES 
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
CREATE TABLE Wastes (
    WasteId SERIAL PRIMARY KEY,
    PublisherId INT NOT NULL,
    CategoryId INT NOT NULL,
    TechnicalDescription TEXT NOT NULL,
    
    WeightDecimal DECIMAL(10,2) NOT NULL, /* Peso total disponible original del lote */
    
    /* CAMBIO NUEVO: Precio base unitario o por kg/pza, reflejado directamente 
       en las tarjetas visuales del dashboard de la interfaz (ej: $15.00 / pza). */
    UnitPrice DECIMAL(10,2) NULL,         
    
    GenerationDate DATE NOT NULL,
    AvailabilityDate DATE NOT NULL,
    StatusId INT DEFAULT 1,    
    /* Lógica: Restringe y audita qué usuario con perfil de calidad aprobó 
       la veracidad y rigor técnico de la publicación. */
    QualityValidatorId INT NULL,          
    
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (PublisherId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
    FOREIGN KEY (QualityValidatorId) REFERENCES Users(UserId)
);


/* -------------------------------------------------------------------------- */
/* TABLA: WasteEvidences                                                      */
/* Lógica: Permite adjuntar múltiples archivos (fotografías del scrap, fichas */
/* técnicas) a una publicación para validar el estado físico del material.    */
/* -------------------------------------------------------------------------- */
CREATE TABLE WasteEvidences (
    EvidenceId SERIAL PRIMARY KEY,
    WasteId INT NOT NULL,
    FilePath VARCHAR(255) NOT NULL,
    FileType VARCHAR(50) NOT NULL,
    FOREIGN KEY (WasteId) REFERENCES Wastes(WasteId)
);


/* -------------------------------------------------------------------------- */
/* TABLA: PurchaseRequests                                                    */
/* Lógica: Gestiona el ciclo comercial y las transacciones B2B entre empresas. */
/* -------------------------------------------------------------------------- */
CREATE TABLE PurchaseRequests (
    RequestId SERIAL PRIMARY KEY,
    WasteId INT NOT NULL,
    BuyerId INT NOT NULL,
    
    /* CAMBIO NUEVO: Permite comprar fracciones o porciones parciales del lote 
       en lugar de obligar a adquirir el peso total de la publicación. */
    RequestedWeight DECIMAL(10,2) NULL,   
    
    /* CAMBIO NUEVO: Soporte directo en base de datos para habilitar el motor 
       de contra-ofertas de precio propuesto por el comprador. */
    OfferedPrice DECIMAL(10,2) NULL,        
    
    StatusId INT DEFAULT 4,
    RequestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ResponseDate TIMESTAMP NULL,
    
    FOREIGN KEY (WasteId) REFERENCES Wastes(WasteId),
    FOREIGN KEY (BuyerId) REFERENCES Users(UserId)
);


/* -------------------------------------------------------------------------- */
/* TABLA: WasteStatusLogs                                                     */
/* Lógica: Bitácora de trazabilidad operativa para registrar cómo cambian     */
/* de estatus los lotes y qué porciones de peso parcial van sufriendo ventas. */
/* -------------------------------------------------------------------------- */
CREATE TABLE WasteStatusLogs (
    LogId SERIAL PRIMARY KEY,
    WasteId INT NOT NULL,
    PurchaseRequestId INT NULL,             /* Referencia a la solicitud de compra que originó el cambio de estado */
    PreviousStatus VARCHAR(50) NOT NULL,    /* Descripción del estado anterior */
    StatusChanged VARCHAR(50) NOT NULL,     /* Descripción del nuevo estado aplicado */
    PartialWeight DECIMAL(10,2) NULL,       /* Cantidad de peso específica afectada en este movimiento parcial */
    Description TEXT NULL,                  /* Notas o bitácora detallada del movimiento operativo */
    ChangedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (WasteId) REFERENCES Wastes(WasteId),
    FOREIGN KEY (PurchaseRequestId) REFERENCES PurchaseRequests(RequestId)
);


/* -------------------------------------------------------------------------- */
/* TABLA: AuditLogs                                                           */
/* Lógica: Bitácora de seguridad interna orientada al panel de administración.*/
/* Registra exhaustivamente qué usuario ejecutó una acción y sobre qué entidad.*/
/* -------------------------------------------------------------------------- */
CREATE TABLE AuditLogs (
    LogId SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    ActionType VARCHAR(100) NOT NULL,     /* Tipo de acción (ej. CREAR_PUBLICACION, CAMBIAR_ESTATUS) */
    EntityAffected VARCHAR(50) NOT NULL,  /* Nombre de la entidad afectada (ej. Wastes, Users) */
    EntityId INT NOT NULL,                /* ID exacto del registro afectado */
    ActionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);