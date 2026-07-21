/* ===== API CLIENT =====
   Thin fetch wrapper used by storage.js, admin.js and forms.js to talk to
   the Express/MongoDB backend. Handles JWT attachment and error unwrapping. */

const TOKEN_KEY = 'anaxcode_token';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

async function apiRequest(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;

    let res;
    try {
        res = await fetch(API_BASE_URL + path, { ...options, headers });
    } catch (networkErr) {
        throw new Error('Cannot reach server. Please check your connection.');
    }

    let body = null;
    try {
        body = await res.json();
    } catch (e) {
        /* No JSON body (e.g. 204) — ignore */
    }

    if (!res.ok) {
        const msg = (body && body.message) || `Request failed (${res.status})`;
        const err = new Error(msg);
        err.status = res.status;
        throw err;
    }

    return body;
}

const api = {
    get: (path) => apiRequest(path, { method: 'GET' }),
    post: (path, data) => apiRequest(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
    put: (path, data) => apiRequest(path, { method: 'PUT', body: JSON.stringify(data ?? {}) }),
    del: (path) => apiRequest(path, { method: 'DELETE' })
};
