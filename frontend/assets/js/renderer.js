/* ===== DYNAMIC STATS ===== */
function calcStats() {
    const d = getData();
    return {
        members: d.members.length,
        hackathons: d.achievements.length,
        projects: d.majorProjects.length + d.miniProjects.length,
        grandFinals: d.achievements.filter(a => a.rank.toLowerCase().includes('grand')).length
    };
}

function renderHomeStats() {
    const s = calcStats(),
          row = document.getElementById('statsRow');
          
    row.innerHTML = `
        <div class="stat-item">
            <div class="stat-num counter" data-target="${s.members}">0</div>
            <div class="stat-label">Members</div>
        </div>
        <div class="stat-item">
            <div class="stat-num counter" data-target="${s.hackathons}">0</div>
            <div class="stat-label">Hackathons</div>
        </div>
        <div class="stat-item">
            <div class="stat-num counter" data-target="${s.projects}">0</div>
            <div class="stat-label">Projects</div>
        </div>
        <div class="stat-item">
            <div class="stat-num counter" data-target="${s.grandFinals}">0</div>
            <div class="stat-label">Grand Finals</div>
        </div>
    `;
    row.classList.remove('stagger');
    void row.offsetWidth;
    row.classList.add('stagger');
    animateCounters();
}

function renderStatsPreview() {
    const s = calcStats();
    document.getElementById('statsPreview').innerHTML = `
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:14px;text-align:center">
            <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:800;color:var(--accent)">${s.members}</div>
            <div style="font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px">Members</div>
        </div>
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:14px;text-align:center">
            <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:800;color:var(--accent)">${s.hackathons}</div>
            <div style="font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px">Hackathons</div>
        </div>
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:14px;text-align:center">
            <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:800;color:var(--accent)">${s.projects}</div>
            <div style="font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px">Projects</div>
        </div>
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:14px;text-align:center">
            <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:800;color:var(--accent)">${s.grandFinals}</div>
            <div style="font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px">Grand Finals</div>
        </div>
    `;
}

function renderHomeText() {
    const d = getData();
    document.getElementById('homeTagline').textContent = d.tagline || DEFAULT_DATA.tagline;
    document.getElementById('homeIntro').innerHTML = d.intro || DEFAULT_DATA.intro;
}

/* ===== CONTACT PAGE ===== */
function renderContact() {
    const c = getData().contactInfo || DEFAULT_DATA.contactInfo;
    const cards = [
        { icon: 'fas fa-envelope', label: 'Email', value: c.email || 'Not set', url: c.email ? 'mailto:' + c.email : '' },
        { icon: 'fab fa-instagram', label: 'Instagram', value: c.instagram ? c.instagram.replace(/^https?:\/\/(www\.)?/, '') : 'Not set', url: c.instagram || '' },
        { icon: 'fab fa-linkedin-in', label: 'LinkedIn', value: c.linkedin ? c.linkedin.replace(/^https?:\/\/(www\.)?/, '') : 'Not set', url: c.linkedin || '' },
        { icon: 'fab fa-youtube', label: 'YouTube', value: c.youtube ? c.youtube.replace(/^https?:\/\/(www\.)?/, '') : 'Not set', url: c.youtube || '' }
    ];
    document.getElementById('contactGrid').innerHTML = cards.map(cd => `
        ${cd.url ? `<a class="contact-card" href="${esc(cd.url)}" target="_blank" rel="noopener">` : `<div class="contact-card" style="cursor:default">`}
            <div class="contact-icon"><i class="${cd.icon}"></i></div>
            <div class="contact-label">${cd.label}</div>
            <div class="contact-value">${esc(cd.value)}</div>
            <div class="contact-arrow"><i class="fas fa-arrow-up-right-from-square"></i></div>
        ${cd.url ? '</a>' : '</div>'}
    `).join('');
}

/* ===== RENDER: MEMBERS ===== */
const SOC_ICONS = {
    linkedin: 'fab fa-linkedin-in',
    github: 'fab fa-github',
    leetcode: 'fas fa-code',
    gmail: 'fas fa-envelope',
    instagram: 'fab fa-instagram'
};

