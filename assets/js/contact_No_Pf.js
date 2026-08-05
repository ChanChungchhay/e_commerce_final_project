/* ==========================================================
   Contact / Relation page — khmerbazaar
   Scroll reveal + contact form interaction
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  // scroll reveal (same pattern as about_us.js)
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // contact form submit
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'ផ្ញើសារបានជោគជ័យ!',
          text: 'សូមអរគុណ! ក្រុមការងារ khmerbazzar នឹងទាក់ទងអ្នកវិញឆាប់ៗនេះ។',
          confirmButtonText: 'យល់ព្រម',
          confirmButtonColor: '#4F7863'
        });
      } else {
        alert('ផ្ញើសារបានជោគជ័យ! សូមអរគុណ។');
      }

      form.reset();
    });
  }
});