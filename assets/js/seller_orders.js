/**
 * START OF FILE seller_orders.js
 * Nexis Orders Management Controller Console
 */

document.addEventListener('DOMContentLoaded', () => {

    // Initial Static Order Datastore
    let ordersData = [
        {
            id: 'ORD-9832',
            customer: {
                name: 'សុខ ជា',
                phone: '092 112 233',
                address: 'ផ្ទះលេខ ១២ ផ្លូវ ៣១០ សង្កាត់បឹងកេងកង ភ្នំពេញ'
            },
            items: [
                { name: 'កាសស្តាប់ត្រចៀក UltraBass Wireless', qty: 1, unitPrice: 129.00 }
            ],
            subtotal: 129.00,
            shippingFee: 2.00,
            grandTotal: 131.00,
            paymentMethod: 'ABA',
            status: 'shipping',
            date: '12-Oct-2026',
            note: 'សូមទាក់ទងមកមុនពេលដឹកជញ្ជូន ២០នាទី'
        },
        {
            id: 'ORD-9831',
            customer: {
                name: 'កែវ សុភ័ក្ត្រ',
                phone: '010 556 778',
                address: 'បុរីវិមានភ្នំពេញ ផ្លូវជាតិលេខ៥ សង្កាត់ច្រាំងចំរេះ ភ្នំពេញ'
            },
            items: [
                { name: 'នាឡិកាឆ្លាតវៃ Active Fit Pro Watch', qty: 2, unitPrice: 199.00 }
            ],
            subtotal: 398.00,
            shippingFee: 3.50,
            grandTotal: 401.50,
            paymentMethod: 'Visa',
            status: 'completed',
            date: '11-Oct-2026',
            note: 'ទូទាត់រួចរាល់តាមកាតកម្រងប្រាក់'
        },
        {
            id: 'ORD-9830',
            customer: {
                name: 'គឹម ឡុង',
                phone: '097 789 123',
                address: 'ភូមិ១ សង្កាត់៣ ក្រុងព្រះសីហនុ ខេត្តព្រះសីហនុ'
            },
            items: [
                { name: 'កាបូបលុយស្បែកស្តើង Slim Leather Wallet', qty: 1, unitPrice: 49.00 }
            ],
            subtotal: 49.00,
            shippingFee: 4.00,
            grandTotal: 53.00,
            paymentMethod: 'COD',
            status: 'pending',
            date: '10-Oct-2026',
            note: 'បង់ប្រាក់ផ្ទាល់ពេលទំនិញទៅដល់ទីកន្លែង'
        }
    ];

    let currentSelectedOrder = null;

    // DOM Selectors
    const ordersListRows = document.getElementById('orders-list-rows');
    const ordersEmptyState = document.getElementById('orders-empty-state');
    const orderPaginationText = document.getElementById('order-pagination-text');
    
    // Filter fields
    const searchFilter = document.getElementById('filter-order-search');
    const shippingFilter = document.getElementById('filter-shipping-status');
    const paymentFilter = document.getElementById('filter-payment-method');
    const btnResetFilters = document.getElementById('btn-reset-order-filters');
    const quickSearchHeader = document.getElementById('order-quick-search');

    // Modal elements
    const updateStatusDropdown = document.getElementById('update-status-dropdown');
    const internalNoteTextarea = document.getElementById('order-internal-note');
    const btnSaveOrderStatus = document.getElementById('btn-save-order-status');
    const btnPrintInvoice = document.getElementById('btn-print-invoice');
    const btnExportOrders = document.getElementById('btn-export-orders');
    
    // Stepper elements
    const steps = {
        pending: document.getElementById('step-pending'),
        processing: document.getElementById('step-processing'),
        shipping: document.getElementById('step-shipping'),
        completed: document.getElementById('step-completed')
    };

    const OrdersController = {
        init() {
            this.renderOrders();
            this.registerEvents();
            this.updateOverviewCounters();
        },

        // Helper Status Map labels in Khmer
        getStatusLabelKhmer(status) {
            const labels = {
                pending: 'រង់ចាំការបញ្ជាក់',
                processing: 'កំពុងរៀបចំ',
                shipping: 'កំពុងដឹកជញ្ជូន',
                completed: 'បានបញ្ចប់',
                cancelled: 'បានបោះបង់'
            };
            return labels[status] || status;
        },

        // Render standard Order list rows
        renderOrders() {
            const searchQuery = (searchFilter.value || (quickSearchHeader ? quickSearchHeader.value : '') || '').toLowerCase().trim();
            const shipStatus = shippingFilter.value;
            const payMethod = paymentFilter.value;

            const filteredOrders = ordersData.filter(order => {
                const matchesSearch = order.id.toLowerCase().includes(searchQuery) || 
                                      order.customer.name.toLowerCase().includes(searchQuery);
                const matchesShipping = shipStatus === 'all' || order.status === shipStatus;
                const matchesPayment = payMethod === 'all' || order.paymentMethod === payMethod;

                return matchesSearch && matchesShipping && matchesPayment;
            });

            if (orderPaginationText) {
                orderPaginationText.textContent = `កំពុងបង្ហាញ ${filteredOrders.length} ក្នុងចំណោម ${ordersData.length} ការបញ្ជាទិញ`;
            }

            if (filteredOrders.length === 0) {
                ordersEmptyState.classList.remove('d-none');
                ordersListRows.innerHTML = '';
                return;
            }

            ordersEmptyState.classList.add('d-none');
            ordersListRows.innerHTML = '';

            filteredOrders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="fw-bold text-primary font-monospace">${order.id}</td>
                    <td>
                        <div class="fw-semibold">${order.customer.name}</div>
                        <span class="text-xs text-muted">${order.customer.phone}</span>
                    </td>
                    <td class="text-xs text-truncate" style="max-width: 200px;">
                        ${order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                    </td>
                    <td class="fw-bold text-dark">$${order.grandTotal.toFixed(2)}</td>
                    <td>
                        <span class="text-xs fw-semibold"><i class="bi bi-wallet2"></i> ${order.paymentMethod}</span>
                    </td>
                    <td>
                        <span class="status-badge status-${order.status}">
                            ${this.getStatusLabelKhmer(order.status)}
                        </span>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-icon-sm view-details-btn" data-id="${order.id}" data-bs-toggle="tooltip" title="មើលលម្អិត & វិក្កយបត្រ">
                            <i class="bi bi-eye-fill"></i>
                        </button>
                    </td>
                `;
                ordersListRows.appendChild(tr);
            });

            this.reinitBootstrapTooltips();
        },

        // Update statistical numbers above tables
        updateOverviewCounters() {
            const total = ordersData.length;
            const pending = ordersData.filter(o => o.status === 'pending').length;
            const shipping = ordersData.filter(o => o.status === 'shipping').length;
            const completedRevenue = ordersData
                .filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + o.grandTotal, 0);

            const totalEl = document.getElementById('metric-total-orders');
            const pendingEl = document.getElementById('metric-pending-orders');
            const sidebarPendingCount = document.getElementById('sidebar-pending-count');
            const shippingEl = document.getElementById('metric-shipping-orders');
            const revenueEl = document.getElementById('metric-total-revenue');

            if (totalEl) totalEl.textContent = total;
            if (pendingEl) pendingEl.textContent = pending;
            if (sidebarPendingCount) sidebarPendingCount.textContent = pending;
            if (shippingEl) shippingEl.textContent = shipping;
            if (revenueEl) revenueEl.textContent = completedRevenue.toLocaleString();
        },

        // Handle Status Progress Stepper Styling Updates
        updateStepperVisualization(status) {
            // Reset active styles
            Object.values(steps).forEach(step => {
                if (step) step.classList.remove('active');
            });

            if (status === 'cancelled') return;

            const progressPath = {
                pending: ['pending'],
                processing: ['pending', 'processing'],
                shipping: ['pending', 'processing', 'shipping'],
                completed: ['pending', 'processing', 'shipping', 'completed']
            };

            const activePath = progressPath[status] || [];
            activePath.forEach(stepKey => {
                if (steps[stepKey]) steps[stepKey].classList.add('active');
            });
        },

        // Populate detail modal data
        showOrderDetailModal(orderId) {
            currentSelectedOrder = ordersData.find(o => o.id === orderId);
            if (!currentSelectedOrder) return;

            // Invoice elements
            document.getElementById('invoice-id').textContent = `#${currentSelectedOrder.id}`;
            document.getElementById('invoice-date').textContent = `កាលបរិច្ឆេទ: ${currentSelectedOrder.date}`;
            document.getElementById('invoice-customer-name').textContent = currentSelectedOrder.customer.name;
            document.getElementById('invoice-customer-phone').textContent = currentSelectedOrder.customer.phone;
            document.getElementById('invoice-customer-address').textContent = currentSelectedOrder.customer.address;
            internalNoteTextarea.value = currentSelectedOrder.note || '';

            // Status Control Elements
            updateStatusDropdown.value = currentSelectedOrder.status;
            
            // Set Marker representation
            const statusMarker = document.getElementById('modal-current-status-marker');
            statusMarker.className = `status-marker ${currentSelectedOrder.status}`;
            document.getElementById('modal-current-status-text').textContent = this.getStatusLabelKhmer(currentSelectedOrder.status);

            // Dynamically render Invoice item rows (Table Layout)
            const itemsBody = document.getElementById('invoice-items-body');
            itemsBody.innerHTML = '';
            
            currentSelectedOrder.items.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="ps-2 fw-semibold text-dark">${item.name}</td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-end">$${item.unitPrice.toFixed(2)}</td>
                    <td class="text-end pe-2 fw-semibold text-dark">$${(item.unitPrice * item.qty).toFixed(2)}</td>
                `;
                itemsBody.appendChild(tr);
            });

            document.getElementById('invoice-subtotal').textContent = `$${currentSelectedOrder.subtotal.toFixed(2)}`;
            document.getElementById('invoice-shipping-fee').textContent = `$${currentSelectedOrder.shippingFee.toFixed(2)}`;
            document.getElementById('invoice-grandtotal').textContent = `$${currentSelectedOrder.grandTotal.toFixed(2)}`;

            this.updateStepperVisualization(currentSelectedOrder.status);

            // Present Modal Interface
            const detailModal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
            detailModal.show();
        },

        // Click actions dispatcher
        registerEvents() {
            const filterEvent = () => this.renderOrders();
            searchFilter.addEventListener('input', filterEvent);
            shippingFilter.addEventListener('change', filterEvent);
            paymentFilter.addEventListener('change', filterEvent);
            
            if (quickSearchHeader) {
                quickSearchHeader.addEventListener('input', () => {
                    searchFilter.value = quickSearchHeader.value;
                    filterEvent();
                });
            }

            // Reset filters logic
            btnResetFilters.addEventListener('click', () => {
                searchFilter.value = '';
                if (quickSearchHeader) quickSearchHeader.value = '';
                shippingFilter.value = 'all';
                paymentFilter.value = 'all';
                this.renderOrders();
            });

            // Action details buttons triggers delegation binding
            ordersListRows.addEventListener('click', (e) => {
                const btn = e.target.closest('.view-details-btn');
                if (btn) {
                    const id = btn.getAttribute('data-id');
                    this.showOrderDetailModal(id);
                }
            });

            // Save order status updates
            btnSaveOrderStatus.addEventListener('click', () => {
                if (!currentSelectedOrder) return;

                const nextStatus = updateStatusDropdown.value;
                currentSelectedOrder.status = nextStatus;
                currentSelectedOrder.note = internalNoteTextarea.value;

                this.showSystemToast('ធ្វើបច្ចុប្បន្នភាព', `ការបញ្ជាទិញ ${currentSelectedOrder.id} ផ្លាស់ប្តូរទៅជា "${this.getStatusLabelKhmer(nextStatus)}"`);
                
                // Close modal dynamic
                const modalEl = document.getElementById('orderDetailModal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();

                this.renderOrders();
                this.updateOverviewCounters();
            });

            // Print system invoice function integration
            btnPrintInvoice.addEventListener('click', () => {
                window.print();
            });

            // Dummy spreadsheet generator message
            if (btnExportOrders) {
                btnExportOrders.addEventListener('click', () => {
                    this.showSystemToast('ទាញយកឯកសារ', 'កំពុងបង្កើតរបាយការណ៍សង្ខេបនៃការលក់ (Excel)...');
                });
            }
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

    OrdersController.init();
});
// END OF FILE seller_orders.js