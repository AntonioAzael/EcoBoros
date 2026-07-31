// ============================================
// PUBLICACION.JS - Detalle de Producto
// ============================================

// ========== DATOS ==========
const productsDB = [
    { id: 1, title: "Bidones HDPE Tricapa", category: "Plásticos", location: "Otay Industrial", qty: "850 Pzas", weightKg: 850, price: "$ 15.00 / pza", date: "2023-10-01", customImage: null, documentation: [
        { title: "Ficha técnica", text: "Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos." },
        { title: "Condición", text: "Unidad usada en buen estado, sin deformaciones visibles y con cierre hermético probado." },
        { title: "Certificado", text: "Disponible certificado de reciclaje y trazabilidad de plástico." }
    ] },
    { id: 2, title: "Recortes de Aluminio 6061", category: "Metales", location: "El Florido", qty: "2.5 Ton", weightKg: 2500, price: "$ 28.50 / kg", date: "2023-10-05", customImage: "../../Public/Imagenes/aluminio.jpeg", documentation: [
        { title: "Especificaciones", text: "Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión." },
        { title: "Calidad", text: "Material limpio, sin óxido, con pieza de prueba incluida." },
        { title: "Certificado", text: "Informe de composición química entregable bajo solicitud." }
    ] },
    { id: 3, title: "Pallets de Pino (Reparables)", category: "Maderas", location: "Pacifico", qty: "200 Uds", weightKg: 4000, price: "$ 45.00 / ud", date: "2023-09-28", customImage: "../../Public/Imagenes/madera.png", documentation: [
        { title: "Condición", text: "Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno." },
        { title: "Material", text: "Pino tratado, sin humedad excesiva, apto para almacenamiento y carga moderada." },
        { title: "Recomendación", text: "Ideal para uso en bodegas o transporte de piezas ligeras." }
    ] },
    { id: 4, title: "Pacas de Cartón Corrugado", category: "Cartón", location: "La Mesa", qty: "5 Ton", weightKg: 5000, price: "$ 3.20 / kg", date: "2023-10-10", customImage: "../../Public/Imagenes/cartoncorrugado.png", documentation: [
        { title: "Ficha técnica", text: "Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical." },
        { title: "Uso recomendado", text: "Recomendado para empaques, relleno y proyectos de reciclaje industrial." },
        { title: "Condición", text: "Material limpio, con algunas imperfecciones menores de almacenamiento." }
    ] },
    { id: 5, title: "Tarjetas Madre (Scrap)", category: "Electrónicos", location: "Nordika", qty: "500 kg", weightKg: 500, price: "A Tratar", date: "2023-10-12", customImage: null, documentation: [
        { title: "Descripción", text: "Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales." },
        { title: "Inspección", text: "Revisión visual previa; sin garantías de funcionalidad." },
        { title: "Manejo seguro", text: "Usar equipo de protección y separar elementos tóxicos antes de procesar." }
    ] },
    { id: 6, title: "Archivo Muerto (Triturado)", category: "Papel", location: "Zona Centro", qty: "1.2 Ton", weightKg: 1200, price: "$ 2.10 / kg", date: "2023-09-15", customImage: null, documentation: [
        { title: "Tipo de material", text: "Papelería triturada de oficina, mezcla de papel bond y cartulina." },
        { title: "Protección", text: "Libre de datos sensibles y lista para reprocesamiento o compostaje industrial." },
        { title: "Uso", text: "Ideal para reciclaje de papel o relleno de embalajes." }
    ] },
    { id: 7, title: "Cobre de Primera (Pelado)", category: "Metales", location: "Otay", qty: "300 kg", weightKg: 300, price: "$ 140.00 / kg", date: "2023-10-15", customImage: null, documentation: [
        { title: "Calidad", text: "Cobre limpio pelado, sin aislamiento, grado comercial de primera." },
        { title: "Aplicación", text: "Adecuado para reciclaje metalúrgico y fabricación de componentes eléctricos." },
        { title: "Certificado", text: "Informe de pureza disponible según solicitud." }
    ] },
    { id: 8, title: "Botellas PET Cristal", category: "Plásticos", location: "Rosarito", qty: "1 Ton", weightKg: 1000, price: "$ 8.00 / kg", date: "2023-10-02", customImage: "../../Public/Imagenes/BotellasPetCristal.png", documentation: [
        { title: "Material", text: "PET transparente de grado alimenticio triturado, limpio y sin etiquetas." },
        { title: "Uso", text: "Perfecto para reprocesado y fabricación de fibra o envases reciclados." },
        { title: "Certificación", text: "Cumple con normas básicas de separación y limpieza para reciclaje." }
    ] },
    { id: 9, title: "Perfiles de Aluminio", category: "Metales", location: "Tijuana", qty: "500 kg", weightKg: 500, price: "$ 32.00 / kg", date: "2023-10-20", customImage: "../../Public/Imagenes/PerfilesAluminio.png", documentation: [
        { title: "Especificaciones", text: "Perfiles extruidos de aluminio, sección rectangular, superficie limpia." },
        { title: "Condición", text: "Buen estado estructural, sin corrosión visible." },
        { title: "Recomendación", text: "Ideal para construcción ligera o procesos de fundición." }
    ] }
];

