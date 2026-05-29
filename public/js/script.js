// ─── Bootstrap form validation ───
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// ─── Navbar scroll shadow ───
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ─── Image upload preview ───
const imageInput = document.getElementById('image');
const dropZone = document.getElementById('dropZone');
const dropZoneText = document.getElementById('dropZoneText');

if (imageInput && dropZone) {
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      dropZoneText.textContent = `✓ ${file.name}`;
      dropZone.style.borderColor = 'var(--brand)';
      dropZone.style.background = 'var(--brand-light)';
    }
  });

  // Drag over style
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--brand)';
    dropZone.style.background = 'var(--brand-light)';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--cream-dark)';
    dropZone.style.background = 'var(--cream)';
  });

  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Transfer dropped file to the input
      const dt = new DataTransfer();
      dt.items.add(file);
      imageInput.files = dt.files;
      dropZoneText.textContent = `✓ ${file.name}`;
      dropZone.style.borderColor = 'var(--brand)';
      dropZone.style.background = 'var(--brand-light)';
    }
  });
}

// ─── Price filter on search page (client-side) ───
function applyPriceFilter() {
  const maxPrice = document.getElementById('maxPrice')?.value;
  if (!maxPrice) return;
  const cards = document.querySelectorAll('.listing-card-wrapper');
  cards.forEach(card => {
    const priceText = card.querySelector('.card-price-amount')?.textContent || '';
    const price = parseInt(priceText.replace(/[₹,+GST\s]/g, ''));
    card.style.display = (!isNaN(price) && price <= parseInt(maxPrice)) ? 'block' : 'none';
  });
}

// Wishlist button toggle persistence (session only)
document.querySelectorAll('.card-wish-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.toggle('wishlisted');
    if (btn.classList.contains('wishlisted')) {
      btn.innerHTML = "<i class='fa-solid fa-heart' style='color:var(--brand)'></i>";
    } else {
      btn.innerHTML = "<i class='fa-regular fa-heart'></i>";
    }
  });
});
