// ================= helpers =================
function parsePrice(text) {
    return parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
}

function getRows() {
    return document.querySelectorAll('.tboby tr');
}

// recalculate each row total + summary totals
function updateTotals() {
    let subtotal = 0;
    getRows().forEach(function (row) {
        const tds = row.querySelectorAll('.td');
        const price = parsePrice(tds[2].textContent);
        const qtyInput = row.querySelector('input');
        let qty = parseInt(qtyInput.value) || 0;
        const rowTotal = price * qty;
        tds[4].textContent = '$' + rowTotal.toFixed(2);
        subtotal += rowTotal;
    });

    const locationInput = document.querySelector('input[name="deliveryLocation"]:checked');
    const isProvince = locationInput && locationInput.value === 'province';
    const deliveryFee = subtotal >= 50 ? 0 : (isProvince ? 2 : 1);
    const grandTotal = subtotal + deliveryFee;

    document.getElementById('sub-total').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('delivery-fee').textContent = deliveryFee === 0 ? 'Free' : '$' + deliveryFee.toFixed(2);
    document.getElementById('grand-total').textContent = '$' + grandTotal.toFixed(2);

    return { subtotal: subtotal, deliveryFee: deliveryFee, grandTotal: grandTotal, isProvince: isProvince };
}

// recompute delivery fee when the location choice changes
document.querySelectorAll('input[name="deliveryLocation"]').forEach(function (radio) {
    radio.addEventListener('change', updateTotals);
});

// ================= quantity + / - =================
document.querySelectorAll('.tboby .qty').forEach(function (box) {
    const input = box.querySelector('input');
    const btnMinus = box.querySelector('[data-qty-decrement]');
    const btnPlus = box.querySelector('[data-qty-increment]');

    btnPlus.addEventListener('click', function () {
        input.value = (parseInt(input.value) || 0) + 1;
        updateTotals();
    });
    btnMinus.addEventListener('click', function () {
        const v = (parseInt(input.value) || 0) - 1;
        input.value = v < 0 ? 0 : v;
        updateTotals();
    });
    input.addEventListener('input', updateTotals);
});