const categoryStyles = {
    "Metales": { color: "bg-slate-600", icon: "🔩" },
    "Plásticos": { color: "bg-blue-500", icon: "🛢️" },
    "Cartón": { color: "bg-amber-500", icon: "📦" },
    "Papel": { color: "bg-slate-400", icon: "📄" },
    "Maderas": { color: "bg-[#795548]", icon: "🪵" },
    "Electrónicos": { color: "bg-orange-500", icon: "🔌" }
};

// ========== VARIABLES DE ESTADO ==========
let matrizMode = false;
let keySequence = [];
let lastKeyTime = 0;

// ========== FUNCIONES ==========
function loadUserData() {
    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            document.getElementById('user-name-display').textContent = user.name;
            const avatar = document.getElementById('user-avatar');
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            avatar.textContent = initials;
        } catch(e) {}
    }
}

function renderProductDetail(productId) {
    const product = productsDB.find(p => p.id === productId);
    if (!product) {
        document.getElementById('product-detail').innerHTML = '<p class="text-center text-slate-500">Producto no encontrado.</p>';
        return;
    }

    const style = categoryStyles[product.category] || { color: "bg-gray-500", icon: "❓" };
    const container = document.getElementById('product-detail');
    const hasCustomImage = product.customImage && product.customImage.trim() !== "";
    
    container.innerHTML = `
        <div class="animate-fade-in">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Columna Izquierda: Imagen y PDF -->
                <div class="lg:w-1/2">
                    <!-- Imagen Principal -->
                    <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
                        <div class="h-96 bg-slate-50 flex items-center justify-center overflow-hidden">
                            ${hasCustomImage ? 
                                `<img src="${product.customImage}" alt="${product.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-9xl opacity-90\'>${style.icon}</span>'">` : 
                                `<span class="text-9xl opacity-90">${style.icon}</span>`
                            }
                        </div>
                    </div>
                    
                    <!-- Miniaturas -->
                    <div class="flex gap-2 mt-4">
                        <div class="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                            ${hasCustomImage ? 
                                `<img src="${product.customImage}" class="w-full h-full object-cover rounded-lg" onerror="this.style.display='none'">` : 
                                `<span class="text-2xl">${style.icon}</span>`
                            }
                        </div>
                        <div class="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                            <span class="text-2xl">📄</span>
                        </div>
                    </div>

                    <!-- PDF de documentación -->
                    <div class="mt-6 bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">
                        <div class="bg-[#1a2b4b] p-4 text-white">
                            <h3 class="text-lg font-bold">Documentación Técnica</h3>
                            <p class="text-sm opacity-80">Visualiza el PDF generado con la ficha técnica del material.</p>
                        </div>
                        <div class="pdf-container w-full">
                            <object data="../../Public/pdfs/product_${product.id}.pdf" type="application/pdf" width="100%" height="500">
                                <div class="p-6 text-center text-slate-600">
                                    <p>No se puede mostrar el PDF en este navegador.</p>
                                    <a href="../../Public/pdfs/product_${product.id}.pdf" class="text-[#78C043] font-bold hover:underline mt-2 inline-block">📥 Descargar PDF</a>
                                </div>
                            </object>
                        </div>
                    </div>
                </div>

                <!-- Columna Derecha: Información del Producto -->
                <div class="lg:w-1/2 space-y-6">
                    <!-- Categoría y Fecha -->
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <span class="inline-block ${style.color} text-white text-sm font-black px-4 py-2 rounded-full shadow-sm uppercase tracking-wider">
                                ${product.category}
                            </span>
                            <span class="text-slate-400 text-sm">Publicado el ${product.date}</span>
                        </div>
                        <h1 class="text-4xl font-black text-[#1a2b4b] mb-4">${product.title}</h1>
                        <div class="flex items-center gap-2 text-slate-600 mb-6">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="font-medium">${product.location}</span>
                        </div>
                    </div>

                    <!-- Precio -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p class="text-slate-500 text-sm font-medium mb-2">Precio</p>
                        <p class="text-5xl font-black text-[#78C043]">${product.price}</p>
                    </div>

                    <!-- Detalles rápidos -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <p class="text-slate-500 text-sm font-medium">Cantidad Disponible</p>
                            <p class="text-[#1a2b4b] font-bold text-xl">${product.qty}</p>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <p class="text-slate-500 text-sm font-medium">Peso Total</p>
                            <p class="text-[#1a2b4b] font-bold text-xl">${product.weightKg} kg</p>
                        </div>
                    </div>

                    <!-- Descripción -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 class="text-lg font-bold text-[#1a2b4b] mb-3">Descripción</h3>
                        <p class="text-slate-600 leading-relaxed">
                            ${product.title} disponible en ${product.location}. Material de calidad industrial, perfecto para reciclaje y reutilización. 
                            Contacta al vendedor para más detalles sobre las condiciones del material y opciones de entrega.
                        </p>
                    </div>

                    <!-- Documentación adicional -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 class="text-lg font-bold text-[#1a2b4b] mb-3 flex items-center gap-2">
                            <span>📋</span> Ficha Técnica del Material
                        </h3>
                        <div class="space-y-3">
                            ${product.documentation.map(doc => `
                                <div class="border-b border-slate-100 pb-3 last:border-0">
                                    <h4 class="font-bold text-[#1a2b4b] text-sm">${doc.title}</h4>
                                    <p class="text-slate-600 text-sm mt-1">${doc.text}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="space-y-3">
                        <button onclick="openContactModal()" class="w-full bg-[#78C043] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#78C043]/30 hover:bg-[#66a338] transition-all flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            Contactar Vendedor
                        </button>
                        <button class="w-full bg-white text-[#1a2b4b] py-4 rounded-xl font-bold border-2 border-slate-200 hover:border-[#1a2b4b] transition-all flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            Agregar a Favoritos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openContactModal() {
    document.getElementById('contact-modal').classList.remove('hidden');
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.add('hidden');
}

