document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-horarios">
        <div class="max-w-6xl mx-auto animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-slate-800">
                <div class="bg-slate-950 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-sky-500 relative">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"></div>
                    <div class="flex items-center gap-5">
                        <div class="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 border border-sky-500/20 shadow-inner">
                            <i class="fas fa-clock text-2xl"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black uppercase tracking-tighter leading-none">Cronograma</h2>
                            <p class="text-slate-500 text-xs font-bold mt-1 tracking-widest uppercase">Organización Semanal</p>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-900/50 text-slate-400">
                                <th class="p-5 font-black uppercase text-[10px] tracking-widest border-b dark:border-slate-800">Módulo</th>
                                <th class="p-5 font-black uppercase text-[10px] tracking-widest border-b dark:border-slate-800">Lunes</th>
                                <th class="p-5 font-black uppercase text-[10px] tracking-widest border-b dark:border-slate-800">Martes</th>
                                <th class="p-5 font-black uppercase text-[10px] tracking-widest border-b dark:border-slate-800">Miércoles</th>
                                <th class="p-5 font-black uppercase text-[10px] tracking-widest border-b dark:border-slate-800">Jueves</th>
                                <th class="p-5 font-black uppercase text-[10px] tracking-widest border-b dark:border-slate-800">Viernes</th>
                            </tr>
                        </thead>
                        <tbody id="schedule-table-body" class="divide-y dark:divide-slate-800"></tbody>
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
            <tr class="bg-sky-500/5 dark:bg-sky-500/10 text-center transition-colors">
                <td class="p-3 font-black text-sky-600 dark:text-sky-400 border-b dark:border-slate-800 text-[10px]">${row.h}</td>
                <td colspan="5" class="p-3 border-b dark:border-slate-800">
                    <div class="flex items-center justify-center gap-4 text-sky-600/40 dark:text-sky-400/30">
                        <span class="h-px w-full max-w-[100px] bg-current"></span>
                        <span class="uppercase tracking-[0.8em] font-black text-[10px] whitespace-nowrap">Receso</span>
                        <span class="h-px w-full max-w-[100px] bg-current"></span>
                    </div>
                </td>
            </tr>`;
        } else {
            const tr = document.createElement('tr');
            tr.className = "group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all";
            tr.innerHTML = `<td class="p-6 font-black text-sky-500 bg-slate-50/30 dark:bg-slate-900/30 border-b dark:border-slate-800 text-xs">${row.h}</td>
                <td class="p-6 text-sm font-bold border-b border-r dark:border-slate-800 cursor-pointer transition-all hover:text-sky-600 dark:hover:text-sky-400" onclick="editSubject(${index}, 'd1')">${row.d1}</td>
                <td class="p-6 text-sm font-bold border-b border-r dark:border-slate-800 cursor-pointer transition-all hover:text-sky-600 dark:hover:text-sky-400" onclick="editSubject(${index}, 'd2')">${row.d2}</td>
                <td class="p-6 text-sm font-bold border-b border-r dark:border-slate-800 cursor-pointer transition-all hover:text-sky-600 dark:hover:text-sky-400" onclick="editSubject(${index}, 'd3')">${row.d3}</td>
                <td class="p-6 text-sm font-bold border-b border-r dark:border-slate-800 cursor-pointer transition-all hover:text-sky-600 dark:hover:text-sky-400" onclick="editSubject(${index}, 'd4')">${row.d4}</td>
                <td class="p-6 text-sm font-bold border-b dark:border-slate-800 cursor-pointer transition-all hover:text-sky-600 dark:hover:text-sky-400" onclick="editSubject(${index}, 'd5')">${row.d5}</td>`;
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