// ================= delete product with alert =================
document.querySelectorAll('.btn-delete').forEach(function (icon) {
    icon.addEventListener('click', function () {
        const row = icon.closest('tr');
        const name = row.querySelector('.product-name-cell').textContent.trim();
        Swal.fire({
            title: 'តើអ្នកប្រាកដទេ?',
            html: 'អ្នកចង់លុបទំនិញ <b>' + name + '</b> ចេញពីកន្ត្រកមែនទេ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'បាទ/ចាស លុប!',
            cancelButtonText: 'បោះបង់'
        }).then(function (result) {
            if (result.isConfirmed) {
                row.remove();
                updateTotals();
                Swal.fire({
                    title: 'បានលុប!',
                    text: 'ទំនិញត្រូវបានលុបចេញពីកន្ត្រករបស់អ្នក។',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
});

// ================= វិកាយប័ណ្ណ : open customer info + payment form =================
let lastOrderInfo = null; // keeps the last submitted customer/payment info for the invoice

const customerFormModalEl = document.getElementById('customerFormModal');
function getCustomerFormModal() {
    return bootstrap.Modal.getOrCreateInstance(customerFormModalEl);
}

// Function ហៅប្រើប្រាស់ Bank QR Modal រួម
function getBankQrModal() {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById('bankQrModal'));
}

document.getElementById('btn-invoice').addEventListener('click', function () {
    const rows = getRows();
    const hasQty = Array.from(rows).some(r => (parseInt(r.querySelector('input').value) || 0) > 0);
    if (rows.length === 0 || !hasQty) {
        Swal.fire('កន្ត្រកទទេ!', 'មិនមានទំនិញនៅក្នុងកន្ត្រកទេ។', 'info');
        return;
    }
    // reset the form each time it is opened
    document.getElementById('customerInfoForm').reset();
    document.querySelectorAll('.cust-input').forEach(el => el.classList.remove('is-invalid'));
    document.getElementById('pay-method-error').style.display = 'none';
    
    // លាក់ section របស់ Visa ទុកជាមុន (ព្រោះយើងលុប qr-payment-section ក្នុង form ចេញហើយ)
    document.getElementById('visa-card-section').style.display = 'none';
    stopBankModalTimer();
    getCustomerFormModal().show();
});

// ================= Bank Modal QR Timer Logic (សម្រាប់គ្រប់ធនាគារ) =================
const QR_DURATION_SECONDS = 2 * 60; // ៥ នាទី
let bankModalTimerInterval = null;
let bankModalQrExpired = false;

function formatQrTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
}

function startBankModalTimer() {
    clearInterval(bankModalTimerInterval);
    bankModalQrExpired = false;
    let remaining = QR_DURATION_SECONDS;
    document.getElementById('modal-bank-qr-img').style.opacity = '1';
    document.getElementById('modal-bank-countdown-box').style.display = 'block';
    document.getElementById('modal-bank-expired-box').style.display = 'none';
    document.getElementById('modal-bank-countdown').textContent = formatQrTime(remaining);

    bankModalTimerInterval = setInterval(function () {
        remaining--;
        if (remaining <= 0) {
            clearInterval(bankModalTimerInterval);
            bankModalQrExpired = true;
            document.getElementById('modal-bank-countdown-box').style.display = 'none';
            document.getElementById('modal-bank-expired-box').style.display = 'block';
            document.getElementById('modal-bank-qr-img').style.opacity = '0.3';
        } else {
            document.getElementById('modal-bank-countdown').textContent = formatQrTime(remaining);
        }
    }, 1000);
}

function stopBankModalTimer() {
    clearInterval(bankModalTimerInterval);
    bankModalQrExpired = false;
}

// ចុចបង្កើត QR ម្តងទៀតនៅក្នុង Modal
document.getElementById('btn-modal-bank-refresh').addEventListener('click', function () {
    startBankModalTimer();
});

// ពេលបិទ Modal ត្រូវបញ្ឈប់ Timer
document.getElementById('bankQrModal').addEventListener('hidden.bs.modal', function () {
    stopBankModalTimer();
});

// ពេលចុចប៊ូតុង "ខ្ញុំបានទូទាត់ប្រាក់រួចរាល់" នៅក្នុង Modal Bank
document.getElementById('btn-bank-paid').addEventListener('click', function () {
    if (bankModalQrExpired) {
        Swal.fire('QR ផុតកំណត់!', 'សូមចុច "បង្កើត QR ឡើងវិញ" មុននឹងបន្តការទូទាត់។', 'warning');
        return;
    }
    // បិទ Modal QR រួចទៅកេះ (Trigger) ប៊ូតុង "បញ្ជាក់ការទូទាត់" ធំនៅក្នុង Form
    getBankQrModal().hide();
    document.getElementById('btn-submit-payment').click();
});


// ================= toggle QR / Visa card sections by chosen payment method =================
const visaSection = document.getElementById('visa-card-section');
const QR_METHODS = ['ABA Pay', 'ACLEDA XPay', 'Wing Bank']; // គ្រប់ប្រភេទធនាគារ

// បង្កើតរូបភាព និងពណ៌ទៅតាមធនាគារនីមួយៗ
const BANK_CONFIGS = {
    'ABA Pay': { title: 'ABA PAY', color: '#0f9bb0', img: '../assets/img/payment/QR.jpg' }, // អាចដូរផ្លូវរូបភាព QR ABA ទីនេះ
    'ACLEDA XPay': { title: 'ACLEDA XPAY', color: '#1a3a6c', img: '../assets/img/payment/QR.jpg' }, // អាចដូរផ្លូវរូបភាព QR ACLEDA ទីនេះ
    'Wing Bank': { title: 'WING BANK', color: '#7cb342', img: '../assets/img/payment/QR.jpg' } // អាចដូរផ្លូវរូបភាព QR Wing ទីនេះ
};

document.querySelectorAll('input[name="payMethod"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        visaSection.style.display = 'none';
        stopBankModalTimer();

        if (QR_METHODS.includes(radio.value)) {
            // ទាញយក Config តាមធនាគារដែលបានរើស
            const config = BANK_CONFIGS[radio.value] || { title: radio.value, color: '#0f9bb0', img: '../assets/image/QR.jpg' };
            
            // កែប្រែព័ត៌មាននៅក្នុង Modal ទៅតាមធនាគារនោះ
            const titleEl = document.getElementById('modal-bank-title');
            titleEl.querySelector('span').textContent = config.title;
            titleEl.style.color = config.color;
            document.getElementById('modal-bank-qr-img').src = config.img;
            document.getElementById('modal-bank-scan-label').textContent = 'ស្កេន QR ' + radio.value + ' ដើម្បីទូទាត់ប្រាក់';
            document.getElementById('modal-bank-amount').textContent = document.getElementById('grand-total').textContent;
            
            // បើក Modal QR មកបង្ហាញ
            getBankQrModal().show();
            startBankModalTimer();
        } else if (radio.value === 'Visa Card') {
            visaSection.style.display = 'block';
        }
    });
});

// format visa card number in groups of 4
document.getElementById('visa-number').addEventListener('input', function (e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
});

// auto-insert slash in MM/YY
document.getElementById('visa-expiry').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
});

