// admin.js – Handles admin login and product CRUD (create only for now)

(() => {
  const ADMIN_PASSWORD = '12345';
  const STORAGE_KEY = 'femme_products';

  // Load products from storage if available
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const arr = JSON.parse(stored);
      // Merge with existing global PRODUCTS (if any)
      window.PRODUCTS = arr;
    } catch (e) {
      console.error('Failed to parse stored products', e);
    }
  }

  // UI elements
  const btn = document.getElementById('admin-access-link');
  const scrim = document.getElementById('admin-scrim');
  const modal = document.getElementById('admin-modal');
  const loginDiv = document.getElementById('admin-login');
  const panelDiv = document.getElementById('admin-panel');
  const passInput = document.getElementById('admin-pass');
  const loginBtn = document.getElementById('admin-login-btn');
  const logoutBtn = document.getElementById('admin-logout');
  const form = document.getElementById('product-form');

  // Helper to open/close modal
  const openModal = () => {
    scrim.classList.remove('hidden');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    scrim.classList.add('hidden');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    // reset to login view
    loginDiv.classList.remove('hidden');
    panelDiv.classList.add('hidden');
    passInput.value = '';
    form.reset();
  };

  // Open admin UI from link
  btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  scrim.addEventListener('click', closeModal);

  // Close button X in modal
  const closeBtn = document.getElementById('admin-close-btn');
  if (closeBtn) { closeBtn.addEventListener('click', closeModal); }

  // Login flow
  loginBtn.addEventListener('click', () => {
    const val = passInput.value.trim();
    if (val === ADMIN_PASSWORD) {
      loginDiv.classList.add('hidden');
      panelDiv.classList.remove('hidden');
    } else {
      alert('Senha incorreta');
    }
  });

  logoutBtn.addEventListener('click', () => {
    // Simple logout – just hide panel and show login again
    panelDiv.classList.add('hidden');
    loginDiv.classList.remove('hidden');
    passInput.value = '';
  });

  // Add product handler
  // Handle image preview and Base64 conversion
  const imagePreview = document.getElementById('image-preview');
  document.getElementById('prod-image').addEventListener('change', function(){
    const file = this.files[0];
    if (!file) { imagePreview.classList.add('hidden'); return; }
    const reader = new FileReader();
    reader.onload = () => { imagePreview.src = reader.result; imagePreview.classList.remove('hidden'); };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('prod-title').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const desc = document.getElementById('prod-desc').value.trim();
    const category = document.getElementById('prod-category').value.trim();
    const sizesRaw = document.getElementById('prod-sizes').value.trim();
    const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);
    const fileInput = document.getElementById('prod-image');
    const file = fileInput.files[0];
    const imageData = await new Promise(resolve => {
      if (!file) { resolve(''); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    if (window.__editingProductId) {
      // Edit existing product
      const prod = window.PRODUCTS.find(p => p.id === window.__editingProductId);
      if (prod) {
        prod.title = title;
        prod.price = price;
        prod.description = desc;
        prod.category = category;
        prod.sizes = sizes;
        if (imageData) prod.image = imageData;
      }
      window.__editingProductId = null;
    } else {
      // New product
      const newId = (window.PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0) + 1);
      const newProduct = {
        id: newId,
        title,
        price,
        image: imageData,
        description: desc,
        badge: '',
        category,
        sizes,
        available: true
      };
      window.PRODUCTS.push(newProduct);
    }
    // Persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.PRODUCTS));
    // Refresh UI
    if (typeof renderProducts === 'function') {
      renderProducts(document.querySelector('.filter-btn.active')?.id?.replace('filter-', '') || 'all');
    }
    renderAdminList();
    alert('Produto salvo com sucesso!');
    form.reset();
    imagePreview.classList.add('hidden');
  });
})();
