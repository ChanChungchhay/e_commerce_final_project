/**
 * START OF FILE seller_customers.js
 * Nexis Customer Relationship Management Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // Mock Customer Database (ជម្រើសទិន្នន័យអតិថិជនខ្មែរ)
    let customersData = [
        {
            id: 'CUST-01',
            name: 'មាស ធីតា',
            email: 'thida.meas@gmail.com',
            phone: '092 112 233',
            address: 'ផ្ទះលេខ ១២ ផ្លូវ ៣១០ សង្កាត់បឹងកេងកងទី១ ភ្នំពេញ',
            tier: 'vip',
            ordersCount: 15,
            totalSpent: 1240.00,
            status: 'active',
            joinedDate: '12-មករា-2025',
            notes: 'អតិថិជនម្នាក់នេះចូលចិត្តការវេចខ្ចប់ប្រអប់ស្អាតៗ និងចូលចិត្តកក់ទំនិញទុកមុន។',
            history: [
                { orderId: 'ORD-9832', date: '12-Oct-2026', amount: 129.00, status: 'shipping' },
                { orderId: 'ORD-9512', date: '10-Sep-2026', amount: 250.00, status: 'completed' },
                { orderId: 'ORD-9401', date: '01-Aug-2026', amount: 861.00, status: 'completed' }
            ]
        },
        {
            id: 'CUST-02',
            name: 'ចាន់ ដារ៉ា',
            email: 'dara.chan@gmail.com',
            phone: '010 556 778',
            address: 'បុរីវិមានភ្នំពេញ ផ្លូវជាតិលេខ៥ សង្កាត់ច្រាំងចំរេះ ភ្នំពេញ',
            tier: 'vip',
            ordersCount: 8,
            totalSpent: 850.50,
            status: 'active',
            joinedDate: '20-កុម្ភៈ-2025',
            notes: 'តែងតែទូទាត់ប្រាក់ភ្លាមៗតាម ABA QR Code ពេលបញ្ជាទិញ។',
            history: [
                { orderId: 'ORD-9831', date: '11-Oct-2026', amount: 401.50, status: 'completed' },
                { orderId: 'ORD-9122', date: '15-May-2026', amount: 449.00, status: 'completed' }
            ]
        },
        {
            id: 'CUST-03',
            name: 'ជា សុខា',
            email: 'sokha.cheas@gmail.com',
            phone: '097 789 123',
            address: 'ភូមិ១ សង្កាត់៣ ក្រុងព្រះសីហនុ ខេត្តព្រះសីហនុ',
            tier: 'regular',
            ordersCount: 4,
            totalSpent: 198.00,
            status: 'active',
            joinedDate: '15-មិថុនា-2025',
            notes: 'អតិថិជននេះជាវត្ថុប្រើប្រាស់ប្រចាំថ្ងៃ ច្រើនទិញទំនិញពេលមានការបញ្ចុះតម្លៃ។',
            history: [
                { orderId: 'ORD-9830', date: '10-Oct-2026', amount: 53.00, status: 'pending' },
                { orderId: 'ORD-9012', date: '12-Apr-2026', amount: 145.00, status: 'completed' }
            ]
        },
        {
            id: 'CUST-04',
            name: 'អ៊ុំ ស្រីនី',
            email: 'sreyny.oum@gmail.com',
            phone: '088 123 456',
            address: 'ភូមិស្វាយប៉ាក សង្កាត់ស្វាយប៉ាក ខណ្ឌឫស្សីកែវ ភ្នំពេញ',
            tier: 'new',
            ordersCount: 1,
            totalSpent: 45.00,
            status: 'active',
            joinedDate: '01-តុលា-2026',
            notes: 'អតិថិជនទើបចុះឈ្មោះថ្មី។',
            history: [
                { orderId: 'ORD-9801', date: '01-Oct-2026', amount: 45.00, status: 'completed' }
            ]
        },
        {
            id: 'CUST-05',
            name: 'ឡាយ គីមស៊្រុន',
            email: 'kimsrun.lay@yahoo.com',
            phone: '012 999 888',
            address: 'ផ្លូវមហាវីថិសហព័ន្ធរុស្ស៊ី សង្កាត់ទឹកថ្លា ភ្នំពេញ',
            tier: 'regular',
            ordersCount: 0,
            totalSpent: 0.00,
            status: 'inactive',
            joinedDate: '10-ធ្នូ-2025',
            notes: 'មិនទាន់មានការបញ្ជាទិញទំនិញនៅឡើយទេ អសកម្មជាង ៦ខែមកហើយ។',
            history: []
        }
    ];

    let currentSelectedCustomer = null;

    // DOM Selectors
    const customersListRows = document.getElementById('customers-list-rows');
    const customersEmptyState = document.getElementById('customers-empty-state');
    const customerPaginationText = document.getElementById('customer-pagination-text');

    // Filter selectors
    const searchFilter = document.getElementById('filter-customer-search');
    const vipFilter = document.getElementById('filter-vip-type');
    const statusFilter = document.getElementById('filter-customer-status');
    const btnResetFilters = document.getElementById('btn-reset-customer-filters');
    const quickSearchHeader = document.getElementById('customer-quick-search');

    // Modal dossiers selectors
    const detailCustAvatar = document.getElementById('detail-cust-avatar');
    const detailCustBadge = document.getElementById('detail-cust-badge');
    const detailCustName = document.getElementById('detail-cust-name');
    const detailCustJoined = document.getElementById('detail-cust-joined');
    const detailCustPhone = document.getElementById('detail-cust-phone');
    const detailCustEmail = document.getElementById('detail-cust-email');
    const detailCustAddress = document.getElementById('detail-cust-address');
    const detailCustOrdersCount = document.getElementById('detail-cust-orders-count');
    const detailCustTotalSpent = document.getElementById('detail-cust-total-spent');
    const custInternalNote = document.getElementById('cust-internal-note');
    const btnSaveCustomerNote = document.getElementById('btn-save-customer-note');
    const customerHistoryRows = document.getElementById('customer-history-rows');

    const CustomersController = {
        init() {
            this.renderCustomers();
            this.registerEvents();
            this.updateOverviewMetrics();
        },

        // Translate Membership Tier to Khmer Labels
        getTierLabelKhmer(tier) {
            const tiers = {
                vip: 'សមាជិក VIP',
                regular: 'អតិថិជនទូទៅ',
                new: 'សមាជិកថ្មី'
            };
            return tiers[tier] || tier;
        },

        // Render customer list rows in table
        renderCustomers() {
            const query = (searchFilter.value || quickSearchHeader.value || '').toLowerCase().trim();
            const vipType = vipFilter.value;
            const statusVal = statusFilter.value;

            const filteredCustomers = customersData.filter(cust => {
                const matchesSearch = cust.name.toLowerCase().includes(query) || 
                                      cust.phone.includes(query) || 
                                      cust.email.toLowerCase().includes(query);
                const matchesVIP = vipType === 'all' || cust.tier === vipType;
                const matchesStatus = statusVal === 'all' || cust.status === statusVal;

                return matchesSearch && matchesVIP && matchesStatus;
            });

            if (customerPaginationText) {
                customerPaginationText.textContent = `កំពុងបង្ហាញ ${filteredCustomers.length} ក្នុងចំណោម ${customersData.length} អតិថិជន`;
            }

            if (filteredCustomers.length === 0) {
                customersEmptyState.classList.remove('d-none');
                customersListRows.innerHTML = '';
                return;
            }

            customersEmptyState.classList.add('d-none');
            customersListRows.innerHTML = '';

            filteredCustomers.forEach(cust => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60&h=60" class="avatar-sm rounded-circle" alt="${cust.name}">
                            <div>
                                <div class="fw-bold">${cust.name}</div>
                                <span class="text-xs text-muted font-monospace">${cust.id}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="text-sm fw-semibold">${cust.phone}</div>
                        <span class="text-xs text-muted">${cust.email}</span>
                    </td>
                    <td>
                        <span class="tier-badge tier-${cust.tier}">${this.getTierLabelKhmer(cust.tier)}</span>
                    </td>
                    <td class="fw-bold text-center">${cust.ordersCount} ដង</td>
                    <td class="fw-bold text-primary">$${cust.totalSpent.toFixed(2)}</td>
                    <td>
                        <span class="text-xs fw-semibold">
                            <span class="status-dot ${cust.status}"></span>
                            ${cust.status === 'active' ? 'សកម្ម' : 'អសកម្ម'}
                        </span>
                    </td>
                    <td class="text-muted text-xs">${cust.joinedDate}</td>
                    <td class="text-end">
                        <button class="btn btn-icon-sm view-profile-btn" data-id="${cust.id}" data-bs-toggle="tooltip" title="មើលព័ត៌មានលម្អិត">
                            <i class="bi bi-person-lines-fill"></i>
                        </button>
                    </td>
                `;
                // Mock custom avatars just for beauty UI
                const avatarImg = tr.querySelector('.avatar-sm');
                if (cust.id === 'CUST-02') avatarImg.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60';
                if (cust.id === 'CUST-03') avatarImg.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60';
                if (cust.id === 'CUST-04') avatarImg.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60';
                if (cust.id === 'CUST-05') avatarImg.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=60';

                customersListRows.appendChild(tr);
            });

            this.reinitBootstrapTooltips();
        },

        // Update overall summary statistics
        updateOverviewMetrics() {
            const total = customersData.length;
            const vipCount = customersData.filter(c => c.tier === 'vip').length;
            const activeCount = customersData.filter(c => c.status === 'active').length;
            
            const payingCustCount = customersData.filter(c => c.totalSpent > 0).length;
            const sumSpent = customersData.reduce((sum, c) => sum + c.totalSpent, 0);
            const avgSpent = payingCustCount > 0 ? (sumSpent / payingCustCount) : 0;

            document.getElementById('metric-total-customers').textContent = total;
            document.getElementById('metric-total-customers').setAttribute('data-target', total);

            document.getElementById('metric-vip-customers').textContent = vipCount;
            document.getElementById('metric-vip-customers').setAttribute('data-target', vipCount);

            document.getElementById('metric-active-customers').textContent = activeCount;
            document.getElementById('metric-active-customers').setAttribute('data-target', activeCount);

            document.getElementById('metric-avg-spent').textContent = Math.round(avgSpent).toLocaleString();
            document.getElementById('metric-avg-spent').setAttribute('data-target', Math.round(avgSpent));
        },

        // Show Customer Dossier Panel
        showCustomerDossier(customerId) {
            currentSelectedCustomer = customersData.find(c => c.id === customerId);
            if (!currentSelectedCustomer) return;

            // Header Elements
            detailCustName.textContent = currentSelectedCustomer.name;
            detailCustJoined.textContent = `សមាជិកតាំងពី: ${currentSelectedCustomer.joinedDate}`;
            detailCustPhone.textContent = currentSelectedCustomer.phone;
            detailCustEmail.textContent = currentSelectedCustomer.email;
            detailCustAddress.textContent = currentSelectedCustomer.address;
            
            detailCustOrdersCount.textContent = `${currentSelectedCustomer.ordersCount} ដង`;
            detailCustTotalSpent.textContent = `$${currentSelectedCustomer.totalSpent.toFixed(2)}`;
            custInternalNote.value = currentSelectedCustomer.notes || '';

            // VIP badge mapping
            detailCustBadge.textContent = currentSelectedCustomer.tier.toUpperCase();
            detailCustBadge.className = `customer-badge-label bg-${currentSelectedCustomer.tier === 'vip' ? 'warning' : 'primary'}`;

            // Large avatar customization
            detailCustAvatar.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150';
            if (currentSelectedCustomer.id === 'CUST-02') detailCustAvatar.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150';
            if (currentSelectedCustomer.id === 'CUST-03') detailCustAvatar.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150';
            if (currentSelectedCustomer.id === 'CUST-04') detailCustAvatar.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150';
            if (currentSelectedCustomer.id === 'CUST-05') detailCustAvatar.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150';

            // Generate history orders body
            customerHistoryRows.innerHTML = '';
            
            if (currentSelectedCustomer.history.length === 0) {
                customerHistoryRows.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center py-4 text-muted">មិនទាន់មានប្រវត្តិទិញទំនិញនៅឡើយទេ</td>
                    </tr>
                `;
            } else {
                currentSelectedCustomer.history.forEach(hist => {
                    const tr = document.createElement('tr');
                    
                    const statusLabels = {
                        pending: 'រង់ចាំ',
                        shipping: 'កំពុងដឹក',
                        completed: 'ជោគជ័យ'
                    };

                    tr.innerHTML = `
                        <td class="fw-bold text-primary font-monospace">${hist.orderId}</td>
                        <td>${hist.date}</td>
                        <td class="fw-bold">$${hist.amount.toFixed(2)}</td>
                        <td>
                            <span class="status-badge status-${hist.status}" style="font-size: 10px; padding: 2px 6px;">
                                ${statusLabels[hist.status] || hist.status}
                            </span>
                        </td>
                    `;
                    customerHistoryRows.appendChild(tr);
                });
            }

            // Present Modal Interface
            const dossierModal = new bootstrap.Modal(document.getElementById('customerDetailModal'));
            dossierModal.show();
        },

        // Event Listeners registration
        registerEvents() {
            const filterEvent = () => this.renderCustomers();
            searchFilter.addEventListener('input', filterEvent);
            vipFilter.addEventListener('change', filterEvent);
            statusFilter.addEventListener('change', filterEvent);

            if (quickSearchHeader) {
                quickSearchHeader.addEventListener('input', () => {
                    searchFilter.value = quickSearchHeader.value;
                    filterEvent();
                });
            }

            // Reset Filter fields
            btnResetFilters.addEventListener('click', () => {
                searchFilter.value = '';
                if (quickSearchHeader) quickSearchHeader.value = '';
                vipFilter.value = 'all';
                statusFilter.value = 'all';
                this.renderCustomers();
            });

            // Handle profiles view action trigger
            customersListRows.addEventListener('click', (e) => {
                const btn = e.target.closest('.view-profile-btn');
                if (btn) {
                    const id = btn.getAttribute('data-id');
                    this.showCustomerDossier(id);
                }
            });

            // Save Customer Note
            btnSaveCustomerNote.addEventListener('click', () => {
                if (!currentSelectedCustomer) return;

                currentSelectedCustomer.notes = custInternalNote.value;
                this.showSystemToast('កែប្រែកំណត់ចំណាំ', `បានរក្សាទុកកំណត់ចំណាំផ្ទៃក្នុងរបស់អតិថិជន ${currentSelectedCustomer.name}`);

                // Close Modal dynamic controls
                const dossierModalEl = document.getElementById('customerDetailModal');
                const modalInstance = bootstrap.Modal.getInstance(dossierModalEl);
                if (modalInstance) modalInstance.hide();
            });

            // Mock excel data export
            document.getElementById('btn-export-customers').addEventListener('click', () => {
                this.showSystemToast('ទាញយកឯកសារ', 'កំពុងបង្កើតបញ្ជីឈ្មោះអតិថិជនទាំងអស់ជាទម្រង់ Excel...');
            });
        },

        reinitBootstrapTooltips() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map((tooltipTriggerEl) => {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        },

        showSystemToast(title, message) {
            const toastEl = document.getElementById('actionToast');
            const toastMsg = toastEl.querySelector('#toast-message');
            if (toastEl && toastMsg) {
                toastMsg.innerHTML = `<strong>${title}:</strong> ${message}`;
                const instance = new bootstrap.Toast(toastEl, { delay: 4000 });
                instance.show();
            }
        }
    };

    CustomersController.init();
});