// cvv digits only
document.getElementById('visa-cvv').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// ================= validate + submit customer form =================
document.getElementById('btn-submit-payment').addEventListener('click', function () {
    const name = document.getElementById('cust-name');
    const phone = document.getElementById('cust-phone');
    const address = document.getElementById('cust-address');
    const payInput = document.querySelector('input[name="payMethod"]:checked');
    const payError = document.getElementById('pay-method-error');

    let valid = true;

    [name, phone, address].forEach(function (field) {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    if (phone.value.trim() && !/^[0-9+\s]{8,15}$/.test(phone.value.trim())) {
        phone.classList.add('is-invalid');
        valid = false;
    }

    if (!payInput) {
        payError.style.display = 'block';
        valid = false;
    } else {
        payError.style.display = 'none';
    }

    // extra validation for Visa Card
    let visaLast4 = '';
    if (payInput && payInput.value === 'Visa Card') {
        const vName = document.getElementById('visa-name');
        const vNumber = document.getElementById('visa-number');
        const vExpiry = document.getElementById('visa-expiry');
        const vCvv = document.getElementById('visa-cvv');
        const digits = vNumber.value.replace(/\s/g, '');

        if (!vName.value.trim()) { vName.classList.add('is-invalid'); valid = false; }
        else vName.classList.remove('is-invalid');

        if (!/^\d{16}$/.test(digits)) { vNumber.classList.add('is-invalid'); valid = false; }
        else { vNumber.classList.remove('is-invalid'); visaLast4 = digits.slice(-4); }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vExpiry.value.trim())) { vExpiry.classList.add('is-invalid'); valid = false; }
        else vExpiry.classList.remove('is-invalid');

        if (!/^\d{3,4}$/.test(vCvv.value.trim())) { vCvv.classList.add('is-invalid'); valid = false; }
        else vCvv.classList.remove('is-invalid');
    }

    if (!valid) return;

    // ឆែកមើលបើជ្រើសរើសធនាគារ ហើយ QR ផុតកំណត់
    if (payInput && QR_METHODS.includes(payInput.value) && bankModalQrExpired) {
        Swal.fire('QR ផុតកំណត់!', 'សូមបង្កើត QR ថ្មីឡើងវិញនៅលើផ្ទាំងទូទាត់មុននឹងបន្ត។', 'warning');
        return;
    }

    const totals = updateTotals();

    lastOrderInfo = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        address: address.value.trim(),
        payMethod: payInput.value === 'Visa Card'
            ? 'Visa Card •••• ' + visaLast4
            : payInput.value,
        location: totals.isProvince ? 'តាមខេត្ត' : 'ភ្នំពេញ',
        deliveryFee: totals.deliveryFee
    };

    getCustomerFormModal().hide();

    // ================= confirm payment =================
    Swal.fire({
        title: 'បញ្ជាក់ការទូទាត់',
        html: 'អ្នកនឹងទូទាត់ប្រាក់តាមរយៈ <b>' + lastOrderInfo.payMethod + '</b><br>សូមប្រាកដថាព័ត៌មានរបស់អ្នកត្រឹមត្រូវ។',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0F172A',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'បាទ/ចាស ទូទាត់ប្រាក់',
        cancelButtonText: 'ត្រឡប់ក្រោយ'
    }).then(function (result) {
        if (result.isConfirmed) {
            // ================= payment success =================
            Swal.fire({
                title: 'ការទូទាត់ជោគជ័យ!',
                html: 'សូមអរគុណ <b>' + lastOrderInfo.name + '</b>! ការបញ្ជាទិញរបស់អ្នកបានទទួលការទូទាត់ដោយជោគជ័យ។',
                icon: 'success',
                showDenyButton: true,
                confirmButtonText: '<i class="fa-solid fa-receipt me-1"></i> មើលការទូទាត់',
                denyButtonText: '<i class="fa-solid fa-right-from-bracket me-1"></i> ចាកចេញ',
                confirmButtonColor: '#0F172A',
                denyButtonColor: '#64748B'
            }).then(function (choice) {
                if (choice.isConfirmed) {
                    showInvoice();
                }
            });
        } else {
            // បើចុច Cancel លើផ្ទាំង SweetAlert ធំ ត្រូវបើកផ្ទាំង Modal QR របស់ធនាគារឡើងវិញ (បើជារបស់ធនាគារ)
            if (QR_METHODS.includes(payInput.value)) {
                getBankQrModal().show();
            } else {
                getCustomerFormModal().show();
            }
        }
    });
});

