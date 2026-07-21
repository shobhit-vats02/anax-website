/* ===== ADMIN LOGIN ===== */
function openAdminLogin() {
    openModal('loginModal');
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').textContent = '';
    setTimeout(() => document.getElementById('loginPassword').focus(), 80);
}

async function attemptLogin() {
    const pw = document.getElementById('loginPassword').value;
    try {
        const res = await api.post('/auth/login', { password: pw });
        setToken(res.token);
        closeModal('loginModal');
        openAdmin();
    } catch (e) {
        document.getElementById('loginError').textContent = e.message || 'Wrong password!';
    }
}

/* ===== ADMIN PANEL ===== */
function openAdmin() {
    document.getElementById('adminOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    switchAdminTab('settings');
}

function closeAdmin() {
    document.getElementById('adminOverlay').classList.remove('open');
    document.body.style.overflow = '';

    renderMembers();
    renderAchievements();
    renderProjects();
    renderHomeText();
    renderHomeStats();
    startTyping();
    renderContact();

    if (currentPage === 'projects') setTimeout(animateProgressBars, 100);
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('active', s.id === 'admin-' + tab));

    if (tab === 'members') renderAdminMembers();
    if (tab === 'achievements') renderAdminAchievements();
    if (tab === 'projects') renderAdminProjects();
    if (tab === 'settings') {
        loadSettingsUI();
        renderStatsPreview();
    }
}

/* ===== SETTINGS: TEAM INFO & CONTACTS ===== */
function loadSettingsUI() {
    const d = getData();
    document.getElementById('settTagline').value = d.tagline || '';
    document.getElementById('settIntro').value = d.intro || '';
    document.getElementById('settTyping').value = (d.typingPhrases || []).join('\n');

    const ci = d.contactInfo || DEFAULT_DATA.contactInfo;
    document.getElementById('settEmail').value = ci.email || '';
    document.getElementById('settInsta').value = ci.instagram || '';
    document.getElementById('settLinkedin').value = ci.linkedin || '';
    document.getElementById('settYoutube').value = ci.youtube || '';
}

async function saveTeamInfo() {
    const payload = {
        tagline: V('settTagline'),
        intro: V('settIntro'),
        typingPhrases: V('settTyping').split('\n').map(l => l.trim()).filter(Boolean)
    };
    try {
        await api.put('/settings/info', payload);
        await refreshData();
        toast('Team info saved!');
    } catch (e) {
        toast(e.message || 'Save failed', 'error');
    }
}

async function saveContactInfo() {
    const payload = {
        email: V('settEmail'),
        instagram: V('settInsta'),
        linkedin: V('settLinkedin'),
        youtube: V('settYoutube')
    };
    try {
        await api.put('/settings/contact', payload);
        await refreshData();
        toast('Contact info saved!');
    } catch (e) {
        toast(e.message || 'Save failed', 'error');
    }
}

