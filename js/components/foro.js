document.body.insertAdjacentHTML('beforeend', `
    <template id="tpl-foro">
        <div class="max-w-4xl mx-auto space-y-6">
            <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border dark:border-slate-800">
                <h3 class="font-black text-slate-800 dark:text-white mb-4 uppercase text-sm tracking-widest">Publicar en el Foro</h3>
                <textarea id="forum-input" class="w-full border-2 border-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-2xl p-4 focus:border-blue-400 outline-none transition resize-none" rows="3" placeholder="¿Tienes alguna duda académica?"></textarea>
                <div class="flex justify-end mt-3">
                    <button onclick="savePost()" class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition">Enviar</button>
                </div>
            </div>
            <div id="forum-list" class="space-y-4"></div>
        </div>
    </template>
`);

function renderForo() {
    const container = document.getElementById('forum-list');
    if (!container) return;

    if (forumPosts.length === 0) {
        container.innerHTML = `<div class="text-center py-10 text-slate-400 italic">No hay consultas aún. ¡Sé el primero en preguntar!</div>`;
        return;
    }

    container.innerHTML = forumPosts.map(post => {
        const profile = userProfiles[currentUser] || {};
        const hasLiked = post.likes && post.likes.includes(currentUser);
        const likeCount = post.likes ? post.likes.length : 0;
        
        return `
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 overflow-hidden mb-4 animate-fade-in">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 overflow-hidden">
                        ${post.authorAvatar ? `<img src="${post.authorAvatar}" class="w-full h-full object-cover">` : `<i class="fas fa-user text-sm"></i>`}
                    </div>
                    <div>
                        <h4 class="font-bold text-sm">${post.authorName}</h4>
                        <span class="text-[10px] text-slate-400">${post.date}</span>
                    </div>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mb-6 whitespace-pre-wrap">${post.content}</p>
                <div class="flex items-center justify-between pt-4 border-t dark:border-slate-800">
                    <button onclick="toggleReplyBox(${post.id})" class="text-xs font-bold text-blue-500 hover:text-blue-600 transition flex items-center gap-2">
                        <i class="fas fa-reply"></i> Responder (${post.replies ? post.replies.length : 0})
                    </button>
                    <button onclick="toggleLike(${post.id})" class="flex items-center gap-2 transition ${hasLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}">
                        <span class="text-xs font-bold">${likeCount}</span>
                        <i class="${hasLiked ? 'fas' : 'far'} fa-heart text-lg"></i>
                    </button>
                </div>
            </div>
            <div id="reply-box-${post.id}" class="hidden bg-slate-50 dark:bg-slate-800/30 p-6 border-t dark:border-slate-800">
                <div class="space-y-4 mb-4">
                    ${post.replies && post.replies.length > 0 ? post.replies.map(r => `
                        <div class="flex gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border dark:border-slate-700">
                            <div class="flex-1 text-sm">
                                <div class="flex justify-between mb-1">
                                    <span class="font-bold text-blue-500 text-xs">${r.author}</span>
                                    <span class="text-[9px] text-slate-400">${r.date}</span>
                                </div>
                                <p class="text-slate-600 dark:text-slate-300">${r.content}</p>
                            </div>
                        </div>
                    `).join('') : '<p class="text-xs text-slate-400 text-center italic">No hay respuestas todavía.</p>'}
                </div>
                <div class="flex gap-2">
                    <input type="text" id="input-reply-${post.id}" class="flex-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500" placeholder="Escribe tu opinión...">
                    <button onclick="sendReply(${post.id})" class="bg-blue-600 text-white p-2 px-4 rounded-xl hover:bg-blue-700 transition"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function savePost() {
    const input = document.getElementById('forum-input');
    const content = input.value.trim();
    if (!content) return;
    const profile = userProfiles[currentUser] || {};
    const newPost = {
        id: Date.now(),
        authorName: profile.nickname || currentUser.split('@')[0],
        authorAvatar: profile.avatar || null,
        content: content,
        date: new Date().toLocaleString(),
        likes: [],
        replies: []
    };
    forumPosts.unshift(newPost);
    localStorage.setItem('app_forum', JSON.stringify(forumPosts));
    input.value = '';
    renderForo();
}

function toggleReplyBox(id) { document.getElementById(`reply-box-${id}`).classList.toggle('hidden'); }

function sendReply(postId) {
    const input = document.getElementById(`input-reply-${postId}`);
    const content = input.value.trim();
    if (!content) return;
    const profile = userProfiles[currentUser] || {};
    const postIndex = forumPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        forumPosts[postIndex].replies.push({
            author: profile.nickname || currentUser.split('@')[0],
            content: content,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('app_forum', JSON.stringify(forumPosts));
        renderForo();
        document.getElementById(`reply-box-${postId}`).classList.remove('hidden');
    }
}

function toggleLike(postId) {
    const postIndex = forumPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        const userLikeIndex = forumPosts[postIndex].likes.indexOf(currentUser);
        if (userLikeIndex === -1) forumPosts[postIndex].likes.push(currentUser);
        else forumPosts[postIndex].likes.splice(userLikeIndex, 1);
        localStorage.setItem('app_forum', JSON.stringify(forumPosts));
        renderForo();
    }
}