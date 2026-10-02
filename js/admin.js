document.addEventListener("DOMContentLoaded", () => {
    const read = key => { try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
    let threads = read("threads");
    const users = read("users");
    const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
    const repliesCount = thread => Array.isArray(thread.replies) ? thread.replies.length : Number(thread.replies || 0);
    const persist = () => localStorage.setItem("threads", JSON.stringify(threads));
    const list = document.getElementById("discussionList");
    function renderThreads(category) {
        const shown = category ? threads.filter(thread => (thread.category || "General") === category) : threads;
        document.getElementById("discussionCountLabel").textContent = `${threads.length} ${threads.length === 1 ? "discussion" : "discussions"}`;
        list.innerHTML = shown.length ? shown.map(thread => `<article class="admin-item"><div class="admin-item-content"><span class="category-badge admin-item-category">${esc(thread.category || "General")}</span><h3>${esc(thread.title || "Untitled Discussion")}</h3><p>${esc(thread.description || thread.content || "No description available.")}</p><p class="admin-item-meta">Posted by <strong>${esc(thread.author || "Anonymous")}</strong> <span>•</span> ${repliesCount(thread)} ${repliesCount(thread) === 1 ? "reply" : "replies"}</p></div><div class="admin-item-actions"><button type="button" class="btn btn-danger btn-small" data-delete="${esc(thread.id)}">Delete</button></div></article>`).join("") : '<div class="admin-empty">No discussions to show yet.</div>';
    }
    function renderUsers() {
        document.getElementById("userCountLabel").textContent = `${users.length} ${users.length === 1 ? "user" : "users"}`;
        document.getElementById("userList").innerHTML = users.length ? users.map(user => `<article class="admin-item admin-user-item"><div class="admin-user-avatar">${esc((user.name || "U").trim().charAt(0).toUpperCase())}</div><div class="admin-item-content"><h3>${esc(user.name || "Forum member")}</h3><p>${esc(user.email || "")}</p></div><span class="admin-role">${esc(user.role || "user")}</span></article>`).join("") : '<div class="admin-empty">No registered users yet.</div>';
    }
    document.getElementById("threadsCount").textContent = threads.length;
    document.getElementById("usersCount").textContent = users.length;
    document.getElementById("repliesCount").textContent = threads.reduce((sum, thread) => sum + repliesCount(thread), 0);
    document.getElementById("notificationsCount").textContent = read("forumNotifications").length;
    renderThreads();
    renderUsers();
    document.querySelectorAll(".admin-category-card[data-category]").forEach(button => button.addEventListener("click", () => {
        const category = button.dataset.category;
        document.getElementById("selectedCategory").textContent = category;
        const categoryThreads = threads.filter(thread => (thread.category || "General") === category);
        document.getElementById("categoryDiscussionList").innerHTML = categoryThreads.length ? categoryThreads.map(thread => `<div class="category-result-item"><strong>${esc(thread.title || "Untitled Discussion")}</strong><span>${repliesCount(thread)} ${repliesCount(thread) === 1 ? "reply" : "replies"}</span></div>`).join("") : '<div class="admin-empty">No discussions in this category.</div>';
    }));
    document.getElementById("showAllBtn").addEventListener("click", () => {
        document.getElementById("selectedCategory").textContent = "All discussions";
        document.getElementById("categoryDiscussionList").innerHTML = threads.length ? threads.map(thread => `<div class="category-result-item"><strong>${esc(thread.title || "Untitled Discussion")}</strong><span>${esc(thread.category || "General")}</span></div>`).join("") : '<div class="admin-empty">No discussions yet.</div>';
    });
    list.addEventListener("click", event => {
        const button = event.target.closest("[data-delete]");
        if (!button || !confirm("Delete this discussion?")) return;
        threads = threads.filter(thread => String(thread.id) !== button.dataset.delete);
        persist();
        document.getElementById("threadsCount").textContent = threads.length;
        document.getElementById("repliesCount").textContent = threads.reduce((sum, thread) => sum + repliesCount(thread), 0);
        renderThreads();
    });
    document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("currentUser"); location.href = "login.html"; });
});
