document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initBinaryRain();
    initMouseGlow();

    await initData();

    renderHomeText();
    renderHomeStats();
    startTyping();
    renderMembers();
    renderAchievements();
    renderProjects();
    renderContact();
});
