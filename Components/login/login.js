// ============================================
// LOGIN.JS - Pantalla de Inicio de Sesión
// ============================================

// ========== BASE DE DATOS DE CUENTAS ==========
const ACCOUNTS_DB = [
    {
        email: "empresa@ecoboros.com",
        password: "123456",
        role: "empresa",
        redirect: "../../Components/empresa/empresa.html",
        name: "Empresa Demo EcoBoros S.A.",
        icon: "🏭",
        description: "Empresa Verificada"
    },
    {
        email: "admin@ecoboros.com",
        password: "123456",
        role: "admin",
        redirect: "../../Components/admin/admin.html",
        name: "Administrador EcoBoros",
        icon: "👑",
        description: "Administrador del Sistema"
    },
    {
        email: "calidad@ecoboros.com",
        password: "123456",
        role: "calidad",
        redirect: "../../Components/calidad/calidad.html",
        name: "Equipo Calidad EcoBoros",
        icon: "✓",
        description: "Control de Calidad"
    }
];

const API_BASE_URL = 'http://127.0.0.1:8000';
const LOGIN_URL = `${API_BASE_URL}/api-ecoboros-v1/auth/login/`;
const ROLE_ROUTES = {
    admin: '../../Components/admin/admin.html',
    calidad: '../../Components/calidad/calidad.html',
    empresa: '../../Components/empresa/empresa.html'
};

// ========== FUNCIONES ==========

// Detectar cuenta por email
function detectAccountByEmail(email) {
    return ACCOUNTS_DB.find(account => account.email.toLowerCase() === email.toLowerCase());
}

// Mostrar indicador de rol detectado
function updateRoleIndicator() {
    const email = document.getElementById('email-input').value.trim();
    const roleIndicator = document.getElementById('role-indicator');
    const roleIcon = document.getElementById('role-indicator-icon');
    const roleText = document.getElementById('role-indicator-text');
    
    if (email) {
        const detectedAccount = detectAccountByEmail(email);
        if (detectedAccount) {
            roleIcon.textContent = detectedAccount.icon;
            roleText.textContent = `Accediendo como ${detectedAccount.description}`;
            roleIndicator.classList.remove('hidden');
            roleIndicator.style.animation = 'none';
            setTimeout(() => { roleIndicator.style.animation = 'fadeIn 0.3s ease-out'; }, 10);
        } else {
            roleIcon.textContent = '❓';
            roleText.textContent = 'Correo no registrado en el sistema';
            roleIndicator.classList.remove('hidden');
        }
    } else {
        roleIndicator.classList.add('hidden');
    }
}

// Manejar inicio de sesión
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const rememberMe = document.getElementById('remember-checkbox').checked;
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const loginBtn = document.getElementById('login-btn');
    const originalBtnText = loginBtn.innerHTML;
    
    // Limpiar errores previos
    errorDiv.classList.add('hidden');
    
    // Validaciones básicas
    if (!email || !password) {
        errorText.textContent = 'Por favor ingresa correo y contraseña';
        errorDiv.classList.remove('hidden');
        return;
    }
    
    // Mostrar estado de carga
    loginBtn.innerHTML = '<div class="spinner"></div> Verificando credenciales...';
    loginBtn.disabled = true;
    loginBtn.classList.add('opacity-70', 'cursor-not-allowed');

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            errorText.textContent = errorData.detail || 'Credenciales inválidas';
            errorDiv.classList.remove('hidden');
            return;
        }

        const data = await response.json();
        const sessionData = {
            email: data.email,
            name: data.name,
            role: data.role,
            icon: data.icon,
            description: data.description,
            loggedIn: true,
            timestamp: new Date().getTime()
        };

        if (rememberMe) {
            localStorage.setItem('ecoboros_user', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('ecoboros_user', JSON.stringify(sessionData));
        }

        loginBtn.innerHTML = '✅ ¡Acceso concedido! Redirigiendo...';
        setTimeout(() => {
            window.location.href = ROLE_ROUTES[data.role] || '../../Components/login/login.html';
        }, 600);
    } catch (error) {
        errorText.textContent = 'No se pudo conectar al backend. Asegúrate de que la API esté activa.';
        errorDiv.classList.remove('hidden');
    } finally {
        if (!errorDiv.classList.contains('hidden')) {
            loginBtn.innerHTML = originalBtnText;
            loginBtn.disabled = false;
            loginBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 4000);
        }
    }
}

// Mostrar notificación flotante
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium animate-fade-in transition-all ${type === 'success' ? 'bg-[#78C043]' : 'bg-red-500'}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Alternar visibilidad de contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password-input');
    const iconSpan = document.getElementById('toggle-password-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        iconSpan.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        iconSpan.textContent = '👁️';
    }
}

// Verificar si ya hay sesión activa
function checkExistingSession() {
    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.loggedIn === true) {
                const destination = ROLE_ROUTES[user.role];
                if (destination) {
                    window.location.href = destination;
                }
            }
        } catch(e) {
            console.log('No hay sesión válida');
        }
    }
}

// Auto-completar demo (para facilitar pruebas)
function autoFillDemo(role) {
    const account = ACCOUNTS_DB.find(acc => acc.role === role);
    if (account) {
        document.getElementById('email-input').value = account.email;
        document.getElementById('password-input').value = account.password;
        updateRoleIndicator();
        // Opcional: auto-enfocar el botón
        document.getElementById('login-btn').focus();
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    
    // Agregar evento para detectar rol al escribir email
    const emailInput = document.getElementById('email-input');
    emailInput.addEventListener('input', updateRoleIndicator);
    emailInput.addEventListener('blur', updateRoleIndicator);
    
    // Las credenciales de prueba son clickeables (ya tienen onclick en el HTML)
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !document.getElementById('login-form').classList.contains('submitting')) {
        const form = document.getElementById('login-form');
        if (form && (document.activeElement === document.getElementById('password-input') || 
            document.activeElement === document.getElementById('email-input'))) {
            e.preventDefault();
            handleLogin(e);
        }
    }
});