document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-home">
        <div class="flex flex-col h-full gap-6 max-w-7xl mx-auto w-full">
            
            <!-- Header Institucional CDE (Minimalista y Animado) -->
            <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 animate-fade-in shrink-0">
                <!-- Izquierda: Logo y CDE -->
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full overflow-hidden shadow-sm border-2 border-slate-100 dark:border-slate-700 bg-transparent flex-shrink-0 hover:scale-110 hover:rotate-6 transition-transform duration-300">
                        <img src="./img/images.png" alt="Logo CDE" class="w-full h-full object-contain drop-shadow-md p-1">
                    </div>
                    <h1 class="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter hover:scale-105 transition-transform duration-300 cursor-default">CDE</h1>
                </div>
                
                <!-- Centro/Derecha: Título Institucional -->
                <div class="flex-1 text-center md:text-right md:mr-6">
                    <h2 class="text-sm md:text-lg font-bold text-slate-600 dark:text-slate-300 tracking-wide">
                        I.S.F.D. y T. Nº 57 <span class="text-blue-500 font-black">“Juana Paula Manso”</span>
                    </h2>
                </div>

                <!-- Emoticones Funcionales y Animados -->
                <div class="flex items-center justify-center gap-4 md:gap-5 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <button onclick="navigate('foro')" class="text-3xl hover:scale-125 hover:-translate-y-2 hover:-rotate-12 transition-all duration-300 drop-shadow-sm" title="Ir al Foro">💬</button>
                    <button onclick="navigate('calendario')" class="text-3xl hover:scale-125 hover:-translate-y-2 hover:rotate-12 transition-all duration-300 drop-shadow-sm" title="Ver Calendario">📅</button>
                    <button onclick="navigate('materias')" class="text-3xl hover:scale-125 hover:-translate-y-2 hover:-rotate-12 transition-all duration-300 drop-shadow-sm" title="Mis Materias">📚</button>
                    <button onclick="toggleDarkMode()" class="text-3xl hover:scale-125 hover:-translate-y-2 hover:rotate-180 transition-all duration-500 drop-shadow-sm" title="Cambiar Tema">🌗</button>
                </div>
            </div>

            <!-- Banner de Bienvenida -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden shrink-0 animate-fadeIn">
                <div class="relative z-10">
                    <h2 class="text-3xl md:text-4xl font-black mb-2">Bienvenido/a, <span id="home-welcome-name" class="text-yellow-300"></span>! 👋</h2>
                    <p class="text-blue-100 mb-6 text-sm md:text-base">¿Qué deseas hacer hoy? Aquí tienes algunos accesos rápidos.</p>
                    <div class="flex flex-wrap gap-3">
                        <button onclick="navigate('calendario')" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm"><i class="fas fa-calendar-check"></i> Calendario</button>
                        <button onclick="navigate('horarios')" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm"><i class="fas fa-clock"></i> Horarios</button>
                        <button onclick="navigate('foro')" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm"><i class="fas fa-comments"></i> Foro</button>
                        <button onclick="navigate('materias')" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm"><i class="fas fa-book-open"></i> Materias</button>
                    </div>
                </div>
                <!-- Elementos decorativos -->
                <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-10 right-20 w-40 h-40 rounded-full bg-blue-400 opacity-20 blur-2xl pointer-events-none"></div>
                <i class="fas fa-graduation-cap absolute -right-4 -bottom-4 text-[120px] text-white opacity-10 -rotate-12 pointer-events-none"></i>
            </div>

            <!-- Grilla Principal -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1 pb-4">
                <div class="flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-lg border dark:border-slate-800 overflow-hidden">
                    <div class="p-5 bg-blue-600 text-white flex justify-between items-center">
                        <h3 class="font-black uppercase tracking-wider flex items-center"><i class="fas fa-bullhorn mr-2"></i> Novedades</h3>
                    </div>
                    <div id="admin-news-panel" class="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hidden">
                        <textarea id="news-input" class="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Escribe una novedad (puedes pegar links)..."></textarea>
                        <input type="text" id="news-img-url" class="w-full mt-2 p-2 rounded-xl border dark:bg-slate-900 dark:border-slate-700 text-sm" placeholder="URL de imagen (opcional)">
                        <button onclick="postNews()" class="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-blue-700">Publicar</button>
                    </div>
                    <div id="news-container" class="flex-1 overflow-y-auto p-4 space-y-4 custom-height"></div>
                </div>

                <div class="flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-lg border dark:border-slate-800 overflow-hidden">
                    <div class="p-5 bg-indigo-600 text-white flex justify-between items-center">
                        <h3 class="font-black uppercase tracking-wider flex items-center"><i class="fas fa-calendar-star mr-2"></i> Próximos Eventos</h3>
                    </div>
                    <div id="admin-event-panel" class="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hidden">
                        <input type="text" id="event-title" class="w-full p-2 rounded-xl border dark:bg-slate-900 dark:border-slate-700 text-sm mb-2" placeholder="Nombre del evento">
                        <div class="flex gap-2 mb-2">
                            <input type="date" id="event-date" class="w-1/2 p-2 rounded-xl border dark:bg-slate-900 dark:border-slate-700 text-sm">
                            <input type="time" id="event-time" class="w-1/2 p-2 rounded-xl border dark:bg-slate-900 dark:border-slate-700 text-sm">
                        </div>
                        <button onclick="postEvent()" class="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-indigo-700">Crear Evento</button>
                    </div>
                    <div id="events-container" class="flex-1 overflow-y-auto p-4 space-y-4 custom-height"></div>
                </div>
            </div>
        </div>
    </template>