document.addEventListener('click', function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target === modal) closeContactModal();
});

// ========== MODO MATRIZ ==========
function toggleMatrizMode() {
    matrizMode = !matrizMode;
    if (matrizMode) activateMatrizLabels();
    else deactivateMatrizLabels();
}

function activateMatrizLabels() {
    deactivateMatrizLabels();
    const homeLink = document.querySelector('a[href="empresa.html"]');
    if (homeLink) addKeyLabelInside(homeLink, 'Alt + H');
    const backButton = document.querySelector('button[onclick="window.history.back()"]');
    if (backButton) addKeyLabelInside(backButton, 'Alt + B');
    const contactButton = document.querySelector('button[onclick="openContactModal()"]');
    if (contactButton) addKeyLabelInside(contactButton, 'Alt + C');
    const commandsButton = document.querySelector('button[onclick="toggleCommands()"]');
    if (commandsButton) addKeyLabelInside(commandsButton, 'Shift + ?');
}

function deactivateMatrizLabels() {
    document.querySelectorAll('.keyboard-label').forEach(el => el.remove());
    document.querySelectorAll('.matriz-active').forEach(el => el.classList.remove('matriz-active'));
}

function addKeyLabelInside(parentEl, text) {
    parentEl.classList.add('matriz-active', 'relative');
    parentEl.style.overflow = 'visible';
    const label = document.createElement('div');
    label.className = 'keyboard-label';
    label.innerHTML = `<span class="text-[#78C043] mr-1">⌨</span> ${text}`;
    label.style.top = '-12px';
    label.style.right = '-12px';
    parentEl.appendChild(label);
}

function toggleCommands() {
    const modal = document.getElementById('commands-modal');
    if (!modal) return;
    modal.classList.toggle('hidden');
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (e.shiftKey && key === '?') {
        e.preventDefault();
        toggleCommands();
        return;
    }

    const now = Date.now();
    if (now - lastKeyTime > 500) keySequence = [];
    lastKeyTime = now;
    keySequence.push(key);

    if (keySequence.length >= 2 && keySequence.slice(-2).join('') === 'qa') {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            toggleMatrizMode();
        }
        keySequence = [];
        return;
    }

    if (e.key === 'Escape') {
        const commandsModal = document.getElementById('commands-modal');
        if (commandsModal && !commandsModal.classList.contains('hidden')) {
            commandsModal.classList.add('hidden');
            e.preventDefault();
            return;
        }
        const contactModal = document.getElementById('contact-modal');
        if (contactModal && !contactModal.classList.contains('hidden')) {
            closeContactModal();
            e.preventDefault();
        }
        return;
    }

    if (e.altKey) {
        if (key === 'h') { e.preventDefault(); window.location.href = 'empresa.html'; return; }
        if (key === 'c') { e.preventDefault(); openContactModal(); return; }
        if (key === 'b') { e.preventDefault(); window.history.back(); return; }
    }
});

// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    if (productId) {
        renderProductDetail(productId);
    } else {
        document.getElementById('product-detail').innerHTML = '<p class="text-center text-slate-500">Producto no encontrado.</p>';
    }
    loadUserData();
});