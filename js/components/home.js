document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-home">
        <div class="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
            
            <!-- Banner de Bienvenida -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden shrink-0 animate-fadeIn">
                <div class="relative z-10">
                    <h2 class="text-3xl md:text-4xl font-black mb-2">Bienvenido/a, <span id="home-welcome-name" class="text-yellow-300"></span>! 👋</h2>
                </div>
                <!-- Elementos decorativos -->
                <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-10 right-20 w-40 h-40 rounded-full bg-blue-400 opacity-20 blur-2xl pointer-events-none"></div>
                <i class="fas fa-graduation-cap absolute -right-4 -bottom-4 text-[120px] text-white opacity-10 -rotate-12 pointer-events-none"></i>
            </div>

            <!-- Contenedor Unificado de Eventos -->
            <div class="flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border dark:border-slate-800 overflow-hidden mb-4">
                <div class="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-700 relative">
                    <h3 class="font-black uppercase tracking-[0.2em] text-sm flex items-center" id="home-category-title">
                        <i class="fas fa-star mr-3 text-blue-400"></i> Eventos
                    </h3>

                    <div class="flex gap-2">
                        <!-- Menú Desplegable de Filtros Avanzados -->
                        <div class="relative">
                            <button onclick="toggleFiltersDropdown()" id="filters-dropdown-button" class="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-3 border border-slate-700">
                                <i class="fas fa-filter text-blue-400"></i> Filtrar <i class="fas fa-chevron-down transition-transform duration-200" id="filters-dropdown-icon"></i>
                            </button>
                            <div id="home-filters-dropdown" class="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border dark:border-slate-700 hidden z-50 overflow-hidden animate-fadeIn backdrop-blur-xl max-h-[500px] overflow-y-auto border-t-8 border-blue-600">
                                <div class="p-5 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                                    <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <i class="fas fa-sliders-h text-blue-500"></i> Filtros de búsqueda
                                    </h4>
                                    <button onclick="resetHomeFilters()" class="text-[9px] font-black text-blue-500 hover:text-blue-600 uppercase tracking-tighter transition-colors">Resetear</button>
                                </div>

                                <div class="p-4 space-y-6">
                                    <!-- Sección: Carreras -->
                                    <div>
                                        <label class="px-2 mb-3 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Carrera</label>
                                        <div class="grid grid-cols-1 gap-1">
                                            <button onclick="setHomeCareer('todas')" data-filter="career-todas" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Todas <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                            <button onclick="setHomeCareer('Sistemas')" data-filter="career-Sistemas" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Sistemas <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                            <button onclick="setHomeCareer('Magisterio')" data-filter="career-Magisterio" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Magisterio <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                        </div>
                                    </div>

                                    <!-- Sección: Materias -->
                                    <div>
                                        <label class="px-2 mb-3 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Materia</label>
                                        <div class="grid grid-cols-1 gap-1">
                                            <button onclick="setHomeSubject('todas')" data-filter="subject-todas" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Todas <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                            <button onclick="setHomeSubject('General')" data-filter="subject-General" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">General <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                            ${globalSubjects.map(s => `<button onclick="setHomeSubject('${s.name}')" data-filter="subject-${s.name}" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between line-clamp-1">${s.name} <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>`).join('')}
                                        </div>
                                    </div>

                                    <!-- Sección: Fecha -->
                                    <div>
                                        <label class="px-2 mb-3 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Fecha</label>
                                        <div class="grid grid-cols-1 gap-1">
                                            <button onclick="setHomeDateFilter('hoy')" data-filter="date-hoy" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Hoy <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                            <button onclick="setHomeDateFilter('semana')" data-filter="date-semana" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Esta Semana <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                            <button onclick="setHomeDateFilter('todos')" data-filter="date-todos" class="filter-opt w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-between">Histórico <i class="fas fa-check opacity-0 text-blue-500 text-[10px]"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Menú Desplegable de Categorías -->
                        <button onclick="toggleCategoryDropdown()" id="category-dropdown-button" class="bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-3 border border-slate-700">
                            Categorías <i class="fas fa-chevron-down transition-transform duration-200" id="category-dropdown-icon"></i>
                        </button>
                        <div id="home-category-dropdown" class="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border dark:border-slate-700 hidden z-50 overflow-hidden animate-fadeIn backdrop-blur-xl">
                            <button onclick="setHomeCategory('urgente')" class="w-full text-left px-6 py-4 text-xs font-black hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition border-b dark:border-slate-700 flex items-center gap-3"><i class="fas fa-fire"></i> URGENTE</button>
                            <button onclick="setHomeCategory('academicas')" class="w-full text-left px-6 py-4 text-xs font-black hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition border-b dark:border-slate-700 flex items-center gap-3"><i class="fas fa-book"></i> ACADÉMICAS</button>
                            <button onclick="setHomeCategory('social')" class="w-full text-left px-6 py-4 text-xs font-black hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-500 transition border-b dark:border-slate-700 flex items-center gap-3"><i class="fas fa-users"></i> SOCIAL</button>
                            <button onclick="setHomeCategory('institucional')" class="w-full text-left px-6 py-4 text-xs font-black hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition flex items-center gap-3"><i class="fas fa-university"></i> INSTITUCIONAL</button>
                        </div>
                    </div>
                </div>

                <!-- Panel de Publicación (Solo Admin/Docente) -->
                <div id="staff-post-panel" class="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hidden">
                    <div class="flex flex-col gap-4">
                        <textarea id="home-post-input" class="w-full p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white text-sm focus:border-blue-500 outline-none resize-none transition-all shadow-sm font-medium" rows="2" placeholder="Comparte una novedad o aviso con la comunidad..."></textarea>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select id="home-post-career" class="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-xs font-bold outline-none focus:border-blue-500 text-slate-500">
                                <option value="Todas">Para todas las carreras</option>
                                <option value="Sistemas">Tec. en Sistemas</option>
                                <option value="Magisterio">Magisterio</option>
                                <option value="Biologia">Biología</option>
                            </select>
                            <select id="home-post-subject" class="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-xs font-bold outline-none focus:border-blue-500 text-slate-500">
                                <option value="General">Materia: General / Institucional</option>
                                ${globalSubjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex-1 relative">
                                <i class="fas fa-link absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input type="text" id="home-post-url" class="w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white text-xs outline-none focus:border-blue-500" placeholder="Enlace externo o URL de imagen (opcional)">
                            </div>
                            <button onclick="postToHome()" class="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-500/20">Publicar</button>
                        </div>
                    </div>
                </div>

                <div id="home-events-feed" class="p-8 space-y-8"></div>
            </div>
        </div>
    </template>
`);

