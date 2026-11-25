(() => {
  function showDialog({ title, message, confirm = false, confirmLabel = confirm ? 'Delete' : 'Okay', cancelLabel = 'Cancel' }) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'app-dialog-overlay';
      overlay.innerHTML = `<section class="app-dialog" role="dialog" aria-modal="true" aria-labelledby="appDialogTitle"><div class="app-dialog-mark" aria-hidden="true">${confirm ? '!' : '✓'}</div><h2 id="appDialogTitle"></h2><p class="app-dialog-message"></p><div class="app-dialog-actions">${confirm ? `<button type="button" class="app-dialog-cancel"></button>` : ''}<button type="button" class="app-dialog-primary"></button></div></section>`;
      overlay.querySelector('#appDialogTitle').textContent = title;
      overlay.querySelector('.app-dialog-message').textContent = message;
      const primary = overlay.querySelector('.app-dialog-primary');
      primary.textContent = confirmLabel;
      const finish = result => { overlay.remove(); document.body.classList.remove('app-dialog-open'); resolve(result); };
      primary.addEventListener('click', () => finish(true));
      if (confirm) overlay.querySelector('.app-dialog-cancel').addEventListener('click', () => finish(false));
      overlay.addEventListener('click', event => { if (event.target === overlay) finish(false); });
      document.addEventListener('keydown', function onKey(event) {
        if (event.key === 'Escape') { document.removeEventListener('keydown', onKey); finish(false); }
      }, { once: true });
      document.body.append(overlay);
      document.body.classList.add('app-dialog-open');
      primary.focus();
    });
  }
  window.showAppAlert = (message, title = 'ForumHub') => showDialog({ title, message });
  window.showAppConfirm = (message, title = 'Please confirm') => showDialog({ title, message, confirm: true });
})();
