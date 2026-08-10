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
    "Electrónicos": { color: "bg-orange-500", icon: "🔌", hoverGlow: "hover:border-orange-500 hover:shadow-orange-500/30", btnHover: "group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white" }
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
    // API returns waste_id, frontend was using id
    return allPublications.find(p => p.waste_id === id);
}

function getCurrentUserPublications() {
    // publisher en la API es el user_id (int)
    return allPublications.filter(p => p.publisher === currentUser.user_id);
}

function isCurrentUserPublication(publication) {
    return publication.publisher === currentUser.user_id;
}

// Keep saveEditedPublication for now, but it should be an API call
function saveEditedPublication(publication) {
    const index = allPublications.findIndex(p => p.waste_id === publication.waste_id);
    if (index !== -1) {
        // This should be a PUT/PATCH request to the API
        console.log("Simulating API call to update publication:", publication);
        allPublications[index] = {...allPublications[index], ...publication};
        
        // For now, let's just re-render
        filterMyPublications(currentPublicationFilter);
        showToast('Publicación actualizada (simulado).');
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
    document.getElementById('nav-publications').className = "text-slate-400 hover:text-white hover:bg-white/5 px-5 py-3 text-sm font-medium transition-colors";
    document.getElementById('nav-purchases').className = "text-white bg-white/5 border-b-2 border-[#78C043] px-5 py-3 text-sm font-medium";

    fetchAndRenderMyPurchases();
    if (matrizMode) activateMatrizLabels();
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

function renderMyPublications(publications) {
    const container = document.getElementById('my-publications-grid');
    const noResults = document.getElementById('my-no-publications');

    if (publications.length === 0) {
        container.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    noResults.classList.add('hidden');

    container.innerHTML = publications.map(pub => {
        // Usar campos de la API (category_name_display, status_name, waste_id, etc.)
        const categoryName = pub.category_name_display || pub.category_name || pub.category || 'Varios';
        const style = categoryStyles[categoryName] || { color: "bg-gray-500", icon: "♻️", btnHover: "" };
        const statusKey = getPublicationStatusKey(pub);
        const status = publicationStatusLabels[statusKey] || { text: pub.status_name || 'Pendiente', class: 'status-pendiente', badge: '⏳' };
        const price = pub.unit_price ? `$ ${parseFloat(pub.unit_price).toFixed(2)} / kg` : (pub.price || 'A consultar');
        const qty = pub.quantity || pub.qty || 'N/A';
        const date = pub.generation_date || pub.date || '-';
        const pubId = pub.waste_id || pub.id;

        // Imagen de evidencia si existe
        let imgHtml;
        if (pub.first_image_url) {
            imgHtml = `<img src="${pub.first_image_url}" class="w-full h-full object-cover" onerror="this.style.display='none'">`;
        } else {
            imgHtml = `<span class="text-7xl group-hover:scale-110 transition-transform duration-500">${style.icon}</span>`;
        }

        return `
            <div onclick="window.location.href='publicacion.html?id=${pubId}'" class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer">
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
                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Disp: ${qty}</span>
                            <span class="text-xs text-slate-400 font-medium">📅 ${date}</span>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-2xl font-black text-[#1a2b4b]">${price}</span>
                            ${statusKey === 'revision' ? `
                                <button onclick="event.stopPropagation(); openEditModal(${pubId})" class="text-sm font-bold bg-white text-[#1a2b4b] border-2 border-slate-200 px-5 py-2.5 rounded-xl hover:bg-[#78C043] hover:text-white hover:border-[#78C043] transition-all">
                                    Editar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}



function openEditModal(id) {
    const product = findPublicationById(id);
    if (product) {
        editingPublicationId = id;
        document.getElementById('edit-title').value = product.title;
        document.getElementById('edit-price').value = product.price;
        document.getElementById('edit-qty').value = product.qty;
        document.getElementById('edit-publication-modal').classList.remove('hidden');
    }
}

function closeEditModal() {
    document.getElementById('edit-publication-modal').classList.add('hidden');
    editingPublicationId = null;
}

function saveEditPublication() {
    if (editingPublicationId) {
        const product = findPublicationById(editingPublicationId);
        if (product) {
            const updated = {
                ...product,
                title: document.getElementById('edit-title').value,
                price: document.getElementById('edit-price').value,
                qty: document.getElementById('edit-qty').value
            };
            saveEditedPublication(updated);
            showToast('Publicación actualizada correctamente');
            filterMyPublications(currentPublicationFilter);
        }
    }
    closeEditModal();
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
        const response = await fetch(
            `http://localhost:8000/api-ecoboros-v1/purchase-requests/?buyer=${userId}`
        );

        if (!response.ok) {
            console.warn('Error al obtener compras:', response.status);
            renderMyPurchasesUI();
            return;
        }

        const fetchedData = await response.json();

        if (Array.isArray(fetchedData)) {
            myPurchases = fetchedData.map(req => {
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
        console.warn('Error al cargar solicitudes de compra:', err);
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
                <td class="px-6 py-4">
                    <button onclick="openRequestDetailsModal(${p.id})" class="bg-[#1a2b4b] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#2d4563] transition-colors">
                        Ver / Gestionar
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

    document.getElementById('modal-req-id').textContent = `#${req.id}`;
    const modalBody = document.getElementById('request-modal-body');
    const isCompleted = req.status === 'completado';
    const isProceso = req.status === 'proceso';
    const isPendiente = req.status === 'pendiente';

    let html = `
        <div class="border-b border-slate-100 pb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-bold text-[#1a2b4b]">${req.productName}</h3>
                    <p class="text-xs text-slate-500 mt-0.5">Vendedor: <strong>${req.seller}</strong> | Comprador: <strong>${req.buyer || 'Usted'}</strong></p>
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
    } else {
        html += `
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-sm">
                <div class="flex items-center gap-2 font-bold text-amber-800 mb-1">
                    <span>⏳</span> En Acuerdo Extermino y Pendiente de Calidad
                </div>
                <p class="text-xs text-amber-700">Las empresas acuerdan cantidades finales por externo. Puedes editar los campos variables (cantidad, peso, precio) antes de que el Usuario de Calidad valide la solicitud.</p>
            </div>
        `;
    }

    // Campos variables (Editables solo si Pendiente)
    html += `
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h4 class="font-bold text-[#1a2b4b] text-sm flex items-center gap-2">
                <span>📝</span> Campos Variables de la Compra
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">Cantidad / Lote</label>
                    <input type="text" id="modal-field-qty" value="${req.quantity}" ${isCompleted || isProceso ? 'disabled' : ''} class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:bg-slate-100 disabled:text-slate-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">Peso Total (KG)</label>
                    <input type="number" id="modal-field-weight" value="${req.weight}" ${isCompleted || isProceso ? 'disabled' : ''} class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:bg-slate-100 disabled:text-slate-500">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1">Precio Unitario ($)</label>
                    <input type="number" step="0.01" id="modal-field-price" value="${req.price}" ${isCompleted || isProceso ? 'disabled' : ''} class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#78C043] disabled:bg-slate-100 disabled:text-slate-500">
                </div>
            </div>

            ${isPendiente ? `
                <button onclick="saveRequestVariables(${req.id})" class="w-full bg-[#1a2b4b] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#2d4563] transition-colors">
                    💾 Guardar Cambios en Campos Variables
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

    try {
        const res = await fetch(`http://localhost:8000/api-ecoboros-v1/purchase-requests/${requestId}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quantity: qty,
                requested_weight: weight,
                offered_price: price
            })
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.status || errData.detail || 'Error al guardar');
        }

        alert('✅ Campos variables actualizados correctamente.');
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

function applyFiltersAndClose() {
    applyFilters();
    toggleFilters();
}

function applyFilters(updateBadges = true) {
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

    if(modalCountLabel) modalCountLabel.innerText = data.length;

    if (data.length === 0) {
        grid.innerHTML = "";
        noResults.classList.remove("hidden");
        noResults.classList.add("flex");
        return;
    }

    noResults.classList.add("hidden");
    noResults.classList.remove("flex");

    grid.innerHTML = data.map((item, index) => {
        // La API devuelve category_name_display para el nombre legible de la categoría
        const categoryName = item.category_name_display || item.category_name || 'Varios';
        const style = categoryStyles[categoryName] || { color: 'bg-gray-500', icon: '❓', hoverGlow: 'hover:border-gray-500 hover:shadow-gray-500/30', btnHover: 'group-hover:bg-gray-500 group-hover:border-gray-500 group-hover:text-white' };
        const delay = index * 30;

        // Mostrar primera imagen subida si existe, si no el icono de categoría
        let imageHtml;
        if (item.first_image_url) {
            imageHtml = `<img src="${item.first_image_url}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-7xl group-hover\:scale-110 transition-transform duration-500 opacity-90\'>${style.icon}</span>';">`;
        } else {
            imageHtml = `<span class="text-7xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 opacity-90">${style.icon}</span>`;
        }

        const location = item.location || 'N/A';
        const price = item.unit_price ? `$ ${parseFloat(item.unit_price).toFixed(2)} / kg` : 'A consultar';
        const quantity = item.quantity || 'N/A';

        return `
            <div onclick="window.location.href='publicacion.html?id=${item.waste_id}'" class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer animate-card ${style.hoverGlow} product-card relative" style="animation-delay: ${delay}ms">
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
                                <button class="text-sm font-bold bg-white text-[#1a2b4b] border-2 border-slate-100 px-5 py-2.5 rounded-xl transition-colors ${style.btnHover}">Ver Más</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

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
    const btnMatriz = document.getElementById('matriz-toggle-btn');
    if (btnMatriz) btnMatriz.addEventListener('click', toggleMatrizMode);
    updateMatrizBubble();
});