function renderHome() {
    const profile = userProfiles[currentUser] || {};
    const nickname = profile.nickname || currentUser.split('@')[0];
    const welcomeNameEl = document.getElementById('home-welcome-name');
    if (welcomeNameEl) welcomeNameEl.innerText = nickname;

    const panel = document.getElementById('staff-post-panel');
    if (panel) {
        if (isDocente()) panel.classList.remove('hidden');
        else panel.classList.add('hidden');
    }
    
    const titleEl = document.getElementById('home-category-title');
    if (titleEl) {
        const labels = {
            urgente: { text: 'Urgente', icon: 'fa-fire', color: 'text-red-500' },
            academicas: { text: 'Académicas', icon: 'fa-book', color: 'text-blue-500' },
            social: { text: 'Social', icon: 'fa-users', color: 'text-pink-500' },
            institucional: { text: 'Institucional', icon: 'fa-university', color: 'text-slate-400' }
        };
        const cfg = labels[currentHomeCategory];
        titleEl.innerHTML = `<i class="fas ${cfg.icon} mr-3 ${cfg.color} text-xl"></i> Eventos: ${cfg.text}`;
    }

    updateFilterActiveStates();
    renderHomeFeed();
    // Resetear estado visual del dropdown al renderizar
    const dropdown = document.getElementById('home-category-dropdown');
    const icon = document.getElementById('category-dropdown-icon');
    if (dropdown) dropdown.classList.add('hidden');
    if (icon) icon.classList.remove('rotate-180');

    const filtersDropdown = document.getElementById('home-filters-dropdown');
    const filtersIcon = document.getElementById('filters-dropdown-icon');
    if (filtersDropdown) filtersDropdown.classList.add('hidden');
    if (filtersIcon) filtersIcon.classList.remove('rotate-180');
}

