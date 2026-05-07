document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-horarios">
        <div class="max-w-6xl mx-auto space-y-8">
            
            <!-- Hero Banner Moderno -->
            <div class="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden group">
                <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                            <i class="fas fa-clock"></i> Organización
                        </div>
                        <h2 class="text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight drop-shadow-md">Mis Horarios</h2>
                        <p class="text-indigo-100 text-sm md:text-base font-medium max-w-2xl leading-relaxed opacity-90">Administra tu agenda semanal y haz clic en las celdas para editar tus materias.</p>
                    </div>
                    
                    <div class="hidden md:flex shrink-0 w-32 h-32 rounded-[2rem] bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <i class="fas fa-calendar-alt text-6xl text-white opacity-90"></i>
                    </div>
                </div>
                <i class="fas fa-calendar-week absolute -right-4 -bottom-4 text-[120px] text-white opacity-5 -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-700"></i>
            </div>

            <!-- Contenedor de la Tabla -->
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                <div class="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 class="font-bold text-slate-700 dark:text-slate-300 text-lg flex items-center gap-2"><i class="fas fa-list-alt text-indigo-500"></i> Cuadrícula Semanal</h3>
                    <span class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"><i class="fas fa-pencil-alt"></i> Modo Edición</span>
                </div>
                <div class="overflow-x-auto p-4 sm:p-6">
                    <table class="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <thead>
                            <tr class="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                                <th class="p-5 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">Hora</th>
                                <th class="p-5 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 text-center">Lunes</th>
                                <th class="p-5 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 text-center">Martes</th>
                                <th class="p-5 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 text-center">Miércoles</th>
                                <th class="p-5 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 text-center">Jueves</th>
                                <th class="p-5 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 text-center">Viernes</th>
                            </tr>
                        </thead>
                        <tbody id="schedule-table-body" class="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </template>
`);

function renderSchedule() {
    const body = document.getElementById('schedule-table-body');
    const data = userSchedules[currentUser];
    body.innerHTML = '';
    data.forEach((row, index) => {
        if (row.isRecreo) {
            body.innerHTML += `
            <tr class="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/10 dark:via-yellow-900/10 dark:to-amber-900/10 text-center group hover:brightness-95 transition-all">
                <td class="p-4 font-black text-amber-700 dark:text-amber-500 border-r border-amber-100/50 dark:border-amber-800/30 whitespace-nowrap text-sm text-left"><i class="fas fa-mug-hot mr-2"></i>${row.h}</td>
                <td colspan="5" class="p-4 uppercase tracking-[0.3em] font-black text-amber-600/80 dark:text-amber-500/80 text-sm">R E C R E O</td>
            </tr>`;
        } else {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group";
            const cellClasses = "p-4 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 hover:scale-[1.02] transition-all border-l border-slate-50 dark:border-slate-800/30 text-center relative shadow-sm hover:shadow-md hover:z-10";
            
            tr.innerHTML = `
                <td class="p-4 font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10 whitespace-nowrap text-sm"><i class="far fa-clock mr-1.5 opacity-70"></i>${row.h}</td>
                <td class="${cellClasses}" onclick="editSubject(${index}, 'd1')"><div class="line-clamp-2">${row.d1}</div></td>
                <td class="${cellClasses}" onclick="editSubject(${index}, 'd2')"><div class="line-clamp-2">${row.d2}</div></td>
                <td class="${cellClasses}" onclick="editSubject(${index}, 'd3')"><div class="line-clamp-2">${row.d3}</div></td>
                <td class="${cellClasses}" onclick="editSubject(${index}, 'd4')"><div class="line-clamp-2">${row.d4}</div></td>
                <td class="${cellClasses}" onclick="editSubject(${index}, 'd5')"><div class="line-clamp-2">${row.d5}</div></td>`;
            body.appendChild(tr);
        }
    });
}

function editSubject(rowIndex, dayKey) {
    const currentVal = userSchedules[currentUser][rowIndex][dayKey];
    const newVal = prompt("Nombre de la materia:", currentVal);
    if (newVal !== null) {
        userSchedules[currentUser][rowIndex][dayKey] = newVal;
        localStorage.setItem('app_schedules', JSON.stringify(userSchedules));
        renderSchedule();
    }
}