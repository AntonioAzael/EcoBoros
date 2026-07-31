// ============================================
// CALIDAD.JS - Control de Calidad ECOBOROS
// ============================================

// ========== DATOS ==========
let publications = [
    { id: 1, title: "Bidones HDPE Tricapa", category: "Plásticos", location: "Otay Industrial", qty: "850 Pzas", weightKg: 850, price: "$ 15.00 / pza", date: "2023-10-01", status: "pending", company: "Reciclados del Norte", companyEmail: "contacto@recicladosnorte.com", description: "Bidones industriales de HDPE de alta densidad, limpios y listos para reciclaje. Material de primera calidad.", images: ["🛢️"], customImage: null, submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-15", comments: [] },
    { id: 2, title: "Recortes de Aluminio 6061", category: "Metales", location: "El Florido", qty: "2.5 Ton", weightKg: 2500, price: "$ 28.50 / kg", date: "2023-10-05", status: "review", company: "Aluminios del Pacífico", companyEmail: "ventas@aluminios.com", description: "Recortes de aluminio grado 6061, libres de impurezas. Ideal para fundición.", images: ["🔩"], customImage: "../../Public/Imagenes/aluminio.jpeg", submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-14", comments: [{ user: "Control Calidad", text: "Verificar pureza del material", date: "2024-03-14", type: "pending" }] },
    { id: 3, title: "Pallets de Pino (Reparables)", category: "Maderas", location: "Pacifico", qty: "200 Uds", weightKg: 4000, price: "$ 45.00 / ud", date: "2023-09-28", status: "approved", company: "Maderas del Norte", companyEmail: "info@maderasnorte.com", description: "Pallets de pino en buen estado, reparables. Ideal para logística.", images: ["🪵"], customImage: "../../Public/Imagenes/madera.png", submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-10", comments: [{ user: "Control Calidad", text: "Material aprobado - Cumple con estándares", date: "2024-03-12", type: "approved" }] },
    { id: 4, title: "Pacas de Cartón Corrugado", category: "Cartón", location: "La Mesa", qty: "5 Ton", weightKg: 5000, price: "$ 3.20 / kg", date: "2023-10-10", status: "rejected", company: "Cartones del Valle", companyEmail: "ventas@cartonesvalle.com", description: "Cartón corrugado mezclado con impurezas.", images: ["📦"], customImage: "../../Public/Imagenes/cartoncorrugado.png", submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-05", comments: [{ user: "Control Calidad", text: "Rechazado - Contiene materiales no reciclables mezclados", date: "2024-03-07", type: "rejected" }] },
    { id: 5, title: "Cobre de Primera (Pelado)", category: "Metales", location: "Otay", qty: "300 kg", weightKg: 300, price: "$ 140.00 / kg", date: "2023-10-15", status: "pending", company: "Metales del Norte", companyEmail: "compras@metalesnorte.com", description: "Cobre de primera calidad, 99.9% pureza. Material pelado y listo.", images: ["🔩"], customImage: null, submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-16", comments: [] },
    { id: 6, title: "Botellas PET Cristal", category: "Plásticos", location: "Rosarito", qty: "1 Ton", weightKg: 1000, price: "$ 8.00 / kg", date: "2023-10-02", status: "review", company: "Plásticos Reciclados", companyEmail: "info@plasticos.com", description: "Botellas PET cristal, limpias y clasificadas.", images: ["🛢️"], customImage: "../../Public/Imagenes/BotellasPetCristal.png", submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-13", comments: [{ user: "Control Calidad", text: "Solicitar certificado de origen", date: "2024-03-14", type: "pending" }] },
    { id: 7, title: "Perfiles de Aluminio", category: "Metales", location: "Tijuana", qty: "500 kg", weightKg: 500, price: "$ 32.00 / kg", date: "2023-10-20", status: "pending", company: "Aluminios del Pacífico", companyEmail: "ventas@aluminios.com", description: "Perfiles extruidos de aluminio, sección rectangular, superficie limpia.", images: ["🔩"], customImage: "../../Public/Imagenes/PerfilesAluminio.png", submittedBy: "empresa@ecoboros.com", submittedDate: "2024-03-17", comments: [] }
];

let reportsHistory = [];

// ========== VARIABLES DE ESTADO ==========
let currentTab = "pending";
let currentPublication = null;
let searchTerm = "";
let currentSection = "publications";
let matrizMode = false;
let keySequence = [];
let lastKeyTime = 0;

const categoryStyles = {
    "Metales": { color: "bg-slate-600", icon: "🔩", hoverGlow: "hover:border-slate-600" },
    "Plásticos": { color: "bg-blue-500", icon: "🛢️", hoverGlow: "hover:border-blue-500" },
    "Cartón": { color: "bg-amber-500", icon: "📦", hoverGlow: "hover:border-amber-500" },
    "Papel": { color: "bg-slate-400", icon: "📄", hoverGlow: "hover:border-slate-400" },
    "Maderas": { color: "bg-[#795548]", icon: "🪵", hoverGlow: "hover:border-[#795548]" },
    "Electrónicos": { color: "bg-orange-500", icon: "🔌", hoverGlow: "hover:border-orange-500" }
};

// ========== FUNCIONES GENERALES ==========
function loadUserData() {
    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role !== 'calidad') {
            window.location.href = '../../Components/empresa/empresa.html';
        }
        document.getElementById('user-name-display').textContent = user.name;
        const avatar = document.getElementById('user-avatar');
        avatar.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        document.getElementById('user-role-display').textContent = 'Control de Calidad';
    } else {
        window.location.href = '../../Components/login/login.html';
    }
}

function logout() {
    localStorage.removeItem('ecoboros_user');
    sessionStorage.removeItem('ecoboros_user');
    window.location.href = '../../Components/login/login.html';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium animate-fade-in ${type === 'success' ? 'bg-[#78C043]' : 'bg-red-500'}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== NAVEGACIÓN ==========
function switchSection(section) {
    currentSection = section;
    
    document.querySelectorAll('.section-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${section}-section`).classList.remove('hidden');
    
    const navs = ['publications', 'reports'];
    navs.forEach(nav => {
        const btn = document.getElementById(`nav-${nav}`);
        if (nav === section) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    if (section === 'publications') {
        updateCounters();
        renderPublications();
    }
    if (matrizMode) activateMatrizLabels();
}

// ========== ESTADÍSTICAS ==========
function updateCounters() {
    document.getElementById('pending-count').textContent = publications.filter(p => p.status === 'pending').length;
    document.getElementById('review-count').textContent = publications.filter(p => p.status === 'review').length;
    document.getElementById('approved-count').textContent = publications.filter(p => p.status === 'approved').length;
    document.getElementById('rejected-count').textContent = publications.filter(p => p.status === 'rejected').length;
    
    const pendingBadge = document.getElementById('pending-badge');
    const pendingCount = publications.filter(p => p.status === 'pending').length;
    if (pendingCount > 0) {
        pendingBadge.textContent = pendingCount;
        pendingBadge.classList.remove('hidden');
    } else {
        pendingBadge.classList.add('hidden');
    }
}

// ========== FILTROS ==========
function filterPublications() {
    searchTerm = document.getElementById('searchInput').value.toLowerCase();
    renderPublications();
}

function switchTab(tab) {
    currentTab = tab;
    
    const tabs = ['pending', 'review', 'approved', 'rejected'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (t === tab) {
            btn.classList.remove('tab-inactive');
            btn.classList.add('tab-active');
        } else {
            btn.classList.remove('tab-active');
            btn.classList.add('tab-inactive');
        }
    });
    
    renderPublications();
}

// ========== RENDER PUBLICACIONES ==========
function renderPublications() {
    let filtered = publications.filter(p => p.status === currentTab);
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.company.toLowerCase().includes(searchTerm) ||
            p.location.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    const grid = document.getElementById('publications-grid');
    const noResults = document.getElementById('no-results');
    
    if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    grid.innerHTML = filtered.map((pub, index) => {
        const style = categoryStyles[pub.category] || { color: "bg-gray-500", icon: "❓", hoverGlow: "hover:border-gray-500" };
        let statusClass = '', statusText = '', statusIcon = '';
        
        switch(pub.status) {
            case 'pending': statusClass = 'status-pending'; statusText = 'Pendiente'; statusIcon = '⏳'; break;
            case 'review': statusClass = 'status-review'; statusText = 'En Revisión'; statusIcon = '🔍'; break;
            case 'approved': statusClass = 'status-approved'; statusText = 'Aprobado'; statusIcon = '✅'; break;
            case 'rejected': statusClass = 'status-rejected'; statusText = 'Rechazado'; statusIcon = '❌'; break;
        }
        
        const hasCustomImage = pub.customImage && pub.customImage.trim() !== "";
        const imageHtml = hasCustomImage ? 
            `<img src="${pub.customImage}" alt="${pub.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-6xl\'>${style.icon}</span>'">` : 
            `<span class="text-6xl">${style.icon}</span>`;
        
        return `
            <div class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer animate-card ${style.hoverGlow} product-card" style="animation-delay: ${index * 30}ms" onclick="openReviewModal(${pub.id})">
                <div class="h-48 relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-t-3xl overflow-hidden">
                    ${imageHtml}
                    <div class="absolute top-4 left-4 ${style.color} text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider z-10">
                        ${pub.category}
                    </div>
                    <div class="absolute top-4 right-4 ${statusClass.split(' ')[0]} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                        <span>${statusIcon}</span>
                        <span>${statusText}</span>
                    </div>
                </div>
                <div class="p-6 flex flex-col gap-2 flex-1">
                    <h3 class="font-bold text-[#1a2b4b] text-xl leading-tight line-clamp-2">${pub.title}</h3>
                    <p class="text-sm text-slate-400 flex items-center gap-1.5 font-medium mt-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${pub.location}
                    </p>
                    <p class="text-slate-600 text-sm line-clamp-2 mt-1">${pub.description}</p>
                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">📦 ${pub.qty}</span>
                            <span class="text-xs text-slate-400 font-medium">🏢 ${pub.company}</span>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-2xl font-black text-[#1a2b4b]">${pub.price}</span>
                            <button class="text-sm font-bold bg-white text-[#1a2b4b] border-2 border-slate-100 px-5 py-2.5 rounded-xl transition-colors hover:bg-[#1a2b4b] hover:text-white hover:border-[#1a2b4b]">
                                Revisar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== MODAL DE REVISIÓN ==========
function openReviewModal(id) {
    currentPublication = publications.find(p => p.id === id);
    const modal = document.getElementById('review-modal');
    const modalContent = document.getElementById('modal-content');
    const style = categoryStyles[currentPublication.category] || { color: "bg-gray-500", icon: "❓" };
    
    const isPending = currentPublication.status === 'pending';
    const isReview = currentPublication.status === 'review';
    const isApprovedOrRejected = currentPublication.status === 'approved' || currentPublication.status === 'rejected';
    const hasCustomImage = currentPublication.customImage && currentPublication.customImage.trim() !== "";
    
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="bg-slate-50 rounded-xl p-5">
                <div class="flex items-center gap-3 mb-4">
                    ${hasCustomImage ? 
                        `<img src="${currentPublication.customImage}" class="w-16 h-16 rounded-lg object-cover" onerror="this.style.display='none'">` : 
                        `<span class="text-4xl">${style.icon}</span>`
                    }
                    <div>
                        <h3 class="text-2xl font-bold text-[#1a2b4b]">${currentPublication.title}</h3>
                        <p class="text-slate-500">${currentPublication.category} • ${currentPublication.location}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div><span class="text-slate-500 text-xs">Empresa</span><p class="font-medium">${currentPublication.company}</p></div>
                    <div><span class="text-slate-500 text-xs">Contacto</span><p class="font-medium">${currentPublication.companyEmail}</p></div>
                    <div><span class="text-slate-500 text-xs">Cantidad</span><p class="font-medium">${currentPublication.qty}</p></div>
                    <div><span class="text-slate-500 text-xs">Peso Total</span><p class="font-medium">${currentPublication.weightKg} kg</p></div>
                </div>
            </div>
            
            <div class="border border-slate-100 rounded-xl p-5">
                <h4 class="font-bold text-[#1a2b4b] mb-2">📝 Descripción del Material</h4>
                <p class="text-slate-600">${currentPublication.description}</p>
            </div>
            
            <div class="border border-slate-100 rounded-xl p-5">
                <h4 class="font-bold text-[#1a2b4b] mb-3">💬 Retroalimentación</h4>
                <div id="comments-list" class="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    ${currentPublication.comments.length > 0 ? currentPublication.comments.map(comment => `
                        <div class="comment-card p-3 bg-slate-50 rounded-xl">
                            <div class="flex justify-between items-start">
                                <span class="font-medium text-sm text-[#1a2b4b]">${comment.user}</span>
                                <span class="text-xs text-slate-400">${comment.date}</span>
                            </div>
                            <p class="text-slate-600 text-sm mt-1">${comment.text}</p>
                        </div>
                    `).join('') : '<p class="text-slate-400 text-sm">Sin comentarios aún</p>'}
                </div>
                <textarea id="comment-text" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#78C043] focus:ring-2 focus:ring-[#78C043]/20 outline-none transition-all" rows="2" placeholder="Escribe tu retroalimentación..."></textarea>
            </div>
            
            <div class="flex flex-wrap gap-3 justify-end border-t border-slate-100 pt-5">
                ${isPending ? `
                    <button onclick="addCommentAndAction(${currentPublication.id}, 'review')" class="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">🔍 Marcar en Revisión</button>
                    <button onclick="closeModal()" class="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cancelar</button>
                ` : ''}
                ${isReview ? `
                    <button onclick="addCommentAndAction(${currentPublication.id}, 'approved')" class="px-6 py-3 bg-[#78C043] text-white rounded-xl font-bold hover:bg-[#66a338] transition-all">✅ Aprobar Publicación</button>
                    <button onclick="addCommentAndAction(${currentPublication.id}, 'rejected')" class="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">❌ Rechazar Publicación</button>
                    <button onclick="closeModal()" class="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cancelar</button>
                ` : ''}
                ${isApprovedOrRejected ? `
                    <button onclick="closeModal()" class="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cerrar</button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function addCommentAndAction(id, action) {
    const commentText = document.getElementById('comment-text')?.value.trim();
    const publication = publications.find(p => p.id === id);
    let statusText = '';
    
    switch(action) {
        case 'approved': statusText = 'aprobada'; break;
        case 'rejected': statusText = 'rechazada'; break;
        case 'review': statusText = 'en revisión'; break;
    }
    
    if (commentText) {
        publication.comments.push({
            user: 'Control Calidad',
            text: commentText,
            date: new Date().toISOString().split('T')[0],
            type: action
        });
    }
    
    if (action === 'review' && publication.status === 'pending') publication.status = 'review';
    else if (action === 'approved') publication.status = 'approved';
    else if (action === 'rejected') publication.status = 'rejected';
    
    showNotification(`📋 Publicación ${statusText} correctamente`, 'success');
    updateCounters();
    renderPublications();
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('review-modal');
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// ========== REPORTES ==========
function submitErrorReport(event) {
    event.preventDefault();
    const type = document.getElementById('error-type').value;
    const publication = document.getElementById('error-publication').value;
    const description = document.getElementById('error-description').value;
    
    if(!description) {
        showNotification('Por favor describe el error', 'error');
        return;
    }
    
    const newReport = {
        id: Date.now(),
        type: type,
        publication: publication || 'No especificada',
        description: description,
        date: new Date().toLocaleString(),
        status: 'Enviado'
    };
    reportsHistory.unshift(newReport);
    
    const historyDiv = document.getElementById('reports-history');
    if(reportsHistory.length === 0) {
        historyDiv.innerHTML = '<p class="text-slate-400 text-center py-8">No hay reportes enviados en esta sesión</p>';
    } else {
        historyDiv.innerHTML = reportsHistory.map(r => `
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-slate-400">${r.date}</span>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">${r.status}</span>
                </div>
                <p class="font-medium text-sm mb-1">
                    ${r.type === 'publicacion' ? '📦 Error en publicación' : (r.type === 'documento' ? '📄 Documento inválido' : (r.type === 'tecnico' ? '⚙️ Problema técnico' : '📝 Otro'))}
                </p>
                <p class="text-sm text-slate-600">${r.description}</p>
                ${r.publication !== 'No especificada' ? `<p class="text-xs text-slate-400 mt-2">📌 Publicación: ${r.publication}</p>` : ''}
            </div>
        `).join('');
    }
    
    document.getElementById('error-publication').value = '';
    document.getElementById('error-description').value = '';
    showNotification('✅ Reporte enviado al administrador', 'success');
}

// ========== MODO MATRIZ ==========
function toggleMatrizMode() {
    matrizMode = !matrizMode;
    if (matrizMode) activateMatrizLabels();
    else deactivateMatrizLabels();
    updateMatrizBubble();
}

function updateMatrizBubble() {
    const bubble = document.getElementById('matriz-bubble');
    const title = document.getElementById('matriz-bubble-title');
    const text = document.getElementById('matriz-bubble-text');
    const btn = document.getElementById('matriz-toggle-btn');
    if (!bubble || !title || !text || !btn) return;
    if (matrizMode) {
        bubble.classList.remove('hidden');
        title.textContent = 'Modo Matriz Activo';
        text.textContent = 'Presiona Q + A para desactivar';
        btn.textContent = 'Desactivar';
    } else {
        bubble.classList.add('hidden');
        title.textContent = 'Modo Matriz Desactivado';
        text.textContent = 'Presiona Q + A para activar';
        btn.textContent = 'Activar';
    }
}

function activateMatrizLabels() {
    deactivateMatrizLabels();
    const navPublications = document.getElementById('nav-publications');
    const navReports = document.getElementById('nav-reports');
    if (navPublications) addKeyLabelInside(navPublications, 'Alt + 1');
    if (navReports) addKeyLabelInside(navReports, 'Alt + 2');
    document.querySelectorAll('.product-card').forEach((card, index) => {
        if (index < 3) addKeyLabelInside(card, `Alt + ${index + 1}`);
    });
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

window.addEventListener('scroll', () => { if (matrizMode) activateMatrizLabels(); });
window.addEventListener('resize', () => { if (matrizMode) activateMatrizLabels(); });

function toggleCommands() {
    const modal = document.getElementById('commands-modal');
    if (!modal) return;
    modal.classList.toggle('hidden');
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
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

    if (e.shiftKey && key === '?') { e.preventDefault(); toggleCommands(); return; }
    if (e.key === 'Escape') {
        const commandsModal = document.getElementById('commands-modal');
        if (commandsModal && !commandsModal.classList.contains('hidden')) {
            commandsModal.classList.add('hidden');
            e.preventDefault();
            return;
        }
        closeModal();
        return;
    }
    if (e.altKey) {
        if (key === 'h') { e.preventDefault(); window.location.href = '../../Components/empresa/empresa.html'; return; }
        if (key === '1') { e.preventDefault(); switchSection('publications'); return; }
        if (key === '2') { e.preventDefault(); switchSection('reports'); return; }
    }
});

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    updateCounters();
    renderPublications();
    switchSection('publications');
});