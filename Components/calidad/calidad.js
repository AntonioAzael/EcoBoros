// ============================================
// CALIDAD.JS - Control de Calidad ECOBOROS
// ============================================

const API_BASE = 'http://localhost:8000/api-ecoboros-v1';

// ========== DATOS DE RESPALDO / CACHE ==========
let publications = [];
let reportsHistory = [];

let currentQualityUser = {
    user_id: 4,
    name: 'Inspector Carlos Mendoza (Calidad A)',
    email: 'calidad@ecoboros.com'
};

// ========== VARIABLES DE ESTADO ==========
let currentTab = "pending-unassigned";
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
    "Electrónicos": { color: "bg-orange-500", icon: "🔌", hoverGlow: "hover:border-orange-500" },
    "Plasticos": { color: "bg-blue-500", icon: "🛢️", hoverGlow: "hover:border-blue-500 hover:shadow-blue-500/30", btnHover: "group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white" },
    "Cartones": { color: "bg-amber-500", icon: "📦", hoverGlow: "hover:border-amber-500 hover:shadow-amber-500/30", btnHover: "group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white" },
    "Carton": { color: "bg-amber-500", icon: "📦", hoverGlow: "hover:border-amber-500 hover:shadow-amber-500/30", btnHover: "group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white" },
    "Papeles": { color: "bg-slate-400", icon: "📄", hoverGlow: "hover:border-slate-400 hover:shadow-slate-400/30", btnHover: "group-hover:bg-slate-400 group-hover:border-slate-400 group-hover:text-white" },
    "Electronicos": { color: "bg-orange-500", icon: "🔌", hoverGlow: "hover:border-orange-500 hover:shadow-orange-500/30", btnHover: "group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white" },

};

