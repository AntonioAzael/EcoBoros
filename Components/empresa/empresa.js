// ============================================

// EMPRESA.JS - Marketplace ECOBOROS

// ============================================

// ========== DATOS ==========

let allPublications = []; // This will be our cache for all publications from the API

// Compras realizadas por la empresa actual

let myPurchases = [

    { id: 1, productName: "Bidones HDPE Tricapa", date: "2024-01-15", total: 1275, totalFormatted: "$ 1,275.00", status: "completada", seller: "Recicladora del Norte" },

    { id: 2, productName: "Pallets de Pino", date: "2024-02-10", total: 9000, totalFormatted: "$ 9,000.00", status: "completada", seller: "Maderas del Pacífico" },

    { id: 3, productName: "Botellas PET Cristal", date: "2024-03-05", total: 8000, totalFormatted: "$ 8,000.00", status: "procesando", seller: "Plásticos Reciclados SA" },

];

// ========== VARIABLES DE ESTADO ==========

let activeCategory = "Todos";

let currentUser = { name: 'Empresa Demo S.A.', role: 'empresa', id: 1, user_id: 1 }; // se actualiza en loadUserData

let currentPublicationFilter = "all";

let editingPublicationId = null;

let matrizMode = false;

let keySequence = [];

let lastKeyTime = 0;

const categoryStyles = {

    "Todos": { text: "text-slate-600", bg: "bg-slate-100", border: "border-transparent" },

    "Metales": { color: "bg-slate-600", icon: "🔩", hoverGlow: "hover:border-slate-600 hover:shadow-slate-600/30", btnHover: "group-hover:bg-slate-600 group-hover:border-slate-600 group-hover:text-white" },

    "Plásticos": { color: "bg-blue-500", icon: "🛢️", hoverGlow: "hover:border-blue-500 hover:shadow-blue-500/30", btnHover: "group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white" },

    "Cartón": { color: "bg-amber-500", icon: "📦", hoverGlow: "hover:border-amber-500 hover:shadow-amber-500/30", btnHover: "group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white" },

    "Papel": { color: "bg-slate-400", icon: "📄", hoverGlow: "hover:border-slate-400 hover:shadow-slate-400/30", btnHover: "group-hover:bg-slate-400 group-hover:border-slate-400 group-hover:text-white" },

    "Maderas": { color: "bg-[#795548]", icon: "🪵", hoverGlow: "hover:border-[#795548] hover:shadow-[#795548]/30", btnHover: "group-hover:bg-[#795548] group-hover:border-[#795548] group-hover:text-white" },

    "Electrónicos": { color: "bg-orange-500", icon: "🔌", hoverGlow: "hover:border-orange-500 hover:shadow-orange-500/30", btnHover: "group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white" },

    "Plasticos": { color: "bg-blue-500", icon: "🛢️", hoverGlow: "hover:border-blue-500 hover:shadow-blue-500/30", btnHover: "group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white" },

    "Cartones": { color: "bg-amber-500", icon: "📦", hoverGlow: "hover:border-amber-500 hover:shadow-amber-500/30", btnHover: "group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white" },

    "Carton": { color: "bg-amber-500", icon: "📦", hoverGlow: "hover:border-amber-500 hover:shadow-amber-500/30", btnHover: "group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white" },

    "Papeles": { color: "bg-slate-400", icon: "📄", hoverGlow: "hover:border-slate-400 hover:shadow-slate-400/30", btnHover: "group-hover:bg-slate-400 group-hover:border-slate-400 group-hover:text-white" },

    "Electronicos": { color: "bg-orange-500", icon: "🔌", hoverGlow: "hover:border-orange-500 hover:shadow-orange-500/30", btnHover: "group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white" },

};

async function fetchAndRenderPublications() {

    // Asegurar que currentUser.user_id está actualizado antes de filtrar

    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');

    if (storedUser) {

        try {

            const u = JSON.parse(storedUser);

            currentUser.user_id = u.user_id || u.id || currentUser.user_id;

            currentUser.id = currentUser.user_id;

        } catch (e) {}

    }

    try {

        const response = await fetch('http://localhost:8000/api-ecoboros-v1/wastes/');

        if (!response.ok) {

            throw new Error(`HTTP error! status: ${response.status}`);

        }

        const data = await response.json();

        allPublications = data; // Cache the data

        applyFilters(false); // Render initial view

        // Actualizar "Mis Publicaciones" si la pestaña está activa

        const myPubPage = document.getElementById('my-publications-page');

        if (myPubPage && !myPubPage.classList.contains('page-hidden')) {

            filterMyPublications(currentPublicationFilter);

        }

    } catch (error) {

        console.error("Could not fetch publications:", error);

        const grid = document.getElementById("products-grid");

        if (grid) {

            grid.innerHTML = `<p class="text-center text-red-500 col-span-full">Error al cargar las publicaciones. Verifique que el backend esté funcionando en <strong>http://localhost:8000</strong></p>`;

        }

    }

}

function findPublicationById(id) {

    const numId = Number(id);

    return allPublications.find(p => Number(p.waste_id) === numId || Number(p.id) === numId);

}

function getCurrentUserPublications() {

    // publisher en la API es el user_id (int)

    return allPublications.filter(p => Number(p.publisher) === Number(currentUser.user_id));

}

function isCurrentUserPublication(publication) {

    return Number(publication.publisher) === Number(currentUser.user_id);

}

