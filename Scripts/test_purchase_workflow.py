import urllib.request
import json
import sys

API_BASE = 'http://localhost:8000/api-ecoboros-v1'

def make_request(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    body = json.dumps(data).encode('utf-8') if data else None
    try:
        with urllib.request.urlopen(req, data=body) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, err_body

def run_tests():
    print("=== INICIANDO PRUEBAS AUTOMATIZADAS DE FLUJO MULTI-CALIDAD Y NEGOCIACIÓN EMPRESA ===")
    
    # 1. Empresa A realiza Petición de Compra (Estatus Pendiente - 4) con comentario inicial
    create_payload = {
        "waste": 38,
        "buyer": 16,
        "requested_weight": "50000.00",
        "offered_price": "3.20",
        "quantity": "50k kg Cartón",
        "negotiation_comment": "Empresa A solicita lote de 50 toneladas.",
        "status": 4
    }
    
    status_code, created_data = make_request(f"{API_BASE}/purchase-requests/", method='POST', data=create_payload)
    print(f"1. Crear Solicitud de Compra por Empresa A (HTTP {status_code}):")
    if status_code != 201:
        print(f"   [ERROR] Falló la creación: {created_data}")
        sys.exit(1)
    
    req_id = created_data['request_id']
    print(f"   [ÉXITO] Solicitud creada con ID: #{req_id}")
    print(f"   - Comentario inicial: '{created_data['negotiation_comment']}'")
    print(f"   - Validador asignado: {created_data['quality_validator_name']} (Debe ser None / Sin Asignar)")
    assert created_data['quality_validator'] is None, "Debe iniciar sin validador asignado"

    # 2. Empresa B (Vendedora) realiza ajuste de contra-oferta / edición en Pendiente
    update_variables_payload = {
        "requested_weight": "25000.00",
        "quantity": "25k kg Cartón Acordado",
        "offered_price": "3.20",
        "negotiation_comment": "Empresa B acordó en llamada vender únicamente 25k kg para mantener inventario."
    }
    status_code, updated_vars = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=update_variables_payload)
    print(f"\n2. Empresa B Ajusta Campos Variables y Agrega Comentario de Negociación (HTTP {status_code}):")
    assert status_code == 200, f"Error actualizando variables: {updated_vars}"
    print(f"   [ÉXITO] Peso actualizado a {updated_vars['requested_weight']} kg | Cantidad: {updated_vars['quantity']}")
    print(f"   - Comentario registrado: '{updated_vars['negotiation_comment']}'")
    print(f"   - Estatus mantenido: {updated_vars['status_name']} (ID {updated_vars['status']}) - Permanece en Pendiente")
    assert updated_vars['status'] == 4, "Debe permanecer en estatus Pendiente hasta dictamen de Calidad"

    # 3. Asignación de Usuario de Calidad B (Inspectora Sofía Ruiz - ID 19)
    assign_payload = {
        "quality_validator": 19
    }
    status_code, assigned_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=assign_payload)
    print(f"\n3. Inspectora Sofía Ruiz (Calidad B) Toma el Seguimiento de la Solicitud (HTTP {status_code}):")
    assert status_code == 200, f"Error asignando validador: {assigned_data}"
    print(f"   [ÉXITO] Validador asignado: {assigned_data['quality_validator_name']} (ID {assigned_data['quality_validator']})")

    # 4. Dictamen de Calidad y Autorización a EN PROCESO (Estatus 5)
    quality_validation_payload = {
        "status": 5
    }
    status_code, proceso_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=quality_validation_payload)
    print(f"\n4. Auditoría de Calidad y Transición a EN PROCESO (HTTP {status_code}):")
    assert status_code == 200, f"Error en dictamen de calidad: {proceso_data}"
    print(f"   [ÉXITO] Estado actual: {proceso_data['status_name']} (ID {proceso_data['status']})")
    print(f"   - Validador responsable: {proceso_data['quality_validator_name']}")
    print(f"   - Total Operación: {proceso_data['total_formatted']} (${proceso_data['total_amount']})")
    print(f"   - Comisión Intermediario (2.5%): {proceso_data['platform_fee_formatted']} (${proceso_data['platform_fee']})")
    print(f"   - Ganancia Vendedor B (97.5%): {proceso_data['seller_payout_formatted']} (${proceso_data['seller_payout']})")

    # 5. Confirmación de Pagos Simulados y Finalización en COMPLETADO (Estatus 6)
    payment_payload = {
        "seller_payment_confirmed": True,
        "platform_fee_confirmed": True,
        "status": 6
    }
    status_code, completed_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=payment_payload)
    print(f"\n5. Confirmación de Pagos y Transición a COMPLETADO (HTTP {status_code}):")
    assert status_code == 200, f"Error al completar solicitud: {completed_data}"
    print(f"   [ÉXITO] Estado actual: {completed_data['status_name']} (ID {completed_data['status']})")
    print(f"   - Pago Vendedor: {completed_data['seller_payment_confirmed']} | Cobro Comisión: {completed_data['platform_fee_confirmed']}")

    # 6. Intento de Edición en Registro COMPLETADO (Inmutabilidad)
    try_modify_payload = {
        "requested_weight": "1000.00"
    }
    status_code, error_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=try_modify_payload)
    print(f"\n6. Prueba de Bloqueo Inmutable en Registro COMPLETADO (HTTP {status_code}):")
    assert status_code == 400, f"Se esperaba 400 pero se recibió {status_code}"
    print(f"   [ÉXITO] Edición rechazada por la API: {error_data}")

    print("\n=== TODAS LAS PRUEBAS AUTOMATIZADAS PASARON CON ÉXITO ===")

if __name__ == '__main__':
    run_tests()
