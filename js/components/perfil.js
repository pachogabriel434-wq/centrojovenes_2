document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-perfil">
        <div class="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border dark:border-slate-800 overflow-hidden relative">
            
            <!-- Modo Vista -->
            <div id="profile-view-mode" class="p-8">
                <!-- Botones de Acción Superiores -->
                <div class="absolute top-6 right-6 flex gap-3">
                    <button onclick="toggleDarkMode()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm" title="Cambiar Tema">
                        <i class="fas fa-moon block dark:hidden"></i>
                        <i class="fas fa-sun hidden dark:block"></i>
                    </button>
                    <button onclick="logout()" class="w-10 h-10 rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-all shadow-sm" title="Cerrar Sesión">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>

                <!-- Cabecera del Perfil -->
                <div class="flex flex-col items-center mb-8 pt-4">
                    <div id="profile-avatar-container" class="w-32 h-32 rounded-full border-4 border-blue-500 p-1 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl text-slate-400 mb-4 overflow-hidden shadow-md">
                        <img id="profile-avatar-img" src="" class="w-full h-full object-cover rounded-full hidden" alt="Avatar">
                        <i id="profile-avatar-icon" class="fas fa-user-circle"></i>
                    </div>
                    <h2 id="profile-name" class="text-3xl font-black text-slate-800 dark:text-white mb-1">Nombre Usuario</h2>
                    <p id="profile-email-text" class="text-blue-500 font-medium"></p>
                </div>
                
                <!-- Detalles del Perfil -->
                <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-6">
                    <div class="mb-4">
                        <h4 class="text-xs font-bold uppercase text-slate-400 mb-1">Descripción</h4>
                        <p id="profile-desc-text" class="text-slate-700 dark:text-slate-300 text-sm italic">Sin descripción.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t dark:border-slate-700 pt-4">
                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-400 mb-1">DNI</h4>
                            <p id="profile-dni-text" class="text-slate-700 dark:text-slate-300 font-medium">-</p>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold uppercase text-slate-400 mb-1">Fecha de Nacimiento</h4>
                            <p id="profile-dob-text" class="text-slate-700 dark:text-slate-300 font-medium">-</p>
                        </div>
                        <div class="md:col-span-2">
                            <h4 class="text-xs font-bold uppercase text-slate-400 mb-1">Carrera en curso</h4>
                            <p id="profile-career-text" class="text-slate-700 dark:text-slate-300 font-medium">-</p>
                        </div>
                    </div>
                </div>
                
                <button onclick="toggleEditMode()" class="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-3 rounded-2xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <i class="fas fa-pencil-alt mr-2"></i> Editar Perfil
                </button>
            </div>
            
            <!-- Panel de Administración (Solo Administradores) -->
            <div id="admin-users-panel" class="hidden border-t-8 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
                <div class="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4">
                    <h3 class="text-2xl font-black text-slate-800 dark:text-white"><i class="fas fa-users-cog text-blue-500 mr-2"></i>Gestión de Usuarios</h3>
                </div>
                <div class="overflow-x-auto rounded-2xl border dark:border-slate-800">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-800/80 dark:text-slate-300 text-xs uppercase tracking-wider">
                                <th class="p-4 font-bold">Usuario / Email</th>
                                <th class="p-4 font-bold text-center">Rol Actual</th>
                                <th class="p-4 font-bold text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody id="admin-users-list" class="divide-y dark:divide-slate-800 bg-white dark:bg-slate-900">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modo Edición -->
            <div id="profile-edit-mode" class="hidden p-8 text-left">
                <div class="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4">
                    <h3 class="text-2xl font-black text-slate-800 dark:text-white">Editar Perfil</h3>
                    <button onclick="toggleEditMode()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2 flex flex-col items-center mb-2">
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Subir Foto de Perfil</label>
                            <input type="file" accept="image/*" onchange="convertirImagenABase64(event)" class="w-full max-w-sm border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-2 outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700">
                            <input type="hidden" id="edit-avatar">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Apodo / Nombre Visible</label>
                            <input type="text" id="edit-nickname" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">DNI</label>
                            <input type="text" id="edit-dni" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Fecha de Nacimiento</label>
                            <input type="date" id="edit-dob" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Carrera en curso</label>
                            <input type="text" id="edit-career" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500" placeholder="Ej: Licenciatura en...">
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Descripción</label>
                            <textarea id="edit-desc" rows="3" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 resize-none" placeholder="Cuéntanos sobre ti..."></textarea>
                        </div>
                        
                        <div class="md:col-span-2 border-t dark:border-slate-800 pt-4 mt-2">
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Nueva Contraseña</label>
                            <input type="password" id="edit-password" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500" placeholder="Dejar en blanco para no cambiar">
                        </div>
                    </div>
                    
                    <div class="flex gap-4 pt-2">
                        <button onclick="saveProfileData()" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">Guardar Cambios</button>
                        <button onclick="toggleEditMode()" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">Cancelar</button>
                    </div>
                </div>
            </div>

        </div>
    </template>