async function saveEditedPublication(publication) {

    const pubId = publication.waste_id || publication.id;

    try {

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/wastes/${pubId}/`, {

            method: 'PATCH',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({

                title: publication.title,

                unit_price: parseFloat(publication.price) || 0,

                quantity: publication.qty,

                weight_decimal: parseFloat(publication.weight) || 0,

                technical_description: publication.description || ''

            })

        });

        if (res.ok) {

            const updated = await res.json();

            const index = allPublications.findIndex(p => Number(p.waste_id) === Number(pubId) || Number(p.id) === Number(pubId));

            if (index !== -1) {

                allPublications[index] = { ...allPublications[index], ...updated };

            }

            showToast('✅ Publicación actualizada correctamente.');

            filterMyPublications(currentPublicationFilter);

        } else {

            alert('Error al guardar la publicación.');

        }

    } catch(e) {

        console.error('Error al actualizar publicación:', e);

        alert('Error de comunicación con el servidor.');

    }

}


// ========== FUNCIONES DE NAVEGACIÓN ==========

function switchPage(showPageId, hidePageIds) {

    const showPage = document.getElementById(showPageId);

    const pages = ['home-page', 'my-publications-page', 'my-purchases-page'];

    pages.forEach(pageId => {

        const page = document.getElementById(pageId);

        if (page) {

            page.style.opacity = '0';

            setTimeout(() => {

                if (pageId === showPageId) {

                    page.classList.remove('page-hidden');

                    page.classList.add('page-visible');

                    setTimeout(() => {

                        page.style.opacity = '1';

                    }, 10);

                } else {

                    page.classList.add('page-hidden');

                    page.classList.remove('page-visible');

                    page.style.opacity = '1';

                }

            }, 150);

        }

    });

    setTimeout(() => {

        if (showPage) {

            showPage.classList.remove('page-hidden');

            showPage.classList.add('page-visible');

        }

    }, 150);

}

function showHomePage() {

    switchPage('home-page', ['my-publications-page', 'my-purchases-page']);

    document.getElementById('nav-home').className = "text-white bg-white/5 border-b-2 border-[#78C043] px-5 py-3 text-sm font-medium";

    document.getElementById('nav-publications').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";

    document.getElementById('nav-purchases').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";

    applyFilters(false);

    if (matrizMode) activateMatrizLabels();

}

function showMyPublicationsPage() {

    switchPage('my-publications-page', ['home-page', 'my-purchases-page']);

    document.getElementById('nav-home').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";

    document.getElementById('nav-publications').className = "text-white bg-white/5 border-b-2 border-[#78C043] px-5 py-3 text-sm font-medium";

    document.getElementById('nav-purchases').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";

    filterMyPublications('all');

    if (matrizMode) activateMatrizLabels();

}

function showMyPurchasesPage() {

    switchPage('my-purchases-page', ['home-page', 'my-publications-page']);

    document.getElementById('nav-home').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";
}

function showMyPurchasesPage() {
    switchPage('my-purchases-page', ['home-page', 'my-publications-page']);
    document.getElementById('nav-home').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";
    document.getElementById('nav-publications').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";
    document.getElementById('nav-purchases').className = "text-white bg-white/5 border-b-2 border-[#78C043] px-5 py-3 text-sm font-medium";
    
    // Call the API to fetch and render my purchases
    fetchAndRenderMyPurchases();
}

// ========== MIS PUBLICACIONES ==========

function getMyPublications() {

    return getCurrentUserPublications();

}

function getPublicationStatusKey(p) {

    if (!p) return 'pendiente';

    // 1. Si status es un ID numérico (API Django statuses: 1:Revision, 2:Aprobado, 3:Rechazado, 4:Pendiente, 5:Proceso, 6:Completado)

    if (typeof p.status === 'number') {

        const idMap = {

            1: 'revision',

            2: 'aprobada',

            3: 'rechazada',

            4: 'pendiente',

            5: 'proceso',

            6: 'completado'

        };

        if (idMap[p.status]) return idMap[p.status];

    }

    // 2. Normalizar según el texto de status_name o status

    const raw = String(p.status_name || p.status || '').toLowerCase().trim().replace(/ /g, '_');

    if (['aprobada', 'aprobado', 'approved', '2'].includes(raw)) return 'aprobada';

    if (['revision', 'en_revisión', 'en_revision', 'review', '1'].includes(raw)) return 'revision';

    if (['rechazada', 'rechazado', 'rejected', '3'].includes(raw)) return 'rechazada';

    if (['pendiente', 'pending', '4'].includes(raw)) return 'pendiente';

    if (['proceso', 'en_proceso', '5'].includes(raw)) return 'proceso';

    if (['completado', 'completada', 'completed', '6'].includes(raw)) return 'completado';

    return raw || 'pendiente';

}

const publicationStatusLabels = {

    revision: { text: 'En Revisión', class: 'status-revision', badge: '⚙️' },

    aprobada: { text: 'Aprobada', class: 'status-aprobada', badge: '✅' },

    aprobado: { text: 'Aprobada', class: 'status-aprobada', badge: '✅' },

    approved: { text: 'Aprobada', class: 'status-aprobada', badge: '✅' },

    rechazada: { text: 'Rechazada', class: 'status-rechazada', badge: '❌' },

    rechazado: { text: 'Rechazada', class: 'status-rechazada', badge: '❌' },

    rejected: { text: 'Rechazada', class: 'status-rechazada', badge: '❌' },

    pendiente: { text: 'Pendiente', class: 'status-pendiente', badge: '⏳' },

    pending: { text: 'Pendiente', class: 'status-pendiente', badge: '⏳' },

    proceso: { text: 'En Proceso', class: 'status-proceso', badge: '🔄' },

    completado: { text: 'Completado', class: 'status-completado', badge: '✅' }

};

function filterMyPublications(status) {

    currentPublicationFilter = status;

    let filtered = getMyPublications();

    if (status !== 'all') {

        filtered = filtered.filter(p => getPublicationStatusKey(p) === status);

    }

    ['all', 'revision', 'aprobada', 'rechazada', 'pendiente', 'proceso', 'completado'].forEach(s => {

        const tab = document.getElementById(`my-tab-${s}`);

        if (tab) {

            if (s === status) {

                tab.className = "tab-active px-6 py-3 rounded-t-xl font-bold text-sm transition-all";

            } else {

                tab.className = "tab-inactive px-6 py-3 rounded-t-xl font-bold text-sm transition-all";

            }

        }

    });

    renderMyPublications(filtered);

}

function switchMyPubsTab(tab) {

    currentMyPubsTab = tab;

    // ... logic (unchanged)

}

async function renderMyPublications(publications) {

    const container = document.getElementById('my-publications-grid');

    const noResults = document.getElementById('my-no-publications');

    if (publications.length === 0) {

        container.classList.add('hidden');

        noResults.classList.remove('hidden');

        return;

    }

    container.classList.remove('hidden');

    noResults.classList.add('hidden');

    const htmlPromises = publications.map(async pub => {

        // Usar campos de la API (category_name_display, status_name, waste_id, etc.)

        const categoryName = pub.category_name_display || pub.category_name || pub.category || 'Varios';

        const style = categoryStyles[categoryName] || { color: "bg-gray-500", icon: "♻️", btnHover: "" };

        const statusKey = getPublicationStatusKey(pub);

        const status = publicationStatusLabels[statusKey] || { text: pub.status_name || 'Pendiente', class: 'status-pendiente', badge: '⏳' };

        const price = pub.unit_price ? `$ ${parseFloat(pub.unit_price).toFixed(2)} / kg` : (pub.price || 'A consultar');

        const qty = pub.quantity || pub.qty || 'N/A';

        const date = pub.generation_date || pub.date || '-';

        const pubId = pub.waste_id || pub.id;

        let rejectionHtml = '';

        if (statusKey === 'rechazado' || pub.status == 3) {

            try {

                const logRes = await fetch(`${API_BASE}/waste-status-logs/?waste=${pubId}`);

                if (logRes.ok) {

                    const logs = await logRes.json();

                    const rejectionLogs = logs.filter(l => l.status_changed === '3');

                    if (rejectionLogs.length > 0) {

                        const lastLog = rejectionLogs[rejectionLogs.length - 1];

                        if (lastLog.description) {

                            rejectionHtml = `

                                <div class="mt-3 bg-red-50 border border-red-100 p-3 rounded-xl flex gap-2 items-start">

                                    <span class="text-red-500 mt-0.5">⚠️</span>

                                    <div>

                                        <p class="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-0.5">Motivo de Rechazo (Calidad)</p>

                                        <p class="text-xs text-red-600 font-medium">${lastLog.description}</p>

                                    </div>

                                </div>

                            `;

                        }

                    }

                }

            } catch(e) {

                console.warn('Error fetching rejection reason:', e);

            }

        }

        // Imagen de evidencia si existe

        let imgHtml;

        if (pub.first_image_url) {

            imgHtml = `<img src="${pub.first_image_url}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-7xl group-hover:scale-110 transition-transform duration-500 opacity-90 flex items-center justify-center w-full h-full\'>${style.icon}</span>';">`;

        } else {

            imgHtml = `<span class="text-7xl group-hover:scale-110 transition-transform duration-500">${style.icon}</span>`;

        }

        return `

            <div onclick="handleMyPublicationCardClick(${pubId}, '${statusKey}')" class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer">

                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden" style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;">

                    ${imgHtml}

                    <div class="absolute top-4 left-4 ${style.color} text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">

                        ${categoryName}

                    </div>

                    <div class="absolute top-4 right-4">

                        <span class="status-badge ${status.class}">${status.badge} ${status.text}</span>

                    </div>

                </div>

                <div class="p-6 flex flex-col gap-2 flex-1">

                    <h3 class="font-bold text-[#1a2b4b] text-xl leading-tight">${pub.title}</h3>

                    <p class="text-sm text-slate-400 flex items-center gap-1.5 font-medium">

                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>

                        ${pub.location || 'Sin ubicación'}

                    </p>

                    ${rejectionHtml}

                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">

                        <div class="flex justify-between items-center">

                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Disp: ${qty}</span>

                            <span class="text-xs text-slate-400 font-medium">📅 ${date}</span>

                        </div>

                        <div class="flex justify-between items-center mt-2">

                            <span class="text-2xl font-black text-[#1a2b4b]">${price}</span>

                            <button onclick="event.stopPropagation(); handleMyPublicationCardClick(${pubId}, '${statusKey}')" class="text-sm font-bold bg-[#1a2b4b] text-white border-2 border-slate-200 px-5 py-2.5 rounded-xl hover:bg-[#78C043] transition-all">

                                ${['revision', 'aprobada', 'approved'].includes(statusKey) ? 'Ver' : 'Gestionar'}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

    const htmlArray = await Promise.all(htmlPromises);

    container.innerHTML = htmlArray.join('');

}

async function handleMyPublicationCardClick(pubId, statusKey) {
    const numPubId = Number(pubId);
    
    // 1️⃣ PUBLICACIÓN RECHAZADA → Modal “Corrección Avanzada”
    if (statusKey === 'rechazado') {
        const pub = findPublicationById(numPubId);
        if (pub && isCurrentUserPublication(pub)) {
            openAdvancedCorrectionModal(numPubId);
            return;
        }
        window.location.href = `publicacion.html?id=${numPubId}`;
        return;
    }

    // 2️⃣ REVISIÓN o APROBADA → Modal de SOLO LECTURA (no editables)
    if (['revision', 'aprobada', 'approved'].includes(statusKey)) {
        const pub = findPublicationById(numPubId);
        if (pub && isCurrentUserPublication(pub)) {
            openReadOnlyPublicationModal(numPubId);
            return;
        }
        window.location.href = `publicacion.html?id=${numPubId}`;
        return;
    }

    try {
        const userId = currentUser.user_id || currentUser.id;
        const [buyerRes, sellerRes] = await Promise.all([
            fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/?buyer=${userId}`),
            fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/?seller=${userId}`)
        ]);
        const buyerData = buyerRes.ok ? await buyerRes.json() : [];
        const sellerData = sellerRes.ok ? await sellerRes.json() : [];
        const allReqs = [...buyerData, ...sellerData];

        const matchingReq = allReqs.find(r => Number(r.waste) === numPubId || Number(r.waste_id) === numPubId);
        if (matchingReq) {
            openRequestDetailsModal(matchingReq.request_id);
            return;
        }
    } catch(e) {
        console.warn('Error al consultar solicitudes asociadas:', e);
    }

    const pub = findPublicationById(numPubId);
    if (pub && isCurrentUserPublication(pub)) {
        openEditModal(numPubId);
    } else {
        window.location.href = `publicacion.html?id=${numPubId}`;
    }
}

