document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-galeria">
        <div class="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-10">
            <div class="flex flex-col gap-2 mb-8 border-b dark:border-slate-800 pb-6">
                <h2 class="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <i class="fas fa-images text-blue-500"></i> Galería de Fotos
                </h2>
                <p class="text-slate-500 dark:text-slate-400">Explora todas las imágenes y recursos visuales compartidos en la plataforma.</p>
            </div>

            <div id="galeria-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <!-- Las fotos se cargarán aquí dinámicamente -->
            </div>
        </div>
    </template>
`);

function renderGaleria() {
    const grid = document.getElementById('galeria-grid');
    if (!grid) return;

    let photos = [];

    // 1. Obtener fotos de las Noticias (globalNews)
    globalNews.forEach(news => {
        if (news.image) {
            photos.push({
                url: news.image,
                caption: news.content.substring(0, 60) + (news.content.length > 60 ? '...' : ''),
                source: news.category ? `Noticia: ${news.category}` : 'Inicio',
                date: news.date
            });
        }
    });

    // 2. Obtener fotos de las Materias (globalSubjects -> posts)
    globalSubjects.forEach(subject => {
        subject.posts.forEach(post => {
            // Solo agregamos si el archivo adjunto es una imagen (detectado por el prefijo base64)
            if (post.fileBase64 && post.fileBase64.startsWith('data:image/')) {
                photos.push({
                    url: post.fileBase64,
                    caption: post.title,
                    source: `Materia: ${subject.name}`,
                    date: post.date
                });
            }
        });
    });

    if (photos.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 opacity-50">
                <i class="fas fa-camera-retro text-6xl mb-4"></i>
                <p class="font-bold italic">No se han encontrado fotos subidas todavía.</p>
            </div>`;
        return;
    }

    // Renderizar la galería
    grid.innerHTML = photos.reverse().map(photo => {
        const isImg = isImageUrl(photo.url);
        
        if (isImg) {
            return `
                <div class="group relative aspect-square bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border dark:border-slate-800 cursor-pointer" onclick="openFullPhoto('${photo.url}')">
                    <img src="${photo.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p class="text-white text-[11px] font-bold line-clamp-2">${photo.caption}</p>
                        <p class="text-blue-400 text-[9px] font-black uppercase tracking-widest mt-1">${photo.source}</p>
                    </div>
                </div>`;
        } else {
            // Tarjeta de adelanto para Links
            let hostname = "Enlace Externo";
            try { hostname = new URL(photo.url).hostname; } catch(e) {}
            
            return `
                <div class="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border dark:border-slate-700 cursor-pointer flex flex-col" onclick="window.open('${photo.url}', '_blank')">
                    <div class="w-full h-2/3 bg-white dark:bg-slate-900 relative overflow-hidden flex items-center justify-center border-b dark:border-slate-700">
                        <!-- Iframe escalado para simular vista previa (algunos sitios pueden bloquearlo por seguridad) -->
                        <iframe src="${photo.url}" class="w-full h-full border-0 pointer-events-none origin-top-left scale-[0.35] w-[285%] h-[285%] absolute top-0 left-0 opacity-20 group-hover:opacity-40 transition-opacity"></iframe>
                        <i class="fas fa-link text-4xl text-blue-500/50 relative z-10 group-hover:scale-125 transition-transform duration-500"></i>
                    </div>
                    <div class="p-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
                        <p class="text-[10px] font-bold text-slate-800 dark:text-white line-clamp-2">${photo.caption || 'Recurso compartido'}</p>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-[8px] text-blue-500 font-black uppercase tracking-tighter truncate max-w-[80px]">${hostname}</span>
                            <span class="text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-black">VISITAR</span>
                        </div>
                    </div>
                    <div class="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-2xl transition-colors pointer-events-none"></div>
                </div>`;
        }
    }).join('');
}

function openFullPhoto(url) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    container.innerHTML = `
        <div class="relative max-w-5xl w-full animate-fadeIn" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('modal-container').classList.add('hidden')" class="absolute -top-12 right-0 text-white text-3xl hover:text-blue-400 transition-colors"><i class="fas fa-times"></i></button>
            <img src="${url}" class="w-full rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800">
        </div>
    `;
    container.classList.remove('hidden');
    container.onclick = () => container.classList.add('hidden');
}