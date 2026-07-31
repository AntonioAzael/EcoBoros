// ============================================
// ADMIN.JS - Panel de Administración ECOBOROS
// ============================================

// ========== DATOS ==========
let companies = [
    { id: 1, name: "Reciclados del Norte S.A. de C.V.", rfc: "RDN123456XYZ", phone: "(664) 123-4567", email: "contacto@recicladosnorte.com", address: "Av. Industrial 123, Otay, Tijuana", status: "active", createdAt: "2024-01-15", totalPurchases: 12, totalSpent: 45800, lastPurchase: "2024-03-15" },
    { id: 2, name: "Aluminios del Pacífico S.A.", rfc: "ADP789012ABC", phone: "(664) 234-5678", email: "ventas@aluminios.com", address: "Blvd. Pacífico 456, El Florido", status: "active", createdAt: "2024-01-20", totalPurchases: 8, totalSpent: 32450, lastPurchase: "2024-03-14" },
    { id: 3, name: "Maderas del Noroeste S.A.", rfc: "MDN345678DEF", phone: "(664) 345-6789", email: "info@maderasnoroeste.com", address: "Calle Roble 789, La Mesa", status: "active", createdAt: "2024-02-01", totalPurchases: 5, totalSpent: 18900, lastPurchase: "2024-03-10" },
    { id: 4, name: "Plásticos Reciclados BC", rfc: "PRB901234GHI", phone: "(664) 456-7890", email: "ventas@plasticosbc.com", address: "Av. Reciclaje 321, Rosarito", status: "suspended", createdAt: "2024-02-10", totalPurchases: 3, totalSpent: 5200, lastPurchase: "2024-02-28" }
];

let publications = [
    { id: 1, title: "Recortes de Aluminio 6061", category: "Metales", location: "El Florido", qty: "2.5 Ton", weightKg: 2500, price: "$28.50/kg", date: "2023-10-05", status: "approved", company: "Aluminios del Pacífico S.A.", description: "Recortes de aluminio grado 6061, libres de impurezas. Material de calidad industrial, perfecto para reciclaje y reutilización.", images: ["🔩"], customImage: "../../Public/Imagenes/aluminio.jpeg", documentation: [{ title: "Ficha Técnica", text: "Aleación 6061-T6; ideal para mecanizado y soldadura de alta precisión." }, { title: "Especificaciones Químicas", text: "Aluminio: 95-98%, Magnesio: 0.8-1.2%, Silicio: 0.4-0.8%, Cobre: 0.15-0.4%, Cromo: 0.04-0.35%" }] },
    { id: 2, title: "Bidones HDPE Tricapa", category: "Plásticos", location: "Otay Industrial", qty: "850 Pzas", weightKg: 850, price: "$15.00/pza", date: "2023-10-01", status: "approved", company: "Reciclados del Norte S.A. de C.V.", description: "Bidones industriales de HDPE de alta densidad, limpios y listos para reciclaje.", images: ["🛢️"], customImage: null, documentation: [{ title: "Ficha técnica", text: "Bidones HDPE de alta resistencia; capacidad 220 L; aptos para líquidos industriales no corrosivos." }] },
    { id: 3, title: "Pallets de Pino (Reparables)", category: "Maderas", location: "Pacifico", qty: "200 Uds", weightKg: 4000, price: "$45.00/ud", date: "2023-09-28", status: "pending", company: "Maderas del Noroeste S.A.", description: "Pallets de pino en buen estado, reparables.", images: ["🪵"], customImage: "../../Public/Imagenes/madera.png", documentation: [] },
    { id: 4, title: "Pacas de Cartón Corrugado", category: "Cartón", location: "La Mesa", qty: "5 Ton", weightKg: 5000, price: "$3.20/kg", date: "2023-10-10", status: "pending", company: "Cartones del Valle", description: "Cartón corrugado reciclado, densidad media, buena resistencia a compresión vertical.", images: ["📦"], customImage: "../../Public/Imagenes/cartoncorrugado.png", documentation: [] },
    { id: 5, title: "Botellas PET Cristal", category: "Plásticos", location: "Rosarito", qty: "1 Ton", weightKg: 1000, price: "$8.00/kg", date: "2023-10-02", status: "approved", company: "Plásticos Reciclados BC", description: "PET transparente de grado alimenticio triturado, limpio y sin etiquetas.", images: ["🛢️"], customImage: "../../Public/Imagenes/BotellasPetCristal.png", documentation: [] },
    { id: 6, title: "Perfiles de Aluminio", category: "Metales", location: "Tijuana", qty: "500 kg", weightKg: 500, price: "$32.00/kg", date: "2023-10-20", status: "pending", company: "Aluminios del Pacífico S.A.", description: "Perfiles extruidos de aluminio, sección rectangular, superficie limpia.", images: ["🔩"], customImage: "../../Public/Imagenes/PerfilesAluminio.png", documentation: [] }
];

