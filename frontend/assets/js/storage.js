/* ===== DATA LAYER =====
   Previously: read/write localStorage directly.
   Now: data lives in MongoDB behind the Express API. This module fetches it
   once into an in-memory cache so the rest of the app (renderer.js,
   animations.js, admin.js) can keep calling the synchronous getData()
   exactly as before — only the source of truth changed. */

let _dataCache = null;

function withId(doc) {
    if (doc && doc._id && !doc.id) doc.id = doc._id;
    return doc;
}

function normalizeData(d) {
    return {
        members: (d.members || []).map(withId),
        achievements: (d.achievements || []).map(withId),
        majorProjects: (d.majorProjects || []).map(withId),
        miniProjects: (d.miniProjects || []).map(withId),
        tagline: d.tagline || '',
        intro: d.intro || '',
        typingPhrases: d.typingPhrases || [],
        contactInfo: d.contactInfo || {}
    };
}

/* Loads site data from the API. Called once on boot (see app.js).
   Falls back to bundled DEFAULT_DATA if the API is unreachable so the site
   still renders (admin actions will simply fail until the API is back). */
async function initData() {
    try {
        const res = await api.get('/data');
        _dataCache = normalizeData(res.data);
    } catch (e) {
        console.error('Failed to load data from API, using local fallback:', e);
        _dataCache = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return _dataCache;
}

/* Re-fetches from the API. Call after any create/update/delete so the
   cache (and therefore every render*() call) reflects the latest state. */
async function refreshData() {
    const res = await api.get('/data');
    _dataCache = normalizeData(res.data);
    return _dataCache;
}

/* Synchronous accessor used everywhere in the app — unchanged signature. */
function getData() {
    return _dataCache || DEFAULT_DATA;
}

/* Legacy no-op kept for backward compatibility. Persistence now happens via
   explicit api.post/put/del calls in admin.js / forms.js; this only updates
   the in-memory cache so nothing crashes if something still calls it. */
function saveData(d) {
    _dataCache = d;
}