function updateFilterActiveStates() {
    const options = document.querySelectorAll('.filter-opt');
    options.forEach(opt => {
        const filterAttr = opt.getAttribute('data-filter');
        if (!filterAttr) return;

        const [type, value] = filterAttr.split('-');
        let isActive = false;

        if (type === 'career') isActive = (currentHomeCareer === value);
        if (type === 'subject') isActive = (currentHomeSubject === value);
        if (type === 'date') isActive = (currentHomeDateFilter === value);

        const icon = opt.querySelector('i');
        if (isActive) {
            opt.classList.add('bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600', 'dark:text-blue-400');
            opt.classList.remove('text-slate-600', 'dark:text-slate-300');
            if (icon) icon.classList.remove('opacity-0');
        } else {
            opt.classList.remove('bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600', 'dark:text-blue-400');
            opt.classList.add('text-slate-600', 'dark:text-slate-300');
            if (icon) icon.classList.add('opacity-0');
        }
    });

    // Actualizar estilo del botón de filtro si hay filtros activos
    const filterBtn = document.getElementById('filters-dropdown-button');
    if (filterBtn) {
        const isFiltering = currentHomeCareer !== 'todas' || currentHomeSubject !== 'todas' || currentHomeDateFilter !== 'todos';
        if (isFiltering) {
            filterBtn.classList.add('border-blue-500', 'text-blue-400');
        } else {
            filterBtn.classList.remove('border-blue-500', 'text-blue-400');
        }
    }
}


function postToHome() {
    const text = document.getElementById('home-post-input').value;
    const url = document.getElementById('home-post-url').value;
    if (!text.trim()) {
        showToast("El contenido de la publicación no puede estar vacío", "warning");
        return;
    }
    
    const profile = userProfiles[currentUser] || {};
    const authorName = profile.nickname || currentUser.split('@')[0];

    globalNews.unshift({
        id: Date.now(),
        author: authorName,
        content: text,
        image: url,
        category: currentHomeCategory,
        career: document.getElementById('home-post-career').value,
        subject: document.getElementById('home-post-subject').value,
        date: new Date().toLocaleString(),
        isPinned: false
    });
    localStorage.setItem('app_news', JSON.stringify(globalNews));
    document.getElementById('home-post-input').value = '';
    document.getElementById('home-post-url').value = '';
    showToast(`Publicado en ${currentHomeCategory}`, "success");
    renderHomeFeed();
}

function resetHomeFilters() {
    currentHomeCareer = 'todas';
    currentHomeSubject = 'todas';
    currentHomeDateFilter = 'todos';
    renderHome();
}

function setHomeCategory(cat) {
    currentHomeCategory = cat;
    renderHome();
}

function setHomeSubject(subject) {
    currentHomeSubject = subject;
    renderHome();
}

function setHomeCareer(career) {
    currentHomeCareer = career;
    renderHome();
}

function setHomeDateFilter(filter) {
    currentHomeDateFilter = filter;
    renderHome();
}