// MOVIMIENTOS MEJORADOS - con información más detallada
let transactions = [
    { 
        id: 1, 
        material: "Bidones HDPE Tricapa", 
        quantity: "500 Pzas", 
        total: 7500, 
        date: "2024-03-15", 
        status: "completed",
        seller: "Reciclados del Norte S.A. de C.V.",
        sellerContact: "contacto@recicladosnorte.com",
        sellerPhone: "(664) 123-4567",
        buyer: "Plásticos Industriales SA",
        buyerContact: "compras@plasticosindustriales.com",
        buyerPhone: "(664) 987-6543",
        paymentMethod: "Transferencia Bancaria",
        trackingNumber: "ECOB-2024-001",
        deliveryAddress: "Av. Industrial 456, Parque Industrial, Tijuana",
        notes: "Material entregado en buen estado. Pago confirmado."
    },
    { 
        id: 2, 
        material: "Recortes de Aluminio 6061", 
        quantity: "1.2 Ton", 
        total: 34200, 
        date: "2024-03-14", 
        status: "completed",
        seller: "Aluminios del Pacífico S.A.",
        sellerContact: "ventas@aluminios.com",
        sellerPhone: "(664) 234-5678",
        buyer: "Fundiciones del Norte",
        buyerContact: "compras@fundicionesnorte.com",
        buyerPhone: "(664) 555-1234",
        paymentMethod: "Transferencia Bancaria",
        trackingNumber: "ECOB-2024-002",
        deliveryAddress: "Blvd. Fundidores 789, Zona Industrial, Tijuana",
        notes: "Material de alta pureza. Se entregó certificado de calidad."
    },
    { 
        id: 3, 
        material: "Pallets de Pino", 
        quantity: "80 Uds", 
        total: 3600, 
        date: "2024-03-12", 
        status: "completed",
        seller: "Maderas del Noroeste S.A.",
        sellerContact: "info@maderasnoroeste.com",
        sellerPhone: "(664) 345-6789",
        buyer: "Logística Express",
        buyerContact: "logistica@express.com",
        buyerPhone: "(664) 444-5678",
        paymentMethod: "Efectivo",
        trackingNumber: "ECOB-2024-003",
        deliveryAddress: "Calle Transporte 123, Zona Logistic, Tijuana",
        notes: "Entrega en sitio. Pago contra entrega."
    },
    { 
        id: 4, 
        material: "Perfiles de Aluminio", 
        quantity: "800 kg", 
        total: 25600, 
        date: "2024-03-08", 
        status: "pending",
        seller: "Aluminios del Pacífico S.A.",
        sellerContact: "ventas@aluminios.com",
        sellerPhone: "(664) 234-5678",
        buyer: "Industrias del Metal",
        buyerContact: "compras@industriasmetal.com",
        buyerPhone: "(664) 777-8901",
        paymentMethod: "Crédito (30 días)",
        trackingNumber: "ECOB-2024-004",
        deliveryAddress: "Av. Metalurgia 456, Zona Industrial, Tijuana",
        notes: "Pendiente de confirmación de pago."
    },
    { 
        id: 5, 
        material: "Botellas PET Cristal", 
        quantity: "500 kg", 
        total: 4000, 
        date: "2024-03-10", 
        status: "completed",
        seller: "Plásticos Reciclados BC",
        sellerContact: "ventas@plasticosbc.com",
        sellerPhone: "(664) 456-7890",
        buyer: "EcoPlast Recicladores",
        buyerContact: "compras@ecoplast.com",
        buyerPhone: "(664) 333-4567",
        paymentMethod: "Transferencia",
        trackingNumber: "ECOB-2024-005",
        deliveryAddress: "Calle Reciclaje 789, Rosarito",
        notes: "Material clasificado por colores. Factura electrónica enviada."
    }
];

let reports = [
    { id: 1, type: "publicacion", description: "La publicación muestra un peso incorrecto del material, dice 500kg pero en realidad son 50kg según las fotos adjuntas.", user: "usuario@ejemplo.com", company: "Metales del Norte", status: "pending", date: "2024-03-16", publicationId: 1, publicationTitle: "Recortes de Aluminio 6061" },
    { id: 2, type: "documento", description: "El certificado de calidad parece estar alterado. La firma no coincide con los registros oficiales.", user: "comprador@ejemplo.com", company: "Reciclados del Norte", status: "pending", date: "2024-03-15", publicationId: 2, publicationTitle: "Bidones HDPE Tricapa" },
    { id: 3, type: "tecnico", description: "No se pueden cargar imágenes en el formulario de registro de residuos.", user: "empresa@ecoboros.com", company: "Sistema", status: "resolved", date: "2024-03-14", publicationId: null, publicationTitle: null }
];

// ========== VARIABLES DE ESTADO ==========
let currentView = "publications";
let confirmCallback = null;
let matrizMode = false;
let keySequence = [];
let lastKeyTime = 0;

const categoryStyles = { 
    "Metales": { color: "bg-slate-600", icon: "🔩" }, 
    "Plásticos": { color: "bg-blue-500", icon: "🛢️" }, 
    "Cartón": { color: "bg-amber-500", icon: "📦" }, 
    "Papel": { color: "bg-slate-400", icon: "📄" }, 
    "Maderas": { color: "bg-[#795548]", icon: "🪵" }, 
    "Electrónicos": { color: "bg-orange-500", icon: "🔌" } 
};

const statusStyles = { 
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "⏳ Pendiente" }, 
    approved: { bg: "bg-green-100", text: "text-green-700", label: "✅ Aprobado" }, 
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "❌ Rechazado" } 
};

let pubFilters = { search: '', category: 'all', status: 'all' };
let transFilters = { search: '', from: '', to: '', status: 'all' };
let reportFilters = { search: '', type: 'all', status: 'all' };

