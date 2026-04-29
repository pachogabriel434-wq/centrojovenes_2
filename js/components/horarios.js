document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-horarios">
        <div class="max-w-6xl mx-auto">
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border dark:border-slate-800">
                <div class="bg-slate-800 p-6 text-white flex items-center justify-between">
                    <h2 class="text-2xl font-bold"><i class="fas fa-edit mr-3 text-blue-400"></i>Gestión de Horarios</h2>
                    <span class="text-xs text-slate-400 italic">Haz clic en una celda para editar</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-100 dark:bg-slate-800 dark:text-slate-200">
                                <th class="p-4 font-bold uppercase text-xs">Hora</th>
                                <th class="p-4 font-bold uppercase text-xs">Lunes</th>
                                <th class="p-4 font-bold uppercase text-xs">Martes</th>
                                <th class="p-4 font-bold uppercase text-xs">Miércoles</th>
                                <th class="p-4 font-bold uppercase text-xs">Jueves</th>
                                <th class="p-4 font-bold uppercase text-xs">Viernes</th>
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
            body.innerHTML += `<tr class="bg-yellow-50 dark:bg-yellow-900/20 text-center"><td class="p-3 font-black text-yellow-700 dark:text-yellow-500">${row.h}</td><td colspan="5" class="p-3 uppercase tracking-widest font-black text-yellow-700 dark:text-yellow-500">RECREO</td></tr>`;
        } else {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="p-4 font-bold text-blue-600 dark:text-blue-400">${row.h}</td>
                <td class="p-4 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800" onclick="editSubject(${index}, 'd1')">${row.d1}</td>
                <td class="p-4 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800" onclick="editSubject(${index}, 'd2')">${row.d2}</td>
                <td class="p-4 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800" onclick="editSubject(${index}, 'd3')">${row.d3}</td>
                <td class="p-4 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800" onclick="editSubject(${index}, 'd4')">${row.d4}</td>
                <td class="p-4 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800" onclick="editSubject(${index}, 'd5')">${row.d5}</td>`;
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