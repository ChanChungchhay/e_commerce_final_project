/**
 * START OF FILE seller_orders.js
 * Nexis Orders Management Controller Console (Minimal Static Version)
 */
document.addEventListener('DOMContentLoaded', () => {

    const btnPrintInvoice = document.getElementById('btn-print-invoice');
    const btnSaveOrderStatus = document.getElementById('btn-save-order-status');

    // ដំណើរការប៊ូតុងបោះពុម្ភវិក្កយបត្រ
    if (btnPrintInvoice) {
        btnPrintInvoice.addEventListener('click', () => {
            window.print();
        });
    }

    // ដំណើរការបង្ហាញការជូនដំណឹង (Toast) ពេលចុចរក្សាទុកស្ថានភាព
    if (btnSaveOrderStatus) {
        btnSaveOrderStatus.addEventListener('click', () => {
            const toastEl = document.getElementById('actionToast');
            const toastMsg = document.getElementById('toast-message');
            if (toastEl && toastMsg) {
                toastMsg.innerHTML = `<strong>ធ្វើបច្ចុប្បន្នភាព:</strong> ស្ថានភាពត្រូវបានរក្សាទុកជាបណ្តោះអាសន្ន!`;
                const instance = new bootstrap.Toast(toastEl, { delay: 4000 });
                instance.show();
            }
        });
    }
});