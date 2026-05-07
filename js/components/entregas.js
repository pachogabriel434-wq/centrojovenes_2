document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-entregas">
        <div id="entregas-wrapper" class="max-w-6xl mx-auto space-y-6 animate-fadeIn"></div>
    </template>
`);

function renderEntregas() {
    const wrapper = document.getElementById('entregas-wrapper');
    if (!wrapper) return;

    // Bloquear acceso a alumnos (solo admins y docentes)
    if ((typeof isDocente === 'function' && !isDocente()) && (typeof isAdmin === 'function' && !isAdmin())) {
        wrapper.innerHTML = `<div class="text-center py-10 text-red-500 font-bold bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800 shadow-sm"><i class="fas fa-lock text-3xl mb-3 block"></i> No tienes permisos para acceder a esta sección.</div>`;
        return;
    }

    let html = `
        <div class="mb-4">
            <button onclick="navigate('materias')" class="text-slate-400 hover:text-blue-600 font-bold text-sm transition flex items-center gap-2"><i class="fas fa-arrow-left"></i> Volver a materias</button>
        </div>
        <div class="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4">
            <h2 class="text-3xl font-black text-slate-800 dark:text-white"><i class="fas fa-inbox text-blue-500 mr-3"></i>Bandeja de Entregas Global</h2>
        </div>
    `;

    let allSubmissions = [];
    if (typeof globalSubjects !== 'undefined') {
        globalSubjects.forEach(subject => {
            subject.posts.forEach(post => {
                if (post.type === 'tarea' && post.submissions) {
                    post.submissions.forEach(sub => {
                        allSubmissions.push({
                            subjectId: subject.id,
                            subjectName: subject.name,
                            postId: post.id,
                            postTitle: post.title,
                            studentId: sub.studentId,
                            studentName: sub.studentName,
                            date: sub.date,
                            comment: sub.comment,
                            fileBase64: sub.fileBase64,
                            grade: sub.grade
                        });
                    });
                }
            });
        });
    }

    const pending = allSubmissions.filter(s => !s.grade);
    const graded = allSubmissions.filter(s => s.grade);

    if (allSubmissions.length === 0) {
        html += `<div class="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border dark:border-slate-800 text-center text-slate-400 italic flex flex-col items-center gap-4"><i class="fas fa-folder-open text-6xl text-slate-200 dark:text-slate-700"></i> Nadie ha entregado trabajos todavía.</div>`;
    } else {
        html += `
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 overflow-hidden">
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 dark:text-white text-lg"><i class="fas fa-clock text-yellow-500 mr-2"></i> Pendientes de Calificar (${pending.length})</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs">
                            <tr>
                                <th class="p-4 font-bold">Alumno y Fecha</th>
                                <th class="p-4 font-bold">Materia / Trabajo</th>
                                <th class="p-4 font-bold">Archivo adjunto / Comentario</th>
                                <th class="p-4 font-bold text-center w-32">Calificación</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y dark:divide-slate-800">
                            ${pending.length === 0 ? `<tr><td colspan="4" class="p-8 text-center text-slate-400 italic">¡Todo al día! No hay tareas pendientes de calificar.</td></tr>` : 
                              pending.map(s => `
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td class="p-4">
                                        <div class="font-bold text-slate-800 dark:text-white text-base">${s.studentName}</div>
                                        <div class="text-[10px] text-slate-500">${s.date}</div>
                                    </td>
                                    <td class="p-4">
                                        <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">${s.subjectName}</div>
                                        <div class="text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-file-alt mr-1 text-slate-400"></i> ${s.postTitle}</div>
                                    </td>
                                    <td class="p-4">
                                        <div class="text-xs text-slate-600 dark:text-slate-300 mb-2 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border dark:border-slate-700">"${s.comment || 'Sin comentarios'}"</div>
                                        ${s.fileBase64 ? `<a href="${s.fileBase64}" download="entrega_${s.studentName}" class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-2 rounded-lg transition"><i class="fas fa-file-download text-lg"></i> Descargar Archivo</a>` : '<span class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg"><i class="fas fa-ban"></i> Sin adjunto</span>'}
                                    </td>
                                    <td class="p-4 align-middle">
                                        <div class="flex flex-col gap-2">
                                            <input type="text" id="entregas-grade-${s.subjectId}-${s.postId}-${s.studentId}" placeholder="Ej: 10" class="w-full p-2 text-center text-sm border-2 rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white outline-none focus:border-blue-500 transition-colors">
                                            <button onclick="saveGradeFromEntregas(${s.subjectId}, ${s.postId}, '${s.studentId}')" class="text-[10px] uppercase tracking-widest font-black text-white bg-green-500 hover:bg-green-600 py-2 rounded-lg transition shadow-md hover:shadow-lg w-full">Guardar</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            ${graded.length > 0 ? `
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 overflow-hidden mt-8 opacity-80 hover:opacity-100 transition-opacity">
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 dark:text-white text-lg"><i class="fas fa-check-double text-green-500 mr-2"></i> Ya Calificadas (${graded.length})</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-xs">
                            <tr>
                                <th class="p-4 font-bold">Alumno</th>
                                <th class="p-4 font-bold">Materia / Trabajo</th>
                                <th class="p-4 font-bold">Comprobante</th>
                                <th class="p-4 font-bold text-center w-32">Nota Asignada</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y dark:divide-slate-800">
                            ${graded.map(s => `
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td class="p-4">
                                        <div class="font-bold text-slate-800 dark:text-white">${s.studentName}</div>
                                        <div class="text-[10px] text-slate-400">${s.date}</div>
                                    </td>
                                    <td class="p-4">
                                        <div class="font-bold text-slate-600 dark:text-slate-300 mb-1">${s.subjectName}</div>
                                        <div class="text-xs text-slate-500">${s.postTitle}</div>
                                    </td>
                                    <td class="p-4">
                                        ${s.fileBase64 ? `<a href="${s.fileBase64}" download="entrega_${s.studentName}" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 transition"><i class="fas fa-paperclip"></i> Ver archivo original</a>` : '<span class="text-xs text-slate-400">Sin archivo</span>'}
                                    </td>
                                    <td class="p-4 align-middle">
                                        <div class="flex flex-col gap-1.5">
                                            <input type="text" id="entregas-grade-${s.subjectId}-${s.postId}-${s.studentId}" value="${s.grade}" class="w-full p-1.5 text-center font-bold text-sm border-2 border-green-400 dark:border-green-600 rounded-lg dark:bg-slate-900 dark:text-green-400 outline-none focus:border-blue-500 transition-colors">
                                            <button onclick="saveGradeFromEntregas(${s.subjectId}, ${s.postId}, '${s.studentId}')" class="text-[9px] uppercase tracking-wider font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 py-1.5 rounded-lg transition w-full">Modificar</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
        `;
    }

    wrapper.innerHTML = html;
}

function saveGradeFromEntregas(subjectId, postId, studentId) {
    const gradeInput = document.getElementById(`entregas-grade-${subjectId}-${postId}-${studentId}`);
    if (!gradeInput) return;
    const grade = gradeInput.value.trim();
    
    const subject = globalSubjects.find(s => s.id === subjectId);
    if (!subject) return;
    const post = subject.posts.find(p => p.id === postId);
    if (!post) return;
    const submission = post.submissions.find(s => s.studentId === studentId);
    if (!submission) return;

    submission.grade = grade;
    localStorage.setItem('app_subjects', JSON.stringify(globalSubjects));
    
    // Animación visual de éxito y refrescar la tabla para moverlo a completados
    gradeInput.classList.replace('border-slate-200', 'border-green-500');
    gradeInput.classList.add('bg-green-100', 'dark:bg-green-900/30', 'text-green-700', 'dark:text-green-400');
    
    setTimeout(() => { 
        renderEntregas();
    }, 600);
}