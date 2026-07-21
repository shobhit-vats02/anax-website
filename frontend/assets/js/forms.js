/* ===== MODALS & TOASTS ===== */
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function toast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-circle-xmark',
        info: 'fas fa-circle-info'
    };
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${esc(msg)}</span>`;
    c.appendChild(t);
    setTimeout(() => {
        t.classList.add('removing');
        setTimeout(() => t.remove(), 250);
    }, 2800);
}

/* ===== CONFIRM DIALOG ===== */
let confirmCb = null;

function showConfirm(title, msg, cb) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent = msg;
    confirmCb = cb;
    document.getElementById('confirmBtn').onclick = () => {
        closeModal('confirmModal');
        if (confirmCb) confirmCb();
    };
    openModal('confirmModal');
}

/* ===== ADMIN: MEMBERS CRUD FORMS ===== */
function openMemberForm(eid) {
    const d = getData(),
          m = eid ? d.members.find(x => x.id === eid) : null,
          isE = !!m;

    document.getElementById('formModalTitle').textContent = isE ? 'EDIT MEMBER' : 'ADD MEMBER';
    document.getElementById('formModalBody').innerHTML = `
        <div class="form-group">
            <label class="form-label">Name</label>
            <input class="form-input" id="mf_name" value="${isE ? esc(m.name) : ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Role</label>
            <input class="form-input" id="mf_role" value="${isE ? esc(m.role) : ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Photo URL</label>
            <input class="form-input" id="mf_photo" value="${isE ? esc(m.photo) : ''}">
            <div class="form-hint">Direct image URL</div>
        </div>
        <div class="form-group">
            <label class="form-label">Introduction</label>
            <textarea class="form-textarea" id="mf_intro">${isE ? esc(m.intro) : ''}</textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">LinkedIn</label>
                <input class="form-input" id="mf_li" value="${isE ? esc(m.socials?.linkedin || '') : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">GitHub</label>
                <input class="form-input" id="mf_gh" value="${isE ? esc(m.socials?.github || '') : ''}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">LeetCode</label>
                <input class="form-input" id="mf_lc" value="${isE ? esc(m.socials?.leetcode || '') : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Gmail</label>
                <input class="form-input" id="mf_gm" value="${isE ? esc(m.socials?.gmail || '') : ''}">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Instagram</label>
            <input class="form-input" id="mf_ig" value="${isE ? esc(m.socials?.instagram || '') : ''}">
        </div>
    `;

    document.getElementById('formModalFooter').innerHTML = `
        <button class="btn-secondary" onclick="closeModal('formModal')">CANCEL</button>
        <button class="btn-primary" onclick="saveMember('${eid || ''}')"><i class="fas fa-check" style="margin-right:5px"></i>${isE ? 'UPDATE' : 'ADD'}</button>
    `;
    openModal('formModal');
}

async function saveMember(eid) {
    const n = V('mf_name'),
          r = V('mf_role'),
          p = V('mf_photo'),
          intro = V('mf_intro');

    if (!n || !r) {
        toast('Name & Role required!', 'error');
        return;
    }

    const socials = {
        linkedin: V('mf_li'),
        github: V('mf_gh'),
        leetcode: V('mf_lc'),
        gmail: V('mf_gm'),
        instagram: V('mf_ig')
    };

    const payload = {
        name: n,
        role: r,
        photo: p || 'https://picsum.photos/seed/' + uid() + '/200/200.jpg',
        intro,
        socials
    };

    try {
        if (eid) {
            await api.put(`/members/${eid}`, payload);
            toast('Member updated!');
        } else {
            await api.post('/members', payload);
            toast('Member added!');
        }
        await refreshData();
        closeModal('formModal');
        renderAdminMembers();
        renderStatsPreview();
    } catch (e) {
        toast(e.message || 'Save failed', 'error');
    }
}

/* ===== ADMIN: ACHIEVEMENTS CRUD FORMS ===== */
const ICONS = [
    'fas fa-trophy',
    'fas fa-medal',
    'fas fa-crown',
    'fas fa-star',
    'fas fa-award',
    'fas fa-certificate',
    'fas fa-gem',
    'fas fa-fire',
    'fas fa-bolt',
    'fas fa-rocket'
];

function openAchieveForm(eid) {
    const d = getData(),
          a = eid ? d.achievements.find(x => x.id === eid) : null,
          isE = !!a;

    const metaR = isE ? (a.meta || []) : [
        { icon: 'fas fa-map-marker-alt', text: '' },
        { icon: 'fas fa-calendar', text: '' }
    ];

    document.getElementById('formModalTitle').textContent = isE ? 'EDIT ACHIEVEMENT' : 'ADD ACHIEVEMENT';
    document.getElementById('formModalBody').innerHTML = `
        <div class="form-group">
            <label class="form-label">Title</label>
            <input class="form-input" id="af_title" value="${isE ? esc(a.title) : ''}">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Rank</label>
                <input class="form-input" id="af_rank" value="${isE ? esc(a.rank) : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Icon</label>
                <select class="form-select" id="af_icon">
                    ${ICONS.map(ic => `<option value="${ic}" ${isE && a.icon === ic ? 'selected' : ''}>${ic.replace('fas fa-', '')}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="af_desc">${isE ? esc(a.description) : ''}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Meta Info</label>
            <div id="af_meta_rows">
                ${metaR.map(m => `
                    <div class="form-row" style="margin-bottom:6px">
                        <select class="form-select af-mi" style="font-size:10px; padding:8px 10px">
                            ${ICONS.map(ic => `<option value="${ic}" ${m.icon === ic ? 'selected' : ''}>${ic.replace('fas fa-', '')}</option>`).join('')}
                        </select>
                        <input class="form-input af-mt" value="${esc(m.text)}">
                        <button class="admin-btn-sm danger" onclick="this.closest('.form-row').remove()" style="flex-shrink:0">
                            <i class="fas fa-xmark"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-secondary" onclick="addMetaRow()" style="font-size:9px; padding:5px 12px; margin-top:6px">
                <i class="fas fa-plus" style="margin-right:4px"></i>ADD ROW
            </button>
        </div>
    `;

    document.getElementById('formModalFooter').innerHTML = `
        <button class="btn-secondary" onclick="closeModal('formModal')">CANCEL</button>
        <button class="btn-primary" onclick="saveAchieve('${eid || ''}')"><i class="fas fa-check" style="margin-right:5px"></i>${isE ? 'UPDATE' : 'ADD'}</button>
    `;
    openModal('formModal');
}

function addMetaRow() {
    const c = document.getElementById('af_meta_rows'),
          div = document.createElement('div');

    div.className = 'form-row';
    div.style.marginBottom = '6px';
    div.innerHTML = `
        <select class="form-select af-mi" style="font-size:10px; padding:8px 10px">
            ${ICONS.map(ic => `<option value="${ic}">${ic.replace('fas fa-', '')}</option>`).join('')}
        </select>
        <input class="form-input af-mt" value="">
        <button class="admin-btn-sm danger" onclick="this.closest('.form-row').remove()" style="flex-shrink:0">
            <i class="fas fa-xmark"></i>
        </button>
    `;
    c.appendChild(div);
}

async function saveAchieve(eid) {
    const t = V('af_title'),
          r = V('af_rank'),
          ic = V('af_icon'),
          desc = V('af_desc');

    if (!t || !r) {
        toast('Title & Rank required!', 'error');
        return;
    }

    const miE = document.querySelectorAll('.af-mi'),
          mtE = document.querySelectorAll('.af-mt'),
          meta = [];

    miE.forEach((el, i) => {
        if (mtE[i]?.value.trim()) {
            meta.push({
                icon: el.value,
                text: mtE[i].value.trim()
            });
        }
    });

    const payload = { title: t, rank: r, icon: ic, description: desc, meta };

    try {
        if (eid) {
            await api.put(`/achievements/${eid}`, payload);
            toast('Achievement updated!');
        } else {
            await api.post('/achievements', payload);
            toast('Achievement added!');
        }
        await refreshData();
        closeModal('formModal');
        renderAdminAchievements();
        renderStatsPreview();
    } catch (e) {
        toast(e.message || 'Save failed', 'error');
    }
}

/* ===== ADMIN: PROJECTS CRUD FORMS ===== */
function openProjectForm(type, eid) {
    const d = getData(),
          isE = !!eid;

    let p = null;
    if (isE) {
        if (type === 'major') p = d.majorProjects.find(x => x.id === eid);
        else p = d.miniProjects.find(x => x.id === eid);
    }

    document.getElementById('formModalTitle').textContent = (isE ? 'EDIT ' : 'ADD ') + (type === 'major' ? 'MAJOR PROJECT' : 'MINI PROJECT');

    if (type === 'major') {
        document.getElementById('formModalBody').innerHTML = `
            <div class="form-group">
                <label class="form-label">Title</label>
                <input class="form-input" id="pf_title" value="${isE ? esc(p.title) : ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-select" id="pf_status">
                        <option value="completed" ${isE && p.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="ongoing" ${isE && p.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                        <option value="planning" ${isE && p.status === 'planning' ? 'selected' : ''}>Planning</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Completion %</label>
                    <input class="form-input" type="number" id="pf_comp" min="0" max="100" value="${isE ? (p.completion || 0) : 0}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="pf_desc">${isE ? esc(p.description) : ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Tech Tags</label>
                <input class="form-input" id="pf_tags" value="${isE ? (p.tags || []).join(', ') : ''}" placeholder="React, Node.js">
                <div class="form-hint">Comma separated</div>
            </div>
            <div class="form-group">
                <label class="form-label">Project Link</label>
                <input class="form-input" id="pf_link" value="${isE ? esc(p.link || '') : ''}" placeholder="https://...">
                <div class="form-hint">Empty = View button hidden</div>
            </div>
        `;

        document.getElementById('formModalFooter').innerHTML = `
            <button class="btn-secondary" onclick="closeModal('formModal')">CANCEL</button>
            <button class="btn-primary" onclick="saveProject('major','${eid || ''}')"><i class="fas fa-check" style="margin-right:5px"></i>${isE ? 'UPDATE' : 'ADD'}</button>
        `;
    } else {
        document.getElementById('formModalBody').innerHTML = `
            <div class="form-group">
                <label class="form-label">Title</label>
                <input class="form-input" id="pf_mt" value="${isE ? esc(p.title) : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <input class="form-input" id="pf_md" value="${isE ? esc(p.desc) : ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Completion %</label>
                    <input class="form-input" type="number" id="pf_mc" min="0" max="100" value="${isE ? (p.completion || 0) : 0}">
                </div>
                <div class="form-group">
                    <label class="form-label">Project Link</label>
                    <input class="form-input" id="pf_ml" value="${isE ? esc(p.link || '') : ''}" placeholder="https://...">
                </div>
            </div>
        `;

        document.getElementById('formModalFooter').innerHTML = `
            <button class="btn-secondary" onclick="closeModal('formModal')">CANCEL</button>
            <button class="btn-primary" onclick="saveProject('mini','${eid || ''}')"><i class="fas fa-check" style="margin-right:5px"></i>${isE ? 'UPDATE' : 'ADD'}</button>
        `;
    }
    openModal('formModal');
}

async function saveProject(type, eid) {
    try {
        if (type === 'major') {
            const t = V('pf_title'),
                  st = V('pf_status'),
                  comp = parseInt(V('pf_comp')) || 0,
                  desc = V('pf_desc'),
                  tags = V('pf_tags').split(',').map(x => x.trim()).filter(Boolean),
                  link = V('pf_link');

            if (!t) {
                toast('Title required!', 'error');
                return;
            }

            const payload = { title: t, status: st, completion: Math.min(100, Math.max(0, comp)), description: desc, tags, link };

            if (eid) await api.put(`/projects/major/${eid}`, payload);
            else await api.post('/projects/major', payload);
        } else {
            const t = V('pf_mt'),
                  desc = V('pf_md'),
                  comp = parseInt(V('pf_mc')) || 0,
                  link = V('pf_ml');

            if (!t) {
                toast('Title required!', 'error');
                return;
            }

            const payload = { title: t, desc, completion: Math.min(100, Math.max(0, comp)), link };

            if (eid) await api.put(`/projects/mini/${eid}`, payload);
            else await api.post('/projects/mini', payload);
        }

        toast(eid ? 'Updated!' : 'Added!');
        await refreshData();
        closeModal('formModal');
        renderAdminProjects();
        renderStatsPreview();
    } catch (e) {
        toast(e.message || 'Save failed', 'error');
    }
}
