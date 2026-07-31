// ============================================
// EMPRESA.JS - Marketplace ECOBOROS
// ============================================

// ========== DATOS ==========
const productsDB = [
    { id: 1, title: "Bidones HDPE Tricapa", category: "Plásticos", location: "Otay Industrial", qty: "850 Pzas", weightKg: 850, price: "$ 15.00 / pza", date: "2023-10-01", userId: "otra_empresa", status: "aprobada", customImage: null, documentation: [
        { title: "Ficha técnica", text: "Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos." },
        { title: "Condición", text: "Unidad usada en buen estado, sin deformaciones visibles y con cierre hermético probado." },
        { title: "Certificado", text: "Disponible certificado de reciclaje y trazabilidad de plástico." }
    ] },
    { id: 2, title: "Recortes de Aluminio 6061", category: "Metales", location: "El Florido", qty: "2.5 Ton", weightKg: 2500, price: "$ 28.50 / kg", date: "2023-10-05", userId: "empresa_actual", status: "revision", customImage: "../../Public/Imagenes/aluminio.jpeg", documentation: [
        { title: "Especificaciones", text: "Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión." },
        { title: "Calidad", text: "Material limpio, sin óxido, con pieza de prueba incluida." },
        { title: "Certificado", text: "Informe de composición química entregable bajo solicitud." }
    ] },
    { id: 3, title: "Pallets de Pino (Reparables)", category: "Maderas", location: "Pacifico", qty: "200 Uds", weightKg: 4000, price: "$ 45.00 / ud", date: "2023-09-28", userId: "otra_empresa", status: "aprobada", customImage: "../../Public/Imagenes/madera.png", documentation: [
        { title: "Condición", text: "Pallets reutilizados en buen estado, listos para reparación ligera y reciclaje interno." },
        { title: "Material", text: "Pino tratado, sin humedad excesiva, apto para almacenamiento y carga moderada." },
        { title: "Recomendación", text: "Ideal para uso en bodegas o transporte de piezas ligeras." }
    ] },
    { id: 4, title: "Pacas de Cartón Corrugado", category: "Cartón", location: "La Mesa", qty: "5 Ton", weightKg: 5000, price: "$ 3.20 / kg", date: "2023-10-10", userId: "empresa_actual", status: "rechazada", customImage: "../../Public/Imagenes/cartoncorrugado.png", documentation: [
        { title: "Ficha técnica", text: "Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical." },
        { title: "Uso recomendado", text: "Recomendado para empaques, relleno y proyectos de reciclaje industrial." },
        { title: "Condición", text: "Material limpio, con algunas imperfecciones menores de almacenamiento." }
    ] },
    { id: 5, title: "Tarjetas Madre (Scrap)", category: "Electrónicos", location: "Nordika", qty: "500 kg", weightKg: 500, price: "A Tratar", date: "2023-10-12", userId: "empresa_actual", status: "revision", customImage: null, documentation: [
        { title: "Descripción", text: "Scrap de tarjetas madre para reciclaje de componentes electrónicos y recuperación de metales." },
        { title: "Inspección", text: "Revisión visual previa; sin garantías de funcionalidad." },
        { title: "Manejo seguro", text: "Usar equipo de protección y separar elementos tóxicos antes de procesar." }
    ] },
    { id: 6, title: "Archivo Muerto (Triturado)", category: "Papel", location: "Zona Centro", qty: "1.2 Ton", weightKg: 1200, price: "$ 2.10 / kg", date: "2023-09-15", userId: "otra_empresa", status: "aprobada", customImage: null, documentation: [
        { title: "Tipo de material", text: "Papelería triturada de oficina, mezcla de papel bond y cartulina." },
        { title: "Protección", text: "Libre de datos sensibles y lista para reprocesamiento o compostaje industrial." },
        { title: "Uso", text: "Ideal para reciclaje de papel o relleno de embalajes." }
    ] },
    { id: 7, title: "Cobre de Primera (Pelado)", category: "Metales", location: "Otay", qty: "300 kg", weightKg: 300, price: "$ 140.00 / kg", date: "2023-10-15", userId: "empresa_actual", status: "revision", customImage: null, documentation: [
        { title: "Calidad", text: "Cobre limpio pelado, sin aislamiento, grado comercial de primera." },
        { title: "Aplicación", text: "Adecuado para reciclaje metalúrgico y fabricación de componentes eléctricos." },
        { title: "Certificado", text: "Informe de pureza disponible según solicitud." }
    ] },
    { id: 8, title: "Botellas PET ", category: "Plásticos", location: "Parque industrial otay", qty: "1 Ton", weightKg: 1000, price: "$ 8.00 / kg", date: "2023-10-02", userId: "otra_empresa", status: "aprobada", customImage: "../../Public/Imagenes/BotellasPetCristal.png", documentation: [
        { title: "Material", text: "PET transparente de grado alimenticio triturado, limpio y sin etiquetas." },
        { title: "Uso", text: "Perfecto para reprocesado y fabricación de fibra o envases reciclados." },
        { title: "Certificación", text: "Cumple con normas básicas de separación y limpieza para reciclaje." }
    ] },
    { id: 9, title: "Perfiles de Aluminio", category: "Metales", location: "Tijuana", qty: "500 kg", weightKg: 500, price: "$ 32.00 / kg", date: "2023-10-20", userId: "otra_empresa", status: "aprobada", customImage: "../../Public/Imagenes/PerfilesAluminio.png", documentation: [
        { title: "Especificaciones", text: "Perfiles extruidos de aluminio, sección rectangular, superficie limpia." },
        { title: "Condición", text: "Buen estado estructural, sin corrosión visible." },
        { title: "Recomendación", text: "Ideal para construcción ligera o procesos de fundición." }
    ] },
];

