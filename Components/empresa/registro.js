// ============================================
// REGISTRO.JS - Registro de Residuos
// ============================================

// ========== STATE ==========
let currentStep = 1;
let selectedCategory = null;
let uploadedImages = [];
let uploadedDocs = [];
let gridFocusIndex = 0;
let matrizMode = false;
let keySequence = [];
let lastKeyTime = 0;

// ========== FUNCIONES GENERALES ==========
function loadUserData() {
    const storedUser = localStorage.getItem('ecoboros_user') || sessionStorage.getItem('ecoboros_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            const nameDisplay = document.getElementById('user-name-display');
            const roleDisplay = document.getElementById('user-role-display');
            const userAvatar = document.getElementById('user-avatar');
            if (nameDisplay) nameDisplay.textContent = user.name;
            if (roleDisplay) roleDisplay.textContent = user.description || "Empresa Verificada";
            if (userAvatar) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                userAvatar.textContent = initials;
            }
        } catch (e) {
            console.log('Error al cargar usuario');
        }
    } else {
        window.location.href = '../../Components/login/login.html';
    }
}

function toggleCompanyDropdown() {
    const dropdown = document.getElementById('company-dropdown');
    dropdown.classList.toggle('hidden');
}

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('company-dropdown');
    const avatar = document.getElementById('user-avatar');
    if (dropdown && !dropdown.classList.contains('hidden') && avatar && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

document.getElementById('user-avatar')?.addEventListener('click', toggleCompanyDropdown);

function logout() {
    localStorage.removeItem('ecoboros_user');
    sessionStorage.removeItem('ecoboros_user');
    window.location.href = '../../Components/login/login.html';
}

function showToast(message, bgColor = '#1a2b4b') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toast.style.backgroundColor = bgColor;
    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
        toast.classList.remove('opacity-100');
    }, 2000);
}

function getCategoryColor(category) {
    const colors = {
        'Metales': '#4b5563',
        'Plasticos': '#3b82f6',
        'Carton': '#f59e0b',
        'Papel': '#64748b',
        'Electronicos': '#f97316',
        'Maderas': '#b45309'
    };
    return colors[category] || '#1a2b4b';
}

// ========== NAVEGACIÓN ==========
function goToStep(step) {
    if (step < 1 || step > 4) return;
    currentStep = step;
    updateStepUI();
    if (step === 4) buildSummary();
    if (matrizMode) activateMatrizLabels();
    showToast('Paso ' + step);
}

function nextStep() {
    if (currentStep === 1 && !selectedCategory) return;
    if (currentStep < 4) {
        currentStep++;
        updateStepUI();
        if (currentStep === 4) buildSummary();
        if (matrizMode) activateMatrizLabels();
        showToast('Paso ' + currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
        if (matrizMode) activateMatrizLabels();
        showToast('Paso ' + currentStep);
    }
}

function updateStepUI() {
    document.querySelectorAll('.form-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('step-' + currentStep).classList.remove('hidden');

    document.querySelectorAll('.step').forEach((step, i) => {
        const num = step.querySelector('.step-number');
        const label = step.querySelector('.step-label');
        if (i + 1 < currentStep) {
            num.className = 'step-number w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#78C043] text-white';
            num.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
            label.className = 'step-label text-sm font-medium text-[#78C043]';
        } else if (i + 1 === currentStep) {
            num.className = 'step-number w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#1a2b4b] text-white';
            num.textContent = i + 1;
            label.className = 'step-label text-sm font-bold text-[#1a2b4b]';
        } else {
            num.className = 'step-number w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-slate-200 text-slate-500';
            num.textContent = i + 1;
            label.className = 'step-label text-sm font-medium text-slate-500';
        }
    });

    document.querySelectorAll('.step-divider').forEach((div, i) => {
        div.className = i < currentStep - 1 ? 'step-divider w-10 h-0.5 bg-[#78C043]' : 'step-divider w-10 h-0.5 bg-slate-200';
    });
}

// ========== CATEGORÍAS ==========
function selectCategory(cat) {
    selectedCategory = cat;
    document.querySelectorAll('.category-card').forEach(card => {
        const category = card.dataset.category;
        card.classList.remove('selected');
        if (category === cat) {
            card.classList.add('selected');
        }
    });
    document.getElementById('btn-next-1').disabled = false;
    const categoryColor = getCategoryColor(cat);
    showToast('Categoria: ' + cat, categoryColor);
}

function updateGridFocus() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, i) => {
        if (i === gridFocusIndex) {
            card.classList.add('kb-focused');
        } else {
            card.classList.remove('kb-focused');
        }
    });
}

