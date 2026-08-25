document.addEventListener('DOMContentLoaded', () => {
    const btnSaveOrderStatus = document.getElementById('btn-save-order-status');
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