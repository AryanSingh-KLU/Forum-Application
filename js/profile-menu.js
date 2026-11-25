document.addEventListener('DOMContentLoaded', () => {
  let user;
  try { user = JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch { user = null; }
  if (!user) return;

  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.querySelectorAll('a[href="login.html"]').forEach(link => link.remove());

  const profile = document.createElement('details');
  profile.className = 'profile-menu';
  const summary = document.createElement('summary');
  summary.className = 'profile-trigger';
  summary.textContent = user.name || 'My Profile';
  const panel = document.createElement('div');
  panel.className = 'profile-panel';
  const name = document.createElement('strong');
  name.textContent = user.name || 'ForumHub user';
  const email = document.createElement('span');
  email.textContent = user.email || '';
  const logout = document.createElement('button');
  logout.type = 'button';
  logout.className = 'profile-logout';
  logout.textContent = 'Log out';
  logout.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
  panel.append(name, email, logout);
  profile.append(summary, panel);
  nav.append(profile);
});
