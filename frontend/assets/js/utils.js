function uid() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function V(id) {
    return document.getElementById(id)?.value?.trim() || '';
}

function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}