function openEditModal(id) {

    const product = findPublicationById(id);

    if (product) {

        editingPublicationId = product.waste_id || product.id;

        

        const statusKey = getPublicationStatusKey(product);

        const isPendiente = statusKey === 'pendiente';

        const isRechazado = statusKey === 'rechazado';

        

        const saveBtn = document.querySelector('#edit-publication-modal button[onclick="saveEditPublication()"]');

        if (saveBtn) {

            if (isRechazado) {

                saveBtn.innerHTML = '<span>🚀</span> Guardar y Enviar a Revisión';

                saveBtn.className = 'px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-md bg-purple-600 hover:bg-purple-700 text-white';

            } else {

                saveBtn.innerHTML = '<span>💾</span> Guardar Cambios';

                saveBtn.className = 'px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-md bg-[#78C043] hover:bg-[#66a338] text-white';

            }

        }

        const titleInput = document.getElementById('edit-title');

        const priceInput = document.getElementById('edit-price');

        const descInput = document.getElementById('edit-description');

        const commentContainer = document.getElementById('edit-comment-container');

        const commentInput = document.getElementById('edit-comment');

        titleInput.value = product.title || '';

        priceInput.value = product.unit_price || product.price || '';

        document.getElementById('edit-qty').value = product.quantity || product.qty || '';

        

        if (document.getElementById('edit-weight')) {

            document.getElementById('edit-weight').value = product.weight_decimal || product.weightKg || '';

        }

        

        if (descInput) {

            descInput.value = product.technical_description || product.description || '';

        }

        

        if (commentInput) {

            commentInput.value = product.negotiation_comment || product.comment || '';

        }

        /* Se aplica bloqueo de campos estaticos si el estado se encuentra en pendiente. */

        if (isPendiente) {

            titleInput.disabled = true;

            titleInput.classList.add('opacity-60', 'cursor-not-allowed', 'bg-slate-100');

            

            priceInput.disabled = false;

            priceInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-slate-100');

            

            if (descInput) {

                descInput.disabled = true;

                descInput.classList.add('opacity-60', 'cursor-not-allowed', 'bg-slate-100');

            }

            if (commentContainer) {

                commentContainer.classList.remove('hidden');

            }

        } else {

            /* Se habilita la edicion completa para estados de revision. */

            titleInput.disabled = false;

            titleInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-slate-100');

            

            priceInput.disabled = false;

            priceInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-slate-100');

            

            if (descInput) {

                descInput.disabled = false;

                descInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-slate-100');

            }

            if (commentContainer) {

                commentContainer.classList.add('hidden');

            }

        }

        document.getElementById('edit-publication-modal').classList.remove('hidden');

    }

}

async function saveEditPublication() {

    if (editingPublicationId) {

        const product = findPublicationById(editingPublicationId);

        if (product) {

            const statusKey = getPublicationStatusKey(product);

            const isPendiente = statusKey === 'pendiente';

            const isRechazado = statusKey === 'rechazado';

            /* Se evalua la insercion de datos originales para proteger la integridad de las variables deshabilitadas en UI. */

            const updated = {

                ...product,

                title: isPendiente ? product.title : document.getElementById('edit-title').value,

                price: isPendiente ? (product.unit_price || product.price) : document.getElementById('edit-price').value,

                qty: document.getElementById('edit-qty').value,

                weight: document.getElementById('edit-weight')?.value || 0,

                description: isPendiente ? (product.technical_description || product.description) : (document.getElementById('edit-description')?.value || '')

            };

            if (isPendiente) {

                updated.negotiation_comment = document.getElementById('edit-comment')?.value || '';

            }

            // Si estaba rechazado y se está editando, enviarlo de nuevo a revisión (status 1)

            if (isRechazado) {

                updated.status = 1;

                updated.quality_validator = null; // Quitar al validador para que entre a "Sin Asignar" de Calidad

            }

            await saveEditedPublication(updated);

        }

    }

    closeEditModal();

}

