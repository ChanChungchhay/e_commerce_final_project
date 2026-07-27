/**
 * START OF FILE seller_products.js
 * Nexis Products Management Logic Controller
 */

document.addEventListener('DOMContentLoaded', () => {

    // Initial Static Product Data Array (ជាភាសាខ្មែរ)
    let productInventory = [
        {
            id: 1,
            sku: 'SKU-9832',
            name: 'កាសស្តាប់ត្រចៀក UltraBass Wireless',
            category: 'គ្រឿងអេឡិចត្រូនិក',
            price: 129.00,
            stock: 45,
            threshold: 10,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 2,
            sku: 'SKU-9831',
            name: 'នាឡិកាឆ្លាតវៃ Active Fit Pro Watch',
            category: 'ឧបករណ៍ឆ្លាតវៃ',
            price: 199.00,
            stock: 3,
            threshold: 5,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 3,
            sku: 'SKU-9830',
            name: 'កាបូបលុយស្បែកស្តើង Slim Leather Wallet',
            category: 'គ្រឿងបន្លាស់',
            price: 49.00,
            stock: 0,
            threshold: 5,
            image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 4,
            sku: 'SKU-9829',
            name: 'ថូផ្កាពណ៌កញ្ចក់ Nordic Glass Vase',
            category: 'សម្ភារៈក្នុងផ្ទះ',
            price: 89.00,
            stock: 12,
            threshold: 3,
            image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=300'
        }
    ];

    let currentEditingId = null;
    let selectedIdForDeletion = null;
    let currentViewMode = 'list'; // list or grid

    // DOM Selectors
    const listContainerBody = document.getElementById('products-list-body');
    const tableContainer = document.getElementById('products-table-container');
    const emptyState = document.getElementById('empty-state');
    
    // Filter Elements
    const searchInput = document.getElementById('filter-search');
    const categorySelect = document.getElementById('filter-category');
    const stockStatusSelect = document.getElementById('filter-stock-status');
    const btnResetFilters = document.getElementById('btn-reset-filters');
    const paginationStatus = document.getElementById('pagination-status');
    const globalSearchHeader = document.getElementById('product-search-input');

    // Modal Form Elements
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('productManageModalLabel');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const imgFileInput = document.getElementById('product-img-file');
    const imgPreviewContainer = document.querySelector('.image-preview-container');
    const imgPreview = document.getElementById('product-img-preview');
    const btnRemoveImg = document.querySelector('.btn-remove-img');
    const base64ImgInput = document.getElementById('product-img-base64');
    const btnOpenAddModal = document.getElementById('btn-open-add-modal');

    // Products Management Controller
    const ProductsController = {
        init() {
            this.renderProducts();
            this.registerEvents();
            this.updateSummaryCounters();
        },

        // Helper Method for Stock Styling Status
        getStockStatusBadge(stock, threshold) {
            if (stock === 0) {
                return `<span class="status-badge status-cancelled">អស់ពីស្តុក</span>`;
            } else if (stock <= threshold) {
                return `<span class="status-badge status-pending">ស្ទើរអស់ពីស្តុក</span>`;
            } else {
                return `<span class="status-badge status-completed">មានក្នុងស្តុក</span>`;
            }
        },

        // Render products as Table or Grid List
        renderProducts() {
            const query = (searchInput.value || globalSearchHeader.value || '').toLowerCase().trim();
            const category = categorySelect.value;
            const stockStatus = stockStatusSelect.value;

            // Filter calculation logic
            const filteredData = productInventory.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query);
                const matchesCategory = category === 'all' || item.category === category;
                
                let matchesStock = true;
                if (stockStatus === 'outofstock') matchesStock = item.stock === 0;
                else if (stockStatus === 'lowstock') matchesStock = item.stock > 0 && item.stock <= item.threshold;
                else if (stockStatus === 'instock') matchesStock = item.stock > item.threshold;

                return matchesSearch && matchesCategory && matchesStock;
            });

            // Update pagination text
            if (paginationStatus) {
                paginationStatus.textContent = `កំពុងបង្ហាញផលិតផល ${filteredData.length} ក្នុងចំណោម ${productInventory.length}`;
            }

            // Handle empty states
            if (filteredData.length === 0) {
                emptyState.classList.remove('d-none');
                tableContainer.classList.add('d-none');
                return;
            }

            emptyState.classList.add('d-none');
            tableContainer.classList.remove('d-none');

            if (currentViewMode === 'list') {
                this.renderTable(filteredData);
            } else {
                this.renderGrid(filteredData);
            }
        },

        renderTable(items) {
            tableContainer.innerHTML = `
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>រូបភាព</th>
                            <th>ឈ្មោះផលិតផល / កូដ SKU</th>
                            <th>ប្រភេទ</th>
                            <th>តម្លៃរាយ</th>
                            <th>ចំនួនស្តុក</th>
                            <th>ស្ថានភាព</th>
                            <th class="text-end">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;
            const tbody = tableContainer.querySelector('tbody');
            
            items.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="product-mini-thumb">
                            <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}">
                        </div>
                    </td>
                    <td>
                        <div class="fw-semibold">${item.name}</div>
                        <span class="text-xs text-muted font-monospace">${item.sku}</span>
                    </td>
                    <td><span class="text-muted text-sm">${item.category}</span></td>
                    <td class="fw-bold">$${item.price.toFixed(2)}</td>
                    <td class="fw-semibold">${item.stock} គ្រឿង</td>
                    <td>${this.getStockStatusBadge(item.stock, item.threshold)}</td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-1">
                            <button class="btn btn-icon-sm edit-product-btn" data-id="${item.id}" data-bs-toggle="tooltip" title="កែសម្រួល"><i class="bi bi-pencil-square"></i></button>
                            <button class="btn btn-icon-sm text-danger delete-product-btn" data-id="${item.id}" data-bs-toggle="tooltip" title="លុបចោល"><i class="bi bi-trash-fill"></i></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            this.reinitBootstrapTooltips();
        },

        renderGrid(items) {
            tableContainer.innerHTML = `<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 p-4"></div>`;
            const gridContainer = tableContainer.querySelector('.row');

            items.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `
                    <div class="dashboard-card h-100 grid-view-item">
                        <div class="grid-product-img-wrap">
                            <img src="${item.image || 'https://via.placeholder.com/100'}" class="grid-product-img" alt="${item.name}">
                        </div>
                        <div class="card-body p-3">
                            <span class="text-xs text-muted d-block mb-1 font-monospace">${item.sku}</span>
                            <h6 class="fw-bold text-sm text-truncate mb-1">${item.name}</h6>
                            <span class="badge bg-light-theme-darker text-muted mb-3" style="font-size: 11px;">${item.category}</span>
                            
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="fw-extrabold text-primary h5 mb-0">$${item.price.toFixed(2)}</span>
                                <span class="text-xs text-muted">ស្តុក: <strong>${item.stock}</strong></span>
                            </div>
                            
                            <div class="pt-2 border-top d-flex align-items-center justify-content-between">
                                ${this.getStockStatusBadge(item.stock, item.threshold)}
                                <div class="d-flex gap-1">
                                    <button class="btn btn-icon-sm edit-product-btn-sm" data-id="${item.id}"><i class="bi bi-pencil"></i></button>
                                    <button class="btn btn-icon-sm text-danger delete-product-btn-sm" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                gridContainer.appendChild(col);
            });
        },

        updateSummaryCounters() {
            const total = productInventory.length;
            const active = productInventory.filter(p => p.stock > p.threshold).length;
            const low = productInventory.filter(p => p.stock > 0 && p.stock <= p.threshold).length;
            const outOfStock = productInventory.filter(p => p.stock === 0).length;

            document.getElementById('metric-total-products').textContent = total;
            document.getElementById('metric-total-products').setAttribute('data-target', total);

            document.getElementById('metric-active-products').textContent = active;
            document.getElementById('metric-active-products').setAttribute('data-target', active);

            document.getElementById('metric-low-stock').textContent = low;
            document.getElementById('metric-low-stock').setAttribute('data-target', low);

            document.getElementById('metric-out-of-stock').textContent = outOfStock;
            document.getElementById('metric-out-of-stock').setAttribute('data-target', outOfStock);
        },

        // Action Events Listeners Bindings
        registerEvents() {
            // View Toggles
            document.getElementById('view-list').addEventListener('click', (e) => {
                document.getElementById('view-list').classList.add('active');
                document.getElementById('view-grid').classList.remove('active');
                currentViewMode = 'list';
                this.renderProducts();
            });

            document.getElementById('view-grid').addEventListener('click', (e) => {
                document.getElementById('view-grid').classList.add('active');
                document.getElementById('view-list').classList.remove('active');
                currentViewMode = 'grid';
                this.renderProducts();
            });

            // Filtering Action Handler
            const filterTrigger = () => this.renderProducts();
            searchInput.addEventListener('input', filterTrigger);
            categorySelect.addEventListener('change', filterTrigger);
            stockStatusSelect.addEventListener('change', filterTrigger);
            if (globalSearchHeader) {
                globalSearchHeader.addEventListener('input', () => {
                    searchInput.value = globalSearchHeader.value;
                    filterTrigger();
                });
            }

            // Reset Filters Buttons Action
            btnResetFilters.addEventListener('click', () => {
                searchInput.value = '';
                if (globalSearchHeader) globalSearchHeader.value = '';
                categorySelect.value = 'all';
                stockStatusSelect.value = 'all';
                this.renderProducts();
            });

            // Image Upload Event Handlers
            imgFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        base64ImgInput.value = event.target.result;
                        imgPreview.src = event.target.result;
                        imgPreviewContainer.classList.remove('d-none');
                    };
                    reader.readAsDataURL(file);
                }
            });

            btnRemoveImg.addEventListener('click', () => {
                imgFileInput.value = '';
                base64ImgInput.value = '';
                imgPreview.src = '';
                imgPreviewContainer.classList.add('d-none');
            });

            // Add Product Modal trigger reset
            btnOpenAddModal.addEventListener('click', () => {
                currentEditingId = null;
                productForm.reset();
                productForm.classList.remove('was-validated');
                modalTitle.textContent = 'បន្ថែមព័ត៌មានផលិតផលថ្មី';
                base64ImgInput.value = '';
                imgPreview.src = '';
                imgPreviewContainer.classList.add('d-none');
            });

            // CRUD: Handle Form Save Product Trigger
            saveProductBtn.addEventListener('click', () => {
                if (!productForm.checkValidity()) {
                    productForm.classList.add('was-validated');
                    return;
                }

                const newProductData = {
                    name: document.getElementById('productName').value,
                    category: document.getElementById('productCategory').value,
                    sku: document.getElementById('productSKU').value.toUpperCase(),
                    price: parseFloat(document.getElementById('productPrice').value),
                    stock: parseInt(document.getElementById('productStock').value),
                    threshold: parseInt(document.getElementById('stockThreshold').value) || 5,
                    image: base64ImgInput.value || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300'
                };

                if (currentEditingId !== null) {
                    // Updating item
                    productInventory = productInventory.map(p => p.id === currentEditingId ? { ...p, ...newProductData } : p);
                    this.showSystemToast('កែប្រែទិន្នន័យ', `បានកែសម្រួលព័ត៌មានរបស់ "${newProductData.name}" រួចរាល់។`);
                } else {
                    // Creating item
                    const newItem = {
                        id: Date.now(),
                        ...newProductData
                    };
                    productInventory.push(newItem);
                    this.showSystemToast('បន្ថែមទំនិញថ្មី', `បានបន្ថែម "${newProductData.name}" ទៅកាន់បញ្ជីលក់។`);
                }

                // Close Modal Control Bootstrap
                const modalEl = document.getElementById('productManageModal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();

                this.renderProducts();
                this.updateSummaryCounters();
                productForm.reset();
            });

            // Edit & Delete row dynamically delegation standard mapping
            tableContainer.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-product-btn') || e.target.closest('.edit-product-btn-sm');
                const deleteBtn = e.target.closest('.delete-product-btn') || e.target.closest('.delete-product-btn-sm');

                if (editBtn) {
                    const id = parseInt(editBtn.getAttribute('data-id'));
                    this.setupEditForm(id);
                }

                if (deleteBtn) {
                    selectedIdForDeletion = parseInt(deleteBtn.getAttribute('data-id'));
                    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
                    deleteConfirmModal.show();
                }
            });

            // Confirm Safe Deletion
            document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
                if (selectedIdForDeletion !== null) {
                    const targetProduct = productInventory.find(p => p.id === selectedIdForDeletion);
                    productInventory = productInventory.filter(p => p.id !== selectedIdForDeletion);
                    
                    this.showSystemToast('លុបផលិតផល', `បានលុប "${targetProduct ? targetProduct.name : ''}" ចេញពីប្រព័ន្ធរួចរាល់។`);
                    selectedIdForDeletion = null;

                    const deleteModalEl = document.getElementById('deleteConfirmModal');
                    const modalInstance = bootstrap.Modal.getInstance(deleteModalEl);
                    if (modalInstance) modalInstance.hide();

                    this.renderProducts();
                    this.updateSummaryCounters();
                }
            });
        },

        // Setup Forms inputs for Editing Modes
        setupEditForm(id) {
            const product = productInventory.find(p => p.id === id);
            if (!product) return;

            currentEditingId = id;
            modalTitle.textContent = 'កែសម្រួលព័ត៌មានផលិតផល';

            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productSKU').value = product.sku;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('stockThreshold').value = product.threshold;
            
            if (product.image) {
                base64ImgInput.value = product.image;
                imgPreview.src = product.image;
                imgPreviewContainer.classList.remove('d-none');
            } else {
                base64ImgInput.value = '';
                imgPreview.src = '';
                imgPreviewContainer.classList.add('d-none');
            }

            // Fire Open Edit Modal dynamically
            const modalEl = document.getElementById('productManageModal');
            const editModal = new bootstrap.Modal(modalEl);
            editModal.show();
        },

        // Helper Bootstrap reinitialization
        reinitBootstrapTooltips() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map((tooltipTriggerEl) => {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        },

        // Helper Toast feedback notification emitter
        showSystemToast(title, message) {
            const toastEl = document.getElementById('actionToast');
            const toastMsg = document.getElementById('toast-message');
            
            if (toastEl && toastMsg) {
                toastMsg.innerHTML = `<strong>${title}:</strong> ${message}`;
                const toastInstance = new bootstrap.Toast(toastEl, { delay: 4000 });
                toastInstance.show();
            }
        }
    };

    // Initialize Page Execution
    ProductsController.init();
});