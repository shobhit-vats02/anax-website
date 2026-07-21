let currentPage = 'home';

function navigateTo(page) {
    if (page === currentPage) return;
    
    document.getElementById('navLinks').classList.remove('open');
    const cur = document.getElementById('page-' + currentPage);
    cur.classList.remove('active');
    cur.classList.add('exiting');
    
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.toggle('active', l.dataset.page === page));
    
    setTimeout(() => {
        cur.classList.remove('exiting');
        cur.style.display = 'none';
        
        const next = document.getElementById('page-' + page);
        next.style.display = 'block';
        
        void next.offsetWidth;
        next.classList.add('active');
        currentPage = page;
        window.scrollTo(0, 0);
        
        if (page === 'home') {
            renderHomeText();
            renderHomeStats();
            startTyping();
        }
        if (page === 'members') renderMembers();
        if (page === 'achievements') renderAchievements();
        if (page === 'projects') {
            renderProjects();
            setTimeout(animateProgressBars, 100);
        }
        if (page === 'contact') renderContact();
    }, 240);
}

function toggleMobile() {
    document.getElementById('navLinks').classList.toggle('open');
}