async function saveEditedPublication(publication) {

    const pubId = publication.waste_id || publication.id;

    try {

        const payload = {

            title: publication.title,

            unit_price: parseFloat(publication.price) || 0,

            quantity: publication.qty,

            weight_decimal: parseFloat(publication.weight) || 0,

            technical_description: publication.description || ''

        };

        

        /* Se inyecta la propiedad de comentario de negociacion al cuerpo de la peticion HTTP si existe. */

        if (publication.negotiation_comment !== undefined) {

            payload.negotiation_comment = publication.negotiation_comment;

        }

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/wastes/${pubId}/`, {

            method: 'PATCH',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify(payload)

        });

        if (res.ok) {

            const updated = await res.json();

            const index = allPublications.findIndex(p => Number(p.waste_id) === Number(pubId) || Number(p.id) === Number(pubId));

            if (index !== -1) {

                allPublications[index] = { ...allPublications[index], ...updated };

            }

            showToast('Publicacion actualizada correctamente.');

            filterMyPublications(currentPublicationFilter);

        } else {

            alert('Error al guardar la publicacion.');

        }

    } catch(e) {

        console.error('Error al actualizar publicacion:', e);

        alert('Error de comunicacion con el servidor.');

    }

}

function closeEditModal() {

    document.getElementById('edit-publication-modal').classList.add('hidden');

    editingPublicationId = null;

}


// ========== MIS COMPRAS ==========

// ========== MIS COMPRAS Y GESTIÓN DE NEGOCIACIÓN/PAGOS ==========

async function fetchAndRenderMyPurchases() {

    const userId = currentUser.user_id || currentUser.id;

    if (!userId) {

        renderMyPurchasesUI();

        return;

    }

    try {

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/?buyer=${userId}`);

        const data = res.ok ? await res.json() : [];

        const buyerData = Array.isArray(data) ? data : (data.results || []);

        if (buyerData.length > 0) {

            myPurchases = buyerData.map(req => {

                const weight = parseFloat(req.requested_weight || 0);

                const price  = parseFloat(req.offered_price  || 0);

                const totalCalculated = req.total_amount || ((weight > 0 && price > 0) ? (weight * price) : price);

                const statusStr = (req.status_name || 'Pendiente').toLowerCase().trim();

                

                let statusKey = 'pendiente';

                if (['completado', 'completada', '6'].includes(statusStr)) statusKey = 'completado';

                else if (['proceso', 'en proceso', '5'].includes(statusStr)) statusKey = 'proceso';

                else if (['pendiente', '4'].includes(statusStr)) statusKey = 'pendiente';

                return {

                    id: req.request_id,

                    request_id: req.request_id,

                    productName: req.product_name || 'Residuo Industrial',

                    date: req.date || '-',

                    total: totalCalculated,

                    totalFormatted: req.total_formatted || `$ ${totalCalculated.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,

                    platformFeeFormatted: req.platform_fee_formatted || `$ ${(totalCalculated * 0.025).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,

                    sellerPayoutFormatted: req.seller_payout_formatted || `$ ${(totalCalculated * 0.975).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,

                    status: statusKey,

                    statusName: req.status_name || 'Pendiente',

                    seller: req.seller_name || 'Vendedor Verificado',

                    buyer: req.buyer_name || 'Usted',

                    quantity: req.quantity || 'N/A',

                    weight: req.requested_weight || 0,

                    price: req.offered_price || 0,

                    qualityValidatorName: req.quality_validator_name || 'Equipo Calidad EcoBoros',

                    sellerPaymentConfirmed: !!req.seller_payment_confirmed,

                    platformFeeConfirmed: !!req.platform_fee_confirmed,

                    raw: req

                };

            });

        } else {

            myPurchases = [];

        }

    } catch (err) {

        console.warn('Error al cargar compras del usuario:', err);

        myPurchases = [];

    }

    renderMyPurchasesUI();

}

function renderMyPurchasesUI() {

    const tbody = document.getElementById('purchases-table-body');

    const noPurchases = document.getElementById('no-purchases');

    const totalSpentEl = document.getElementById('total-spent');

    const totalPurchasesEl = document.getElementById('total-purchases-count');

    const pendingPurchasesEl = document.getElementById('pending-purchases-count');

    if (!tbody) return;

    if (myPurchases.length === 0) {

        tbody.innerHTML = '';

        if (noPurchases) noPurchases.classList.remove('hidden');

        if (totalSpentEl) totalSpentEl.textContent = '$ 0.00';

        if (totalPurchasesEl) totalPurchasesEl.textContent = '0';

        if (pendingPurchasesEl) pendingPurchasesEl.textContent = '0';

        return;

    }

    if (noPurchases) noPurchases.classList.add('hidden');

    const totalSpent = myPurchases.reduce((sum, p) => sum + p.total, 0);

    const completedCount = myPurchases.filter(p => p.status === 'completado').length;

    const pendingCount = myPurchases.filter(p => p.status !== 'completado').length;

    if (totalSpentEl) totalSpentEl.textContent = `$ ${totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (totalPurchasesEl) totalPurchasesEl.textContent = completedCount;

    if (pendingPurchasesEl) pendingPurchasesEl.textContent = pendingCount;

    tbody.innerHTML = myPurchases.map(p => {

        let badgeClass = 'bg-yellow-100 text-yellow-800';

        if (p.status === 'completado') badgeClass = 'bg-green-100 text-green-800';

        else if (p.status === 'proceso') badgeClass = 'bg-blue-100 text-blue-800';

        return `

            <tr class="hover:bg-slate-50 transition-colors">

                <td class="px-6 py-4">

                    <p class="font-semibold text-slate-800">${p.productName}</p>

                    <p class="text-xs text-slate-400">Cant: ${p.quantity}</p>

                </td>

                <td class="px-6 py-4 text-sm text-slate-600">${p.date}</td>

                <td class="px-6 py-4">

                    <span class="font-bold text-[#1a2b4b]">${p.totalFormatted}</span>

                </td>

                <td class="px-6 py-4">

                    <span class="px-3 py-1 rounded-full text-xs font-bold ${badgeClass}">

                        ${p.statusName}

                    </span>

                </td>

                <td class="px-6 py-4 text-sm text-slate-500">${p.seller}</td>

                <td class="px-6 py-4 text-right">

                    <button onclick="openRequestDetailsModal(${p.id})" class="bg-[#1a2b4b] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#2d4563] transition-colors flex items-center gap-1.5 shadow-sm">

                        Ver <span class="hidden sm:inline">Detalles</span>

                    </button>

                </td>

            </tr>

        `;

    }).join('');

}

async function openRequestDetailsModal(requestId) {

    let req = myPurchases.find(p => p.id === requestId);

    

    // Intentar obtener los datos frescos directamente de la API

    try {

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/${requestId}/`);

        if (res.ok) {

            const apiReq = await res.json();

            const weight = parseFloat(apiReq.requested_weight || 0);

            const price = parseFloat(apiReq.offered_price || 0);

            const totalCalculated = apiReq.total_amount || ((weight > 0 && price > 0) ? (weight * price) : price);

            const statusStr = (apiReq.status_name || 'Pendiente').toLowerCase().trim();

            

            let statusKey = 'pendiente';

            if (['completado', 'completada', '6'].includes(statusStr)) statusKey = 'completado';

            else if (['proceso', 'en proceso', '5'].includes(statusStr)) statusKey = 'proceso';

            else if (['pendiente', '4'].includes(statusStr)) statusKey = 'pendiente';

            req = {

                id: apiReq.request_id,

                request_id: apiReq.request_id,

                productName: apiReq.product_name || 'Residuo Industrial',

                date: apiReq.date || '-',

                total: totalCalculated,

                totalFormatted: apiReq.total_formatted || `$ ${totalCalculated.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,

                platformFeeFormatted: apiReq.platform_fee_formatted || `$ ${(totalCalculated * 0.025).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,

                sellerPayoutFormatted: apiReq.seller_payout_formatted || `$ ${(totalCalculated * 0.975).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,

                status: statusKey,

                statusName: apiReq.status_name || 'Pendiente',

                seller: apiReq.seller_name || 'Vendedor Verificado',

                buyer: apiReq.buyer_name || 'Comprador Verificado',

                quantity: apiReq.quantity || 'N/A',

                weight: apiReq.requested_weight || 0,

                price: apiReq.offered_price || 0,

                qualityValidatorName: apiReq.quality_validator_name || 'Equipo Calidad EcoBoros',

                sellerPaymentConfirmed: !!apiReq.seller_payment_confirmed,

                platformFeeConfirmed: !!apiReq.platform_fee_confirmed,

                raw: apiReq

            };

        }

    } catch(e) {

        console.warn("Usando cache local para modal:", e);

    }

    if (!req) return;

    const originalPub = req.raw?.waste ? findPublicationById(req.raw.waste) : null;

    const userId = Number(currentUser.user_id || currentUser.id);

    const isSeller = (req.raw?.publisher && Number(req.raw.publisher) === userId) ||

                     (originalPub && isCurrentUserPublication(originalPub)) ||

                     (req.raw?.seller_id && Number(req.raw.seller_id) === userId);

    document.getElementById('modal-req-id').textContent = `#${req.id}`;

    const modalBody = document.getElementById('request-modal-body');

    const isCompleted = req.status === 'completado';

    const isProceso = req.status === 'proceso';

    const isPendiente = ['pendiente', 'pending'].includes(req.status);

    const canEdit = isPendiente && isSeller;

    let html = `

        <div class="border-b border-slate-100 pb-4">

            <div class="flex justify-between items-start">

                <div>

                    <h3 class="text-xl font-bold text-[#1a2b4b]">${req.productName}</h3>

                    <p class="text-xs text-slate-500 mt-0.5">Vendedor: <strong>${req.seller}</strong> | Comprador: <strong>${req.buyer || 'Usted'}</strong></p>

                    ${!isSeller ? `<p class="text-xs text-[#78C043] font-bold mt-1">📞 Teléfono del Vendedor: ${req.raw?.publisher_phone || req.raw?.seller_phone || 'Consultar con Vendedor / Admin'}</p>` : ''}

                </div>

                <span class="px-3 py-1.5 rounded-full text-xs font-bold ${

                    isCompleted ? 'bg-green-100 text-green-800 border border-green-200' : 

                    (isProceso ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200')

                }">

                    ${isCompleted ? '🔒 COMPLETADO' : (isProceso ? '🔄 EN PROCESO' : '⏳ PENDIENTE')}

                </span>

            </div>

        </div>

    `;

    if (isCompleted) {

        html += `

            <div class="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-900 text-sm">

                <div class="flex items-center gap-2 font-bold text-green-800 mb-1">

                    <span>🔒</span> Transacción Finalizada y Completada

                </div>

                <p class="text-xs text-green-700">Esta publicación/compra ha sido confirmada por ambas partes y por el software intermediario. <strong>No se permiten modificaciones.</strong></p>

            </div>

        `;

    } else if (isProceso) {

        html += `

            <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-900 text-sm">

                <div class="flex items-center gap-2 font-bold text-blue-800 mb-1">

                    <span>✅</span> Validado por Calidad (${req.qualityValidatorName})

                </div>

                <p class="text-xs text-blue-700">El usuario de calidad ha verificado el acuerdo y la cantidad real vendida. Procede con la confirmación de pagos simulados.</p>

            </div>

        `;

    } else if (isPendiente && !isSeller) {

        html += `

            <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-900 text-sm">

                <div class="flex items-center gap-2 font-bold text-blue-800 mb-1">

                    <span>🔒</span> Modo Lectura (Empresa Compradora)

                </div>

                <p class="text-xs text-blue-700">Estás consultando esta solicitud desde <strong>Mis Compras</strong>. Si acordaron ajustes por llamada, la <strong>Empresa Vendedora</strong> registrará los cambios de precio/peso y la justificación explicativa en su panel de <em>Mis Publicaciones</em> antes de la auditoría de Calidad.</p>

            </div>

        `;

    } else {

        html += `

            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-sm">

                <div class="flex items-center gap-2 font-bold text-amber-800 mb-1">

                    <span>⏳</span> En Acuerdo Externo y Pendiente de Calidad (Empresa Vendedora)

                </div>

                <p class="text-xs text-amber-700">Como propietario de la publicación, puedes editar los campos variables (cantidad, peso, precio) y registrar el comentario explicativo del acuerdo antes de que Calidad valide la solicitud.</p>

            </div>

        `;

    }

    if (req.raw?.negotiation_comment) {

        html += `

            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs">

                <div class="flex items-center gap-2 font-bold text-amber-800 mb-1">

                    <span>💬</span> Comentario / Acuerdos Registrados en la Negociación:

                </div>

                <p class="italic text-amber-800 font-medium">${req.raw.negotiation_comment}</p>

            </div>

        `;

    }

    // Campos variables (Editables solo si es Pendiente Y es la Empresa Vendedora)

    html += `

        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">

            <h4 class="font-bold text-[#1a2b4b] text-sm flex items-center gap-2">

                <span>📝</span> Campos Variables de la Compra ${canEdit ? '' : '(🔒 Solo Lectura)'}

            </h4>

            

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>

                    <label class="block text-xs font-bold text-slate-500 mb-1">Cantidad / Lote</label>

                    <input type="text" id="modal-field-qty" value="${req.quantity}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:bg-slate-100 disabled:text-slate-500">

                    ${originalPub && originalPub.quantity ? `<span class="text-xs text-slate-400 mt-1 block">Original: ${originalPub.quantity}</span>` : ''}

                </div>

                <div>

                    <label class="block text-xs font-bold text-slate-500 mb-1">Peso Total (KG)</label>

                    <input type="number" id="modal-field-weight" value="${req.weight}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:bg-slate-100 disabled:text-slate-500">

                    ${originalPub && originalPub.weight_decimal ? `<span class="text-xs text-slate-400 mt-1 block">Original: ${parseFloat(originalPub.weight_decimal).toLocaleString()} kg</span>` : ''}

                </div>

                <div>

                    <label class="block text-xs font-bold text-slate-500 mb-1">Precio Unitario ($)</label>

                    <input type="number" step="0.01" id="modal-field-price" value="${req.price}" ${!canEdit ? 'disabled' : ''} class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:bg-slate-100 disabled:text-slate-500">

                    ${originalPub && originalPub.unit_price ? `<span class="text-xs text-slate-400 mt-1 block">Original: $${parseFloat(originalPub.unit_price).toFixed(2)}</span>` : ''}

                </div>

            </div>

            <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">

                <label class="block text-xs font-bold text-amber-900 flex items-center gap-1.5">

                    <span>💬 Explicación de los Acuerdos Fuera de Plataforma (Para Auditoría de Calidad)</span>

                </label>

                <p class="text-[11px] text-amber-800">

                    Detalla la negociación acordada (ej: contra-oferta de precio, peso ajustado o motivos) para que el Inspector de Calidad pueda auditarlo y autorizar el paso a En Proceso.

                </p>

                <textarea id="modal-field-comment" rows="3" ${!canEdit ? 'disabled' : ''} placeholder="Ej: Se acordó por llamada vender únicamente 25k kg en vez de las 50k kg iniciales para mantener inventario en planta." class="w-full mt-1 p-3 bg-white border border-amber-300 rounded-xl text-xs font-medium outline-none focus:border-[#78C043] focus:ring-2 focus:ring-[#78C043]/20 disabled:bg-slate-100 disabled:text-slate-500 text-slate-800 shadow-sm">${req.raw?.negotiation_comment || ''}</textarea>

            </div>

            ${canEdit ? `

                <button onclick="saveRequestVariables(${req.id})" class="w-full bg-[#1a2b4b] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#2d4563] transition-colors">

                    💾 Guardar Ajustes de Negociación (Mantiene en Pendiente)

                </button>

            ` : ''}

        </div>

    `;

    // Desglose de Ganancias y Comisión 2.5% (Visible en Proceso y Completado)

    if (isProceso || isCompleted) {

        html += `

            <div class="bg-gradient-to-br from-[#1a2b4b] to-[#2d4563] text-white rounded-2xl p-5 shadow-lg space-y-3">

                <h4 class="font-bold text-[#78C043] text-sm uppercase tracking-wider flex items-center gap-2">

                    <span>📊</span> Desglose de Operación y Ganancias

                </h4>

                

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">

                    <div class="bg-white/10 p-3 rounded-xl">

                        <span class="text-[11px] opacity-75 block">Total de la Compra</span>

                        <span class="text-xl font-black">${req.totalFormatted}</span>

                    </div>

                    <div class="bg-white/10 p-3 rounded-xl">

                        <span class="text-[11px] opacity-75 block">Comisión Intermediario (2.5%)</span>

                        <span class="text-xl font-black text-[#78C043]">${req.platformFeeFormatted}</span>

                        <span class="text-[9px] opacity-70 block mt-0.5">(Para mantenimiento y calidad)</span>

                    </div>

                    <div class="bg-white/10 p-3 rounded-xl">

                        <span class="text-[11px] opacity-75 block">Ganancia Neta Vendedor (97.5%)</span>

                        <span class="text-xl font-black text-white">${req.sellerPayoutFormatted}</span>

                    </div>

                </div>

            </div>

        `;

    }

    // Confirmaciones de Pago Simulado (Visible en Proceso)

    if (isProceso) {

        html += `

            <div class="border border-slate-200 rounded-2xl p-5 space-y-4">

                <h4 class="font-bold text-[#1a2b4b] text-sm flex items-center gap-2">

                    <span>💳</span> Confirmación de Pagos (Simulación de Proyecto)

                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">

                        <div>

                            <span class="text-xs font-bold text-slate-700 block">Pago Vendedor (97.5%)</span>

                            <span class="text-xs ${req.sellerPaymentConfirmed ? 'text-green-600 font-bold' : 'text-slate-400'}">

                                ${req.sellerPaymentConfirmed ? '✅ Reflejado' : '⏳ Pendiente'}

                            </span>

                        </div>

                        <button onclick="toggleSimulatedPayment(${req.id}, 'seller')" class="text-xs font-bold ${req.sellerPaymentConfirmed ? 'bg-slate-200 text-slate-600' : 'bg-green-600 text-white'} px-3 py-1.5 rounded-lg hover:opacity-90 transition-all">

                            ${req.sellerPaymentConfirmed ? 'Desmarcar' : 'Confirmar Pago'}

                        </button>

                    </div>

                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">

                        <div>

                            <span class="text-xs font-bold text-slate-700 block">Comisión Software (2.5%)</span>

                            <span class="text-xs ${req.platformFeeConfirmed ? 'text-green-600 font-bold' : 'text-slate-400'}">

                                ${req.platformFeeConfirmed ? '✅ Reflejado' : '⏳ Pendiente'}

                            </span>

                        </div>

                        <button onclick="toggleSimulatedPayment(${req.id}, 'platform')" class="text-xs font-bold ${req.platformFeeConfirmed ? 'bg-slate-200 text-slate-600' : 'bg-green-600 text-white'} px-3 py-1.5 rounded-lg hover:opacity-90 transition-all">

                            ${req.platformFeeConfirmed ? 'Desmarcar' : 'Confirmar Cobro'}

                        </button>

                    </div>

                </div>

                <div class="pt-2">

                    <button onclick="transitionToCompleted(${req.id})" class="w-full bg-[#78C043] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#66a338] transition-all flex items-center justify-center gap-2 text-sm">

                        <span>✅</span> Confirmar Pagos y Pasar a COMPLETADO

                    </button>

                </div>

            </div>

        `;

    }

    modalBody.innerHTML = html;

    document.getElementById('request-details-modal').classList.remove('hidden');

}

function closeRequestDetailsModal() {

    document.getElementById('request-details-modal').classList.add('hidden');

}

async function saveRequestVariables(requestId) {

    const qty = document.getElementById('modal-field-qty').value;

    const weight = parseFloat(document.getElementById('modal-field-weight').value) || 0;

    const price = parseFloat(document.getElementById('modal-field-price').value) || 0;

    const comment = document.getElementById('modal-field-comment')?.value.trim() || '';

    try {

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/${requestId}/`, {

            method: 'PATCH',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({

                quantity: qty,

                requested_weight: weight,

                offered_price: price,

                negotiation_comment: comment

            })

        });

        if (!res.ok) {

            const errData = await res.json();

            throw new Error(errData.status || errData.detail || 'Error al guardar');

        }

        alert('✅ Ajustes de negociación y comentario guardados. Permanece en estatus Pendiente hasta la auditoría de Calidad.');

        await fetchAndRenderMyPurchases();

        openRequestDetailsModal(requestId);

    } catch(err) {

        alert('Error al guardar: ' + err.message);

    }

}

async function toggleSimulatedPayment(requestId, paymentType) {

    const req = myPurchases.find(p => p.id === requestId);

    if (!req) return;

    const payload = {};

    if (paymentType === 'seller') {

        payload.seller_payment_confirmed = !req.sellerPaymentConfirmed;

    } else if (paymentType === 'platform') {

        payload.platform_fee_confirmed = !req.platformFeeConfirmed;

    }

    try {

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/${requestId}/`, {

            method: 'PATCH',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify(payload)

        });

        if (!res.ok) {

            const errData = await res.json();

            throw new Error(errData.status || errData.detail || 'Error al actualizar pago');

        }

        await fetchAndRenderMyPurchases();

        openRequestDetailsModal(requestId);

    } catch(err) {

        alert('Error al actualizar pago simulado: ' + err.message);

    }

}

async function transitionToCompleted(requestId) {

    if (!confirm('¿Deseas confirmar los pagos y pasar esta compra a estatus COMPLETADO? Una vez completada, NO se podrán realizar más cambios.')) {

        return;

    }

    try {

        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/${requestId}/`, {

            method: 'PATCH',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({

                status: 6, // Completado

                seller_payment_confirmed: true,

                platform_fee_confirmed: true

            })

        });

        if (!res.ok) {

            const errData = await res.json();

            throw new Error(errData.status || errData.detail || 'Error al finalizar');

        }

        alert('🎉 Transacción finalizada. Estatus actualizado a COMPLETADO. La compra ha quedado registrada sin posibilidad de cambios.');

        await fetchAndRenderMyPurchases();

        openRequestDetailsModal(requestId);

    } catch(err) {

        alert('Error al completar la transacción: ' + err.message);

    }

}

function renderMyPurchases() {

    fetchAndRenderMyPurchases();

}

// ========== FUNCIONES GENERALES ==========

function loadUserData() {

    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');

    const nameDisplay = document.getElementById('user-name-display');

    const roleDisplay = document.getElementById('user-role-display');

    const userAvatar = document.getElementById('user-avatar');

    if (storedUser) {

        try {

            const user = JSON.parse(storedUser);

            // Actualizar currentUser con datos reales del backend

            currentUser.name = user.name || user.company_name || currentUser.name;

            currentUser.user_id = user.user_id || user.id || 1;

            currentUser.id = currentUser.user_id; // compatibilidad

            currentUser.role = user.role || 'empresa';

            if (nameDisplay) nameDisplay.textContent = currentUser.name;

            if (roleDisplay) roleDisplay.textContent = user.description || 'Empresa Verificada';

            if (userAvatar) {

                const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

                userAvatar.textContent = initials;

            }

        } catch (e) { console.error('Error parsing user data:', e); }

    } else {

        // Redirigir al login si no hay sesión

        window.location.href = '../../Components/login/login.html';

    }

}

function logout() {

    localStorage.removeItem('ecoboros_user');

    sessionStorage.removeItem('ecoboros_user');

    window.location.href = '../../Components/login/login.html';

}

function toggleCompanyDropdown() {

    const dropdown = document.getElementById('company-dropdown');

    dropdown.classList.toggle('hidden');

}

document.addEventListener('click', function (e) {

    const dropdown = document.getElementById('company-dropdown');

    const avatar = document.getElementById('user-avatar');

    if (dropdown && !dropdown.classList.contains('hidden') && avatar && !avatar.contains(e.target) && !dropdown.contains(e.target)) {

        dropdown.classList.add('hidden');

    }

});

function showToast(message) {

    const toast = document.createElement('div');

    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a2b4b] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium z-50 animate-card';

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);

}

// ========== FILTROS DE INICIO ==========

function renderModalCategoryButtons() {

    const container = document.getElementById("modal-category-buttons");

    const categories = ["Todos", "Metales", "Plásticos", "Cartón", "Maderas", "Electrónicos", "Papel"];

    container.innerHTML = categories.map(cat => {

        const isActive = activeCategory === cat;

        let btnClass = isActive ? `bg-[#1a2b4b] text-white shadow-md ring-2 ring-offset-2 ring-[#1a2b4b]` : `bg-slate-100 text-slate-600 hover:bg-slate-200`;

        return `<button onclick="setCategory('${cat}')" class="px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${btnClass}">${cat}</button>`;

    }).join("");

}

function setCategory(cat) {

    activeCategory = cat;

    renderModalCategoryButtons();

    applyFilters(false);

}

let currentHomeCatalogPage = 1;

const homeCatalogItemsPerPage = 6;

function changeHomePage(newPage) {

    currentHomeCatalogPage = newPage;

    applyFilters(false);

    const section = document.getElementById('products-section');

    if (section) section.scrollIntoView({ behavior: 'smooth' });

}

function applyFiltersAndClose() {

    applyFilters();

    toggleFilters();

}

function applyFilters(updateBadges = true) {

    if (updateBadges) currentHomeCatalogPage = 1;

    const searchText = document.getElementById("searchInput").value.toLowerCase();

    const minWeight = parseFloat(document.getElementById("weightInput").value) || 0;

    const startDate = document.getElementById("dateStartInput").value;

    const endDate = document.getElementById("dateEndInput").value;

    const filtered = allPublications.filter(item => {

        const itemCategory = item.category_name_display || item.category_name || '';

        const matchCat = activeCategory === "Todos" || itemCategory === activeCategory;

        const matchText = item.title.toLowerCase().includes(searchText) || (item.location && item.location.toLowerCase().includes(searchText));

        const matchWeight = parseFloat(item.weight_decimal) >= minWeight;

        let matchDate = true;

        if (startDate) matchDate = matchDate && (item.generation_date >= startDate);

        if (endDate) matchDate = matchDate && (item.generation_date <= endDate);

        return matchCat && matchText && matchWeight && matchDate;

    });

    renderProducts(filtered);

    if (updateBadges) renderBadges(minWeight, startDate, endDate);

}

function renderProducts(data) {

    const grid = document.getElementById("products-grid");

    const modalCountLabel = document.getElementById("modalResultCount");

    const noResults = document.getElementById("no-results");

    const paginationContainer = document.getElementById("home-pagination-container");

    // Filtrar publicaciones aprobadas para el catálogo público de inicio (status 2 = Aprobado, o aprobada)

    const approvedData = data.filter(item => {

        const s = String(item.status_name || item.status || '').toLowerCase().trim();

        return ['aprobado', 'aprobada', 'approved', '2'].includes(s);

    });

    const displayData = approvedData.length > 0 ? approvedData : data;

    if (modalCountLabel) modalCountLabel.innerText = displayData.length;

    if (displayData.length === 0) {

        grid.innerHTML = "";

        if (noResults) {

            noResults.classList.remove("hidden");

            noResults.classList.add("flex");

        }

        if (paginationContainer) paginationContainer.innerHTML = "";

        return;

    }

    if (noResults) {

        noResults.classList.add("hidden");

        noResults.classList.remove("flex");

    }

    // Calcular Paginación (6 por página)

    const totalPages = Math.ceil(displayData.length / homeCatalogItemsPerPage);

    if (currentHomeCatalogPage > totalPages) currentHomeCatalogPage = totalPages;

    if (currentHomeCatalogPage < 1) currentHomeCatalogPage = 1;

    const startIndex = (currentHomeCatalogPage - 1) * homeCatalogItemsPerPage;

    const paginatedData = displayData.slice(startIndex, startIndex + homeCatalogItemsPerPage);

    grid.innerHTML = paginatedData.map((item, index) => {

        const categoryName = item.category_name_display || item.category_name || 'Varios';

        const style = categoryStyles[categoryName] || { color: 'bg-gray-500', icon: '❓', hoverGlow: 'hover:border-gray-500 hover:shadow-gray-500/30', btnHover: 'group-hover:bg-gray-500 group-hover:border-gray-500 group-hover:text-white' };

        const delay = index * 30;

        let imageHtml;

        if (item.first_image_url) {

            imageHtml = `<img src="${item.first_image_url}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-7xl group-hover\:scale-110 transition-transform duration-500 opacity-90\'>${style.icon}</span>';">`;

        } else {

            imageHtml = `<span class="text-7xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 opacity-90">${style.icon}</span>`;

        }

        const location = item.location || 'N/A';

        const price = item.unit_price ? `$ ${parseFloat(item.unit_price).toFixed(2)} / kg` : 'A consultar';

        const quantity = item.quantity || 'N/A';

        const pubId = item.waste_id || item.id;

        return `

            <div onclick="window.location.href='publicacion.html?id=${pubId}'" class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer animate-card ${style.hoverGlow} product-card relative" style="animation-delay: ${delay}ms">

                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden" style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;">

                    ${imageHtml}

                    <div class="absolute top-4 left-4 ${style.color} text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider z-10">

                        ${categoryName}

                    </div>

                </div>

                <div class="p-6 flex flex-col gap-2 flex-1">

                    <div class="flex justify-between items-start gap-2">

                        <h3 class="font-bold text-[#1a2b4b] text-xl leading-tight line-clamp-2">${item.title}</h3>

                    </div>

                    <p class="text-sm text-slate-400 flex items-center gap-1.5 font-medium mt-1">

                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>

                        ${location}

                    </p>

                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">

                        <div class="flex justify-between items-center">

                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Disp: ${quantity}</span>

                            <span class="text-xs text-slate-400 font-medium">📅 ${item.generation_date}</span>

                        </div>

                        <div class="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:justify-between">

                            <span class="text-2xl font-black text-[#1a2b4b]">${price}</span>

                            <div class="flex flex-wrap gap-3">

                                <button onclick="event.stopPropagation(); window.location.href='publicacion.html?id=${pubId}'" class="text-sm font-bold bg-[#1a2b4b] text-white px-5 py-2.5 rounded-xl transition-colors hover:bg-[#78C043]">Ver Más</button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }).join('');

    // Controles de Paginación UI

    if (paginationContainer) {

        if (totalPages <= 1) {

            paginationContainer.innerHTML = '';

        } else {

            let pagesHtml = '';

            for (let i = 1; i <= totalPages; i++) {

                const isActive = i === currentHomeCatalogPage;

                pagesHtml += `

                    <button onclick="changeHomePage(${i})" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#1a2b4b] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">

                        ${i}

                    </button>

                `;

            }

            paginationContainer.innerHTML = `

                <button onclick="changeHomePage(${currentHomeCatalogPage - 1})" ${currentHomeCatalogPage === 1 ? 'disabled' : ''} class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">

                    ← Anterior

                </button>

                <div class="flex items-center gap-1.5">

                    ${pagesHtml}

                </div>

                <button onclick="changeHomePage(${currentHomeCatalogPage + 1})" ${currentHomeCatalogPage === totalPages ? 'disabled' : ''} class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">

                    Siguiente →

                </button>

            `;

        }

    }

    if (matrizMode) activateMatrizLabels();

}

function renderBadges(weight, start, end) {

    const container = document.getElementById("active-filters-badges");

    let html = "";

    if (activeCategory !== "Todos") html += `<span class="bg-[#1a2b4b] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Cat: ${activeCategory}</span>`;

    if (weight > 0) html += `<span class="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Min: ${weight}kg</span>`;

    if (start || end) html += `<span class="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">📅 ${start || '...'} / ${end || '...'}</span>`;

    container.innerHTML = html;

}

function resetFilters() {

    document.getElementById("weightInput").value = "";

    document.getElementById("dateStartInput").value = "";

    document.getElementById("dateEndInput").value = "";

    document.getElementById("searchInput").value = "";

    setCategory("Todos");

    applyFilters();

}

// ========== MODO MATRIZ ==========

function toggleMatrizMode() {

    matrizMode = !matrizMode;

    if (matrizMode) activateMatrizLabels();

    else deactivateMatrizLabels();

    updateMatrizBubble();

}

function updateMatrizBubble() {

    const title = document.getElementById('matriz-bubble-title');

    const text = document.getElementById('matriz-bubble-text');

    const btn = document.getElementById('matriz-toggle-btn');

    if (matrizMode) {

        title.textContent = 'Modo Matriz Activo';

        text.innerHTML = 'Presiona <span class="font-mono">Q + A</span> para desactivar';

        btn.textContent = 'Desactivar';

    } else {

        title.textContent = 'Modo Matriz Desactivado';

        text.innerHTML = 'Presiona <span class="font-mono">Q + A</span> para activar';

        btn.textContent = 'Activar';

    }

}

function activateMatrizLabels() {

    deactivateMatrizLabels();

    const searchContainer = document.querySelector('.search-container');

    if (searchContainer) addKeyLabelInside(searchContainer, 'Alt + B');

    const btnFilter = document.getElementById('btnFilter');

    if (btnFilter) addKeyLabelInside(btnFilter, 'Alt + F');

    const btnReset = document.getElementById('btnResetModal');

    if (btnReset && btnReset.offsetParent !== null) addKeyLabelInside(btnReset, 'Alt + L');

    const navHome = document.getElementById('nav-home');

    if (navHome) addKeyLabelInside(navHome, 'Alt + H');

    const navPublications = document.getElementById('nav-publications');

    if (navPublications) addKeyLabelInside(navPublications, 'Alt + P');

    const navPurchases = document.getElementById('nav-purchases');

    if (navPurchases) addKeyLabelInside(navPurchases, 'Alt + C');

    const uploadLink = document.querySelector('a[href="registro.html"]');

    if (uploadLink) addKeyLabelInside(uploadLink, 'Alt + U');

    const logoutButton = document.querySelector('button[onclick="logout()"]');

    if (logoutButton) addKeyLabelInside(logoutButton, 'Alt + S');

    updateProductCardLabels();

}

function updateProductCardLabels() {

    document.querySelectorAll('.product-card .keyboard-label').forEach(label => label.remove());

    const visibleCards = getVisibleProductCards();

    visibleCards.forEach((card, index) => addKeyLabelInside(card, `Alt + ${index + 1}`));

    positionMatrizLabels();

}

function getVisibleProductCards() {

    const cards = Array.from(document.querySelectorAll('.product-card'));

    const centerY = window.innerHeight / 2;

    const scored = cards.map(card => {

        const rect = card.getBoundingClientRect();

        const midpoint = rect.top + rect.height / 2;

        const visibility = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));

        return {

            card,

            score: Math.abs(midpoint - centerY) - visibility / 10,

            visible: rect.bottom > 0 && rect.top < window.innerHeight

        };

    });

    const visible = scored.filter(item => item.visible).sort((a, b) => a.score - b.score).map(item => item.card);

    if (visible.length >= 3) return visible.slice(0, 3);

    if (visible.length > 0) return visible;

    return cards.slice(0, 3);

}

function positionMatrizLabels() {

    document.querySelectorAll('.product-card').forEach(card => {

        const label = card.querySelector('.keyboard-label');

        if (!label) return;

        const rect = card.getBoundingClientRect();

        if (rect.top + rect.height / 2 > window.innerHeight / 2) {

            label.style.top = '';

            label.style.bottom = '-12px';

        } else {

            label.style.bottom = '';

            label.style.top = '-12px';

        }

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

window.addEventListener('scroll', () => {

    if (matrizMode) updateProductCardLabels();

});

window.addEventListener('resize', () => {

    if (matrizMode) updateProductCardLabels();

});

function toggleCommands() { document.getElementById('commands-modal').classList.toggle('hidden'); }

function toggleFilters() {

    const modal = document.getElementById('filters-modal');

    if (!modal) return;

    const isHidden = modal.classList.toggle('hidden');

    if (isHidden) document.body.classList.remove('overflow-hidden');

    else {

        document.body.classList.add('overflow-hidden');

        applyFilters(false);

    }

}

function closeFiltersOnBackground(event) { if (event.target && event.target.id === 'filters-modal') toggleFilters(); }

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {

    const key = e.key.toLowerCase();

    const now = Date.now();

    if (now - lastKeyTime > 500) keySequence = [];

    lastKeyTime = now;

    keySequence.push(key);

    if (e.shiftKey && key === '?') {

        e.preventDefault();

        toggleCommands();

        return;

    }

    if (keySequence.length >= 2 && keySequence.slice(-2).join('') === 'qa') {

        if (document.activeElement.tagName !== 'INPUT') e.preventDefault();

        toggleMatrizMode();

        keySequence = [];

        return;

    }

    if (e.key === 'Escape') {

        const commandsModal = document.getElementById('commands-modal');

        const filtersModal = document.getElementById('filters-modal');

        let handled = false;

        if (commandsModal && !commandsModal.classList.contains('hidden')) {

            commandsModal.classList.add('hidden');

            handled = true;

        }

        if (filtersModal && !filtersModal.classList.contains('hidden')) {

            toggleFilters();

            handled = true;

        }

        if (handled) {

            e.preventDefault();

            return;

        }

    }

    if (e.altKey) {

        if (key === 'h') { e.preventDefault(); showHomePage(); return; }

        if (key === 'p') { e.preventDefault(); showMyPublicationsPage(); return; }

        if (key === 'c') { e.preventDefault(); showMyPurchasesPage(); return; }

        if (key === 'u') { e.preventDefault(); window.location.href = 'registro.html'; return; }

        if (key === 's') { e.preventDefault(); logout(); return; }

        if (key === 'b') { e.preventDefault(); document.getElementById('searchInput').focus(); return; }

        if (key === 'f') { e.preventDefault(); toggleFilters(); return; }

        if (key === 'l') { e.preventDefault(); resetFilters(); return; }

        if (['1', '2', '3'].includes(key)) {

            const cards = getVisibleProductCards();

            const index = parseInt(key) - 1;

            if (cards[index]) {

                e.preventDefault();

                cards[index].click();

            }

        }

    }

});

// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", () => {

    loadUserData();

    renderModalCategoryButtons();

    fetchAndRenderPublications(); // Fetch data from API on page load
    
    fetchAndRenderMyPurchases(); // Fetch purchases on page load

    const btnMatriz = document.getElementById('matriz-toggle-btn');

    if (btnMatriz) btnMatriz.addEventListener('click', toggleMatrizMode);

    updateMatrizBubble();

});
// ========== MODAL CORRECCIN AVANZADA (RECHAZOS) ==========
async function openAdvancedCorrectionModal(id) {
    const product = findPublicationById(id);
    if (!product) return;
    
    document.getElementById("ac-waste-id").value = product.waste_id || product.id;
    document.getElementById("ac-title").value = product.title || "";
    
    // Convertir category_name a algo que empate el select si es necesario, pero usualmente ya empata
    let cat = (product.category_name || "Metales").replace("es", "").replace("os", "o");
    if (product.category_name === "Papeles") cat = "Papel";
    if (product.category_name === "Cartones") cat = "Cartn";
    
    const selectCat = document.getElementById("ac-category");
    for (let i = 0; i < selectCat.options.length; i++) {
        if (selectCat.options[i].text.includes(cat) || selectCat.options[i].value === product.category_name || selectCat.options[i].value === cat) {
            selectCat.selectedIndex = i;
            break;
        }
    }
    
    document.getElementById("ac-price").value = product.unit_price || product.price || "";
    document.getElementById("ac-weight").value = product.weight_decimal || product.weightKg || "";
    document.getElementById("ac-qty").value = product.quantity || product.qty || "";
    document.getElementById("ac-description").value = product.technical_description || product.description || "";
    document.getElementById("ac-files").value = ""; // Limpiar inputs de archivos
    
    document.getElementById("advanced-correction-modal").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    
    // Obtener la razn del rechazo de los logs
    const reasonEl = document.getElementById("ac-rejection-reason");
    reasonEl.textContent = "Buscando el motivo del rechazo...";
    try {
        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/waste-status-logs/?waste=${product.waste_id || product.id}`);
        if (res.ok) {
            const logs = await res.json();
            // Buscar el ltimo log donde haya cambiado a estatus "3" (Rechazado)
            const rejectedLog = logs.sort((a,b) => new Date(b.changed_at) - new Date(a.changed_at)).find(l => l.status_changed == "3");
            if (rejectedLog && rejectedLog.description) {
                reasonEl.innerHTML = `<strong>Motivo:</strong> ${rejectedLog.description}`;
            } else {
                reasonEl.textContent = "Rechazado sin comentarios adicionales por parte de Calidad.";
            }
        }
    } catch(e) {
        reasonEl.textContent = "No se pudo recuperar el motivo del rechazo.";
    }
}

function closeAdvancedCorrectionModal() {
    document.getElementById("advanced-correction-modal").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
}

async function submitAdvancedCorrection() {
    const wasteId = document.getElementById("ac-waste-id").value;
    const btn = document.getElementById("btn-submit-ac");
    btn.disabled = true;
    btn.textContent = "?? Guardando...";
    
    const formData = new FormData();
    formData.append("title", document.getElementById("ac-title").value);
    formData.append("category_name", document.getElementById("ac-category").value);
    formData.append("unit_price", document.getElementById("ac-price").value);
    formData.append("weight_decimal", document.getElementById("ac-weight").value);
    
    const qty = document.getElementById("ac-qty").value;
    if(qty) formData.append("quantity", qty);
    
    const desc = document.getElementById("ac-description").value;
    if(desc) formData.append("technical_description", desc);
    
    // Forzar el estado de nuevo a Revisin (1)
    formData.append("status", 1);
    
    const fileInput = document.getElementById("ac-files");
    if (fileInput.files.length > 0) {
        for(let i=0; i<fileInput.files.length; i++){
            formData.append("evidences", fileInput.files[i]);
        }
    }
    
    try {
        const response = await fetch(`http://localhost:8000/api-ecoboros-v1/wastes/${wasteId}/`, {
            method: "PATCH",
            body: formData
        });
        
        if (response.ok) {
            alert("Publicacin corregida y enviada a revisin correctamente.");
            closeAdvancedCorrectionModal();
            fetchPublications();
        } else {
            const errorText = await response.text();
            alert("Error al corregir publicacin: " + errorText);
        }
    } catch (error) {
        alert("Error de red: " + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "?? Guardar y Reenviar a Revisin";
    }
}

// ---------------------------------------------------------------
//  Modal de solo lectura (para publicaciones en revisión / aprobada)
// ---------------------------------------------------------------
async function openReadOnlyPublicationModal(id) {
    const pub = findPublicationById(id);
    if (!pub) return;

    // Rellenar campos (todos disabled)
    document.getElementById('ro-waste-id').value = pub.waste_id || pub.id;
    document.getElementById('ro-title').value   = pub.title || '';
    document.getElementById('ro-price').value   = pub.unit_price || pub.price || '';
    document.getElementById('ro-weight').value  = pub.weight_decimal || pub.weightKg || '';
    document.getElementById('ro-description').value = pub.technical_description || pub.description || '';

    // Categoría (solo lectura)
    const catSelect = document.getElementById('ro-category');
    catSelect.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = pub.category_name || pub.category || '';
    opt.textContent = pub.category_name || pub.category || '';
    opt.selected = true;
    catSelect.appendChild(opt);

    document.getElementById('read-only-publication-modal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeReadOnlyPublicationModal() {
    document.getElementById('read-only-publication-modal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}
