/**
 * Nexis Dashboard Management Console Engine
 * Core Frontend Interactive Logic Block (Vanilla ES6 Implementation)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Application Systems Orchestrator
    const NexisApp = {
        init() {
            this.initSidebarNavigation();
            this.initThemeEngine();
            this.initAnimatedCounters();
            this.initSalesCircularProgress();
            this.initCalendarEngine();
            this.initTableFilters();
            this.initScrollToTop();
            this.initBootstrapTooltips();
        },
        //  MOBILE RESPONSIVE SIDEBAR NAVIGATION CONTROLS
        initSidebarNavigation() {
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.getElementById('sidebar-toggle');
            const closeBtn = document.getElementById('sidebar-close');
            
            if (toggleBtn && sidebar) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sidebar.classList.add('show');
                });
            }

            if (closeBtn && sidebar) {
                closeBtn.addEventListener('click', () => {
                    sidebar.classList.remove('show');
                });
            }

            // Click outside sidebar to dismiss on mobile viewports
            document.addEventListener('click', (e) => {
                if (sidebar && sidebar.classList.contains('show')) {
                    if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
                        sidebar.classList.remove('show');
                    }
                }
            });

            // Handle sidebar active class modifications
            const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    menuItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                });
            });
        },

        // 3. SECURE LIGHT/DARK THEME STORAGE & ENGINES
        initThemeEngine() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const htmlElement = document.documentElement;

            // Load saved preference or check device configuration settings
            const currentTheme = localStorage.getItem('nexis-theme') || 
                                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            htmlElement.setAttribute('data-bs-theme', currentTheme);
            this.updateThemeIcon(themeIcon, currentTheme);

            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const activeTheme = htmlElement.getAttribute('data-bs-theme');
                    const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
                    
                    htmlElement.setAttribute('data-bs-theme', targetTheme);
                    localStorage.setItem('nexis-theme', targetTheme);
                    this.updateThemeIcon(themeIcon, targetTheme);
                    this.showToast('Theme System', `Successfully converted to ${targetTheme} interface view!`);
                });
            }
        },

        updateThemeIcon(iconElement, currentTheme) {
            if (!iconElement) return;
            if (currentTheme === 'dark') {
                iconElement.className = 'bi bi-sun-fill text-warning';
            } else {
                iconElement.className = 'bi bi-moon-stars-fill';
            }
        },

        // 4. ANIMATED PERFORMANCE COUNTER METRICS ENGINE
        initAnimatedCounters() {
            const counters = document.querySelectorAll('.stats-counter');
            
            const animateCounter = (counter) => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 1200; // Total animation cycle milliseconds
                const stepTime = 15;
                const totalSteps = duration / stepTime;
                const increment = target / totalSteps;
                let current = 0;
                let stepCount = 0;

                const timer = setInterval(() => {
                    current += increment;
                    stepCount++;
                    
                    if (stepCount >= totalSteps) {
                        clearInterval(timer);
                        // Finalize with formatted layout output
                        counter.textContent = target.toLocaleString(undefined, {
                            minimumFractionDigits: target % 1 !== 0 ? 2 : 0,
                            maximumFractionDigits: target % 1 !== 0 ? 2 : 0
                        });
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString(undefined, {
                            maximumFractionDigits: 0
                        });
                    }
                }, stepTime);
            };

            // Instantiate counters using simple delay wrapper
            setTimeout(() => {
                counters.forEach(counter => animateCounter(counter));
            }, 1000);
        },

        // 5. TODAY'S SALES CIRCULAR TARGET CHART COMPUTATIONS
        initSalesCircularProgress() {
            const indicator = document.getElementById('progress-circle-indicator');
            if (indicator) {
                const percentage = 78; // Default current performance level metrics %
                const radius = 45;
                const circumference = 2 * Math.PI * radius; // Approx 283
                
                // Adjust circular dashed strokes visually
                const offset = circumference - (percentage / 100) * circumference;
                indicator.style.strokeDasharray = circumference;
                
                // Animate calculation on viewport focus load delay
                setTimeout(() => {
                    indicator.style.strokeDashoffset = offset;
                }, 1200);
            }
        },

        // 7. STOREFRONT OPERATIONS MONTHLY CALENDAR RENDER
        initCalendarEngine() {
            const grid = document.getElementById('calendar-grid');
            const label = document.getElementById('calendar-month-label');
            if (!grid) return;

            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();

            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if (label) label.textContent = `${monthNames[month]} ${year}`;

            // Generate Week headers automatically
            const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            grid.innerHTML = '';
            
            daysOfWeek.forEach(day => {
                const div = document.createElement('div');
                div.className = 'calendar-header-day';
                div.textContent = day;
                grid.appendChild(div);
            });

            // Find start offset calculations for grid day positions
            const firstDay = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();

            // Inject spacer blocks
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'calendar-cell empty-cell';
                grid.appendChild(empty);
            }

            // Populate monthly numerical dates
            for (let day = 1; day <= totalDays; day++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                cell.textContent = day;
                
                // Highlight real-world calendar day matches
                if (day === today.getDate()) {
                    cell.classList.add('today');
                }
                
                grid.appendChild(cell);
            }
        },

        // 8. TABLE PIPELINE INTERACTIVE QUERY/FILTERS
        initTableFilters() {
            const tableRows = document.querySelectorAll('#orders-table-body tr');
            const filterDropdownItems = document.querySelectorAll('[aria-labelledby="ordersFilter"] .dropdown-item');

            filterDropdownItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Toggle Active state style on buttons
                    filterDropdownItems.forEach(x => x.classList.remove('active'));
                    item.classList.add('active');

                    const targetFilter = item.getAttribute('data-filter');
                    
                    tableRows.forEach(row => {
                        const status = row.getAttribute('data-status');
                        if (targetFilter === 'all' || status === targetFilter) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            });

            // Global search filter mechanics integration
            const globalSearch = document.getElementById('global-search');
            if (globalSearch) {
                globalSearch.addEventListener('keyup', () => {
                    const term = globalSearch.value.toLowerCase().trim();

                    tableRows.forEach(row => {
                        const content = row.textContent.toLowerCase();
                        if (content.includes(term)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            }
        },
        // 11. SCROLL TO TOP UTILITY TOGGLE BUTTON
        initScrollToTop() {
            const topBtn = document.getElementById('scrollTopBtn');
            if (!topBtn) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    topBtn.classList.add('visible');
                } else {
                    topBtn.classList.remove('visible');
                }
            });

            topBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        // 12. INITIALIZE STANDARD NATIVE BOOTSTRAP 5 TOOLTIPS
        initBootstrapTooltips() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map((tooltipTriggerEl) => {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        },

        // HELPER METHOD: GLOBAL EMITTER TOAST NOTIFICATION CREATOR
        showToast(title, message) {
            const toastEl = document.getElementById('actionToast');
            const toastMsg = document.getElementById('toast-message');
            
            if (toastEl && toastMsg) {
                toastMsg.innerHTML = `<strong>${title}:</strong> ${message}`;
                const toastInstance = new bootstrap.Toast(toastEl, { delay: 4000 });
                toastInstance.show();
            }
        }
    };

    // Instantiate complete application lifecycle
    NexisApp.init();
});