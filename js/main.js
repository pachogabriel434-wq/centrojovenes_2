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
    navigate('login');
});