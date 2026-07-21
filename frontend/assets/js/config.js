/* ===== API CONFIGURATION =====
   Update the production URL below to your deployed Render backend once live,
   e.g. 'https://anaxcode-api.onrender.com/api' */
const API_BASE_URL = (function () {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '') {
        return 'http://localhost:5000/api';
    }
    return 'https://YOUR-BACKEND-URL.onrender.com/api';
})();