// ========== FUNCIONES GENERALES ==========
function showNotification(msg, type) { 
    const n = document.createElement('div'); 
    n.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium animate-fade-up ${type === 'success' ? 'bg-[#78C043]' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`; 
    n.innerHTML = msg; 
    document.body.appendChild(n); 
    setTimeout(() => { 
        n.style.opacity = '0'; 
        setTimeout(() => n.remove(), 300); 
    }, 3000); 
}

function logout() { 
    localStorage.removeItem('ecoboros_user'); 
    sessionStorage.removeItem('ecoboros_user'); 
    window.location.href = '../../Components/login/login.html'; 
}

function openConfirmModal(title, msg) { 
    document.getElementById('confirm-title').textContent = title; 
    document.getElementById('confirm-message').textContent = msg; 
    document.getElementById('confirm-modal').classList.remove('hidden'); 
}

function closeConfirmModal() { 
    document.getElementById('confirm-modal').classList.add('hidden'); 
    confirmCallback = null; 
}

document.getElementById('confirm-yes').onclick = () => { if (confirmCallback) confirmCallback(); };
document.getElementById('confirm-no').onclick = closeConfirmModal;

// ========== NAVEGACIÓN ==========
function switchView(view) { 
    currentView = view; 
    ['publications', 'companies', 'transactions', 'reports'].forEach(v => { 
        document.getElementById(`${v}-view`).classList.add('hidden'); 
        const navBtn = document.getElementById(`nav-${v}`); 
        if (navBtn) { 
            navBtn.classList.remove('border-[#78C043]', 'text-white', 'bg-white/5'); 
            navBtn.classList.add('text-slate-400'); 
        } 
    }); 
    document.getElementById(`${view}-view`).classList.remove('hidden'); 
    const activeNav = document.getElementById(`nav-${view}`); 
    if (activeNav) { 
        activeNav.classList.remove('text-slate-400'); 
        activeNav.classList.add('border-[#78C043]', 'text-white', 'bg-white/5'); 
    } 
    if (view === 'publications') filterPublications(); 
    if (view === 'companies') filterCompanies(); 
    if (view === 'transactions') filterTransactions(); 
    if (view === 'reports') renderReports(); 
    if (matrizMode) activateMatrizLabels(); 
}

// ========== PUBLICACIONES ==========
function filterPublications() { 
    pubFilters.search = document.getElementById('pub-search-input')?.value.toLowerCase() || ''; 
    pubFilters.category = document.getElementById('pub-category-select')?.value || 'all'; 
    pubFilters.status = document.getElementById('pub-status-select')?.value || 'all'; 
    renderPublicationsGrid(); 
}

function resetPublicationFilters() { 
    if (document.getElementById('pub-search-input')) document.getElementById('pub-search-input').value = ''; 
    if (document.getElementById('pub-category-select')) document.getElementById('pub-category-select').value = 'all'; 
    if (document.getElementById('pub-status-select')) document.getElementById('pub-status-select').value = 'all'; 
    filterPublications(); 
}

function renderPublicationsGrid() {
    let filtered = publications.filter(p => { 
        const matchSearch = p.title.toLowerCase().includes(pubFilters.search) || p.category.toLowerCase().includes(pubFilters.search) || p.company.toLowerCase().includes(pubFilters.search); 
        const matchCategory = pubFilters.category === 'all' || p.category === pubFilters.category; 
        const matchStatus = pubFilters.status === 'all' || p.status === pubFilters.status; 
        return matchSearch && matchCategory && matchStatus; 
    });
    const grid = document.getElementById('publications-grid'); 
    const noMsg = document.getElementById('no-publications-message');
    if (filtered.length === 0) { grid.innerHTML = ''; noMsg.classList.remove('hidden'); return; }
    noMsg.classList.add('hidden');
    grid.innerHTML = filtered.map(p => { 
        const style = categoryStyles[p.category] || { color: "bg-gray-500", icon: "❓" }; 
        const statusStyle = statusStyles[p.status] || statusStyles.pending;
        const hasCustomImage = p.customImage && p.customImage.trim() !== "";
        return `<div class="product-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer" onclick="openPublicationDetail(${p.id})"><div class="h-36 bg-gradient-to-br from-slate-50 to-slate-100 relative flex items-center justify-center overflow-hidden">${hasCustomImage ? `<img src="${p.customImage}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-5xl\'>${style.icon}</span>'">` : `<span class="text-5xl">${style.icon}</span>`}<div class="absolute top-3 left-3 ${style.color} text-white text-[10px] font-bold px-2 py-1 rounded-full">${p.category}</div><div class="absolute top-3 right-3 ${statusStyle.bg} ${statusStyle.text} text-[10px] font-bold px-2 py-1 rounded-full">${statusStyle.label}</div></div><div class="p-4"><h3 class="font-bold text-slate-800 text-lg">${p.title}</h3><p class="text-sm text-slate-500">📍 ${p.location}</p><p class="text-xs text-slate-400">🏢 ${p.company}</p><div class="mt-3 flex justify-between items-center"><div><span class="text-xl font-bold text-[#78C043]">${p.price}</span><p class="text-xs text-slate-400">${p.qty} • ${p.weightKg}kg</p></div><div class="flex gap-1">${p.status === 'pending' ? `<button onclick="event.stopPropagation(); approvePublication(${p.id})" class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Aprobar">✅</button><button onclick="event.stopPropagation(); rejectPublication(${p.id})" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Rechazar">❌</button>` : ''}<button onclick="event.stopPropagation(); editPublication(${p.id})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">✏️</button><button onclick="event.stopPropagation(); deletePublication(${p.id})" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button></div></div></div></div>`; 
    }).join('');
    if (matrizMode) activateMatrizLabels();
}

function openPublicationDetail(id) {
    const pub = publications.find(p => p.id === id);
    if (!pub) return;
    const style = categoryStyles[pub.category] || { color: "bg-gray-500", icon: "❓" };
    const hasCustomImage = pub.customImage && pub.customImage.trim() !== "";
    const container = document.getElementById('publication-detail-content');
    container.innerHTML = `<div class="flex flex-col lg:flex-row gap-8"><div class="lg:w-1/2"><div class="bg-white rounded-3xl shadow-lg overflow-hidden"><div class="h-96 bg-slate-50 flex items-center justify-center overflow-hidden">${hasCustomImage ? `<img src="${pub.customImage}" class="w-full h-full object-cover" onerror="this.style.display='none'">` : `<span class="text-9xl">${style.icon}</span>`}</div></div><div class="flex gap-2 mt-4"><div class="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center"><span class="text-2xl">${style.icon}</span></div></div><div class="mt-6 bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200"><div class="bg-[#1a2b4b] p-4 text-white"><h3 class="text-lg font-bold">Documentación Técnica</h3><p class="text-sm opacity-80">Ficha técnica del material</p></div><div class="p-6 space-y-4">${pub.documentation && pub.documentation.length > 0 ? pub.documentation.map(doc => `<div class="border-b border-slate-100 pb-3"><h4 class="font-bold text-[#1a2b4b]">${doc.title}</h4><p class="text-slate-600 text-sm mt-1">${doc.text}</p></div>`).join('') : '<p class="text-slate-400 text-center py-8">No hay documentación adicional disponible</p>'}</div></div><div class="mt-6 bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200"><div class="bg-[#1a2b4b] p-4 text-white"><h3 class="text-lg font-bold">📄 Certificados y Documentos PDF</h3><p class="text-sm opacity-80">Documentación oficial del material</p></div><div class="pdf-container w-full"><object data="../../Public/pdfs/product_${pub.id}.pdf" type="application/pdf" width="100%" height="500"><div class="p-6 text-center text-slate-600"><p>No se puede mostrar el PDF en este navegador.</p><a href="../../Public/pdfs/product_${pub.id}.pdf" class="text-[#78C043] font-bold hover:underline mt-2 inline-block">📥 Descargar PDF</a></div></object></div></div></div><div class="lg:w-1/2 space-y-6"><div><div class="flex items-center gap-3 mb-4"><span class="inline-block ${style.color} text-white text-sm font-black px-4 py-2 rounded-full">${pub.category}</span><span class="text-slate-400 text-sm">Publicado el ${pub.date}</span></div><h1 class="text-4xl font-black text-[#1a2b4b] mb-4">${pub.title}</h1><div class="flex items-center gap-2 text-slate-600 mb-6"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span class="font-medium">${pub.location}</span></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p class="text-slate-500 text-sm font-medium mb-2">Precio</p><p class="text-5xl font-black text-[#78C043]">${pub.price}</p></div><div class="grid grid-cols-2 gap-4"><div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p class="text-slate-500 text-sm font-medium">Cantidad Disponible</p><p class="text-[#1a2b4b] font-bold text-xl">${pub.qty}</p></div><div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100"><p class="text-slate-500 text-sm font-medium">Peso Total</p><p class="text-[#1a2b4b] font-bold text-xl">${pub.weightKg} kg</p></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 class="text-lg font-bold text-[#1a2b4b] mb-3">Descripción</h3><p class="text-slate-600 leading-relaxed">${pub.description}</p></div><div class="bg-slate-50 p-4 rounded-xl"><p class="text-sm text-slate-500">Empresa publicadora</p><p class="font-bold text-[#1a2b4b]">${pub.company}</p></div></div></div>`;
    document.getElementById('publication-detail-modal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closePublicationDetailModal() { 
    document.getElementById('publication-detail-modal').classList.add('hidden'); 
    document.body.classList.remove('overflow-hidden'); 
}

function approvePublication(id) { 
    const pub = publications.find(p => p.id === id); 
    if (pub) { pub.status = 'approved'; showNotification(`✅ Publicación "${pub.title}" aprobada`, 'success'); filterPublications(); } 
}

function rejectPublication(id) { 
    confirmCallback = () => { 
        const pub = publications.find(p => p.id === id); 
        if (pub) { pub.status = 'rejected'; showNotification(`❌ Publicación "${pub.title}" rechazada`, 'warning'); filterPublications(); } 
        closeConfirmModal(); 
    }; 
    openConfirmModal('Rechazar Publicación', '¿Estás seguro?'); 
}

function openCreatePublicationModal() { 
    document.getElementById('pub-id').value = ''; 
    document.getElementById('pub-modal-title').textContent = 'Nueva Publicación'; 
    document.getElementById('publication-form').reset(); 
    document.getElementById('publication-modal').classList.remove('hidden'); 
}

function editPublication(id) { 
    const p = publications.find(p => p.id === id); 
    if (p) { 
        document.getElementById('pub-id').value = p.id; 
        document.getElementById('pub-title').value = p.title; 
        document.getElementById('pub-category').value = p.category; 
        document.getElementById('pub-location').value = p.location; 
        document.getElementById('pub-qty').value = p.qty; 
        document.getElementById('pub-weight').value = p.weightKg; 
        document.getElementById('pub-price').value = p.price; 
        document.getElementById('pub-status').value = p.status; 
        document.getElementById('pub-company').value = p.company; 
        document.getElementById('pub-custom-image').value = p.customImage || ''; 
        document.getElementById('pub-description').value = p.description || ''; 
        document.getElementById('pub-modal-title').textContent = 'Editar Publicación'; 
        document.getElementById('publication-modal').classList.remove('hidden'); 
    } 
}

function savePublication(e) { 
    e.preventDefault(); 
    const id = document.getElementById('pub-id').value; 
    const customImageValue = document.getElementById('pub-custom-image').value; 
    const data = { 
        title: document.getElementById('pub-title').value, 
        category: document.getElementById('pub-category').value, 
        location: document.getElementById('pub-location').value, 
        qty: document.getElementById('pub-qty').value, 
        weightKg: parseInt(document.getElementById('pub-weight').value), 
        price: document.getElementById('pub-price').value, 
        status: document.getElementById('pub-status').value, 
        company: document.getElementById('pub-company').value, 
        description: document.getElementById('pub-description').value, 
        customImage: customImageValue ? customImageValue : null, 
        date: new Date().toISOString().split('T')[0], 
        images: [], 
        documentation: [] 
    }; 
    if (id) { 
        const idx = publications.findIndex(p => p.id === parseInt(id)); 
        if (idx !== -1) publications[idx] = { ...publications[idx], ...data }; 
        showNotification('Publicación actualizada', 'success'); 
    } else { 
        const newId = Math.max(...publications.map(p => p.id), 0) + 1; 
        publications.push({ id: newId, ...data }); 
        showNotification('Publicación creada', 'success'); 
    } 
    closePublicationModal(); 
    filterPublications(); 
}

function deletePublication(id) { 
    confirmCallback = () => { 
        publications = publications.filter(p => p.id !== id); 
        filterPublications(); 
        showNotification('Publicación eliminada', 'success'); 
        closeConfirmModal(); 
    }; 
    openConfirmModal('Eliminar Publicación', 'Esta acción no se puede deshacer.'); 
}

function closePublicationModal() { 
    document.getElementById('publication-modal').classList.add('hidden'); 
}

// ========== EMPRESAS ==========
function filterCompanies() { 
    const search = document.getElementById('company-search-input')?.value.toLowerCase() || ''; 
    const status = document.getElementById('company-status-select')?.value || 'all'; 
    let filtered = companies.filter(c => (c.name.toLowerCase().includes(search) || c.rfc.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)) && (status === 'all' || c.status === status)); 
    const grid = document.getElementById('companies-grid'); 
    const noMsg = document.getElementById('no-companies-message'); 
    if (filtered.length === 0) { grid.innerHTML = ''; noMsg.classList.remove('hidden'); return; } 
    noMsg.classList.add('hidden'); 
    grid.innerHTML = filtered.map(c => `<div class="company-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer" onclick="openCompanyDetail(${c.id})"><div class="flex justify-between items-start mb-3"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2b4b] to-[#2d4563] text-white flex items-center justify-center text-xl">🏢</div><span class="status-badge ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${c.status === 'active' ? 'Activa' : 'Suspendida'}</span></div><h3 class="font-bold text-lg text-slate-800">${c.name}</h3><p class="text-sm text-slate-500">RFC: ${c.rfc}</p><p class="text-sm text-slate-500">📞 ${c.phone}</p><div class="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center"><div><p class="text-xs text-slate-400">Compras: ${c.totalPurchases}</p><p class="text-xs text-slate-400">Total: $${c.totalSpent.toLocaleString()}</p></div><div class="flex gap-2"><button onclick="event.stopPropagation(); editCompany(${c.id})" class="p-2 text-slate-400 hover:text-blue-600 rounded-lg">✏️</button><button onclick="event.stopPropagation(); deleteCompany(${c.id})" class="p-2 text-slate-400 hover:text-red-600 rounded-lg">🗑️</button></div></div></div>`).join(''); 
    if (matrizMode) activateMatrizLabels(); 
}

function openCompanyDetail(id) { 
    const c = companies.find(c => c.id === id); 
    if (!c) return; 
    const container = document.getElementById('company-detail-content'); 
    container.innerHTML = `<div class="space-y-6"><div class="flex items-center gap-4 pb-4 border-b border-slate-100"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a2b4b] to-[#2d4563] text-white flex items-center justify-center text-3xl">🏢</div><div><h2 class="text-2xl font-bold text-slate-800">${c.name}</h2><span class="status-badge ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mt-1">${c.status === 'active' ? 'Activa' : 'Suspendida'}</span></div></div><div class="grid grid-cols-2 gap-4"><div class="detail-section"><div class="detail-label">RFC</div><div class="detail-value">${c.rfc}</div></div><div class="detail-section"><div class="detail-label">Teléfono</div><div class="detail-value">${c.phone}</div></div><div class="col-span-2 detail-section"><div class="detail-label">Correo Electrónico</div><div class="detail-value">${c.email}</div></div><div class="col-span-2 detail-section"><div class="detail-label">Dirección</div><div class="detail-value">${c.address}</div></div><div class="detail-section"><div class="detail-label">Fecha de Registro</div><div class="detail-value">${c.createdAt}</div></div><div class="detail-section"><div class="detail-label">Última Compra</div><div class="detail-value">${c.lastPurchase || 'N/A'}</div></div><div class="detail-section"><div class="detail-label">Total de Compras</div><div class="detail-value text-2xl font-bold text-[#78C043]">${c.totalPurchases}</div></div><div class="detail-section"><div class="detail-label">Monto Total Gastado</div><div class="detail-value text-2xl font-bold text-[#78C043]">$${c.totalSpent.toLocaleString()}</div></div></div><div class="detail-section"><div class="detail-label">Historial de Transacciones</div><div class="detail-value"><div class="space-y-2">${transactions.filter(t => t.seller === c.name).map(t => `<div class="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100"><div><p class="font-medium">${t.material}</p><p class="text-xs text-slate-400">${t.date}</p></div><div><span class="font-bold text-[#78C043]">$${t.total.toLocaleString()}</span><span class="ml-2 status-badge ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} text-xs">${t.status === 'completed' ? 'Completada' : 'Pendiente'}</span></div></div>`).join('') || '<p class="text-slate-400 text-center py-4">No hay transacciones registradas</p>'}</div></div></div></div>`; 
    document.getElementById('company-detail-modal').classList.remove('hidden'); 
}

function closeCompanyDetailModal() { document.getElementById('company-detail-modal').classList.add('hidden'); }

function openCreateCompanyModal() { 
    document.getElementById('company-id').value = ''; 
    document.getElementById('company-modal-title').textContent = 'Registrar Empresa'; 
    document.getElementById('company-form').reset(); 
    document.getElementById('company-modal').classList.remove('hidden'); 
}

function editCompany(id) { 
    const c = companies.find(c => c.id === id); 
    if (c) { 
        document.getElementById('company-id').value = c.id; 
        document.getElementById('company-name').value = c.name; 
        document.getElementById('company-rfc').value = c.rfc; 
        document.getElementById('company-phone').value = c.phone; 
        document.getElementById('company-email').value = c.email; 
        document.getElementById('company-address').value = c.address; 
        document.getElementById('company-status').value = c.status; 
        document.getElementById('company-modal-title').textContent = 'Editar Empresa'; 
        document.getElementById('company-modal').classList.remove('hidden'); 
    } 
}

function saveCompany(e) { 
    e.preventDefault(); 
    const id = document.getElementById('company-id').value; 
    const data = { 
        name: document.getElementById('company-name').value, 
        rfc: document.getElementById('company-rfc').value, 
        phone: document.getElementById('company-phone').value, 
        email: document.getElementById('company-email').value, 
        address: document.getElementById('company-address').value, 
        status: document.getElementById('company-status').value, 
        totalPurchases: 0, 
        totalSpent: 0, 
        createdAt: new Date().toISOString().split('T')[0] 
    }; 
    if (id) { 
        const idx = companies.findIndex(c => c.id === parseInt(id)); 
        if (idx !== -1) companies[idx] = { ...companies[idx], ...data }; 
        showNotification('Empresa actualizada', 'success'); 
    } else { 
        const newId = Math.max(...companies.map(c => c.id), 0) + 1; 
        companies.push({ id: newId, ...data }); 
        showNotification('Empresa creada', 'success'); 
    } 
    closeCompanyModal(); 
    filterCompanies(); 
}

function deleteCompany(id) { 
    confirmCallback = () => { 
        companies = companies.filter(c => c.id !== id); 
        filterCompanies(); 
        showNotification('Empresa eliminada', 'success'); 
        closeConfirmModal(); 
    }; 
    openConfirmModal('Eliminar Empresa', '¿Estás seguro?'); 
}

function closeCompanyModal() { document.getElementById('company-modal').classList.add('hidden'); }

// ========== MOVIMIENTOS ==========
function filterTransactions() { 
    transFilters.search = document.getElementById('trans-search')?.value.toLowerCase() || '';
    transFilters.from = document.getElementById('trans-date-from')?.value || '';
    transFilters.to = document.getElementById('trans-date-to')?.value || '';
    transFilters.status = document.getElementById('trans-status-filter')?.value || 'all';
    let filtered = [...transactions];
    if (transFilters.search) filtered = filtered.filter(t => t.material.toLowerCase().includes(transFilters.search) || t.seller.toLowerCase().includes(transFilters.search) || t.buyer.toLowerCase().includes(transFilters.search));
    if (transFilters.from) filtered = filtered.filter(t => t.date >= transFilters.from);
    if (transFilters.to) filtered = filtered.filter(t => t.date <= transFilters.to);
    if (transFilters.status !== 'all') filtered = filtered.filter(t => t.status === transFilters.status);
    const container = document.getElementById('transactions-list'); 
    const noMsg = document.getElementById('no-transactions-message');
    if (filtered.length === 0) { container.innerHTML = ''; noMsg.classList.remove('hidden'); return; }
    noMsg.classList.add('hidden');
    container.innerHTML = filtered.map(t => `<div class="transaction-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="openTransactionDetail(${t.id})"><div class="flex justify-between items-start flex-wrap gap-3"><div><div class="flex items-center gap-2 mb-2"><span class="status-badge ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">${t.status === 'completed' ? '✅ Completada' : '⏳ Pendiente'}</span></div><h3 class="font-bold text-slate-800 text-lg">${t.material}</h3><p class="text-sm text-slate-500">🏢 Vendedor: ${t.seller}</p><p class="text-sm text-slate-500">👤 Comprador: ${t.buyer}</p><p class="text-xs text-slate-400">📅 ${t.date}</p></div><div class="text-right"><p class="text-2xl font-bold text-[#78C043]">$${t.total.toLocaleString()}</p><p class="text-xs text-slate-400">Cantidad: ${t.quantity}</p><p class="text-xs text-slate-400">💳 ${t.paymentMethod}</p></div></div></div>`).join(''); 
    if (matrizMode) activateMatrizLabels(); 
}

function openTransactionDetail(id) { 
    const t = transactions.find(t => t.id === id);
    if (!t) return;
    const container = document.getElementById('transaction-detail-content');
    container.innerHTML = `<div class="space-y-6"><div class="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3"><div><h2 class="text-2xl font-bold text-slate-800">${t.material}</h2><p class="text-slate-500">ID de transacción: #ECOB-${t.id.toString().padStart(4, '0')}</p></div><span class="status-badge ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} text-lg px-4 py-2">${t.status === 'completed' ? '✅ Completada' : '⏳ Pendiente'}</span></div><div class="transaction-detail-grid"><div class="detail-section"><div class="detail-label">📅 Fecha de Transacción</div><div class="detail-value">${t.date}</div></div><div class="detail-section"><div class="detail-label">💰 Monto Total</div><div class="detail-value text-2xl font-bold text-[#78C043]">$${t.total.toLocaleString()}</div></div><div class="detail-section"><div class="detail-label">📦 Cantidad</div><div class="detail-value">${t.quantity}</div></div><div class="detail-section"><div class="detail-label">💳 Método de Pago</div><div class="detail-value">${t.paymentMethod}</div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="detail-section bg-green-50"><div class="detail-label text-green-700">🏢 VENDEDOR</div><div class="detail-value font-bold">${t.seller}</div><div class="text-sm text-slate-600 mt-1">📧 ${t.sellerContact}</div><div class="text-sm text-slate-600">📞 ${t.sellerPhone}</div></div><div class="detail-section bg-blue-50"><div class="detail-label text-blue-700">👤 COMPRADOR</div><div class="detail-value font-bold">${t.buyer}</div><div class="text-sm text-slate-600 mt-1">📧 ${t.buyerContact}</div><div class="text-sm text-slate-600">📞 ${t.buyerPhone}</div></div></div><div class="detail-section"><div class="detail-label">📍 Dirección de Entrega</div><div class="detail-value">${t.deliveryAddress}</div></div>${t.trackingNumber ? `<div class="detail-section"><div class="detail-label">📦 Número de Seguimiento</div><div class="detail-value font-mono text-[#78C043]">${t.trackingNumber}</div></div>` : ''}<div class="detail-section"><div class="detail-label">📝 Notas Adicionales</div><div class="detail-value">${t.notes}</div></div><div class="bg-slate-50 p-4 rounded-xl"><p class="text-sm text-slate-500">Información de la transacción</p><p class="text-sm text-slate-600 mt-1">Esta transacción ha sido procesada a través de la plataforma ECOBOROS. Para cualquier consulta, contactar al administrador del sistema.</p></div></div>`;
    document.getElementById('transaction-detail-modal').classList.remove('hidden');
}

function closeTransactionDetailModal() { document.getElementById('transaction-detail-modal').classList.add('hidden'); }

// ========== REPORTES ==========
function filterReports() { 
    reportFilters.search = document.getElementById('report-search-input')?.value.toLowerCase() || ''; 
    reportFilters.type = document.getElementById('report-type-select')?.value || 'all'; 
    reportFilters.status = document.getElementById('report-status-select')?.value || 'all'; 
    renderReports(); 
}

function resetReportFilters() { 
    if (document.getElementById('report-search-input')) document.getElementById('report-search-input').value = ''; 
    if (document.getElementById('report-type-select')) document.getElementById('report-type-select').value = 'all'; 
    if (document.getElementById('report-status-select')) document.getElementById('report-status-select').value = 'all'; 
    filterReports(); 
}

function updateReportCounters() { 
    const pending = reports.filter(r => r.status === 'pending').length; 
    const resolved = reports.filter(r => r.status === 'resolved').length; 
    document.getElementById('pending-reports-count').textContent = pending; 
    document.getElementById('resolved-reports-count').textContent = resolved; 
    document.getElementById('reports-badge').textContent = pending; 
    document.getElementById('reports-badge').classList.toggle('hidden', pending === 0); 
}

function openReportDetail(report) { 
    const typeMap = { publicacion: '📦 Error en publicación', documento: '📄 Documento inválido', tecnico: '⚙️ Problema técnico', otro: '📝 Otro' }; 
    const container = document.getElementById('report-detail-content'); 
    container.innerHTML = `<div class="space-y-4"><div class="detail-section"><div class="detail-label">Tipo</div><div class="detail-value">${typeMap[report.type]}</div></div><div class="detail-section"><div class="detail-label">Estado</div><div class="detail-value"><span class="status-badge ${report.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">${report.status === 'pending' ? '⚠️ Pendiente' : '✅ Resuelto'}</span></div></div><div class="detail-section"><div class="detail-label">Descripción</div><div class="detail-value bg-white p-3 rounded-xl border">${report.description}</div></div><div class="grid grid-cols-2 gap-4"><div class="detail-section"><div class="detail-label">Reportado por</div><div class="detail-value">👤 ${report.user}</div></div><div class="detail-section"><div class="detail-label">Empresa</div><div class="detail-value">🏢 ${report.company}</div></div></div><div class="detail-section"><div class="detail-label">Fecha</div><div class="detail-value">📅 ${report.date}</div></div>${report.publicationId ? `<div class="detail-section"><div class="detail-label">Publicación Relacionada</div><div class="detail-value"><button onclick="goToPublicationFromReport(${report.publicationId})" class="px-4 py-2 bg-[#78C043] text-white rounded-xl text-sm font-medium">🔍 Ver Publicación</button></div></div>` : ''}<div class="flex gap-3 pt-4">${report.status === 'pending' ? `<button onclick="resolveReportFromModal(${report.id})" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium">✅ Resolver</button>` : ''}<button onclick="closeReportDetailModal()" class="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium">Cerrar</button></div></div>`; 
    document.getElementById('report-detail-modal').classList.remove('hidden'); 
}

function closeReportDetailModal() { document.getElementById('report-detail-modal').classList.add('hidden'); }

function goToPublicationFromReport(publicationId) { 
    closeReportDetailModal(); 
    const pub = publications.find(p => p.id === publicationId); 
    if (pub) openPublicationDetail(publicationId); 
    else showNotification('No se encontró la publicación', 'warning'); 
}

function resolveReportFromModal(id) { 
    const r = reports.find(r => r.id === id); 
    if (r) { r.status = 'resolved'; showNotification('Reporte resuelto', 'success'); renderReports(); updateReportCounters(); closeReportDetailModal(); } 
}

function resolveReport(id) { 
    const r = reports.find(r => r.id === id); 
    if (r) { r.status = 'resolved'; showNotification('Reporte resuelto', 'success'); renderReports(); updateReportCounters(); } 
}

function renderReports() { 
    let filtered = reports.filter(r => { 
        const matchSearch = r.description.toLowerCase().includes(reportFilters.search) || r.company.toLowerCase().includes(reportFilters.search); 
        const matchType = reportFilters.type === 'all' || r.type === reportFilters.type; 
        const matchStatus = reportFilters.status === 'all' || r.status === reportFilters.status; 
        return matchSearch && matchType && matchStatus; 
    }); 
    const container = document.getElementById('reports-list'); 
    const noMsg = document.getElementById('no-reports-message'); 
    updateReportCounters(); 
    if (filtered.length === 0) { container.innerHTML = ''; noMsg.classList.remove('hidden'); return; } 
    noMsg.classList.add('hidden'); 
    const typeIcon = { publicacion: '📦', documento: '📄', tecnico: '⚙️', otro: '📝' }; 
    container.innerHTML = filtered.map(r => `<div class="report-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="openReportDetail(${JSON.stringify(r).replace(/"/g, '&quot;')})"><div class="flex justify-between items-start flex-wrap gap-3"><div><div class="flex items-center gap-2 mb-2"><span class="status-badge ${r.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">${r.status === 'pending' ? '⚠️ Pendiente' : '✅ Resuelto'}</span><span class="status-badge bg-slate-100">${typeIcon[r.type]} ${r.type === 'publicacion' ? 'Error publicación' : r.type === 'documento' ? 'Documento' : r.type === 'tecnico' ? 'Técnico' : 'Otro'}</span></div><h3 class="font-bold text-slate-800">${r.description.substring(0, 80)}${r.description.length > 80 ? '...' : ''}</h3><div class="flex gap-4 text-sm text-slate-500 mt-1"><span>👤 ${r.user}</span><span>🏢 ${r.company}</span><span>📅 ${r.date}</span></div></div><div class="flex gap-2">${r.status === 'pending' ? `<button onclick="event.stopPropagation(); resolveReport(${r.id})" class="px-4 py-2 bg-[#78C043] text-white rounded-xl text-sm font-medium">✅ Resolver</button>` : ''}<button onclick="event.stopPropagation(); openReportDetail(${JSON.stringify(r).replace(/"/g, '&quot;')})" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium">🔍 Detalle</button></div></div></div>`).join(''); 
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
    const bubble = document.getElementById('matriz-bubble'); 
    const title = document.getElementById('matriz-bubble-title'); 
    const text = document.getElementById('matriz-bubble-text'); 
    const btn = document.getElementById('matriz-toggle-btn'); 
    if (!bubble) return; 
    if (matrizMode) { 
        bubble.classList.remove('hidden'); 
        title.textContent = 'Modo Matriz Activo'; 
        text.innerHTML = 'Presiona Q + A para desactivar'; 
        btn.textContent = 'Desactivar'; 
    } else { 
        bubble.classList.add('hidden'); 
        btn.textContent = 'Activar'; 
    } 
}

function activateMatrizLabels() { 
    deactivateMatrizLabels(); 
    const navs = ['nav-publications', 'nav-companies', 'nav-transactions', 'nav-reports']; 
    navs.forEach((id, idx) => { 
        const el = document.getElementById(id); 
        if (el) addKeyLabelInside(el, `Alt + ${idx + 1}`); 
    }); 
    const newPubBtn = document.querySelector('button[onclick="openCreatePublicationModal()"]'); 
    if (newPubBtn) addKeyLabelInside(newPubBtn, 'Alt + N'); 
    const resetFilterBtns = document.querySelectorAll('#publications-view .bg-white button:last-child, #reports-view .bg-white button:last-child'); 
    resetFilterBtns.forEach(btn => { 
        if (btn && btn.textContent.includes('Limpiar')) addKeyLabelInside(btn, 'Alt + L'); 
    }); 
    const commandsBtn = document.querySelector('button[onclick="toggleCommands()"]'); 
    if (commandsBtn) addKeyLabelInside(commandsBtn, 'Shift + ?'); 
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

function toggleCommands() { document.getElementById('commands-modal').classList.toggle('hidden'); }

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
    if (e.shiftKey && key === '?') { 
        e.preventDefault(); 
        toggleCommands(); 
        return; 
    } 
    if (e.key === 'Escape') { 
        closePublicationDetailModal(); 
        closeCompanyDetailModal(); 
        closeTransactionDetailModal(); 
        closeReportDetailModal(); 
        closeConfirmModal(); 
        const commandsModal = document.getElementById('commands-modal'); 
        if (commandsModal && !commandsModal.classList.contains('hidden')) commandsModal.classList.add('hidden'); 
        return; 
    } 
    if (e.altKey) { 
        if (key === '1') { e.preventDefault(); switchView('publications'); return; } 
        if (key === '2') { e.preventDefault(); switchView('companies'); return; } 
        if (key === '3') { e.preventDefault(); switchView('transactions'); return; } 
        if (key === '4') { e.preventDefault(); switchView('reports'); return; } 
        if (key === 'n') { e.preventDefault(); if (currentView === 'publications') openCreatePublicationModal(); return; } 
        if (key === 'l') { e.preventDefault(); if (currentView === 'publications') resetPublicationFilters(); if (currentView === 'reports') resetReportFilters(); return; } 
    } 
});

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => { 
    const stored = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user'); 
    if (stored) { 
        const user = JSON.parse(stored); 
        if (user.role !== 'admin') window.location.href = '../../Components/empresa/empresa.html'; 
        document.getElementById('admin-name').textContent = user.name; 
    } else { 
        window.location.href = '../../Components/login/login.html'; 
    } 
    switchView('publications'); 
    updateMatrizBubble(); 
    renderReports(); 
});

document.getElementById('matriz-toggle-btn')?.addEventListener('click', toggleMatrizMode);