function showInvoice() {
    const tbody = document.getElementById('invoice-items');
    tbody.innerHTML = '';
    let subtotal = 0;
    getRows().forEach(function (row) {
        const tds = row.querySelectorAll('.td');
        const img = row.querySelector('img') ? row.querySelector('img').src : 'https://i.pinimg.com/736x/20/25/40/2025402606958221c3332ecff3e70008.jpg';
        const name = row.querySelector('.product-name-cell').textContent.trim();
        const details = row.querySelectorAll('.fw-normal');
        const size = details[0] ? details[0].textContent.trim() : '';
        const color = details[1] ? details[1].textContent.trim() : '';
        const price = parsePrice(tds[2].textContent);
        const qty = parseInt(row.querySelector('input').value) || 0;
        if (qty === 0) return;
        const total = price * qty;
        subtotal += total;
        tbody.innerHTML +=
            '<tr>' +
            '<td><div class="d-flex gap-2 align-items-center">' +
            '<img src="' + img + '" style="width:45px;height:52px;object-fit:cover;border-radius:6px;">' +
            '<div><div class="fw-bold" style="font-size:13px;">' + name + '</div>' +
            '<div class="text-muted" style="font-size:12px;">' + size + ' | ' + color + '</div></div>' +
            '</div></td>' +
            '<td class="text-center">$' + price.toFixed(2) + '</td>' +
            '<td class="text-center">' + qty + '</td>' +
            '<td class="text-end fw-bold">$' + total.toFixed(2) + '</td>' +
            '</tr>';
    });

    if (subtotal === 0) {
        Swal.fire('មិនអាចចេញវិកាយប័ណ្ណ!', 'សូមបញ្ចូលចំនួនទំនិញយ៉ាងតិច ១ ។', 'info');
        return;
    }

    const deliveryFee = (lastOrderInfo && typeof lastOrderInfo.deliveryFee === 'number')
        ? lastOrderInfo.deliveryFee
        : (subtotal >= 50 ? 0 : 1);
    const grandTotal = subtotal + deliveryFee;

    document.getElementById('invoice-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('invoice-delivery').textContent = deliveryFee === 0 ? 'Free' : '$' + deliveryFee.toFixed(2);
    document.getElementById('invoice-total').textContent = '$' + grandTotal.toFixed(2);

    const now = new Date();
    document.getElementById('invoice-meta').textContent =
        'No: INV-' + now.getTime().toString().slice(-6) + ' | ' + now.toLocaleString();

    const custBox = document.getElementById('invoice-customer');
    if (lastOrderInfo && custBox) {
        custBox.style.display = 'flex';
        document.getElementById('invoice-cust-name').textContent = lastOrderInfo.name;
        document.getElementById('invoice-cust-phone').textContent = lastOrderInfo.phone;
        document.getElementById('invoice-cust-address').textContent = lastOrderInfo.address;
        document.getElementById('invoice-cust-location').textContent =
            'ទីតាំង: ' + lastOrderInfo.location + ' • សេវាដឹកជញ្ជូន ' +
            (deliveryFee === 0 ? 'Free' : '$' + deliveryFee.toFixed(2));
        document.getElementById('invoice-cust-pay').textContent = lastOrderInfo.payMethod;
    } else if (custBox) {
        custBox.style.display = 'none';
    }

    new bootstrap.Modal(document.getElementById('invoiceModal')).show();
}

// initial totals on page load
updateTotals();