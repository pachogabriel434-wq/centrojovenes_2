document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-calendario">
        <div class="max-w-5xl mx-auto space-y-4">
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border dark:border-slate-800">
                <div class="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <button onclick="changeMonth(-1)" class="hover:bg-blue-700 px-4 py-2 rounded-xl transition font-bold"><i class="fas fa-chevron-left"></i></button>
                    <h2 id="calendar-month-year" class="text-2xl font-black capitalize"></h2>
                    <button onclick="changeMonth(1)" class="hover:bg-blue-700 px-4 py-2 rounded-xl transition font-bold"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 text-center py-3 font-bold text-xs uppercase dark:text-slate-400 border-b dark:border-slate-800">
                    <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
                </div>
                <div id="calendar-body" class="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800"></div>
            </div>
        </div>
    </template>
`);

function renderCalendar() {
    const body = document.getElementById('calendar-body');
    const title = document.getElementById('calendar-month-year');
    if (!body) return;
    title.innerText = `${monthNames[currentMonth]} ${currentYear}`;
    body.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) body.innerHTML += `<div class="bg-white dark:bg-slate-900/50 min-h-[90px]"></div>`;
    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${currentYear}-${currentMonth}-${i}`;
        const note = userEvents[currentUser][dateKey] || "";
        const dayDiv = document.createElement('div');
        dayDiv.className = `bg-white dark:bg-slate-900 min-h-[90px] p-2 border border-transparent hover:border-blue-500 cursor-pointer transition-all flex flex-col`;
        dayDiv.innerHTML = `<span class="text-xs font-bold ${note ? 'text-blue-500' : 'text-slate-400'}">${i}</span><div class="text-[10px] mt-1 text-slate-500 line-clamp-2">${note}</div>`;
        dayDiv.onclick = () => {
            const val = prompt("Nota:", note);
            if (val !== null) {
                userEvents[currentUser][dateKey] = val;
                localStorage.setItem('app_events', JSON.stringify(userEvents));
                renderCalendar();
            }
        };
        body.appendChild(dayDiv);
    }
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    else if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
}