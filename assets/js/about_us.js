/* ==========================================================
   About Us — khmerbazaar
   Scroll reveal + animated stat counters
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  // convert western digits to Khmer numerals
  function toKhmerNum(n){
    const map = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
    return String(n).replace(/[0-9]/g, d => map[d]).replace(/,/g, ',');
  }
  function formatWithComma(n){
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // count-up stats once visible
  const counters = document.querySelectorAll('.stat .num[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2200;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = toKhmerNum(formatWithComma(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = toKhmerNum(formatWithComma(target)) + suffix;
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countIO.observe(el));
});