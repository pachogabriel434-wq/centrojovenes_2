document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-instructivos">
        <div class="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-10">
            <div class="flex flex-col gap-2 mb-8 border-b dark:border-slate-800 pb-6">
                <h2 class="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <i class="fas fa-file-invoice text-blue-500"></i> Instructivos y Trámites
                </h2>
                <p class="text-slate-500 dark:text-slate-400">Guías paso a paso y documentos oficiales para gestiones académicas.</p>
            </div>

            <div id="instructivos-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Contenido dinámico -->
            </div>
        </div>
    </template>
`);

function renderInstructivos() {
    const listContainer = document.getElementById('instructivos-list');
    if (!listContainer) return;

    const docs = [
        { title: "Instructivo inscripción a cursada en SAMBA", url: "https://isfdyt57-bue.infd.edu.ar/sitio/wp-content/uploads/2025/03/InscripcionCursadas.pdf", icon: "fa-file-pdf", color: "blue" },
        { title: "Estudiantes embarazadas", url: "https://docs.google.com/document/d/1l839WZkoQERN0jD7SN9_DqBiqNJtw8Gv1kKYkUfcZco/edit?usp=drive_link", icon: "fa-person-pregnant", color: "pink" },
        { title: "Instructivo de solicitud de pase a otro instituto", url: "https://docs.google.com/document/d/1R1XD8LICRz6L4dtdS-trrZMY8oKednbNqPGl8EhkVOU/edit?usp=drive_link", icon: "fa-exchange-alt", color: "indigo" },
        { title: "Instructivo de solicitud de pase al ISFDyT57 Chascomús", url: "https://docs.google.com/document/d/1zp9YAstp_0YfV_cDZZumkP8sohP8liXAluNumjk0TsA/edit?usp=drive_link", icon: "fa-university", color: "emerald" },
        { title: "Solicitud de certificados", url: "https://docs.google.com/document/d/1pY-fQxcRMrCIMJNKUftaPxYg6IGD5RRDq7-QqxvR_Zk/edit?usp=drive_link", icon: "fa-certificate", color: "amber" },
        { title: "Pedido de programas", url: "https://docs.google.com/document/d/1zi4d3KiSOSp_tF5dF5lGlVd79Ru1pHTdu_FP1IDzQpM/edit?usp=drive_link", icon: "fa-copy", color: "orange" },
        { title: "Pedido de equivalencias", url: "https://docs.google.com/document/d/1XoBX-6TzyGl4cIbc_xEGPXIP_LBR7EDVBiWOX-vbumw/edit?usp=drive_link", icon: "fa-balance-scale", color: "purple" },
        { title: "Equivalencia asignatura", url: "https://isfdyt57-bue.infd.edu.ar/sitio/wp-content/uploads/2025/03/Equiv_Asignatura-A14a-2025.doc", icon: "fa-file-word", color: "cyan" },
        { title: "Equivalencia resumen", url: "https://isfdyt57-bue.infd.edu.ar/sitio/wp-content/uploads/2025/03/Equiv_Resumen-A14-2025.docx", icon: "fa-file-word", color: "slate" },
        { title: "Protocolo de préstamos y uso de netbooks", url: "https://drive.google.com/file/d/1HxhFRU-y4F6KLEgK9hLEtmCBsNgeeyxl/view?usp=drive_link", icon: "fa-laptop", color: "blue" }
    ];

    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800",
        pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 border-pink-100 dark:border-pink-800",
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-100 dark:border-orange-800",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800",
        cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800",
        slate: "bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 border-slate-100 dark:border-slate-800"
    };

    let html = '';
    docs.forEach(doc => {
        const colors = colorClasses[doc.color] || colorClasses.blue;
        html += `
            <a href="${doc.url}" target="_blank" class="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md">
                <div class="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-xl border ${colors}">
                    <i class="fas ${doc.icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-800 dark:text-white text-sm leading-tight group-hover:text-blue-600 transition-colors">${doc.title}</h4>
                    <p class="text-[10px] uppercase tracking-wider font-black text-slate-400 mt-1">
                        <i class="fas fa-external-link-alt mr-1"></i> Abrir enlace
                    </p>
                </div>
                <div class="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        `;
    });

    listContainer.innerHTML = html;
}