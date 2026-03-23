// showbin.js — shared utilities

// ── Online count (simulated, range-controlled) ──
const _RANGES = {
  '1-100':   [1,   100],
  '100-200': [100, 200],
  '300-400': [300, 400],
  '400-500': [400, 500],
  '500-600': [500, 600],
  '600-700': [600, 700],
  '800-900': [800, 900],
  '900-999': [900, 999],
};

function _getTargetRange() {
    const key = localStorage.getItem('sb_online_range') || '1-100';
    return _RANGES[key] || [1, 100];
}

let _onlineCount = null; // init on first tick

function _tickOnline() {
    const [min, max] = _getTargetRange();
    if (_onlineCount === null) {
        _onlineCount = Math.floor(min + (max - min) * 0.7);
    }
    // nudge toward range — step by 1-2 per tick
    if (_onlineCount < min) {
        _onlineCount += Math.floor(Math.random() * 2) + 1;
        if (_onlineCount > min) _onlineCount = min;
    } else if (_onlineCount > max) {
        _onlineCount -= Math.floor(Math.random() * 2) + 1;
        if (_onlineCount < max) _onlineCount = max;
    } else {
        // within range: drift naturally, never jump more than 1
        const dir = Math.random() > 0.5 ? 1 : -1;
        if (Math.random() > 0.35) _onlineCount += dir;
        if (_onlineCount < min) _onlineCount = min;
        if (_onlineCount > max) _onlineCount = max;
    }
    document.querySelectorAll('.online-count').forEach(el => {
        el.textContent = _onlineCount;
        el.removeAttribute('style');
        el.classList.add('connected');
    });
}
setInterval(_tickOnline, 5000);
document.addEventListener('DOMContentLoaded', () => setTimeout(_tickOnline, 100));

// ── Navbar active state ──
document.addEventListener('DOMContentLoaded', function () {
    const page = location.pathname.split('/').pop() || 'index.html';
    const map = {
        'index.html': 'nav-home',
        'add.html': 'nav-add',
        'users.html': 'nav-users',
        'upgrades.html': 'nav-upgrades',
        'hof.html': 'nav-hof',
        'contact.html': 'nav-contact',
        'login.html': '',
        'register.html': '',
    };
    const activeId = map[page];
    if (activeId) {
        const el = document.getElementById(activeId);
        if (el) el.classList.add('active');
    }

    // hamburger
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
        toggler.addEventListener('click', () => {
            document.querySelector('.nav-wrapper').classList.toggle('show');
        });
    }
});

// ── Pastes store (localStorage) ──
function getPastes() {
    try { return JSON.parse(localStorage.getItem('sb_pastes') || '[]'); } catch { return []; }
}
function savePastes(arr) {
    localStorage.setItem('sb_pastes', JSON.stringify(arr));
}
function addPaste(title, content) {
    const pastes = getPastes();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    pastes.unshift({ id, title, content, author: null, views: 0, comments: 0, created_at: dateStr });
    savePastes(pastes);
    return id;
}
function getPasteById(id) {
    return getPastes().find(p => p.id === id) || null;
}
function incViews(id) {
    const pastes = getPastes();
    const p = pastes.find(x => x.id === id);
    if (p) { p.views++; savePastes(pastes); }
}

// ── Escape HTML ──
function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Format date ──
function fmtDate(d) {
    const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${M[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
