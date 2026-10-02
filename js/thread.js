document.addEventListener("DOMContentLoaded", () => {
    const read = (key, fallback) => {
        try { const value = JSON.parse(localStorage.getItem(key)); return value == null ? fallback : value; }
        catch { return fallback; }
    };
    let threads = read("threads", []);
    const id = new URLSearchParams(location.search).get("id");
    const thread = threads.find(item => String(item.id) === id);
    const detail = document.getElementById("threadDetail");
    const repliesEl = document.getElementById("replies");
    const replyForm = document.getElementById("replyForm");
    const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
    if (!thread) {
        detail.innerHTML = '<div class="thread-box"><h1>Discussion not found</h1><p>This discussion may have been removed.</p><a href="index.html">Back to discussions</a></div>';
        replyForm.hidden = true;
        return;
    }
    if (!Array.isArray(thread.replies)) thread.replies = [];
    if (!Array.isArray(thread.followers)) thread.followers = [];
    const persist = () => { localStorage.setItem("threads", JSON.stringify(threads)); };
    const currentUser = read("currentUser", null);
    let guestId = localStorage.getItem("forumGuestId");
    if (!guestId) {
        guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem("forumGuestId", guestId);
    }
    const userKey = currentUser?.email ? currentUser.email.toLowerCase() : guestId;
    if (!thread.votes || typeof thread.votes !== "object" || Array.isArray(thread.votes)) thread.votes = {};
    const announce = (title, message) => {
        const notifications = read("forumNotifications", []);
        notifications.unshift({ title, message, time: "Just now" });
        localStorage.setItem("forumNotifications", JSON.stringify(notifications));
    };
    const count = () => Array.isArray(thread.replies) ? thread.replies.length : Number(thread.replies || 0);
    function render() {
        const myVote = thread.votes[userKey];
        detail.innerHTML = `<article class="thread-box"><span class="category-badge">${esc(thread.category || "General")}</span><h1>${esc(thread.title || "Untitled Discussion")}</h1><p class="thread-author">Posted by <strong>${esc(thread.author || "Anonymous")}</strong> • ${esc(thread.date || "Recently")}</p><p class="thread-description">${esc(thread.description || thread.content || "No description provided.")}</p><div class="thread-actions"><button class="btn btn-small ${myVote === "like" ? "" : "btn-secondary"}" type="button" id="upvote" aria-pressed="${myVote === "like"}">👍 ${Number(thread.likes) || 0}</button><button class="btn btn-small ${myVote === "dislike" ? "btn-danger" : "btn-secondary"}" type="button" id="downvote" aria-pressed="${myVote === "dislike"}">👎 ${Number(thread.dislikes) || 0}</button><button class="btn btn-small btn-secondary" type="button" id="follow">${thread.followers.includes(userKey) ? "Following" : "Follow discussion"}</button></div></article>`;
        document.querySelector(".reply-count").textContent = `${count()} ${count() === 1 ? "reply" : "replies"}`;
        repliesEl.innerHTML = count() ? thread.replies.map(reply => typeof reply === "string" ? `<article class="reply-card"><p>${esc(reply)}</p></article>` : `<article class="reply-card"><p>${esc(reply.text || "")}</p><small>${esc(reply.author || "Community member")} • ${esc(reply.date || "Recently")}</small></article>`).join("") : '<p class="empty-box">No replies yet. Be the first to respond.</p>';
        const castVote = type => {
            const previousVote = thread.votes[userKey];
            if (previousVote === type) {
                thread[type === "like" ? "likes" : "dislikes"] = Math.max(0, (Number(thread[type === "like" ? "likes" : "dislikes"]) || 0) - 1);
                delete thread.votes[userKey];
            } else {
                if (previousVote) {
                    const previousCount = previousVote === "like" ? "likes" : "dislikes";
                    thread[previousCount] = Math.max(0, (Number(thread[previousCount]) || 0) - 1);
                }
                const nextCount = type === "like" ? "likes" : "dislikes";
                thread[nextCount] = (Number(thread[nextCount]) || 0) + 1;
                thread.votes[userKey] = type;
            }
            persist();
            render();
        };
        document.getElementById("upvote").onclick = () => castVote("like");
        document.getElementById("downvote").onclick = () => castVote("dislike");
        document.getElementById("follow").onclick = () => {
            if (thread.followers.includes(userKey)) thread.followers = thread.followers.filter(user => user !== userKey);
            else thread.followers.push(userKey);
            persist(); render();
        };
    }
    replyForm.addEventListener("submit", event => {
        event.preventDefault();
        const input = document.getElementById("replyText");
        const text = input.value.trim();
        if (!text) return;
        thread.replies.push({ text, author: currentUser?.name || "Guest", date: new Date().toLocaleDateString() });
        persist();
        announce("New reply", `A reply was added to “${thread.title}”.`);
        input.value = "";
        document.getElementById("replyStatus").textContent = "Reply posted.";
        render();
    });
    render();
});