// ========== FILE UPLOAD ==========
function handleFileUpload(event, type) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        if (type === 'images') {
            uploadedImages.push(file);
            renderFileItem(file, 'list-images', 'images');
        } else {
            uploadedDocs.push(file);
            renderFileItem(file, 'list-docs', 'docs');
        }
    });
    showToast(files.length + ' archivo(s) agregado(s)');
}

function renderFileItem(file, containerId, type) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl';

    const isImage = file.type.startsWith('image/');
    const iconHtml = isImage
        ? `<div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`
        : `<div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>`;

    div.innerHTML = `
        ${iconHtml}
        <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-700 truncate">${file.name}</p>
            <p class="text-xs text-slate-400">${(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button onclick="removeFile('${file.name}', '${type}', this)" class="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;
    container.appendChild(div);
}

function removeFile(name, type, btn) {
    if (type === 'images') {
        uploadedImages = uploadedImages.filter(f => f.name !== name);
    } else {
        uploadedDocs = uploadedDocs.filter(f => f.name !== name);
    }
    btn.closest('div').remove();
    showToast('Archivo eliminado');
}

function setupDragDrop() {
    ['upload-images', 'upload-docs'].forEach(id => {
        const zone = document.getElementById(id);
        ['dragenter', 'dragover'].forEach(evt => {
            zone.addEventListener(evt, e => {
                e.preventDefault();
                zone.classList.add('border-[#78C043]', 'bg-[#78C043]/5');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            zone.addEventListener(evt, e => {
                e.preventDefault();
                zone.classList.remove('border-[#78C043]', 'bg-[#78C043]/5');
            });
        });
        zone.addEventListener('drop', e => {
            const files = Array.from(e.dataTransfer.files);
            const type = id === 'upload-images' ? 'images' : 'docs';
            files.forEach(file => {
                if (type === 'images') {
                    uploadedImages.push(file);
                    renderFileItem(file, 'list-images', 'images');
                } else {
                    uploadedDocs.push(file);
                    renderFileItem(file, 'list-docs', 'docs');
                }
            });
            showToast(files.length + ' archivo(s) agregado(s)');
        });
    });
}

// ========== SUMMARY ==========
function buildSummary() {
    const container = document.getElementById('summary-content');
    const items = [
        { label: 'Categoria', value: selectedCategory || '-' },
        { label: 'Titulo', value: document.getElementById('input-titulo').value || '-' },
        { label: 'Peso', value: (document.getElementById('input-peso').value || '-') + ' kg' },
        { label: 'Cantidad', value: document.getElementById('input-cantidad').value || '-' },
        { label: 'Fecha Generacion', value: document.getElementById('input-fecha-gen').value || '-' },
        { label: 'Fecha Disponibilidad', value: document.getElementById('input-fecha-disp').value || '-' },
        { label: 'Ubicacion', value: document.getElementById('input-ubicacion').value || '-' },
        { label: 'Precio', value: document.getElementById('input-precio').value || '-' },
    ];

    let html = '';
    items.forEach(item => {
        html += `
            <div class="p-4 bg-slate-50 rounded-xl border-l-4 border-[#78C043]">
                <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">${item.label}</p>
                <p class="text-sm font-semibold text-[#1a2b4b]">${item.value}</p>
            </div>
        `;
    });

    const desc = document.getElementById('input-descripcion').value || '-';
    html += `
        <div class="col-span-2 p-4 bg-slate-50 rounded-xl border-l-4 border-[#78C043]">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Descripcion</p>
            <p class="text-sm font-semibold text-[#1a2b4b]">${desc}</p>
        </div>
    `;

    html += `
        <div class="col-span-2 p-4 bg-slate-50 rounded-xl border-l-4 border-[#78C043]">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Archivos Adjuntos</p>
            <div class="flex flex-wrap gap-2">
                ${uploadedImages.map(f => `<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">${f.name}</span>`).join('')}
                ${uploadedDocs.map(f => `<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">${f.name}</span>`).join('')}
                ${(uploadedImages.length + uploadedDocs.length === 0) ? '<span class="text-sm text-slate-400">Sin archivos</span>' : ''}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ========== SUBMIT ==========
function submitForm() {
    document.getElementById('success-modal').classList.remove('hidden');
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
    currentStep = 1;
    selectedCategory = null;
    uploadedImages = [];
    uploadedDocs = [];
    document.querySelectorAll('input, textarea').forEach(el => el.value = '');
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('list-images').innerHTML = '';
    document.getElementById('list-docs').innerHTML = '';
    document.getElementById('btn-next-1').disabled = true;
    updateStepUI();
}

