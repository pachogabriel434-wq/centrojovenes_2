document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-login">
        <!-- Fondo animado del Login -->
        <div class="fixed inset-0 z-[-1] bg-black">
            <div class="absolute inset-0 bg-[url('./img/bg-login.jpg')] bg-cover bg-center opacity-30 blur-[4px] animate-fade-in-bg"></div>
        </div>

        <!-- Contenedor Principal -->
        <div class="flex h-full min-h-[80vh] items-center justify-center">
            <div class="w-full max-w-md mx-auto bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl mt-12 border-b-8 border-blue-600 animate-slide-up-fade relative overflow-hidden" style="animation-delay: 0.2s;">
                
                <div class="text-center mb-8">
                    <div class="inline-block mb-4 w-28 h-28 rounded-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-110 border-4 border-white dark:border-slate-800">
                        <img src="./img/images.png" alt="Logo" class="w-full h-full object-cover">
                    </div>
                    <h2 class="text-3xl font-black text-slate-800 dark:text-white">I.S.F.D. y T. N° 57</h2>
                    <p class="text-slate-500 dark:text-slate-400 mt-1">Centro de Estudiantes</p>
                </div>

                <!-- Formulario de Login -->
                <form id="form-login" class="space-y-5 transition-all duration-300 block">
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Correo</label>
                        <input type="email" id="login-email" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500" required placeholder="ejemplo@estudiante.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Contraseña</label>
                        <input type="password" id="login-password" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all">ACCEDER</button>
                    <div class="text-center mt-4">
                        <button type="button" onclick="toggleAuthMode()" class="text-sm font-bold text-blue-500 hover:text-blue-600">¿No tienes cuenta? Regístrate</button>
                    </div>
                </form>

                <!-- Formulario de Registro -->
                <form id="form-register" class="space-y-4 transition-all duration-300 hidden">
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Nombre Completo</label>
                        <input type="text" id="reg-name" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-3 outline-none focus:border-blue-500" required placeholder="Juan Pérez">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                        <input type="email" id="reg-email" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-3 outline-none focus:border-blue-500" required placeholder="ejemplo@estudiante.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Contraseña</label>
                        <input type="password" id="reg-password" class="w-full border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-3 outline-none focus:border-blue-500" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all">CREAR CUENTA</button>
                    <div class="text-center mt-4">
                        <button type="button" onclick="toggleAuthMode()" class="text-sm font-bold text-slate-500 hover:text-slate-600 dark:text-slate-400">Volver al Login</button>
                    </div>
                </form>
            </div>
        </div>
    </template>
`);

function toggleAuthMode() {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    
    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
    }
}

function initLogin() {
    if (!userProfiles['admin@admin.com']) {
        userProfiles['admin@admin.com'] = {
            password: 'admin',
            role: 'admin',
            nickname: 'Administrador'
        };
        localStorage.setItem('app_profiles', JSON.stringify(userProfiles));
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;

            if (userProfiles[email] && userProfiles[email].password) {
                if (userProfiles[email].password !== pass) {
                    alert("Contraseña incorrecta");
                    return;
                }
            } else {
                alert("Usuario no encontrado. Por favor regístrese.");
                return;
            }

            performLogin(email);
        };
    }

    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-password').value;

            if (userProfiles[email]) {
                alert("Este correo ya está registrado.");
                return;
            }

            userProfiles[email] = {
                password: pass,
                nickname: name,
                role: 'alumno',
                createdAt: new Date().toLocaleString()
            };
            localStorage.setItem('app_profiles', JSON.stringify(userProfiles));
            alert("Cuenta creada exitosamente. Ingresando...");
            performLogin(email);
        };
    }
}

function performLogin(email) {
    currentUser = email;
    
    userEvents = JSON.parse(localStorage.getItem('app_events') || '{}');
    if (!userEvents[currentUser]) userEvents[currentUser] = {};
    
    userSchedules = JSON.parse(localStorage.getItem('app_schedules') || '{}');
    if (!userSchedules[currentUser]) {
        userSchedules[currentUser] = [
            { h: "17:30 - 18:30", d1: "Materia", d2: "Materia", d3: "Materia", d4: "Materia", d5: "Materia" },
            { h: "18:30 - 19:30", d1: "Materia", d2: "Materia", d3: "Materia", d4: "Materia", d5: "Materia" },
            { h: "19:30 - 19:40", isRecreo: true },
            { h: "19:40 - 20:50", d1: "Materia", d2: "Materia", d3: "Materia", d4: "Materia", d5: "Materia" },
            { h: "20:50 - 22:00", d1: "Materia", d2: "Materia", d3: "Materia", d4: "Materia", d5: "Materia" }
        ];
    }
    
    forumPosts = JSON.parse(localStorage.getItem('app_forum') || '[]');
    
    updateSidebarData();
    navigate('home');
}

function logout() { 
    currentUser = null; 
    navigate('login'); 
}