function renderMembers() {
    const d = getData(),
          g = document.getElementById('membersGrid');
          
    if (!d.members.length) {
        g.innerHTML = '<div class="empty-state"><i class="fas fa-users-slash"></i><p>No members yet.</p></div>';
        return;
    }
    
    g.innerHTML = d.members.map(m => `
        <div class="g-card member-card">
            <div class="member-top">
                <img class="member-photo" src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" onerror="this.src='https://picsum.photos/seed/fallback/200/200.jpg'">
                <div>
                    <div class="member-name">${esc(m.name)}</div>
                    <div class="member-role">${esc(m.role)}</div>
                </div>
            </div>
            <p class="member-intro">${esc(m.intro)}</p>
            <div class="member-socials">
                ${Object.entries(m.socials || {})
                    .filter(([_, u]) => u)
                    .map(([p, u]) => `<a class="soc-link" href="${esc(u)}" target="_blank" rel="noopener"><i class="${SOC_ICONS[p] || 'fas fa-link'}"></i></a>`)
                    .join('')}
            </div>
        </div>
    `).join('');
}

/* ===== RENDER: ACHIEVEMENTS ===== */
function renderAchievements() {
    const d = getData(),
          l = document.getElementById('achieveList');
          
    if (!d.achievements.length) {
        l.innerHTML = '<div class="empty-state"><i class="fas fa-trophy"></i><p>No achievements yet.</p></div>';
        return;
    }
    
    l.innerHTML = d.achievements.map(a => `
        <div class="g-card achieve-card">
            <span class="rank">${esc(a.rank)}</span>
            <div class="achieve-icon"><i class="${a.icon || 'fas fa-star'}"></i></div>
            <div class="achieve-title">${esc(a.title)}</div>
            <p class="achieve-sub">${esc(a.description)}</p>
            <div class="achieve-meta">
                ${(a.meta || []).map(m => `<span class="achieve-meta-item"><i class="${m.icon}"></i> ${esc(m.text)}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

/* ===== RENDER: PROJECTS ===== */
function renderProjects() {
    const d = getData(),
          mg = document.getElementById('majorProjGrid');
          
    if (!d.majorProjects.length) {
        mg.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No major projects.</p></div>';
    } else {
        mg.innerHTML = d.majorProjects.map((p, i) => `
            <div class="g-card proj-card">
                <div class="proj-num">${String(i + 1).padStart(2, '0')}</div>
                <div class="proj-status ${p.status}">
                    <span class="status-dot" style="background:${p.status === 'completed' ? '#00ff88' : p.status === 'ongoing' ? '#FFD700' : '#777'}; animation:pulse 2s ease-in-out infinite"></span>${p.status}
                </div>
                <div class="proj-title">${esc(p.title)}</div>
                <p class="proj-desc">${esc(p.description)}</p>
                <div class="proj-tags">
                    ${(p.tags || []).map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
                </div>
                <div class="proj-progress">
                    <div class="prog-header">
                        <span class="prog-label">Completion</span>
                        <span class="prog-pct">${p.completion || 0}%</span>
                    </div>
                    <div class="prog-bar">
                        <div class="prog-fill" style="--target-width:${Math.min(100, p.completion || 0)}%"></div>
                    </div>
                </div>
                ${p.link ? `<a class="view-proj-btn" href="${esc(p.link)}" target="_blank" rel="noopener">View Project <i class="fas fa-arrow-right"></i></a>` : `<span class="view-proj-btn disabled">No Link <i class="fas fa-link-slash"></i></span>`}
            </div>
        `).join('');
    }

    const mn = document.getElementById('miniProjGrid');
    if (!d.miniProjects.length) {
        mn.innerHTML = '<div class="empty-state"><i class="fas fa-bolt"></i><p>No mini projects.</p></div>';
    } else {
        mn.innerHTML = d.miniProjects.map(p => `
            <div class="mini-card">
                <div class="mini-title">${esc(p.title)}</div>
                <div class="mini-desc">${esc(p.desc)}</div>
                <div class="mini-bottom">
                    <div class="proj-progress" style="flex:1; margin-bottom:0; margin-right:12px">
                        <div class="prog-header">
                            <span class="prog-label">Progress</span>
                            <span class="prog-pct" style="font-size:12px">${p.completion || 0}%</span>
                        </div>
                        <div class="prog-bar">
                            <div class="prog-fill" style="--target-width:${Math.min(100, p.completion || 0)}%"></div>
                        </div>
                    </div>
                    ${p.link ? `<a class="view-proj-btn" href="${esc(p.link)}" target="_blank" rel="noopener" style="margin-top:auto; flex-shrink:0; padding:7px 14px; font-size:9px">View <i class="fas fa-arrow-right"></i></a>` : `<span class="view-proj-btn disabled" style="margin-top:auto; flex-shrink:0; padding:7px 14px; font-size:9px"><i class="fas fa-link-slash"></i></span>`}
                </div>
            </div>
        `).join('');
    }
}
