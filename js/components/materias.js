document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-materias">
        <div id="materias-wrapper" class="max-w-5xl mx-auto space-y-6 animate-fadeIn"></div>
    </template>
`);

// --- VISTA PRINCIPAL (LISTA DE MATERIAS) ---
function renderMaterias() {
    const wrapper = document.getElementById('materias-wrapper');
    if (!wrapper) return;

    let html = `
        <div class="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4">
            <h2 class="text-3xl font-black text-slate-800 dark:text-white"><i class="fas fa-book-open text-blue-500 mr-2"></i> Mis Materias</h2>
            ${isPrivileged() ? `<button onclick="toggleForm('form-new-subject')" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"><i class="fas fa-plus mr-1"></i> Nueva Materia</button>` : ''}
        </div>
        
        <!-- Formulario Oculto: Nueva Materia (Solo Profes/Admins) -->
        <div id="form-new-subject" class="hidden bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border dark:border-slate-800 mb-6">
            <h3 class="font-bold text-slate-800 dark:text-white mb-4 uppercase text-xs tracking-widest">Crear Nueva Materia</h3>
            <input type="text" id="subj-name" placeholder="Nombre de la Materia (Ej: Matemáticas Avanzadas)" class="w-full mb-3 border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500">
            <input type="text" id="subj-desc" placeholder="Descripción breve..." class="w-full mb-4 border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500">
            <input type="text" id="subj-teacher" placeholder="Profesor a cargo (Ej: Lic. Gómez) - Opcional" class="w-full mb-4 border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500">
            <div class="flex gap-3 justify-end">
                <button onclick="toggleForm('form-new-subject')" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold">Cancelar</button>
                <button onclick="saveSubject()" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Guardar Materia</button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (globalSubjects.length === 0) {
        html += `<p class="col-span-full text-slate-400 italic text-center py-10">Aún no hay materias registradas en el sistema.</p>`;
    } else {
        globalSubjects.forEach(sub => {
            html += `
            <div onclick="openSubject(${sub.id})" class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all group relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <h3 class="text-xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">${sub.name}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">${sub.desc}</p>
                <div class="flex justify-between items-center text-xs font-bold text-slate-400 border-t dark:border-slate-800 pt-4">
                    <span><i class="fas fa-chalkboard-teacher mr-1 text-blue-400"></i> ${sub.teacher}</span>
                    <span><i class="fas fa-layer-group mr-1"></i> ${sub.posts.length} Pub.</span>
                </div>
            </div>`;
        });
    }

    html += `</div>`;
    wrapper.innerHTML = html;
}

