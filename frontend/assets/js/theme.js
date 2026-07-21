function initTheme() {
    const t = localStorage.getItem('anaxcode_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
    updateThemeIcon(t);
}

function toggleTheme() {
    const c = document.documentElement.getAttribute('data-theme'),
          n = c === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem('anaxcode_theme', n);
    updateThemeIcon(n);
}

function updateThemeIcon(t) {
    const b = document.getElementById('themeBtn');
    if (b) b.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
