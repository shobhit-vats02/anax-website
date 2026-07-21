/* ===== TYPING EFFECT ===== */
let typeIdx = 0,
    charIdx = 0,
    isDel = false,
    typeTimer = null;

function getTypingPhrases() {
    return getData().typingPhrases || DEFAULT_DATA.typingPhrases;
}

function startTyping() {
    if (typeTimer) clearTimeout(typeTimer);
    typeIdx = 0;
    charIdx = 0;
    isDel = false;
    runTyping();
}

function runTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const phrases = getTypingPhrases();
    if (!phrases.length) {
        el.textContent = '';
        return;
    }
    const c = phrases[typeIdx % phrases.length];
    if (!isDel) {
        el.textContent = c.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === c.length) {
            isDel = true;
            typeTimer = setTimeout(runTyping, 2000);
            return;
        }
        typeTimer = setTimeout(runTyping, 55);
    } else {
        el.textContent = c.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDel = false;
            typeIdx++;
            typeTimer = setTimeout(runTyping, 350);
            return;
        }
        typeTimer = setTimeout(runTyping, 28);
    }
}

/* ===== ANIMATE COUNTER ===== */
function animateCounters() {
    document.querySelectorAll('.counter').forEach(el => {
        const t = parseInt(el.dataset.target);
        let c = 0;
        const s = Math.max(1, Math.floor(t / 28));
        const iv = setInterval(() => {
            c += s;
            if (c >= t) {
                c = t;
                clearInterval(iv);
            }
            el.textContent = c + '+';
        }, 40);
    });
}

/* ===== ANIMATE PROGRESS BARS ===== */
function animateProgressBars() {
    document.querySelectorAll('.prog-fill').forEach(el => el.classList.add('animate'));
}

/* ===== MOUSE GLOW ===== */
function initMouseGlow() {
    const g = document.createElement('div');
    g.style.cssText = 'position:fixed;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,107,0,.05)0%,transparent 70%);pointer-events:none;z-index:0;transition:transform .12s ease-out;transform:translate(-50% ,-50%)';
    document.body.appendChild(g);
    document.addEventListener('mousemove', e => {
        g.style.left = e.clientX + 'px';
        g.style.top = e.clientY + 'px';
    });
}
