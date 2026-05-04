document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-calendario">
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-full pb-10 animate-fadeIn">
            <!-- Sidebar de Eventos Arrastrables -->
            <div id="external-events" class="w-full lg:w-72 bg-white dark:bg-slate-900 rounded-[2.5rem] p-0 shadow-2xl border dark:border-slate-800 h-fit lg:sticky lg:top-0 overflow-hidden">
                <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-lg">
                    <h4 class="font-black uppercase text-[10px] tracking-[0.3em] mb-2 opacity-70">Planificador</h4>
                    <h3 class="text-2xl font-black leading-tight">Eventos Rápidos</h3>
                    <p class="text-[11px] mt-2 text-blue-100/80 italic">Arrastra los bloques al calendario.</p>
                </div>
                <div class="p-6">
                    <div id="external-events-list" class="space-y-3">
                        <div class='fc-event bg-blue-500/10 text-blue-600 dark:text-blue-400 border-2 border-dashed border-blue-500/30 p-4 rounded-2xl cursor-move text-xs font-black shadow-sm hover:bg-blue-600 hover:text-white hover:border-solid hover:scale-105 transition-all'>Examen Final</div>
                        <div class='fc-event bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-dashed border-indigo-500/30 p-4 rounded-2xl cursor-move text-xs font-black shadow-sm hover:bg-indigo-600 hover:text-white hover:border-solid hover:scale-105 transition-all'>Entrega Trabajo</div>
                        <div class='fc-event bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-2 border-dashed border-emerald-500/30 p-4 rounded-2xl cursor-move text-xs font-black shadow-sm hover:bg-emerald-600 hover:text-white hover:border-solid hover:scale-105 transition-all'>Clase Especial</div>
                        <div class='fc-event bg-amber-500/10 text-amber-600 dark:text-amber-400 border-2 border-dashed border-amber-500/30 p-4 rounded-2xl cursor-move text-xs font-black shadow-sm hover:bg-amber-600 hover:text-white hover:border-solid hover:scale-105 transition-all'>Estudiar</div>
                    </div>
                    <div class="mt-8 pt-6 border-t dark:border-slate-800">
                        <label class="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 cursor-pointer group">
                            <div class="relative w-10 h-6">
                                <input type="checkbox" id="drop-remove" class="peer hidden">
                                <div class="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-blue-600 transition-colors shadow-inner"></div>
                                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                            </div>
                            Quitar al soltar
                        </label>
                    </div>
                </div>
            </div>

            <!-- Contenedor del Calendario -->
            <div class="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 border dark:border-slate-800 min-h-[700px]">
                <div id="calendar" class="h-full"></div>
            </div>
        </div>
    </template>
`);

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    // Inicializar Draggable para los eventos externos (Sidebar)
    const containerEl = document.getElementById('external-events-list');
    if (containerEl && !containerEl.dataset.initialized) {
        new FullCalendar.Draggable(containerEl, {
            itemSelector: '.fc-event',
            eventData: function(eventEl) {
                return { title: eventEl.innerText.trim() };
            }
        });
        containerEl.dataset.initialized = "true";
    }

    // Cargar eventos desde userEvents convirtiendo el formato de fecha
    const events = [];
    const myEvents = userEvents[currentUser] || {};
    for (const key in myEvents) {
        const [y, m, d] = key.split('-').map(Number);
        // FullCalendar usa ISO (meses 1-12), el sistema anterior usaba meses 0-11
        const isoDate = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        events.push({ id: key, title: myEvents[key], start: isoDate, allDay: true });
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', list: 'Agenda' },
        editable: true,
        droppable: true,
        events: events,
        
        // Al soltar un evento externo en el calendario
        drop: function(info) {
            if (document.getElementById('drop-remove').checked) {
                info.draggedEl.parentNode.removeChild(info.draggedEl);
            }
            const d = info.date;
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            userEvents[currentUser][key] = info.draggedEl.innerText.trim();
            localStorage.setItem('app_events', JSON.stringify(userEvents));
        },

        // Clic en un día vacío para agregar nota manual
        dateClick: function(info) {
            const val = prompt("Agregar nota para este día:");
            if (val) {
                const d = info.date;
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                userEvents[currentUser][key] = val;
                localStorage.setItem('app_events', JSON.stringify(userEvents));
                renderCalendar();
            }
        },

        // Clic en un evento existente para editar o borrar
        eventClick: function(info) {
            const key = info.event.id;
            const current = userEvents[currentUser][key];
            const val = prompt("Editar nota (deja vacío para eliminar):", current);
            if (val === null) return;
            if (val.trim() === "") delete userEvents[currentUser][key];
            else userEvents[currentUser][key] = val;
            localStorage.setItem('app_events', JSON.stringify(userEvents));
            renderCalendar();
        },

        // Actualizar fecha al arrastrar un evento dentro del calendario
        eventDrop: function(info) {
            const oldKey = info.event.id;
            const d = info.event.start;
            const newKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            const content = userEvents[currentUser][oldKey];
            delete userEvents[currentUser][oldKey];
            userEvents[currentUser][newKey] = content;
            localStorage.setItem('app_events', JSON.stringify(userEvents));
            renderCalendar();
        }
    });

    calendar.render();
}