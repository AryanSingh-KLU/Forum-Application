document.addEventListener('DOMContentLoaded', () => {
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const user = read('currentUser', null);
  const threads = read('threads', []);
  const users = read('users', []);
  const followedRoot = document.getElementById('followedList');
  const followersRoot = document.getElementById('yourFollowersList');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  if (!user) {
    followedRoot.innerHTML = '<div class="followed-empty">Sign in to see discussions you follow.</div>';
    followersRoot.innerHTML = '<div class="followed-empty">Sign in to see followers of your discussions.</div>';
    return;
  }
  const key = String(user.email || '').toLowerCase();
  const myFollows = threads.filter(thread => Array.isArray(thread.followers) && thread.followers.some(id => String(id).toLowerCase() === key));
  followedRoot.innerHTML = myFollows.length ? myFollows.map(thread => {
    const followers = Array.isArray(thread.followers) ? thread.followers : [];
    return `<a class="followed-card" href="thread.html?id=${encodeURIComponent(thread.id)}"><span class="category-badge">${esc(thread.category || 'General')}</span><h3>${esc(thread.title || 'Untitled discussion')}</h3><p>By ${esc(thread.author || 'Community member')}</p><span class="follower-count">${followers.length} ${followers.length === 1 ? 'follower' : 'followers'}</span></a>`;
  }).join('') : '<div class="followed-empty">You are not following any discussions yet. Open a thread and choose “Follow discussion” to add one here.</div>';

  const ownThreads = threads.filter(thread => {
    if (thread.authorEmail && key) return String(thread.authorEmail).toLowerCase() === key;
    return Boolean(user.name && thread.author && String(thread.author).trim().toLowerCase() === String(user.name).trim().toLowerCase());
  });
  followersRoot.innerHTML = ownThreads.length ? ownThreads.map(thread => {
    const followers = Array.isArray(thread.followers) ? thread.followers : [];
    const names = followers.map(id => users.find(item => String(item.email || '').toLowerCase() === String(id).toLowerCase())?.name).filter(Boolean);
    const namesText = names.length ? names.map(esc).join(', ') : (followers.length ? 'Some followers are not registered accounts' : 'No followers yet');
    return `<article class="followed-card"><span class="category-badge">${esc(thread.category || 'General')}</span><h3>${esc(thread.title || 'Untitled discussion')}</h3><p class="follower-count">${followers.length} ${followers.length === 1 ? 'person follows' : 'people follow'} this discussion</p><p class="follower-names">${namesText}</p><a class="open-link" href="thread.html?id=${encodeURIComponent(thread.id)}">Open discussion →</a></article>`;
  }).join('') : '<div class="followed-empty">Create a discussion to see its followers here.</div>';
});
