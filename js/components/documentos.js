// Inyectar el template si no existe
if (!document.getElementById('tpl-documentos')) {
    document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-documentos">
        <div class="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24">
            
            <!-- Cabecera Institucional Mejorada -->
            <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl border border-white/10">
                <div class="relative z-10 space-y-4">
                    <h2 class="text-4xl md:text-5xl font-black tracking-tight leading-none">Reglamentación <br><span class="text-blue-500">ISFDyT 57 Chascomús</span></h2>
                    <p class="text-slate-400 max-w-xl text-sm leading-relaxed">Consulta la normativa académica, convivencia y guías del instituto.</p>
                </div>
                <i class="fas fa-balance-scale absolute -right-10 -bottom-10 text-[220px] text-white/5 -rotate-12 pointer-events-none"></i>
            </div>

            <!-- Sistema de Navegación Interna (Menú de Filtros) -->
            <div class="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-xl border dark:border-slate-800 sticky top-4 z-40 transition-all">
                <div class="flex flex-col lg:flex-row gap-4">
                    <div class="relative flex-1">
                        <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" id="docs-search" oninput="filterDocs()" placeholder="Buscar por palabra clave..." 
                            class="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:text-white rounded-xl outline-none transition-all font-bold text-xs">
                    </div>
                    <div id="docs-category-menu" class="flex flex-wrap gap-1.5">
                        <button onclick="filterDocsByCategory('todos')" class="doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all" data-cat="todos">Todos</button>
                        <button onclick="filterDocsByCategory('Régimen académico')" class="doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all" data-cat="Régimen académico">Académico</button>
                        <button onclick="filterDocsByCategory('Convivencia')" class="doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all" data-cat="Convivencia">Convivencia</button>
                        <button onclick="filterDocsByCategory('Becas')" class="doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all" data-cat="Becas">Becas</button>
                        <button onclick="filterDocsByCategory('Centro de estudiantes')" class="doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all" data-cat="Centro de estudiantes">Estudiantes</button>
                    </div>
                </div>
            </div>

            <!-- Contenido Principal -->
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div class="xl:col-span-8 space-y-6">
                    <div id="docs-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <!-- Dinámico -->
                    </div>
                </div>

                <div class="xl:col-span-4 space-y-8">
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm">
                        <h3 class="font-black text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
                            <i class="fas fa-question-circle text-blue-500"></i> Consultas Frecuentes
                        </h3>
                        <div id="faq-list" class="space-y-3">
                            <!-- Dinámico -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    `);
}

// Datos Reales ISFDyT 57 Chascomús
const officialDocs = [
    { id: 1, title: "Reglamento Académico (RAI)", category: "Régimen académico", version: "Res. 4043/09", date: "2024", icon: "fa-file-contract", desc: "Regula el ingreso, permanencia, asistencia, promoción y acreditación de los estudiantes." },
    { id: 2, title: "Acuerdo de Convivencia (AIC)", category: "Convivencia", version: "V2.0", date: "Vigente", icon: "fa-handshake", desc: "Normas de interacción democrática y respetuosa para la comunidad educativa del 57." },
    { id: 3, title: "Estatuto Centro de Estudiantes", category: "Centro de estudiantes", version: "Juana P. Manso", date: "Abril 2024", icon: "fa-landmark", desc: "Documento que rige la organización y representación estudiantil institucional." },
    { id: 4, title: "Guía Becas y Boleto Estudiantil", category: "Becas", version: "Actualizada", date: "Enero 2025", icon: "fa-graduation-cap", desc: "Pasos para Progresar, Manuel Belgrano y Boleto Especial Educativo." },
    { id: 5, title: "Régimen de Correlatividades", category: "Régimen académico", version: "Plan 57", date: "Vigente", icon: "fa-sitemap", desc: "Esquema de materias indispensables para el avance académico en cada carrera." },
    { id: 6, title: "Formulario Equivalencias", category: "Régimen académico", version: "Disp. A14", date: "2024", icon: "fa-exchange-alt", desc: "Planilla obligatoria para solicitud de reconocimiento de materias aprobadas." }
];

const faqData = [
    { q: "¿Cómo me inscribo a finales?", a: "A través del sistema SAMBA en los turnos de Julio/Agosto y Noviembre/Diciembre." },
    { q: "¿Cuánta asistencia necesito?", a: "Mínimo 60% para cursada regular. 50% con certificado laboral." },
    { q: "¿Dónde está el Centro?", a: "La oficina de 'Juana Paula Manso' está en planta baja, junto al patio." }
];

let currentDocsCategory = 'todos';

function renderDocumentos() {
    // Asegurar que el scroll esté arriba
    const content = document.getElementById('app-content');
    if(content) content.scrollTop = 0;

    setTimeout(() => {
        currentDocsCategory = 'todos';
        updateFilterButtons();
        filterDocs();
        renderFAQ();
    }, 50);
}

function filterDocsByCategory(cat) {
    currentDocsCategory = cat;
    updateFilterButtons();
    filterDocs();
}

function updateFilterButtons() {
    const btns = document.querySelectorAll('.doc-filter-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-cat') === currentDocsCategory) {
            btn.className = "doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20";
        } else {
            btn.className = "doc-filter-btn px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700";
        }
    });
}

function filterDocs() {
    const grid = document.getElementById('docs-grid');
    const searchInput = document.getElementById('docs-search');
    if (!grid) return;
    
    const search = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';

    const filtered = officialDocs.filter(doc => {
        const matchesCat = currentDocsCategory === 'todos' || doc.category === currentDocsCategory;
        const matchesSearch = doc.title.toLowerCase().includes(search) || doc.desc.toLowerCase().includes(search);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center opacity-30"><i class="fas fa-search-minus text-5xl mb-3"></i><p class="font-bold">Sin resultados</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(doc => `
        <div class="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all animate-fadeIn">
            <div class="flex justify-between items-start mb-5">
                <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <i class="fas ${doc.icon} text-lg"></i>
                </div>
                <div class="text-right">
                    <span class="block text-[9px] font-black text-blue-500 uppercase tracking-widest">${doc.version}</span>
                    <span class="block text-[9px] font-bold text-slate-400">${doc.date}</span>
                </div>
            </div>
            <h4 class="text-base font-black text-slate-800 dark:text-white mb-2 leading-tight">${doc.title}</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed line-clamp-2">${doc.desc}</p>
            <div class="flex items-center justify-between border-t dark:border-slate-800 pt-4 mt-auto">
                <span class="text-[8px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">${doc.category}</span>
                <button onclick="simulateDownload('${doc.title}')" class="text-blue-600 hover:text-blue-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    PDF <i class="fas fa-arrow-down"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderFAQ() {
    const list = document.getElementById('faq-list');
    if (!list) return;
    list.innerHTML = faqData.map((f, i) => `
        <div class="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 overflow-hidden shadow-sm">
            <button onclick="toggleFaq(${i})" class="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span class="font-bold text-slate-700 dark:text-slate-200 text-[11px] leading-tight pr-4">${f.q}</span>
                <i id="faq-icon-${i}" class="fas fa-chevron-down text-slate-400 text-xs transition-transform duration-300"></i>
            </button>
            <div id="faq-content-${i}" class="hidden p-4 pt-0 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t dark:border-slate-700 bg-slate-50/20 dark:bg-slate-800/50">
                ${f.a}
            </div>
        </div>
    `).join('');
}

function toggleFaq(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    if(!content || !icon) return;
    const isHidden = content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180', !isHidden);
}

function simulateDownload(title) {
    if(typeof showToast === 'function') showToast(`Descargando: ${title}`, "info");
    else alert(`Descargando: ${title}`);
}

// Exportación global limpia
window.renderDocumentos = renderDocumentos;
window.filterDocsByCategory = filterDocsByCategory;
window.filterDocs = filterDocs;
window.toggleFaq = toggleFaq;
window.simulateDownload = simulateDownload;