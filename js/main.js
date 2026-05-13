// --- ESTADO GLOBAL ---
let currentUser = null;
let userEvents = {}; 
let userSchedules = {};
let forumPosts = [];
let globalNews = JSON.parse(localStorage.getItem('app_news') || '[]');
let globalEvents = JSON.parse(localStorage.getItem('app_global_events') || '[]');
let userProfiles = JSON.parse(localStorage.getItem('app_profiles') || '{}');
let globalSubjects = JSON.parse(localStorage.getItem('app_subjects') || '[]');
let globalNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
let currentHomeCategory = 'institucional'; // Estado global de la categoría de inicio

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function getUserRole(email) {
    if (!email) return 'alumno';
    if (email === 'admin@admin.com') {
        if (!userProfiles[email]) {
            userProfiles[email] = { password: 'admin', role: 'admin', nickname: 'Administrador' };
            localStorage.setItem('app_profiles', JSON.stringify(userProfiles));
        }
        return 'admin';
    }
    const profile = userProfiles[email];
    return profile ? (profile.role || 'alumno') : 'alumno';
}

function isAdmin() { return getUserRole(currentUser) === 'admin'; }
function isDelegado() { const r = getUserRole(currentUser); return r === 'admin' || r === 'delegado'; }
function isDocente() { const r = getUserRole(currentUser); return r === 'admin' || r === 'docente'; }

// --- UTILIDADES GLOBALES ---
function isImageUrl(url) {
    if (!url) return false;
    if (url.startsWith('data:image/')) return true;
    return /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(url.split('?')[0].split('#')[0]);
}

// --- MOTOR DE NAVEGACIÓN ---
function navigate(page) {
    const content = document.getElementById('app-content');
    const title = document.getElementById('page-title');
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('main-header');
    
    if (!currentUser) page = 'login';

    if (page === 'login') {
        if (sidebar) sidebar.classList.add('hidden');
        if (header) header.classList.add('hidden');
    } else {
        if (sidebar) sidebar.classList.remove('hidden');
        if (header) header.classList.remove('hidden');
        if (sidebar) sidebar.classList.add('-translate-x-full');
        updateNotifications();
    }

    const template = document.getElementById(`tpl-${page}`);
    if (template) {
        if (content) content.innerHTML = template.innerHTML;
        if (title) title.innerText = page.toUpperCase();
        
        if (page === 'login') initLogin();
        if (page === 'home') renderHome();
        if (page === 'perfil') initProfile();
        if (page === 'calendario') renderCalendar();
        if (page === 'foro') renderForo();
        if (page === 'horarios') renderSchedule();
        if (page === 'materias') renderMaterias();
        if (page === 'instructivos') renderInstructivos();
        if (page === 'galeria') renderGaleria();
    }
}