// ========== COMMANDS MODAL ==========
function toggleCommands() {
    const modal = document.getElementById('commands-modal');
    modal.classList.toggle('hidden');
}

// ========== MODO MATRIZ ==========
function toggleMatrizMode() {
    matrizMode = !matrizMode;
    if (matrizMode) activateMatrizLabels();
    else deactivateMatrizLabels();
}

function activateMatrizLabels() {
    deactivateMatrizLabels();
    if (currentStep === 1) {
        document.querySelectorAll('.category-card').forEach((card, index) => {
            addKeyLabelInside(card, `Alt + ${index + 1}`);
        });
    }
    if (currentStep === 2) {
        const fieldMaps = [
            { id: 'input-titulo', label: 'Alt + T' },
            { id: 'input-descripcion', label: 'Alt + D' },
            { id: 'input-peso', label: 'Alt + P' },
            { id: 'input-cantidad', label: 'Alt + C' },
            { id: 'input-fecha-gen', label: 'Alt + G' },
            { id: 'input-fecha-disp', label: 'Alt + F' },
            { id: 'input-ubicacion', label: 'Alt + U' },
            { id: 'input-precio', label: 'Alt + R' }
        ];
        fieldMaps.forEach(field => {
            const el = document.getElementById(field.id);
            if (el) addKeyLabelInside(el, field.label);
        });
    }
    if (currentStep === 3) {
        const uploadImages = document.getElementById('upload-images');
        const uploadDocs = document.getElementById('upload-docs');
        if (uploadImages) addKeyLabelInside(uploadImages, 'Alt + I');
        if (uploadDocs) addKeyLabelInside(uploadDocs, 'Alt + O');
    }
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

// ========== KEYBOARD SHORTCUTS ==========
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        const now = Date.now();
        if (now - lastKeyTime > 500) keySequence = [];
        lastKeyTime = now;
        keySequence.push(e.key.toLowerCase());

        const tag = document.activeElement.tagName;
        const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

        if (keySequence.length >= 2 && keySequence.slice(-2).join('') === 'qa') {
            if (!isInput) {
                e.preventDefault();
                toggleMatrizMode();
            }
            keySequence = [];
            return;
        }

        if (e.shiftKey && e.key === '?') {
            e.preventDefault();
            toggleCommands();
            return;
        }

        if (e.key === 'Escape') {
            document.getElementById('commands-modal').classList.add('hidden');
            document.getElementById('success-modal').classList.add('hidden');
            return;
        }

        if (e.altKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            window.location.href = 'empresa.html';
            return;
        }
        if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault();
            nextStep();
            return;
        }
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            prevStep();
            return;
        }

        if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
            e.preventDefault();
            goToStep(parseInt(e.key));
            return;
        }

        if (currentStep === 1 && !isInput) {
            const categories = ['Metales', 'Plasticos', 'Carton', 'Papel', 'Electronicos', 'Maderas'];
            if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
                e.preventDefault();
                selectCategory(categories[parseInt(e.key) - 1]);
                return;
            }

            const cards = document.querySelectorAll('.category-card');
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                gridFocusIndex = (gridFocusIndex + 1) % 6;
                updateGridFocus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                gridFocusIndex = (gridFocusIndex - 1 + 6) % 6;
                updateGridFocus();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                gridFocusIndex = (gridFocusIndex + 3) % 6;
                updateGridFocus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                gridFocusIndex = (gridFocusIndex - 3 + 6) % 6;
                updateGridFocus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectCategory(categories[gridFocusIndex]);
            }
        }

        if (currentStep === 2 && e.altKey) {
            const fieldMap = {
                't': 'input-titulo',
                'd': 'input-descripcion',
                'p': 'input-peso',
                'c': 'input-cantidad',
                'g': 'input-fecha-gen',
                'f': 'input-fecha-disp',
                'u': 'input-ubicacion',
                'r': 'input-precio'
            };
            if (fieldMap[e.key.toLowerCase()]) {
                e.preventDefault();
                document.getElementById(fieldMap[e.key.toLowerCase()]).focus();
                return;
            }
        }

        if (currentStep === 3 && e.altKey) {
            if (e.key.toLowerCase() === 'i') {
                e.preventDefault();
                document.getElementById('file-images').click();
            } else if (e.key.toLowerCase() === 'o') {
                e.preventDefault();
                document.getElementById('file-docs').click();
            }
        }

        if (currentStep === 4 && e.key === 'Enter' && !isInput) {
            e.preventDefault();
            submitForm();
        }
    });
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    updateStepUI();
    setupKeyboardShortcuts();
    setupDragDrop();
});