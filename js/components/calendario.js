document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-calendario">
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 h-full pb-10">
            <!-- Sidebar de Eventos Arrastrables -->
            <div id="external-events" class="w-full lg:w-64 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border dark:border-slate-800 h-fit lg:sticky lg:top-0">
                <h4 class="font-black text-slate-800 dark:text-white mb-4 uppercase text-xs tracking-widest">Atajos / Eventos</h4>
                <div id="external-events-list" class="space-y-2">
                    <div class='fc-event bg-blue-600 text-white p-3 rounded-2xl cursor-move text-xs font-bold shadow-sm hover:scale-105 transition-transform'>Examen Final</div>
                    <div class='fc-event bg-indigo-600 text-white p-3 rounded-2xl cursor-move text-xs font-bold shadow-sm hover:scale-105 transition-transform'>Entrega Trabajo</div>
                    <div class='fc-event bg-emerald-600 text-white p-3 rounded-2xl cursor-move text-xs font-bold shadow-sm hover:scale-105 transition-transform'>Clase Especial</div>
                    <div class='fc-event bg-amber-500 text-white p-3 rounded-2xl cursor-move text-xs font-bold shadow-sm hover:scale-105 transition-transform'>Estudiar</div>
                </div>
                <div class="mt-6 pt-6 border-t dark:border-slate-800">
                    <label class="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 cursor-pointer">
                        <input type="checkbox" id="drop-remove" class="rounded accent-blue-500"> Quitar al soltar
                    </label>
                </div>
            </div>

            <!-- Contenedor del Calendario -->
            <div class="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 border dark:border-slate-800 min-h-[600px]">
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