`);

function updateSidebarData() {
    const profile = userProfiles[currentUser] || {};
    const nickname = profile.nickname || currentUser.split('@')[0];
    
    const elSidebarUsername = document.getElementById('sidebar-username');
    if (elSidebarUsername) elSidebarUsername.innerText = nickname;

    const elHeaderUser = document.getElementById('header-user');
    if (elHeaderUser) elHeaderUser.innerText = currentUser;

    const avatarImg = document.getElementById('sidebar-avatar-img');
    const avatarIcon = document.getElementById('sidebar-avatar-icon');
    
    if (avatarImg && avatarIcon) {
        if (profile.avatar) {
            avatarImg.src = profile.avatar;
            avatarImg.classList.remove('hidden');
            avatarIcon.classList.add('hidden');
        } else {
            avatarImg.classList.add('hidden');
            avatarIcon.classList.remove('hidden');
        }
    }
}

function initProfile() {
    const profile = userProfiles[currentUser] || {};
    const nickname = profile.nickname || currentUser.split('@')[0].toUpperCase();
    
    document.getElementById('profile-name').innerText = nickname;
    
    const roleColors = {
        'admin': 'bg-red-500',
        'delegado': 'bg-purple-500',
        'docente': 'bg-blue-500',
        'alumno': 'bg-green-500'
    };
    const userRole = getUserRole(currentUser);
    const roleColor = roleColors[userRole] || 'bg-slate-500';
    document.getElementById('profile-email-text').innerHTML = `${currentUser} <span class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase ${roleColor}">${userRole}</span>`;
    
    document.getElementById('profile-dni-text').innerText = profile.dni || '-';
    document.getElementById('profile-dob-text').innerText = profile.dob || '-';
    document.getElementById('profile-career-text').innerText = profile.career || '-';
    document.getElementById('profile-desc-text').innerText = profile.desc || 'Sin descripción.';
    
    const avatarImg = document.getElementById('profile-avatar-img');
    const avatarIcon = document.getElementById('profile-avatar-icon');
    
    if (profile.avatar) {
        avatarImg.src = profile.avatar;
        avatarImg.classList.remove('hidden');
        avatarIcon.classList.add('hidden');
    } else {
        avatarImg.classList.add('hidden');
        avatarIcon.classList.remove('hidden');
    }
    
    if (isAdmin()) {
        document.getElementById('admin-users-panel').classList.remove('hidden');
        renderAdminUsersList();
    } else {
        document.getElementById('admin-users-panel').classList.add('hidden');
    }
}

function toggleEditMode() {
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    
    if (editMode.classList.contains('hidden')) {
        const profile = userProfiles[currentUser] || {};
        document.getElementById('edit-nickname').value = profile.nickname || currentUser.split('@')[0];
        document.getElementById('edit-avatar').value = profile.avatar || '';
        document.getElementById('edit-dni').value = profile.dni || '';
        document.getElementById('edit-dob').value = profile.dob || '';
        document.getElementById('edit-career').value = profile.career || '';
        document.getElementById('edit-desc').value = profile.desc || '';
        document.getElementById('edit-password').value = ''; 
        
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
    } else {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
    }
}

function saveProfileData() {
    const nickname = document.getElementById('edit-nickname').value.trim();
    const avatar = document.getElementById('edit-avatar').value.trim();
    const dni = document.getElementById('edit-dni').value.trim();
    const dob = document.getElementById('edit-dob').value.trim();
    const career = document.getElementById('edit-career').value.trim();
    const desc = document.getElementById('edit-desc').value.trim();
    const password = document.getElementById('edit-password').value.trim();
    
    if (!userProfiles[currentUser]) {
        userProfiles[currentUser] = {};
    }
    
    if (nickname) userProfiles[currentUser].nickname = nickname;
    userProfiles[currentUser].avatar = avatar; 
    userProfiles[currentUser].dni = dni;
    userProfiles[currentUser].dob = dob;
    userProfiles[currentUser].career = career;
    userProfiles[currentUser].desc = desc;
    
    if (password) {
        userProfiles[currentUser].password = password;
    }
    
    localStorage.setItem('app_profiles', JSON.stringify(userProfiles));
    
    updateSidebarData();
    initProfile();
    toggleEditMode();
}

function renderAdminUsersList() {
    const listBody = document.getElementById('admin-users-list');
    let html = '';
    
    const roleColors = {
        'admin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        'delegado': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        'docente': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'alumno': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
    
    Object.keys(userProfiles).forEach(email => {
        const prof = userProfiles[email];
        const role = prof.role || 'alumno';
        const colorClass = roleColors[role] || 'bg-slate-100 text-slate-700';
        
        html += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group">
                <td class="p-4">
                    <div class="font-bold text-slate-800 dark:text-white text-sm">${prof.nickname || email.split('@')[0]}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">${email}</div>
                </td>
                <td class="p-4 text-center">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colorClass}">${role}</span>
                </td>
                <td class="p-4 text-right">
                    <select onchange="changeUserRole('${email}', this.value)" class="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer">
                        <option value="" disabled selected>Cambiar Rol</option>
                        <option value="alumno">Alumno</option>
                        <option value="docente">Docente</option>
                        <option value="delegado">Delegado</option>
                        <option value="admin">Administrador</option>
                    </select>
                </td>
            </tr>
        `;
    });
    
    listBody.innerHTML = html;
}

function changeUserRole(email, newRole) {
    if (!newRole) return;
    if (email === currentUser && newRole !== 'admin' && !confirm("¿Seguro que deseas quitarte los permisos de administrador?")) {
        renderAdminUsersList();
        return;
    }
    userProfiles[email].role = newRole;
    localStorage.setItem('app_profiles', JSON.stringify(userProfiles));
    renderAdminUsersList();
    if (email === currentUser) initProfile();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

function convertirImagenABase64(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 250; 
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                document.getElementById('edit-avatar').value = dataUrl;
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}