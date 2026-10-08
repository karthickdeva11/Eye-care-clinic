/* ==========================================================================
   STACKLY - APPOINTMENT SCHEDULER & BOOKING SYSTEM
   Interactive Multi-Step Appointment Request & Real-time Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
});

function initBookingForm() {
  const bookingForm = document.getElementById('appointmentForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookName')?.value.trim();
    const phone = document.getElementById('bookPhone')?.value.trim();
    const service = document.getElementById('bookService')?.value;
    const doctor = document.getElementById('bookDoctor')?.value;
    const date = document.getElementById('bookDate')?.value;
    const time = document.getElementById('bookTime')?.value;

    if (!name || !phone || !service || !date) {
      if (typeof showToast === 'function') {
        showToast('Please fill out all required fields marked with (*)', 'error');
      } else {
        alert('Please complete all required fields.');
      }
      return;
    }

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Confirm Booking';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Booking...`;
    }

    // Simulate API request delay
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      // Close modal
      const modal = bookingForm.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }

      // Show success toast notification
      if (typeof showToast === 'function') {
        showToast(`Thank you ${name}! Your ${service} appointment on ${date} at ${time || '10:00 AM'} is confirmed. Check SMS/Email.`, 'success');
      }

      // Reset form
      bookingForm.reset();
    }, 1200);
  });
}