`);

function renderHome() {
    const profile = userProfiles[currentUser] || {};
    const nickname = profile.nickname || currentUser.split('@')[0];
    const welcomeNameEl = document.getElementById('home-welcome-name');
    if (welcomeNameEl) welcomeNameEl.innerText = nickname;

    if (isPrivileged()) {
        document.getElementById('admin-news-panel').classList.remove('hidden');
        document.getElementById('admin-event-panel').classList.remove('hidden');
    }
    renderNews();
    renderGlobalEvents();
}

function postNews() {
    const text = document.getElementById('news-input').value;
    const img = document.getElementById('news-img-url').value;
    if (!text.trim()) return;
    
    const profile = userProfiles[currentUser] || {};
    const authorName = profile.nickname || currentUser.split('@')[0];

    globalNews.unshift({
        author: authorName,
        content: text,
        image: img,
        date: new Date().toLocaleString()
    });
    localStorage.setItem('app_news', JSON.stringify(globalNews));
    document.getElementById('news-input').value = '';
    document.getElementById('news-img-url').value = '';
    renderNews();
}

function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    container.innerHTML = globalNews.map(n => `
        <div class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border dark:border-slate-700 animate-fade-in">
            <div class="flex items-center gap-2 mb-2">
                <span class="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Staff</span>
                <span class="text-xs font-bold">${n.author}</span>
                <span class="text-[10px] text-slate-400 ml-auto">${n.date}</span>
            </div>
            <p class="text-sm mb-3 break-words">${n.content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-500 underline break-all">$1</a>')}</p>
            ${n.image ? `<img src="${n.image}" class="rounded-xl w-full h-40 object-cover border dark:border-slate-600">` : ''}
        </div>
    `).join('');
}

function postEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    if (!title || !date) return;

    globalEvents.unshift({
        id: Date.now(),
        title, date, time,
        attendees: []
    });
    localStorage.setItem('app_global_events', JSON.stringify(globalEvents));
    renderGlobalEvents();
}

function renderGlobalEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;
    container.innerHTML = globalEvents.map(e => {
        const isInscribed = e.attendees.includes(currentUser);
        return `
        <div class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border-l-4 border-indigo-500 shadow-sm">
            <h4 class="font-bold text-indigo-600 dark:text-indigo-400 break-words">${e.title}</h4>
            
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span class="whitespace-nowrap"><i class="fas fa-calendar mr-1"></i> ${e.date}</span>
                <span class="whitespace-nowrap"><i class="fas fa-clock mr-1"></i> ${e.time}</span>
            </div>
            
            <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span class="text-[10px] font-medium whitespace-nowrap"><i class="fas fa-users mr-1"></i> ${e.attendees.length} inscriptos</span>
                <button onclick="toggleInscribe(${e.id})" class="px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${isInscribed ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-indigo-600 text-white hover:bg-indigo-700'}">
                    ${isInscribed ? 'Cancelar' : 'Inscribirme'}
                </button>
            </div>
        </div>
    `}).join('');
}

function toggleInscribe(id) {
    globalEvents = globalEvents.map(e => {
        if (e.id === id) {
            if (e.attendees.includes(currentUser)) {
                e.attendees = e.attendees.filter(u => u !== currentUser);
            } else {
                e.attendees.push(currentUser);
            }
        }
        return e;
    });
    localStorage.setItem('app_global_events', JSON.stringify(globalEvents));
    renderGlobalEvents();
}