// --- SISTEMA DE NOTIFICACIONES ---
function updateNotifications() {
    const bellContainer = document.getElementById('notification-bell-container');
    if (!bellContainer) return;

    if (getUserRole(currentUser) !== 'alumno') {
        bellContainer.classList.add('hidden');
        return;
    }
    
    bellContainer.classList.remove('hidden');
    const myNotifs = globalNotifications.slice(-20).reverse();
    const badge = document.getElementById('notification-badge');
    const list = document.getElementById('notification-list');
    const profile = userProfiles[currentUser] || {};
    const lastRead = profile.lastReadNotifs || 0;
    const unreadCount = myNotifs.filter(n => n.timestamp > lastRead).length;
    
    if (unreadCount > 0) {
        badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
    
    if (myNotifs.length === 0) {
        list.innerHTML = `<div class="text-xs text-slate-400 text-center p-6 italic">No hay novedades en tus materias.</div>`;
    } else {
        list.innerHTML = myNotifs.map(n => `
            <div class="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border ${n.timestamp > lastRead ? 'border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700'} cursor-pointer hover:shadow-md transition-all" onclick="navigate('materias'); setTimeout(() => openSubject(${n.subjectId}), 100); toggleNotifications();">
                <p class="text-xs font-bold text-slate-800 dark:text-white mb-1"><i class="${n.type === 'tarea' ? 'fas fa-tasks text-blue-500' : 'fas fa-bullhorn text-yellow-500'} mr-1"></i> ${n.subjectName}</p>
                <p class="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">${n.title}</p>
                <p class="text-[9px] text-slate-400 mt-1">${n.date}</p>
            </div>
        `).join('');
    }
}

function toggleNotifications() {
    document.getElementById('notification-dropdown').classList.toggle('hidden');
}

function clearNotifications() {
    if (!userProfiles[currentUser]) userProfiles[currentUser] = {};
    userProfiles[currentUser].lastReadNotifs = Date.now();
    localStorage.setItem('app_profiles', JSON.stringify(userProfiles));
    updateNotifications();
}

// --- SISTEMA DE ALERTAS PERSONALIZADAS (TOAST) ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    
    // Configuración según el tipo
    const configs = {
        success: { icon: 'fa-check-circle', color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' },
        error: { icon: 'fa-exclamation-circle', color: 'border-red-500 text-red-600 dark:text-red-400' },
        warning: { icon: 'fa-exclamation-triangle', color: 'border-amber-500 text-amber-600 dark:text-amber-400' },
        info: { icon: 'fa-info-circle', color: 'border-blue-500 text-blue-600 dark:text-blue-400' }
    };

    const config = configs[type] || configs.info;

    toast.className = `pointer-events-auto flex items-center gap-3 p-4 min-w-[300px] bg-white dark:bg-slate-900 border-l-4 ${config.color} shadow-2xl rounded-2xl animate-slide-up-fade overflow-hidden`;
    
    toast.innerHTML = `
        <i class="fas ${config.icon} text-xl"></i>
        <div class="flex-1">
            <p class="text-sm font-black">${message}</p>
        </div>
        <button class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Auto-eliminar
    const removeToast = () => {
        toast.classList.add('opacity-0', 'translate-x-full');
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector('button').onclick = removeToast;
    container.appendChild(toast);
    setTimeout(removeToast, 4000);
}

// --- SISTEMA DE MODALES PERSONALIZADOS (REEMPLAZO DE PROMPT) ---
function showModalPrompt(title, label, defaultValue, callback) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border dark:border-slate-800 animate-slide-up-fade">
            <h3 class="text-xl font-black text-slate-800 dark:text-white mb-2">${title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">${label}</p>
            <input type="text" id="modal-prompt-input" class="w-full mb-6 border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 font-bold" autofocus>
            <div class="flex gap-3">
                <button id="modal-cancel" class="flex-1 px-4 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Cancelar</button>
                <button id="modal-confirm" class="flex-1 px-4 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition">Guardar</button>
            </div>
        </div>
    `;

    const input = document.getElementById('modal-prompt-input');
    input.value = defaultValue || '';
    container.classList.remove('hidden');
    
    setTimeout(() => {
        input.focus();
        input.select();
    }, 50);

    const close = () => container.classList.add('hidden');

    document.getElementById('modal-cancel').onclick = () => {
        close();
        callback(null);
    };

    document.getElementById('modal-confirm').onclick = () => {
        const val = input.value.trim();
        close();
        callback(val);
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter') document.getElementById('modal-confirm').click();
        if (e.key === 'Escape') document.getElementById('modal-cancel').click();
    };
}

// --- SISTEMA DE DROPDOWNS PERSONALIZADOS (PARA HOME CATEGORÍAS) ---
function toggleCategoryDropdown() {
    const dropdown = document.getElementById('home-category-dropdown');
    const icon = document.getElementById('category-dropdown-icon');
    if (dropdown && icon) {
        const isHidden = dropdown.classList.toggle('hidden');
        if (isHidden) icon.classList.remove('rotate-180');
        else icon.classList.add('rotate-180');
    }
}

// --- SIDEBAR LOGIC ---
let isSidebarPinned = localStorage.getItem('sidebar_pinned') !== 'false'; // Por defecto fijado

function togglePinSidebar() {
    isSidebarPinned = !isSidebarPinned;
    localStorage.setItem('sidebar_pinned', isSidebarPinned);
    applySidebarPinState();
}

function applySidebarPinState() {
    const sidebar = document.getElementById('sidebar');
    const pinIcon = document.getElementById('pin-icon');
    
    if (!sidebar || !pinIcon) return;
    
    if (isSidebarPinned) {
        sidebar.classList.add('sidebar-pinned');
        pinIcon.classList.remove('-rotate-45', 'text-slate-400');
        pinIcon.classList.add('text-blue-400');
    } else {
        sidebar.classList.remove('sidebar-pinned');
        pinIcon.classList.add('-rotate-45', 'text-slate-400');
        pinIcon.classList.remove('text-blue-400');
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    const btnOpen = document.getElementById('open-sidebar');
    if (btnOpen) btnOpen.onclick = () => document.getElementById('sidebar')?.classList.remove('-translate-x-full');
    
    const btnClose = document.getElementById('close-sidebar');
    if (btnClose) btnClose.onclick = () => document.getElementById('sidebar')?.classList.add('-translate-x-full');
    
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
    
    applySidebarPinState();

    // Global click listener for dropdowns (e.g., home category dropdown)
    document.addEventListener('click', (event) => {
        // Handle home category dropdown
        const dropdownButton = document.getElementById('category-dropdown-button');
        const dropdownContent = document.getElementById('home-category-dropdown');
        const icon = document.getElementById('category-dropdown-icon');

        if (dropdownContent && !dropdownContent.classList.contains('hidden') &&
            !dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.add('hidden');
            if (icon) icon.classList.remove('rotate-180');
        }
    });
    navigate('login');
});