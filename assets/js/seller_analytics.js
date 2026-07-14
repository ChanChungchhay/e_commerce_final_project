/**
 * START OF FILE seller_analytics.js
 * Basic E-commerce Theme & Navigation Controller (Minimal Code Style)
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Sidebar Toggle Control
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => sidebar.classList.add('show'));
    }
    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => sidebar.classList.remove('show'));
    }

    // 2. Pure Light/Dark Interface Switcher 
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = htmlElement.getAttribute('data-bs-theme');
            const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-bs-theme', targetTheme);

            if (themeIcon) {
                themeIcon.className = targetTheme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-primary';
            }
        });
    }

    // 3. Simple Download Excel Action Feedback
    const exportBtn = document.getElementById('exportReportBtn');
    const actionToast = document.getElementById('actionToast');

    if (exportBtn && actionToast) {
        exportBtn.addEventListener('click', () => {
            const toastInstance = new bootstrap.Toast(actionToast);
            toastInstance.show();
        });
    }
});
// END OF FILE seller_analytics.js