// ========== FUNCIONES GENERALES ==========
function loadUserData() {
    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            currentQualityUser.user_id = user.user_id || 4;
            currentQualityUser.name = user.name || 'Inspector Carlos Mendoza (Calidad A)';
            currentQualityUser.email = user.email || 'calidad@ecoboros.com';

            document.getElementById('user-name-display').textContent = currentQualityUser.name;
            const avatar = document.getElementById('user-avatar');
            avatar.textContent = currentQualityUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            document.getElementById('user-role-display').textContent = 'Control de Calidad';
        } catch(e) {}
    } else {
        document.getElementById('user-name-display').textContent = currentQualityUser.name;
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

// ========== OBTENER DATOS DE LA API ==========
async function fetchQualityData() {
    try {
        const [wastesRes, requestsRes] = await Promise.all([
            fetch(`${API_BASE}/wastes/`),
            fetch(`${API_BASE}/purchase-requests/`)
        ]);

        const wastesData = wastesRes.ok ? await wastesRes.json() : [];
        const requestsData = requestsRes.ok ? await requestsRes.json() : [];

        let items = [];

        // Convertir Purchase Requests en ítems para el panel de Calidad
        requestsData.forEach(req => {
            const statusStr = (req.status_name || 'Pendiente').toLowerCase();
            let statusKey = 'pending';
            if (['proceso', 'en proceso', '5'].includes(statusStr)) statusKey = 'review';
            else if (['completado', 'completada', '6'].includes(statusStr)) statusKey = 'completed-requests';
            else if (['rechazado', 'rechazada', '3'].includes(statusStr)) statusKey = 'rejected';

            const weight = parseFloat(req.requested_weight || 0);
            const price = parseFloat(req.offered_price || 0);
            const total = req.total_amount || (weight * price);

            const origWaste = wastesData.find(w => Number(w.waste_id) === Number(req.waste) || Number(w.id) === Number(req.waste));

            items.push({
                id: req.request_id,
                isRequest: true,
                request_id: req.request_id,
                waste_id: req.waste,
                title: req.product_name || origWaste?.title || 'Residuo Industrial',
                category: origWaste?.category_name_display || 'Cartón',
                location: 'Tijuana / En Operación',
                qty: req.quantity || `${weight} kg`,
                weightKg: weight,
                price: req.total_formatted || `$ ${total.toFixed(2)}`,
                unitPrice: price,
                originalUnitPrice: origWaste ? parseFloat(origWaste.unit_price || 0) : null,
                originalWeightKg: origWaste ? parseFloat(origWaste.weight_decimal || 0) : null,
                date: req.date || '2026-08-10',
                status: statusKey,
                rawStatusName: req.status_name || 'Pendiente',
                company: req.seller_name || 'Empresa Vendedora',
                buyerCompany: req.buyer_name || 'Empresa Compradora',
                companyEmail: 'contacto@ecoboros.com',
                description: `Petición de compra entre ${req.buyer_name} y ${req.seller_name}.`,
                negotiationComment: req.negotiation_comment || 'Sin comentarios adicionales por parte de las empresas.',
                customImage: origWaste?.first_image_url || null,
                qualityValidatorId: req.quality_validator,
                qualityValidatorName: req.quality_validator_name,
                platformFeeFormatted: req.platform_fee_formatted || `$ ${(total * 0.025).toFixed(2)}`,
                sellerPayoutFormatted: req.seller_payout_formatted || `$ ${(total * 0.975).toFixed(2)}`,
                sellerPaymentConfirmed: !!req.seller_payment_confirmed,
                platformFeeConfirmed: !!req.platform_fee_confirmed,
                comments: []
            });
        });

        // Convertir Wastes directos si no están en solicitudes
        wastesData.forEach(w => {
            const statusStr = (w.status_name || 'Pendiente').toLowerCase();
            let statusKey = 'pending';
            if (['aprobado', 'aprobada', '2'].includes(statusStr)) statusKey = 'approved-publications';
            else if (['rechazado', 'rechazada', '3'].includes(statusStr)) statusKey = 'rejected';
            else if (['revision', 'review', '1'].includes(statusStr)) statusKey = 'review-publications';

            items.push({
                id: 1000 + w.waste_id,
                isRequest: false,
                waste_id: w.waste_id,
                title: w.title,
                category: w.category_name_display || 'Varios',
                location: 'Otay Industrial',
                qty: w.quantity || `${w.weight_decimal} kg`,
                weightKg: parseFloat(w.weight_decimal),
                price: w.unit_price ? `$ ${w.unit_price} / kg` : 'A consultar',
                unitPrice: parseFloat(w.unit_price || 0),
                date: w.generation_date || '2026-08-10',
                status: statusKey,
                rawStatusName: w.status_name || 'Pendiente',
                company: w.publisher_name || 'Empresa Publicadora',
                companyEmail: 'contacto@empresa.com',
                description: w.technical_description,
                negotiationComment: 'Publicación directa en revisión previa.',
                customImage: w.first_image_url,
                qualityValidatorId: null,
                qualityValidatorName: null,
                comments: []
            });
        });

        publications = items;
    } catch(e) {
        console.warn("Error al obtener datos de API en calidad:", e);
    }

    updateCounters();
    renderPublications();
}

let currentPage = 1;
const itemsPerPage = 9;

// ========== NAVEGACIÓN ==========
function switchSection(section) {
    currentSection = section;
    
    document.querySelectorAll('.section-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${section}-section`).classList.remove('hidden');
    
    const navs = ['publications', 'reports'];
    navs.forEach(nav => {
        const btn = document.getElementById(`nav-${nav}`);
        if (btn) {
            if (nav === section) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
    
    if (section === 'publications') {
        fetchQualityData();
    }
    if (section === 'reports') {
        loadPublicationsForReportSelect();
        loadReportsHistory();
    }
    if (matrizMode) activateMatrizLabels();
}

// ========== ESTADÍSTICAS ==========
// ========== ESTADÍSTICAS ==========
function updateCounters() {
    const myId = Number(currentQualityUser.user_id);
    
    // 1. Revisión (General)
    const reviewPublicationsCount = publications.filter(p => p.status === 'review-publications').length;
    // 2. Pendientes (General)
    const unassignedCount = publications.filter(p => p.status === 'pending' && (!p.qualityValidatorId || p.qualityValidatorId === null)).length;
    // 3. Seguimiento (Mis Asignaciones)
    const assignedCount = publications.filter(p => p.status === 'pending' && Number(p.qualityValidatorId) === myId).length;
    // 4. Aprobados (General)
    const approvedPublicationsCount = publications.filter(p => p.status === 'approved-publications').length;
    // 5. Rechazados (General)
    const rejectedCount = publications.filter(p => p.status === 'rejected').length;
    // 6. Mis Procesos (En Proceso, míos)
    const reviewCount = publications.filter(p => p.status === 'review' && Number(p.qualityValidatorId) === myId).length;

    document.getElementById('review-publications-count').textContent = reviewPublicationsCount;
    document.getElementById('pending-count').textContent = unassignedCount;
    document.getElementById('assigned-count').textContent = assignedCount;
    document.getElementById('approved-count').textContent = approvedPublicationsCount;
    document.getElementById('rejected-count').textContent = rejectedCount;
    document.getElementById('review-count').textContent = reviewCount;
    
    const unassignedBadge = document.getElementById('unassigned-badge');
    if (unassignedBadge) {
        if (unassignedCount > 0) {
            unassignedBadge.textContent = unassignedCount;
            unassignedBadge.classList.remove('hidden');
        } else {
            unassignedBadge.classList.add('hidden');
        }
    }

    const assignedBadge = document.getElementById('assigned-badge');
    if (assignedBadge) {
        if (assignedCount > 0) {
            assignedBadge.textContent = assignedCount;
            assignedBadge.classList.remove('hidden');
        } else {
            assignedBadge.classList.add('hidden');
        }
    }

    const reviewPubBadge = document.getElementById('review-publications-badge');
    if (reviewPubBadge) {
        if (reviewPublicationsCount > 0) {
            reviewPubBadge.textContent = reviewPublicationsCount;
            reviewPubBadge.classList.remove('hidden');
        } else {
            reviewPubBadge.classList.add('hidden');
        }
    }
}

// ========== FILTROS ==========
function filterPublications() {
    searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentPage = 1;
    renderPublications();
}

function switchTab(tab) {
    currentTab = tab;
    currentPage = 1;
    
    const tabs = ['pending-unassigned', 'my-assigned', 'review-publications', 'review', 'approved-publications', 'completed-requests', 'rejected'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) {
            if (t === tab) {
                btn.classList.remove('tab-inactive');
                btn.classList.add('tab-active');
            } else {
                btn.classList.remove('tab-active');
                btn.classList.add('tab-inactive');
            }
        }
    });
    
    renderPublications();
}

// ========== RENDER PUBLICACIONES ==========
function renderPublications() {
    let filtered = [];
    const myId = Number(currentQualityUser.user_id);

    if (currentTab === 'pending-unassigned') {
        filtered = publications.filter(p => p.status === 'pending' && (!p.qualityValidatorId || p.qualityValidatorId === null));
    } else if (currentTab === 'my-assigned') {
        filtered = publications.filter(p => p.status === 'pending' && Number(p.qualityValidatorId) === myId);
    } else if (currentTab === 'review-publications') {
        filtered = publications.filter(p => p.status === 'review-publications');
    } else if (currentTab === 'review') {
        filtered = publications.filter(p => p.status === 'review' && Number(p.qualityValidatorId) === myId);
    } else if (currentTab === 'approved-publications') {
        filtered = publications.filter(p => p.status === 'approved-publications');
    } else if (currentTab === 'completed-requests') {
        filtered = publications.filter(p => p.status === 'completed-requests' && Number(p.qualityValidatorId) === myId);
    } else if (currentTab === 'rejected') {
        filtered = publications.filter(p => p.status === 'rejected');
    } else {
        filtered = publications.filter(p => p.status === currentTab);
    }
    
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
    const pagControls = document.getElementById('pagination-controls');
    
    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        if (pagControls) pagControls.classList.add('hidden');
        return;
    }
    
    if (noResults) noResults.classList.add('hidden');

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filtered.slice(start, end);
    
    grid.innerHTML = paginatedItems.map((pub, index) => {
        const style = categoryStyles[pub.category] || { color: "bg-gray-500", icon: "❓", hoverGlow: "hover:border-gray-500" };
        
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
                    ${currentTab === 'pending-unassigned' ? `
                        <div class="absolute top-4 right-4 status-pending text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                            <span>📥</span>
                            <span>Sin Asignar</span>
                        </div>
                    ` : ''}
                </div>
                <div class="p-6 flex flex-col gap-2 flex-1">
                    <h3 class="font-bold text-[#1a2b4b] text-xl leading-tight line-clamp-2">${pub.title}</h3>
                    <p class="text-sm text-slate-400 flex items-center gap-1.5 font-medium mt-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${pub.location}
                    </p>
                    <p class="text-slate-600 text-sm line-clamp-2 mt-1">${pub.description}</p>
                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">📦 ${pub.qty}</span>
                            <span class="text-slate-400 font-medium">🏢 ${pub.company}</span>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-2xl font-black text-[#1a2b4b]">${pub.price}</span>
                            ${currentTab === 'pending-unassigned' ? `
                                <button onclick="event.stopPropagation(); assignToMe(${pub.id})" class="text-xs font-bold bg-[#78C043] text-white px-4 py-2.5 rounded-xl transition-all hover:bg-[#66a338] shadow-md flex items-center gap-1">
                                    <span>📌</span> Asignarme
                                </button>
                            ` : `
                                <button class="text-xs font-bold bg-[#1a2b4b] text-white px-5 py-2.5 rounded-xl transition-colors hover:bg-[#2d4563]">
                                    Auditar y Validar
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    renderPaginationControls(filtered.length);
}

function renderPaginationControls(totalItems) {
    const pagControls = document.getElementById('pagination-controls');
    if (!pagControls) return;

    if (totalItems <= itemsPerPage) {
        pagControls.classList.add('hidden');
        return;
    }

    pagControls.classList.remove('hidden');
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let html = '';
    
    // Anterior
    html += `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors">Anterior</button>`;
    
    // Números (simplificado para mostrar todas las páginas por ahora, asumiendo que no habrá cientos)
    for(let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="w-10 h-10 rounded-xl text-sm font-bold bg-[#1a2b4b] text-white shadow-md">${i}</button>`;
        } else {
            html += `<button onclick="goToPage(${i})" class="w-10 h-10 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">${i}</button>`;
        }
    }
    
    // Siguiente
    html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors">Siguiente</button>`;

    pagControls.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderPublications();
    // Scroll hacia arriba
    window.scrollTo({ top: document.getElementById('publications-section').offsetTop - 50, behavior: 'smooth' });
}

// ========== ASIGNAR USUARIO DE CALIDAD A SOLICITUD ==========
async function assignToMe(id) {
    const pub = publications.find(p => Number(p.id) === Number(id));
    if (!pub) return;

    if (pub.isRequest && pub.request_id) {
        try {
            const res = await fetch(`${API_BASE}/purchase-requests/${pub.request_id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quality_validator: currentQualityUser.user_id
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.status || errData.detail || 'Error al asignarse');
            }

            showNotification(`📌 Solicitud asignada a ${currentQualityUser.name}`, 'success');
            await fetchQualityData();
            switchTab('my-assigned');
            closeModal();
            return;
        } catch(err) {
            alert('Error al asignarse solicitud: ' + err.message);
            return;
        }
    }

    pub.qualityValidatorId = currentQualityUser.user_id;
    pub.qualityValidatorName = currentQualityUser.name;
    showNotification(`📌 Publicación asignada a ${currentQualityUser.name}`, 'success');
    updateCounters();
    switchTab('my-assigned');
    closeModal();
}

// ========== MODAL DE REVISIÓN Y VALIDACIÓN DE CALIDAD ==========
function openReviewModal(id) {
    currentPublication = publications.find(p => p.id === id);
    if (!currentPublication) return;

    const modal = document.getElementById('review-modal');
    const modalContent = document.getElementById('modal-content');
    const style = categoryStyles[currentPublication.category] || { color: "bg-gray-500", icon: "❓" };
    
    const isUnassigned = currentPublication.status === 'pending' && !currentPublication.qualityValidatorId;
    const isMyAssigned = currentPublication.status === 'pending' && currentPublication.qualityValidatorId === currentQualityUser.user_id;
    const isReview = currentPublication.status === 'review'; // En Proceso
    const isReviewPublications = currentPublication.status === 'review-publications'; // Publicaciones directas
    const isApprovedOrRejected = currentPublication.status === 'approved-publications' || currentPublication.status === 'completed-requests' || currentPublication.status === 'rejected';
    const hasCustomImage = currentPublication.customImage && currentPublication.customImage.trim() !== "";
    
    let html = `
        <div class="space-y-6">
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div class="flex items-center gap-3 mb-4">
                    ${hasCustomImage ? 
                        `<img src="${currentPublication.customImage}" class="w-16 h-16 rounded-lg object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-7xl group-hover:scale-110 transition-transform duration-500 opacity-90 flex items-center justify-center w-full h-full\'>${style.icon}</span>';">` : 
                        `<span class="text-4xl">${style.icon}</span>`
                    }
                    <div>
                        <h3 class="text-2xl font-bold text-[#1a2b4b]">${currentPublication.title}</h3>
                        <p class="text-slate-500 text-sm">${currentPublication.category} • ${currentPublication.location}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                    <div><span class="text-slate-400 block">Vendedor</span><p class="font-bold text-slate-700">${currentPublication.company}</p></div>
                    <div><span class="text-slate-400 block">Comprador</span><p class="font-bold text-slate-700">${currentPublication.buyerCompany || 'Empresa A'}</p></div>
                    <div><span class="text-slate-400 block">Fecha Registrada</span><p class="font-bold text-slate-700">${currentPublication.date}</p></div>
                    <div><span class="text-slate-400 block">Inspector Asignado</span><p class="font-bold text-[#78C043]">${currentPublication.qualityValidatorName || 'Sin Asignar'}</p></div>
                </div>
            </div>

            <!-- Comparativa: Precio Base Original vs Oferta Acordada / Contra-oferta -->
            <!-- Análisis de Negociación y Contra-oferta -->
            ${currentPublication.isRequest ? `
            <div class="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-[#1a2b4b] text-sm flex items-center gap-2">
                        <span>💬</span> Análisis de Negociación y Contra-oferta
                    </h4>
                    ${(currentPublication.originalUnitPrice && currentPublication.originalUnitPrice.toFixed(2) !== (currentPublication.unitPrice || 0).toFixed(2)) || (currentPublication.originalWeightKg && currentPublication.originalWeightKg !== currentPublication.weightKg) ? `
                        <span class="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-[11px] border border-amber-200">
                            ⚠️ Se detectaron cambios en la oferta
                        </span>
                    ` : `
                        <span class="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-[11px] border border-green-200">
                            ✅ Se mantienen valores originales
                        </span>
                    `}
                </div>

                <!-- Comentario de la Empresa -->
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Comentario Registrado por Empresa</p>
                    <p class="text-sm text-slate-600 italic">${currentPublication.negotiationComment}</p>
                </div>

                <!-- Desglose de Cambios -->
                <div>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Desglose de Cambios</p>
                    <div class="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-2 text-sm items-center">
                        <!-- Header -->
                        <div></div>
                        <div class="font-bold text-slate-500 text-xs">Publicación Original</div>
                        <div class="font-bold text-blue-700 text-xs">Oferta Acordada</div>

                        <!-- Fila Precio -->
                        <div class="font-semibold text-slate-600">Precio Unitario</div>
                        <div class="text-slate-600">${currentPublication.originalUnitPrice ? `$ ${currentPublication.originalUnitPrice.toFixed(2)} / kg` : 'N/A'}</div>
                        <div class="font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-md">${currentPublication.unitPrice ? `$ ${currentPublication.unitPrice.toFixed(2)} / kg` : 'N/A'}</div>

                        <!-- Fila Peso -->
                        <div class="font-semibold text-slate-600">Peso Total</div>
                        <div class="text-slate-600">${currentPublication.originalWeightKg ? `${currentPublication.originalWeightKg.toLocaleString()} kg` : 'N/A'}</div>
                        <div class="font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-md">${currentPublication.weightKg ? `${currentPublication.weightKg.toLocaleString()} kg` : 'N/A'}</div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Campos Variables Editables por Calidad en Estatus Pendiente -->
            <div class="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
                <div class="flex justify-between items-center">
                    <h4 class="font-bold text-[#1a2b4b] text-sm flex items-center gap-2">
                        <span>📝</span> Auditoría de Campos Variables (Calidad)
                    </h4>
                    ${isApprovedOrRejected ? '<span class="text-xs bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-md">🔒 Lectura Solamente</span>' : ''}
                </div>
                <p class="text-xs text-slate-500">Revisa la evidencia física/fotográfica o en móvil para re-confirmar los valores antes de autorizar el cambio a En Proceso.</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">Cantidad Verificada</label>
                        <input type="text" id="quality-qty" value="${currentPublication.qty}" ${isApprovedOrRejected ? 'disabled' : ''} class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:opacity-60">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">Peso Total (KG)</label>
                        <input type="number" id="quality-weight" value="${currentPublication.weightKg}" ${isApprovedOrRejected ? 'disabled' : ''} class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:opacity-60">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">Precio Unitario ($)</label>
                        <input type="number" step="0.01" id="quality-price" value="${currentPublication.unitPrice || 0}" ${isApprovedOrRejected ? 'disabled' : ''} class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:opacity-60">
                    </div>
                </div>
            </div>
    `;

    if (isReview || isApprovedOrRejected) {
        html += `
            <div class="bg-gradient-to-br from-[#1a2b4b] to-[#2d4563] text-white rounded-2xl p-5 space-y-3">
                <h4 class="font-bold text-[#78C043] text-sm flex items-center gap-2">
                    <span>📊</span> Desglose de Ganancias (Comisión Intermediario 2.5%)
                </h4>
                <div class="grid grid-cols-3 gap-3 text-xs pt-1">
                    <div class="bg-white/10 p-2.5 rounded-xl">
                        <span class="opacity-75 block text-[10px]">Total Operación</span>
                        <span class="font-black text-base">${currentPublication.price}</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl">
                        <span class="opacity-75 block text-[10px]">Comisión Software (2.5%)</span>
                        <span class="font-black text-base text-[#78C043]">${currentPublication.platformFeeFormatted || '$ 0.00'}</span>
                    </div>
                    <div class="bg-white/10 p-2.5 rounded-xl">
                        <span class="opacity-75 block text-[10px]">Ganancia Vendedor (97.5%)</span>
                        <span class="font-black text-base text-white">${currentPublication.sellerPayoutFormatted || '$ 0.00'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    html += `
            <div class="border border-slate-100 rounded-xl p-5">
                <h4 class="font-bold text-[#1a2b4b] mb-3">💬 Dictamen Final de Auditoría de Calidad</h4>
                <textarea id="comment-text" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#78C043] focus:ring-2 focus:ring-[#78C043]/20 outline-none transition-all" rows="2" placeholder="Escribe tu dictamen o nota de verificación auditada..."></textarea>
            </div>
            
            <div class="flex flex-wrap gap-3 justify-end border-t border-slate-100 pt-5">
                ${isUnassigned ? `
                    <button onclick="assignToMe(${currentPublication.id})" class="px-6 py-3 bg-[#78C043] text-white rounded-xl font-bold hover:bg-[#66a338] transition-all text-sm flex items-center gap-2 shadow-md">
                        <span>📌</span> Asignarme para Dar Seguimiento
                    </button>
                    <button onclick="closeModal()" class="px-5 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm">Cancelar</button>
                ` : ''}
                ${isMyAssigned ? `
                    <button onclick="validateAndMoveToProceso(${currentPublication.id})" class="px-6 py-3 bg-[#78C043] text-white rounded-xl font-bold hover:bg-[#66a338] transition-all text-sm flex items-center gap-2 shadow-md">
                        <span>✅</span> Validar Dictamen y Pasar a EN PROCESO
                    </button>
                    <button onclick="closeModal()" class="px-5 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm">Cancelar</button>
                ` : ''}
                ${isReview ? `
                    <button onclick="addCommentAndAction(${currentPublication.id}, 'approved')" class="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all text-sm">🔒 Marcar COMPLETADO</button>
                    <button onclick="addCommentAndAction(${currentPublication.id}, 'rejected')" class="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all text-sm">❌ Rechazar Operación</button>
                    <button onclick="closeModal()" class="px-5 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm">Cerrar</button>
                ` : ''}
                ${isReviewPublications ? `
                    <button onclick="approveOrRejectPublication(${currentPublication.id}, 'approved')" class="px-6 py-3 bg-[#78C043] text-white rounded-xl font-bold hover:bg-[#66a338] transition-all text-sm flex items-center gap-2 shadow-md">✅ Aprobar Publicación</button>
                    <button onclick="approveOrRejectPublication(${currentPublication.id}, 'rejected')" class="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all text-sm flex items-center gap-2 shadow-md">❌ Rechazar Publicación</button>
                    <button onclick="closeModal()" class="px-5 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm">Cerrar</button>
                ` : ''}
                ${isApprovedOrRejected ? `
                    <button onclick="closeModal()" class="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm">Cerrar</button>
                ` : ''}
            </div>
        </div>
    `;
    
    modalContent.innerHTML = html;
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

async function validateAndMoveToProceso(id) {
    const pub = publications.find(p => p.id === id);
    if (!pub) return;

    const qty = document.getElementById('quality-qty').value;
    const weight = parseFloat(document.getElementById('quality-weight').value) || 0;
    const price = parseFloat(document.getElementById('quality-price').value) || 0;
    const comment = document.getElementById('comment-text')?.value.trim();

    if (pub.isRequest && pub.request_id) {
        try {
            const res = await fetch(`${API_BASE}/purchase-requests/${pub.request_id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity: qty,
                    requested_weight: weight,
                    offered_price: price,
                    status: 5, // Proceso
                    quality_validator: currentQualityUser.user_id
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.status || errData.detail || 'Error al validar');
            }

            showNotification(`✅ Dictamen auditado por ${currentQualityUser.name} y cambiado a EN PROCESO`, 'success');
            await fetchQualityData();
            switchTab('review');
            closeModal();
            return;
        } catch(err) {
            alert('Error al validar solicitud en API: ' + err.message);
            return;
        }
    }

    // Fallback simulado
    pub.qty = qty;
    pub.weightKg = weight;
    pub.unitPrice = price;
    pub.status = 'review';
    pub.rawStatusName = 'Proceso';
    showNotification('✅ Información auditada y movida a EN PROCESO', 'success');
    updateCounters();
    switchTab('review');
    closeModal();
}

async function approveOrRejectPublication(id, action) {
    const pub = publications.find(p => p.id === id);
    if (!pub || pub.isRequest) return;

    let rejectionReason = "Aprobado por calidad";
    let targetStatus = 2; // Aprobado

    if (action === 'rejected') {
        targetStatus = 3; // Rechazado
        rejectionReason = document.getElementById('comment-text')?.value.trim();
        if (!rejectionReason) {
            rejectionReason = prompt("Por favor, ingrese el motivo del rechazo para que la empresa pueda corregirlo:");
            if (!rejectionReason) {
                alert("Debe proveer un motivo de rechazo.");
                return;
            }
        }
    }

    try {
        // 1. PATCH publication
        const res = await fetch(`${API_BASE}/wastes/${pub.waste_id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: targetStatus,
                quality_validator: currentQualityUser.user_id
            })
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.status || errData.detail || 'Error al actualizar estatus');
        }

        // 2. POST to waste-status-logs to store the reason
        const logRes = await fetch(`${API_BASE}/waste-status-logs/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                waste: pub.waste_id,
                previous_status: "1",
                status_changed: targetStatus.toString(),
                description: rejectionReason,
                changed_at: new Date().toISOString()
            })
        });

        if (!logRes.ok) {
            console.warn("No se pudo registrar el log de estado de publicación, pero el estado se actualizó.");
        }

        showNotification(action === 'approved' ? '✅ Publicación aprobada' : '❌ Publicación rechazada', 'success');
        await fetchQualityData();
        closeModal();
    } catch(err) {
        alert('Error al actualizar en API: ' + err.message);
    }
}

async function addCommentAndAction(id, action) {
    const pub = publications.find(p => p.id === id);
    if (!pub) return;

    let targetStatus = 6; // Completado
    if (action === 'rejected') targetStatus = 3;

    if (pub.isRequest && pub.request_id) {
        try {
            const res = await fetch(`${API_BASE}/purchase-requests/${pub.request_id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: targetStatus,
                    seller_payment_confirmed: targetStatus === 6,
                    platform_fee_confirmed: targetStatus === 6
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.status || errData.detail || 'Error al actualizar estatus');
            }

            showNotification(`📋 Estatus actualizado a ${targetStatus === 6 ? 'COMPLETADO' : 'RECHAZADO'}`, 'success');
            await fetchQualityData();
            closeModal();
            return;
        } catch(err) {
            alert('Error al actualizar en API: ' + err.message);
            return;
        }
    }

    if (action === 'approved') pub.status = 'approved-publications';
    else if (action === 'rejected') pub.status = 'rejected';
    
    showNotification(`📋 Registro actualizado correctamente`, 'success');
    updateCounters();
    renderPublications();
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('review-modal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// ========== REPORTE DE ERRORES ==========

const REPORT_TYPE_MAP = {
    documento_invalido:     '📄 Documento inválido',
    imagen_invalida:        '🖼️ Imágenes inválidas',
    datos_incorrectos:      '📦 Datos incorrectos',
    descripcion_incorrecta: '✏️ Descripción incorrecta',
    categoria_incorrecta:   '🏷️ Categoría incorrecta',
    fraude_sospechoso:      '🚨 Fraude sospechoso',
    tecnico:                '⚙️ Problema técnico',
    otro:                   '📝 Otro',
};

async function loadPublicationsForReportSelect() {
    const select = document.getElementById('error-publication-select');
    if (!select) return;
    try {
        const res   = await fetch(`${API_BASE}/wastes/?format=json`);
        const data  = res.ok ? await res.json() : [];
        const wastes = Array.isArray(data) ? data : (data.results || []);
        select.innerHTML = '<option value="">-- Sin publicación específica --</option>';
        wastes.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w.waste_id || w.id;
            opt.textContent = `[${w.waste_id || w.id}] ${w.title}`;
            opt.dataset.search = `${w.waste_id || w.id} ${(w.title || '').toLowerCase()}`;
            select.appendChild(opt);
        });
        select._allOptions = Array.from(select.options);
    } catch(e) {
        select.innerHTML = '<option value="">Error al cargar publicaciones</option>';
    }
}

function filterReportPublicationSelect(query) {
    const select = document.getElementById('error-publication-select');
    if (!select || !select._allOptions) return;
    const q = query.toLowerCase().trim();
    select.innerHTML = '';
    (q ? select._allOptions.filter(o => o.dataset.search && o.dataset.search.includes(q))
       : select._allOptions
    ).forEach(o => select.appendChild(o.cloneNode(true)));
}

async function submitErrorReport(event) {
    event.preventDefault();
    const type        = document.getElementById('error-type').value;
    const wasteId     = document.getElementById('error-publication-select')?.value || '';
    const description = document.getElementById('error-description').value.trim();

    if (!description) { showNotification('Por favor describe el error', 'error'); return; }

    const userId = currentQualityUser?.user_id;
    if (!userId) { showNotification('Sesión inválida, recarga la página', 'error'); return; }

    const btn = document.getElementById('btn-submit-report');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Enviando...'; }

    const payload = { type, description, reported_by: userId, status: 'pending' };
    if (wasteId) payload.waste = Number(wasteId);

    try {
        const res = await fetch(`${API_BASE}/reports/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            showNotification('✅ Reporte enviado al administrador correctamente', 'success');
            document.getElementById('error-report-form').reset();
            document.getElementById('pub-search').value = '';
            filterReportPublicationSelect('');
            await loadReportsHistory();
        } else {
            const err = await res.json().catch(() => ({}));
            const msg = Object.entries(err).map(([k,v]) => `${k}: ${v}`).join(', ');
            showNotification('Error: ' + (msg || JSON.stringify(err)), 'error');
        }
    } catch(e) {
        showNotification('Error de red: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<span>📨</span> Enviar Reporte al Administrador'; }
    }
}

async function loadReportsHistory() {
    const historyDiv = document.getElementById('reports-history');
    if (!historyDiv) return;
    try {
        const userId = currentQualityUser?.user_id;
        const url = userId ? `${API_BASE}/reports/?reported_by=${userId}` : `${API_BASE}/reports/`;
        const res  = await fetch(url);
        const data = res.ok ? await res.json() : [];
        const reps = (Array.isArray(data) ? data : (data.results || []))
                        .sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

        if (!reps.length) {
            historyDiv.innerHTML = '<p class="text-slate-400 text-sm text-center py-8">No hay reportes enviados aún.</p>';
            return;
        }
        historyDiv.innerHTML = reps.map(r => `
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all text-xs">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-slate-400">${r.date || r.created_at?.substring(0,10) || ''}</span>
                    <span class="text-xs px-2 py-1 rounded-full ${r.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}">
                        ${r.status === 'pending' ? '⏳ Pendiente' : '✅ Resuelto'}
                    </span>
                </div>
                <p class="font-medium mb-1">${REPORT_TYPE_MAP[r.type] || '📝 ' + r.type}</p>
                <p class="text-slate-600">${r.description}</p>
                ${r.publicationTitle ? `<p class="text-slate-400 mt-2">📌 Publicación: ${r.publicationTitle}</p>` : ''}
            </div>
        `).join('');
    } catch(e) {
        historyDiv.innerHTML = '<p class="text-red-400 text-sm text-center py-4">Error al cargar historial.</p>';
    }
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
    fetchQualityData();
    switchSection('publications');
});