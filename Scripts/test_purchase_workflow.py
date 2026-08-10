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
    print("=== INICIANDO PRUEBAS AUTOMATIZADAS DE FLUJO DE COMPRA / CALIDAD ===")
    
    # 1. Crear Petición de Compra (Estatus Pendiente - 4)
    # Ejemplo context: Empresa A (buyer=16) pide 50k de cartón a Empresa B (waste=38) pero ofrece comprar 30k
    create_payload = {
        "waste": 38,
        "buyer": 16,
        "requested_weight": "50000.00",
        "offered_price": "3.20",
        "quantity": "50k kg Cartón",
        "status": 4
    }
    
    status_code, created_data = make_request(f"{API_BASE}/purchase-requests/", method='POST', data=create_payload)
    print(f"1. Crear Solicitud de Compra (HTTP {status_code}):")
    if status_code != 201:
        print(f"   [ERROR] Falló la creación: {created_data}")
        sys.exit(1)
    
    req_id = created_data['request_id']
    print(f"   [ÉXITO] Solicitud creada con ID: #{req_id}")
    print(f"   - Estado: {created_data['status_name']} (ID {created_data['status']})")
    print(f"   - Cantidad: {created_data['quantity']}, Peso: {created_data['requested_weight']}, Precio: {created_data['offered_price']}")
    
    # 2. Modificar Campos Variables en Pendiente (Ej. Empresa A acuerda comprar solo 30k en vez de 50k)
    update_variables_payload = {
        "requested_weight": "30000.00",
        "quantity": "30k kg Cartón Acordado",
        "offered_price": "3.20"
    }
    status_code, updated_vars = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=update_variables_payload)
    print(f"\n2. Ajustar Campos Variables en Pendiente (HTTP {status_code}):")
    assert status_code == 200, f"Error actualizando variables: {updated_vars}"
    print(f"   [ÉXITO] Peso actualizado: {updated_vars['requested_weight']} kg | Cantidad: {updated_vars['quantity']}")
    print(f"   - Total Calculado: {updated_vars['total_formatted']} (${updated_vars['total_amount']})")
    
    # 3. Validación de Calidad (Usuario Calidad=4 valida la información y pasa a Proceso - 5)
    quality_validation_payload = {
        "status": 5,
        "quality_validator": 4
    }
    status_code, proceso_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=quality_validation_payload)
    print(f"\n3. Validación de Calidad y Paso a EN PROCESO (HTTP {status_code}):")
    assert status_code == 200, f"Error en validación de calidad: {proceso_data}"
    print(f"   [ÉXITO] Estado actual: {proceso_data['status_name']} (ID {proceso_data['status']})")
    print(f"   - Validador asignado: {proceso_data['quality_validator_name']} (ID {proceso_data['quality_validator']})")
    print(f"   - Total Operación: {proceso_data['total_formatted']}")
    print(f"   - Comisión Intermediario (2.5%): {proceso_data['platform_fee_formatted']} (${proceso_data['platform_fee']})")
    print(f"   - Ganancia Vendedor B (97.5%): {proceso_data['seller_payout_formatted']} (${proceso_data['seller_payout']})")
    
    # Verificar cálculos matemáticos
    total_val = float(proceso_data['total_amount'])
    fee_val = float(proceso_data['platform_fee'])
    payout_val = float(proceso_data['seller_payout'])
    assert abs(fee_val - round(total_val * 0.025, 2)) < 0.01, "Comisión 2.5% incorrecta"
    assert abs(payout_val - round(total_val * 0.975, 2)) < 0.01, "Ganancia vendedor 97.5% incorrecta"
    print("   [ÉXITO] Desglose 2.5% intermediario y 97.5% vendedor matemáticamente verificado.")

    # 4. Simulación de Pagos y Transición a COMPLETADO (Status - 6)
    payment_payload = {
        "seller_payment_confirmed": True,
        "platform_fee_confirmed": True,
        "status": 6
    }
    status_code, completed_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=payment_payload)
    print(f"\n4. Confirmar Pagos Simulados y Transicionar a COMPLETADO (HTTP {status_code}):")
    assert status_code == 200, f"Error al completar solicitud: {completed_data}"
    print(f"   [ÉXITO] Estado actual: {completed_data['status_name']} (ID {completed_data['status']})")
    print(f"   - Pago Vendedor Confirmado: {completed_data['seller_payment_confirmed']}")
    print(f"   - Cobro Intermediario 2.5% Confirmado: {completed_data['platform_fee_confirmed']}")
    
    # 5. Intentar modificar registro COMPLETADO (Debe fallar con HTTP 400 por regla de negocio)
    try_modify_payload = {
        "requested_weight": "1000.00"
    }
    status_code, error_data = make_request(f"{API_BASE}/purchase-requests/{req_id}/", method='PATCH', data=try_modify_payload)
    print(f"\n5. Intento de Modificación en Registro COMPLETADO (HTTP {status_code}):")
    assert status_code == 400, f"Se esperaba error 400 pero se recibió {status_code}"
    print(f"   [ÉXITO] El backend bloqueó correctamente la modificación. Mensaje: {error_data}")
    
    print("\n=== TODAS LAS PRUEBAS AUTOMATIZADAS SE COMPLETARON CON ÉXITO ===")

if __name__ == '__main__':
    run_tests()
