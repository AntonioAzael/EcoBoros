-- ==============================================================================
-- db/reset_and_seed.sql — Limpieza total + reseed limpio para EcoBoros
-- Ejecutar ANTES de insert.sql para garantizar IDs secuenciales
-- ==============================================================================
BEGIN;

-- 1. Borrar datos en orden (respetando FK)
DELETE FROM waste_evidences;
DELETE FROM waste_status_logs;
DELETE FROM purchase_requests;
DELETE FROM reports;
DELETE FROM wastes;
DELETE FROM audit_logs;
DELETE FROM users;

-- 2. Resetear secuencias a 1
ALTER SEQUENCE IF EXISTS users_user_id_seq            RESTART WITH 1;
ALTER SEQUENCE IF EXISTS wastes_waste_id_seq           RESTART WITH 1;
ALTER SEQUENCE IF EXISTS purchase_requests_request_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS waste_evidences_evidence_id_seq  RESTART WITH 1;
ALTER SEQUENCE IF EXISTS audit_logs_log_id_seq         RESTART WITH 1;
ALTER SEQUENCE IF EXISTS reports_report_id_seq         RESTART WITH 1;

COMMIT;