function renderHomeFeed() {
    const container = document.getElementById('home-events-feed');
    if (!container) return;

    let filtered = globalNews.filter(n => (n.category || 'institucional') === currentHomeCategory);

    if (currentHomeCareer !== 'todas') filtered = filtered.filter(n => n.career === currentHomeCareer);
    if (currentHomeSubject !== 'todas') filtered = filtered.filter(n => n.subject === currentHomeSubject);
    
    if (currentHomeDateFilter === 'hoy') {
        const today = new Date().toLocaleDateString();
        filtered = filtered.filter(n => n.date.startsWith(today));
    } else if (currentHomeDateFilter === 'semana') {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(n => {
            try {
                const postDate = new Date(n.date);
                return postDate >= oneWeekAgo;
            } catch(e) {
                return false;
            }
        });
    }

    // Ordenar: Primero los fijados (isPinned), luego por ID descendente (más nuevos)
    filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.id - a.id;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-20 opacity-30 flex flex-col items-center gap-4">
            <i class="fas fa-folder-open text-5xl"></i>
            <p class="font-bold italic">No hay publicaciones en esta categoría todavía.</p>
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(n => `
        <div class="relative bg-white dark:bg-slate-800/40 p-6 rounded-[2rem] border-2 ${n.isPinned ? 'border-blue-500 shadow-blue-500/10' : 'border-slate-50 dark:border-slate-800'} shadow-sm animate-fadeIn group">
            ${n.isPinned ? '<div class="absolute -top-3 left-8 bg-blue-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><i class="fas fa-thumbtack"></i> Fijado por la institución</div>' : ''}
            <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div>
                    <h4 class="text-sm font-black text-slate-800 dark:text-white">${n.author}</h4>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">${n.date}</p>
                </div>
                ${isDocente() ? `
                    <div class="ml-auto flex gap-1">
                        <button onclick="togglePinPost(${n.id})" class="text-slate-300 ${n.isPinned ? 'text-blue-500' : 'hover:text-blue-400'} transition-colors p-2" title="Fijar mensaje"><i class="fas fa-thumbtack"></i></button>
                        <button onclick="deleteHomePost(${n.id})" class="text-slate-300 hover:text-red-500 transition-colors p-2"><i class="fas fa-trash-alt"></i></button>
                    </div>
                ` : ''}
            </div>
            <div class="prose dark:prose-invert max-w-none">
                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">${n.content.replace(/(https?:\/\/[^\s]+)/g, '').trim()}</p>
            </div>
            <div class="flex gap-2 mb-4">
                ${n.career && n.career !== 'Todas' ? `<span class="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border dark:border-slate-700">${n.career}</span>` : ''}
                ${n.subject && n.subject !== 'General' ? `<span class="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-100 dark:border-blue-800">${n.subject}</span>` : ''}
            </div>
            ${n.image ? (isImageUrl(n.image) ? `
                <div class="rounded-3xl overflow-hidden border dark:border-slate-700 shadow-inner max-h-96">
                    <img src="${n.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                </div>
            ` : `
                <div class="mt-2">
                    <a href="${n.image}" target="_blank" class="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                        <i class="fas fa-external-link-alt"></i> Acceder al sitio compartido
                    </a>
                </div>
            `) : ''}
        </div>
    `).join('');
}

function togglePinPost(id) {
    const post = globalNews.find(n => n.id === id);
    if (post) {
        post.isPinned = !post.isPinned;
        localStorage.setItem('app_news', JSON.stringify(globalNews));
        showToast(post.isPinned ? "Mensaje fijado" : "Mensaje desfijado", "info");
        renderHomeFeed();
    }
}

function deleteHomePost(id) {
    if (!confirm("¿Seguro que deseas eliminar esta publicación?")) return;
    globalNews = globalNews.filter(n => n.id !== id);
    localStorage.setItem('app_news', JSON.stringify(globalNews));
    showToast("Publicación eliminada", "info");
    renderHomeFeed();
}

function toggleFiltersDropdown() {
    const dropdown = document.getElementById('home-filters-dropdown');
    const icon = document.getElementById('filters-dropdown-icon');
    const isHidden = dropdown.classList.toggle('hidden');
    if (isHidden) icon.classList.remove('rotate-180');
    renderHomeFeed();
}