/* ===== RENDER ADMIN TABLES ===== */
function renderAdminMembers() {
    const d = getData(),
          l = document.getElementById('adminMembersList');

    if (!d.members.length) {
        l.innerHTML = '<div class="empty-state"><i class="fas fa-users-slash"></i><p>No members.</p></div>';
        return;
    }

    l.innerHTML = d.members.map(m => `
        <div class="admin-item">
            <img src="${esc(m.photo)}" alt="" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,107,0,.12); flex-shrink:0" onerror="this.src='https://picsum.photos/seed/fb/100/100.jpg'">
            <div class="admin-item-info">
                <div class="admin-item-title">${esc(m.name)}</div>
                <div class="admin-item-sub">${esc(m.role)}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-btn-sm" onclick="openMemberForm('${m.id}')"><i class="fas fa-pen"></i></button>
                <button class="admin-btn-sm danger" onclick="deleteItem('members','${m.id}','Member')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderAdminAchievements() {
    const d = getData(),
          l = document.getElementById('adminAchieveList');

    if (!d.achievements.length) {
        l.innerHTML = '<div class="empty-state"><i class="fas fa-trophy"></i><p>No achievements.</p></div>';
        return;
    }

    l.innerHTML = d.achievements.map(a => `
        <div class="admin-item">
            <div style="width:38px; text-align:center; flex-shrink:0">
                <i class="${a.icon || 'fas fa-star'}" style="font-size:20px; color:var(--accent)"></i>
            </div>
            <div class="admin-item-info">
                <div class="admin-item-title">${esc(a.title)} <span style="color:var(--accent); font-size:9px; margin-left:6px">${esc(a.rank)}</span></div>
                <div class="admin-item-sub">${esc(a.description).substring(0, 70)}...</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-btn-sm" onclick="openAchieveForm('${a.id}')"><i class="fas fa-pen"></i></button>
                <button class="admin-btn-sm danger" onclick="deleteItem('achievements','${a.id}','Achievement')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderAdminProjects() {
    const d = getData(),
          ml = document.getElementById('adminMajorList'),
          mn = document.getElementById('adminMiniList');

    if (!d.majorProjects.length) {
        ml.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No major projects.</p></div>';
    } else {
        ml.innerHTML = d.majorProjects.map(p => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <div class="admin-item-title">${esc(p.title)} <span style="color:${p.status === 'completed' ? '#00ff88' : p.status === 'ongoing' ? '#FFD700' : 'var(--muted)'}; font-size:9px; margin-left:6px">[${p.status}] ${p.completion || 0}%</span></div>
                    <div class="admin-item-sub">${esc(p.description).substring(0, 70)}... ${p.link ? '<i class="fas fa-link" style="color:var(--accent); margin-left:4px"></i>' : ''}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-btn-sm" onclick="openProjectForm('major','${p.id}')"><i class="fas fa-pen"></i></button>
                    <button class="admin-btn-sm danger" onclick="deleteItem('majorProjects','${p.id}','Project')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    if (!d.miniProjects.length) {
        mn.innerHTML = '<div class="empty-state"><i class="fas fa-bolt"></i><p>No mini projects.</p></div>';
    } else {
        mn.innerHTML = d.miniProjects.map(p => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <div class="admin-item-title">${esc(p.title)} <span style="color:var(--accent); font-size:9px; margin-left:6px">${p.completion || 0}%</span></div>
                    <div class="admin-item-sub">${esc(p.desc)} ${p.link ? '<i class="fas fa-link" style="color:var(--accent); margin-left:4px"></i>' : ''}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-btn-sm" onclick="openProjectForm('mini','${p.id}')"><i class="fas fa-pen"></i></button>
                    <button class="admin-btn-sm danger" onclick="deleteItem('miniProjects','${p.id}','Mini Project')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
}

/* ===== CRUD DELETE OPERATION ===== */
const DELETE_ENDPOINTS = {
    members: '/members',
    achievements: '/achievements',
    majorProjects: '/projects/major',
    miniProjects: '/projects/mini'
};

function deleteItem(arr, id, label) {
    showConfirm(`Delete ${label}?`, 'This will be removed.', async () => {
        try {
            await api.del(`${DELETE_ENDPOINTS[arr]}/${id}`);
            await refreshData();

            if (arr === 'members') renderAdminMembers();
            if (arr === 'achievements') renderAdminAchievements();
            if (arr === 'majorProjects' || arr === 'miniProjects') renderAdminProjects();

            renderStatsPreview();
            toast(`${label} deleted!`, 'info');
        } catch (e) {
            toast(e.message || 'Delete failed', 'error');
        }
    });
}

/* ===== SETTINGS: DATABASE AND ACCESS ===== */
async function changePassword() {
    const c = V('settCurrPass'),
          n = V('settNewPass'),
          cf = V('settConfPass');

    if (!n || n.length < 4) {
        toast('Min 4 characters!', 'error');
        return;
    }
    if (n !== cf) {
        toast('Passwords dont match!', 'error');
        return;
    }

    try {
        await api.put('/auth/password', { currentPassword: c, newPassword: n });
        document.getElementById('settCurrPass').value = '';
        document.getElementById('settNewPass').value = '';
        document.getElementById('settConfPass').value = '';
        toast('Password changed!');
    } catch (e) {
        toast(e.message || 'Wrong current password!', 'error');
    }
}

async function exportData() {
    try {
        const backup = await api.get('/data/export');
        const b = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }),
              u = URL.createObjectURL(b),
              a = document.createElement('a');

        a.href = u;
        a.download = 'anaxcode_backup_' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(u);
        toast('Exported!');
    } catch (e) {
        toast(e.message || 'Export failed', 'error');
    }
}

function importData(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async function (ev) {
        try {
            const imp = JSON.parse(ev.target.result);
            if (!imp.members || !imp.achievements) {
                toast('Invalid file!', 'error');
                return;
            }
            await api.post('/data/import', imp);
            await refreshData();
            loadSettingsUI();
            renderAdminMembers();
            renderAdminAchievements();
            renderAdminProjects();
            renderStatsPreview();
            toast('Imported!');
        } catch (err) {
            toast(err.message || 'Parse error!', 'error');
        }
    };
    r.readAsText(f);
    e.target.value = '';
}

function confirmReset() {
    showConfirm('RESET ALL DATA?', 'Everything restored to defaults.', async () => {
        try {
            await api.post('/data/reset');
            await refreshData();
            loadSettingsUI();
            renderAdminMembers();
            renderAdminAchievements();
            renderAdminProjects();
            renderStatsPreview();
            toast('Reset to defaults!', 'info');
        } catch (e) {
            toast(e.message || 'Reset failed', 'error');
        }
    });
}
