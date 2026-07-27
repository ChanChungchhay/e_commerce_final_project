/**
 * Nexis Dashboard Management Console Engine
 * Core Frontend Interactive Logic Block (Vanilla ES6 Implementation)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Application Systems Orchestrator
    const NexisApp = {
        init() {
            this.handleLoadingOverlay();
            this.initSidebarNavigation();
            this.initThemeEngine();
            this.initAnimatedCounters();
            this.initSalesCircularProgress();
            this.initTodoListEngine();
            this.initCalendarEngine();
            this.initTableFilters();
            this.initFormSubmissions();
            this.initFloatingActionMenu();
            this.initScrollToTop();
            this.initBootstrapTooltips();
            this.updateCurrentDate();
        },

        // 1. DISMISS LOADING OVERLAY AFTER RECOVERY
        handleLoadingOverlay() {
            const loader = document.getElementById('loading-overlay');
            if (loader) {
                // Simulate telemetry retrieval delay of 900ms
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 900);
            }
        },

        // 2. MOBILE RESPONSIVE SIDEBAR NAVIGATION CONTROLS
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
                iconElement.className = 'bi bi-moon-stars-fill text-primary';
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

        // 6. VANILLA PERSISTENT TODO LIST ENGINE
        initTodoListEngine() {
            const todoForm = document.getElementById('todo-form');
            const todoInput = document.getElementById('todo-input');
            const todoList = document.getElementById('todo-list');
            const todoCount = document.getElementById('todo-count');
            
            let tasks = JSON.parse(localStorage.getItem('nexis-tasks')) || [
                { id: 1, text: 'Reorder classic leather wallets from warehouse', completed: false },
                { id: 2, text: 'Approve pending discount campaign setups', completed: true },
                { id: 3, text: 'Confirm system API integration reports', completed: false }
            ];

            const renderTasks = () => {
                if (!todoList) return;
                todoList.innerHTML = '';
                
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = `todo-item list-group-item d-flex align-items-center justify-content-between border-0 px-0 ${task.completed ? 'completed' : ''}`;
                    li.innerHTML = `
                        <div class="d-flex align-items-center gap-3">
                            <input class="form-check-input todo-checkbox" type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                            <span class="text-sm fw-medium">${task.text}</span>
                        </div>
                        <button class="btn btn-icon-sm text-danger delete-task-btn" data-id="${task.id}" title="Remove Task">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    `;
                    todoList.appendChild(li);
                });

                // Update uncompleted badges
                const remaining = tasks.filter(t => !t.completed).length;
                if (todoCount) todoCount.textContent = `${remaining} Remaining`;
                localStorage.setItem('nexis-tasks', JSON.stringify(tasks));
            };

            if (todoForm) {
                todoForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const text = todoInput.value.trim();
                    if (text === '') return;

                    const newTask = {
                        id: Date.now(),
                        text,
                        completed: false
                    };

                    tasks.push(newTask);
                    todoInput.value = '';
                    renderTasks();
                    this.showToast('Task Added', 'Your system reminder was recorded successfully.');
                });
            }

            // Bind checklist toggling and removal clicks safely
            if (todoList) {
                todoList.addEventListener('change', (e) => {
                    if (e.target.classList.contains('todo-checkbox')) {
                        const id = parseInt(e.target.getAttribute('data-id'));
                        tasks = tasks.map(t => t.id === id ? { ...t, completed: e.target.checked } : t);
                        renderTasks();
                    }
                });

                todoList.addEventListener('click', (e) => {
                    const deleteBtn = e.target.closest('.delete-task-btn');
                    if (deleteBtn) {
                        const id = parseInt(deleteBtn.getAttribute('data-id'));
                        tasks = tasks.filter(t => t.id !== id);
                        renderTasks();
                        this.showToast('Task Deleted', 'An administrative task item has been removed.');
                    }
                });
            }

            renderTasks();
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

        // 9. DIALOG SUBMISSIONS & SUCCESS NOTIFICATIONS
        initFormSubmissions() {
            // New Product Form Handler
            const saveProductBtn = document.getElementById('saveProductBtn');
            const addProductForm = document.getElementById('addProductForm');
            const addProductModalEl = document.getElementById('addProductModal');

            if (saveProductBtn && addProductForm) {
                saveProductBtn.addEventListener('click', () => {
                    if (addProductForm.checkValidity()) {
                        const productName = document.getElementById('productName').value;
                        const productPrice = document.getElementById('productPrice').value;
                        
                        // Hide modal using standard bootstrap controls
                        const modalInstance = bootstrap.Modal.getInstance(addProductModalEl);
                        if (modalInstance) modalInstance.hide();
                        
                        this.showToast('Product Catalog', `Successfully added listing details for ${productName} ($${productPrice}).`);
                        addProductForm.reset();
                    } else {
                        addProductForm.classList.add('was-validated');
                    }
                });
            }

            // Coupon Generator Form Handler
            const saveCouponBtn = document.getElementById('saveCouponBtn');
            const addDiscountForm = document.getElementById('addDiscountForm');
            const createDiscountModalEl = document.getElementById('createDiscountModal');

            if (saveCouponBtn && addDiscountForm) {
                saveCouponBtn.addEventListener('click', () => {
                    const code = document.getElementById('couponCode').value;
                    const value = document.getElementById('discountValue').value;

                    if (code && value) {
                        const modalInstance = bootstrap.Modal.getInstance(createDiscountModalEl);
                        if (modalInstance) modalInstance.hide();

                        this.showToast('Discount Created', `Coupon code "${code.toUpperCase()}" set for immediate activation!`);
                        addDiscountForm.reset();
                    }
                });
            }

            // Quick actions test trigger
            const exportBtn = document.getElementById('exportReportBtn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.showToast('Export Module', 'Generating spreadsheet catalog logs... download will start shortly.');
                });
            }
        },

        // 10. FLOATING ACTION DRAWERS TOGGLE LOGIC
        initFloatingActionMenu() {
            const fabBtn = document.getElementById('fabBtn');
            const fabWrapper = document.querySelector('.fab-wrapper');
            const toastTrigger = document.getElementById('fab-toast-trigger');

            if (fabBtn && fabWrapper) {
                fabBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fabWrapper.classList.toggle('active');
                });

                // Dismiss menu on click outside bounds
                document.addEventListener('click', (e) => {
                    if (!fabWrapper.contains(e.target)) {
                        fabWrapper.classList.remove('active');
                    }
                });
            }

            if (toastTrigger) {
                toastTrigger.addEventListener('click', () => {
                    this.showToast('Quick Status Monitor', 'All active servers are performing within optimal operational capacity.');
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

        // 13. DATE RENDERING ENGINE
        updateCurrentDate() {
            const dateSpan = document.getElementById('header-date');
            const footerYear = document.getElementById('current-year');
            const today = new Date();
            
            if (dateSpan) {
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                dateSpan.textContent = today.toLocaleDateString('en-US', options);
            }

            if (footerYear) {
                footerYear.textContent = today.getFullYear();
            }
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