// --- VISTA DETALLE DE MATERIA ---
function openSubject(id) {
    const subject = globalSubjects.find(s => s.id === id);
    if (!subject) return;
    
    const wrapper = document.getElementById('materias-wrapper');
    let html = `
        <div class="mb-2">
            <button onclick="renderMaterias()" class="text-slate-400 hover:text-blue-600 font-bold text-sm transition flex items-center gap-2"><i class="fas fa-arrow-left"></i> Volver a materias</button>
        </div>
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg mb-6 relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-4xl font-black mb-2">${subject.name}</h2>
                <p class="text-blue-100 italic mb-4">${subject.desc}</p>
                <p class="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-lg"><i class="fas fa-chalkboard-teacher"></i> Prof. ${subject.teacher}</p>
            </div>
            <i class="fas fa-book-reader absolute -right-10 -bottom-10 text-9xl text-white/10"></i>
        </div>

        ${isPrivileged() ? `
        <!-- Botón Flotante Animado para Profesores -->
        <div class="relative flex justify-end mb-6 z-20">
            <div id="fab-menu" class="hidden absolute top-16 right-0 flex flex-col gap-3 items-end transition-all">
                <button onclick="toggleForm('form-post-aviso'); toggleFab()" class="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-3 transform transition hover:scale-105"><i class="fas fa-bullhorn text-xl"></i> Publicar Aviso</button>
                <button onclick="toggleForm('form-post-tarea'); toggleFab()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-3 transform transition hover:scale-105"><i class="fas fa-tasks text-xl"></i> Asignar Tarea</button>
            </div>
            <button onclick="toggleFab()" id="fab-main-btn" class="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                <i class="fas fa-plus transition-transform duration-300" id="fab-icon"></i>
            </button>
        </div>
        
        <!-- Formularios Ocultos -->
        <div id="form-post-aviso" class="hidden bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-700/50 mb-6">
            <h4 class="font-bold text-yellow-700 dark:text-yellow-500 mb-3"><i class="fas fa-bullhorn mr-2"></i>Nuevo Aviso</h4>
            <input type="text" id="aviso-title" placeholder="Título del aviso..." class="w-full mb-3 rounded-xl p-3 border outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white">
            <textarea id="aviso-content" placeholder="Escribe el anuncio para toda la clase..." class="w-full mb-3 rounded-xl p-3 border outline-none resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"></textarea>
            <input type="file" id="aviso-file" class="mb-4 text-sm w-full dark:text-slate-400">
            <div class="flex justify-end"><button onclick="savePost(${subject.id}, 'aviso')" class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl font-bold">Publicar Aviso</button></div>
        </div>
        <div id="form-post-tarea" class="hidden bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/50 mb-6">
            <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-3"><i class="fas fa-tasks mr-2"></i>Nueva Tarea / Trabajo</h4>
            <input type="text" id="tarea-title" placeholder="Título del trabajo..." class="w-full mb-3 rounded-xl p-3 border outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white">
            <textarea id="tarea-content" placeholder="Instrucciones para los alumnos..." class="w-full mb-3 rounded-xl p-3 border outline-none resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"></textarea>
            <input type="file" id="tarea-file" class="mb-4 text-sm w-full dark:text-slate-400">
            <div class="flex justify-end"><button onclick="savePost(${subject.id}, 'tarea')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold">Crear Trabajo</button></div>
        </div>
        ` : ''}

        <div class="space-y-6">
    `;

    if (subject.posts.length === 0) {
        html += `<div class="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 text-slate-400 italic">No hay publicaciones en esta materia.</div>`;
    } else {
        subject.posts.slice().reverse().forEach(post => {
            const isTarea = post.type === 'tarea';
            const hasSubmitted = isTarea && post.submissions.find(s => s.studentId === currentUser);
            
            html += `
            <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border ${isTarea ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-yellow-400'} dark:border-slate-800">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full ${isTarea ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400'} flex items-center justify-center text-lg">
                            <i class="${isTarea ? 'fas fa-tasks' : 'fas fa-bullhorn'}"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-800 dark:text-white text-lg">${post.title}</h4>
                            <span class="text-xs text-slate-400">${post.date} - ${post.author}</span>
                        </div>
                    </div>
                    <span class="uppercase text-[10px] font-black tracking-widest ${isTarea ? 'text-blue-500' : 'text-yellow-500'} bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">${post.type}</span>
                </div>
                
                <p class="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">${post.content}</p>
                
                ${post.fileBase64 ? `<a href="${post.fileBase64}" download="adjunto" class="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl mb-4"><i class="fas fa-paperclip"></i> Descargar Adjunto</a>` : ''}

                ${isTarea ? `
                    <div class="mt-4 pt-4 border-t dark:border-slate-800">
                        ${isPrivileged() ? `
                            <button onclick="toggleForm('subs-${post.id}')" class="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-500"><i class="fas fa-users"></i> Ver Entregas (${post.submissions.length})</button>
                            <div id="subs-${post.id}" class="hidden mt-4 space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                ${post.submissions.length === 0 ? '<p class="text-xs italic text-slate-400">Nadie ha entregado el trabajo aún.</p>' : 
                                  post.submissions.map(s => `
                                    <div class="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border dark:border-slate-700">
                                        <div>
                                            <p class="font-bold text-sm text-slate-800 dark:text-white">${s.studentName}</p>
                                            <p class="text-xs text-slate-500">${s.comment || 'Sin comentario'}</p>
                                        </div>
                                        ${s.fileBase64 ? `<a href="${s.fileBase64}" download="entrega_${s.studentName}" class="text-blue-500 hover:text-blue-600" title="Descargar Trabajo"><i class="fas fa-download text-lg"></i></a>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            ${hasSubmitted ? `
                                <div class="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-xl font-bold text-sm flex items-center"><i class="fas fa-check-circle mr-2 text-lg"></i> ¡Trabajo Entregado Correctamente!</div>
                            ` : `
                                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                                    <h5 class="font-bold text-sm mb-2 text-slate-700 dark:text-slate-300">Tu Entrega</h5>
                                    <input type="file" id="task-file-${post.id}" class="w-full text-sm mb-2 dark:text-slate-400">
                                    <input type="text" id="task-comment-${post.id}" placeholder="Mensaje para el profesor (opcional)..." class="w-full p-2 border rounded-xl text-sm mb-3 dark:bg-slate-900 dark:border-slate-700 outline-none">
                                    <button onclick="submitTask(${subject.id}, ${post.id})" class="w-full bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition">Entregar Trabajo</button>
                                </div>
                            `}
                        `}
                    </div>
                ` : ''}

                <!-- Comentarios del Post -->
                <div class="mt-6 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border dark:border-slate-800">
                    <h5 class="text-xs font-bold uppercase text-slate-400 mb-3"><i class="fas fa-comments mr-1"></i> Comentarios de la clase</h5>
                    <div class="space-y-3 mb-4">
                        ${post.comments.length === 0 ? '<p class="text-xs text-slate-400 italic">No hay comentarios. Sé el primero en escribir algo.</p>' : 
                          post.comments.map(c => `
                            <div class="text-sm border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                                <span class="font-bold text-slate-700 dark:text-slate-300">${c.author}:</span> 
                                <span class="text-slate-600 dark:text-slate-400">${c.content}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="comment-input-${post.id}" placeholder="Añadir comentario visible para todos..." class="flex-1 rounded-xl p-2 px-3 border dark:bg-slate-900 dark:border-slate-700 dark:text-white text-sm outline-none focus:border-blue-400">
                        <button onclick="addComment(${subject.id}, ${post.id})" class="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-sm font-bold transition"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
            `;
        });
    }
    html += `</div>`;
    wrapper.innerHTML = html;
}

// --- FUNCIONES AUXILIARES DE MATERIAS ---
function toggleForm(id) {
    document.getElementById(id).classList.toggle('hidden');
}

function toggleFab() {
    const menu = document.getElementById('fab-menu');
    const icon = document.getElementById('fab-icon');
    const btn = document.getElementById('fab-main-btn');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('animate-fadeIn');
        icon.classList.add('rotate-45');
        btn.classList.replace('bg-blue-600', 'bg-slate-700');
        btn.classList.replace('hover:bg-blue-700', 'hover:bg-slate-800');
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('animate-fadeIn');
        icon.classList.remove('rotate-45');
        btn.classList.replace('bg-slate-700', 'bg-blue-600');
        btn.classList.replace('hover:bg-slate-800', 'hover:bg-blue-700');
    }
}

function saveSubject() {
    const name = document.getElementById('subj-name').value.trim();
    const desc = document.getElementById('subj-desc').value.trim();
    const teacherInput = document.getElementById('subj-teacher');
    let teacher = teacherInput ? teacherInput.value.trim() : '';
    if (!name) return alert("El nombre es obligatorio");
    if (!teacher) teacher = userProfiles[currentUser]?.nickname || currentUser.split('@')[0];
    
    globalSubjects.push({ id: Date.now(), name, desc, teacher: teacher, posts: [] });
    localStorage.setItem('app_subjects', JSON.stringify(globalSubjects));
    renderMaterias();
}

async function getBase64(file) {
    if (!file) return null;
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

async function savePost(subjectId, type) {
    const title = document.getElementById(`${type}-title`).value.trim();
    const content = document.getElementById(`${type}-content`).value.trim();
    const fileInput = document.getElementById(`${type}-file`);
    if (!title || !content) return alert("Título y contenido obligatorios");
    
    const fileBase64 = await getBase64(fileInput.files[0]);
    const subject = globalSubjects.find(s => s.id === subjectId);
    
    subject.posts.push({ id: Date.now(), type, title, content, fileBase64, date: new Date().toLocaleString(), author: userProfiles[currentUser]?.nickname || currentUser.split('@')[0], submissions: [], comments: [] });
    localStorage.setItem('app_subjects', JSON.stringify(globalSubjects));
    
    globalNotifications.push({
        id: Date.now(),
        subjectId: subjectId,
        subjectName: subject.name,
        type: type,
        title: title,
        timestamp: Date.now(),
        date: new Date().toLocaleString()
    });
    localStorage.setItem('app_notifications', JSON.stringify(globalNotifications));
    if (typeof updateNotifications === 'function') updateNotifications();

    openSubject(subjectId);
}

async function submitTask(subjectId, postId) {
    const fileInput = document.getElementById(`task-file-${postId}`);
    const comment = document.getElementById(`task-comment-${postId}`).value.trim();
    if (!fileInput.files[0]) return alert("Debes adjuntar un archivo para entregar.");
    
    const fileBase64 = await getBase64(fileInput.files[0]);
    const subject = globalSubjects.find(s => s.id === subjectId);
    const post = subject.posts.find(p => p.id === postId);
    
    post.submissions.push({ studentId: currentUser, studentName: userProfiles[currentUser]?.nickname || currentUser.split('@')[0], fileBase64, comment, date: new Date().toLocaleString() });
    localStorage.setItem('app_subjects', JSON.stringify(globalSubjects));
    openSubject(subjectId);
}

function addComment(subjectId, postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;
    
    const subject = globalSubjects.find(s => s.id === subjectId);
    const post = subject.posts.find(p => p.id === postId);
    post.comments.push({ author: userProfiles[currentUser]?.nickname || currentUser.split('@')[0], content, date: new Date().toLocaleString() });
    
    localStorage.setItem('app_subjects', JSON.stringify(globalSubjects));
    openSubject(subjectId);
}