// Compras realizadas por la empresa actual
let myPurchases = [
    { id: 1, productName: "Bidones HDPE Tricapa", date: "2024-01-15", total: 1275, totalFormatted: "$ 1,275.00", status: "completada", seller: "Recicladora del Norte" },
    { id: 2, productName: "Pallets de Pino", date: "2024-02-10", total: 9000, totalFormatted: "$ 9,000.00", status: "completada", seller: "Maderas del Pacífico" },
    { id: 3, productName: "Botellas PET Cristal", date: "2024-03-05", total: 8000, totalFormatted: "$ 8,000.00", status: "procesando", seller: "Plásticos Reciclados SA" },
];

// ========== VARIABLES DE ESTADO ==========
let activeCategory = "Todos";
let currentUser = { name: "Empresa Demo S.A.", role: "empresa", id: "empresa_actual" };
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

    renderMyPurchases();
    if (matrizMode) activateMatrizLabels();
}

// ========== MIS PUBLICACIONES ==========
function getMyPublications() {
    return productsDB.filter(p => p.userId === "empresa_actual");
}

function filterMyPublications(status) {
    currentPublicationFilter = status;
    let filtered = getMyPublications();
    if (status !== 'all') {
        filtered = filtered.filter(p => p.status === status);
    }

    ['all', 'revision', 'aprobada', 'rechazada'].forEach(s => {
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
        const style = categoryStyles[pub.category] || { color: "bg-gray-500", icon: "♻️", btnHover: "" };
        const statusClass = pub.status === 'revision' ? 'status-revision' : (pub.status === 'aprobada' ? 'status-aprobada' : 'status-rechazada');
        const statusText = pub.status === 'revision' ? 'En Revisión' : (pub.status === 'aprobada' ? 'Aceptada' : 'Rechazada');

        return `
            <div class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group">
                <div class="h-48 bg-slate-50 relative flex items-center justify-center" style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
                    <span class="text-7xl group-hover:scale-110 transition-transform duration-500">${style.icon}</span>
                    <div class="absolute top-4 left-4 ${style.color} text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                        ${pub.category}
                    </div>
                    <div class="absolute top-4 right-4">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="p-6 flex flex-col gap-2 flex-1">
                    <h3 class="font-bold text-[#1a2b4b] text-xl leading-tight">${pub.title}</h3>
                    <p class="text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${pub.location}
                    </p>
                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Disp: ${pub.qty}</span>
                            <span class="text-xs text-slate-400 font-medium">📅 ${pub.date}</span>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-2xl font-black text-[#1a2b4b]">${pub.price}</span>
                            ${pub.status === 'revision' ? `
                                <button onclick="openEditModal(${pub.id})" class="text-sm font-bold bg-white text-[#1a2b4b] border-2 border-slate-200 px-5 py-2.5 rounded-xl hover:bg-[#78C043] hover:text-white hover:border-[#78C043] transition-all">
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
    const product = productsDB.find(p => p.id === id);
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
        const product = productsDB.find(p => p.id === editingPublicationId);
        if (product) {
            product.title = document.getElementById('edit-title').value;
            product.price = document.getElementById('edit-price').value;
            product.qty = document.getElementById('edit-qty').value;
            showToast('Publicación actualizada correctamente');
            filterMyPublications(currentPublicationFilter);
        }
    }
    closeEditModal();
}

// ========== MIS COMPRAS ==========
function renderMyPurchases() {
    const tbody = document.getElementById('purchases-table-body');
    const noPurchases = document.getElementById('no-purchases');
    const totalSpentEl = document.getElementById('total-spent');
    const totalPurchasesEl = document.getElementById('total-purchases-count');
    const pendingPurchasesEl = document.getElementById('pending-purchases-count');

    if (myPurchases.length === 0) {
        tbody.innerHTML = '';
        noPurchases.classList.remove('hidden');
        totalSpentEl.textContent = '$0';
        totalPurchasesEl.textContent = '0';
        pendingPurchasesEl.textContent = '0';
        return;
    }

    noPurchases.classList.add('hidden');

    const totalSpent = myPurchases.reduce((sum, p) => sum + p.total, 0);
    const completedCount = myPurchases.filter(p => p.status === 'completada').length;
    const pendingCount = myPurchases.filter(p => p.status === 'procesando').length;

    totalSpentEl.textContent = `$${totalSpent.toLocaleString()}`;
    totalPurchasesEl.textContent = completedCount;
    pendingPurchasesEl.textContent = pendingCount;

    tbody.innerHTML = myPurchases.map(p => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">${p.productName}</p>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">${p.date}</td>
            <td class="px-6 py-4">
                <span class="font-bold text-[#1a2b4b]">${p.totalFormatted}</span>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${p.status === 'completada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                    ${p.status === 'completada' ? 'Completada' : 'En Proceso'}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">${p.seller}</td>
        </tr>
    `).join('');
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
            currentUser.name = user.name;
            if (nameDisplay) nameDisplay.textContent = user.name;
            if (roleDisplay) roleDisplay.textContent = user.description || "Empresa Verificada";
            if (userAvatar) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                userAvatar.textContent = initials;
            }
        } catch (e) { }
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

    const filtered = productsDB.filter(item => {
        const matchCat = activeCategory === "Todos" || item.category === activeCategory;
        const matchText = item.title.toLowerCase().includes(searchText) || item.location.toLowerCase().includes(searchText);
        const matchWeight = item.weightKg >= minWeight;
        let matchDate = true;
        if (startDate) matchDate = matchDate && (item.date >= startDate);
        if (endDate) matchDate = matchDate && (item.date <= endDate);
        return matchCat && matchText && matchWeight && matchDate;
    });

    renderProducts(filtered);
    if (updateBadges) renderBadges(minWeight, startDate, endDate);
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
        const style = categoryStyles[item.category] || { color: "bg-gray-500", icon: "❓", hoverGlow: "hover:border-gray-500 hover:shadow-gray-500/30", btnHover: "group-hover:bg-gray-500 group-hover:border-gray-500 group-hover:text-white" };
        const delay = index * 30;
        
        const hasCustomImage = item.customImage && item.customImage.trim() !== "";
        
        const imageHtml = hasCustomImage ? `
            <div class="image-container w-full h-full">
                <img src="${item.customImage}" alt="${item.title}" class="product-image w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-7xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 opacity-90\'>${style.icon}</span>'">
            </div>
        ` : `
            <span class="text-7xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 opacity-90">${style.icon}</span>
        `;

        return `
            <div onclick="window.location.href='publicacion.html?id=${item.id}'" class="bg-white rounded-3xl border-4 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer animate-card ${style.hoverGlow} product-card relative" style="animation-delay: ${delay}ms">
                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden" style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
                    ${imageHtml}
                    <div class="absolute top-4 left-4 ${style.color} text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider z-10">
                        ${item.category}
                    </div>
                </div>
                <div class="p-6 flex flex-col gap-2 flex-1">
                    <div class="flex justify-between items-start gap-2">
                        <h3 class="font-bold text-[#1a2b4b] text-xl leading-tight line-clamp-2">${item.title}</h3>
                    </div>
                    <p class="text-sm text-slate-400 flex items-center gap-1.5 font-medium mt-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${item.location}
                    </p>
                    <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Disp: ${item.qty}</span>
                            <span class="text-xs text-slate-400 font-medium">📅 ${item.date}</span>
                        </div>
                        <div class="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:justify-between">
                            <span class="text-2xl font-black text-[#1a2b4b]">${item.price}</span>
                            <div class="flex flex-wrap gap-3">
                                <button class="text-sm font-bold bg-white text-[#1a2b4b] border-2 border-slate-100 px-5 py-2.5 rounded-xl transition-colors ${style.btnHover}">Ver Más</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    if (matrizMode) activateMatrizLabels();
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
    renderProducts(productsDB);
    const btnMatriz = document.getElementById('matriz-toggle-btn');
    if (btnMatriz) btnMatriz.addEventListener('click', toggleMatrizMode);
    updateMatrizBubble();
});