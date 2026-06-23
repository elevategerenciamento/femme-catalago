// admin.js – Handles admin login and product CRUD (add, edit, delete) for both modal (produtos.html) and standalone page (admin.html)
(() => {
  const ADMIN_PASSWORD = '12345';
  const STORAGE_KEY = 'femme_products';

  // Load products from storage if available
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      window.PRODUCTS = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored products', e);
      window.PRODUCTS = [];
    }
  } else {
    window.PRODUCTS = [];
  }

  // ------------------- UI Helpers -------------------
  const isAdminPage = !!document.getElementById('admin-login');

  // Elements that exist on both contexts
  const passInput = document.getElementById('admin-pass');
  const loginBtn = document.getElementById('admin-login-btn');
  const logoutBtn = document.getElementById('admin-logout');
  const form = document.getElementById('product-form');
  const imagePreview = document.getElementById('image-preview');

  // ---------- Modal specific elements (produtos.html) ----------
  const modalLink = document.getElementById('admin-access-link');
  const scrim = document.getElementById('admin-scrim');
  const modal = document.getElementById('admin-modal');
  const loginDiv = document.getElementById('admin-login');
  const panelDiv = document.getElementById('admin-panel');
  const closeBtn = document.getElementById('admin-close-btn');

  // ---------- Functions ----------
  const openModal = () => {
    if (scrim && modal) {
      scrim.classList.remove('hidden');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };
  const closeModal = () => {
    if (scrim && modal) {
      scrim.classList.add('hidden');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
    if (loginDiv) loginDiv.classList.remove('hidden');
    if (panelDiv) panelDiv.classList.add('hidden');
    if (passInput) passInput.value = '';
    if (form) form.reset();
    if (imagePreview) imagePreview.classList.add('hidden');
    window.__editingProductId = null;
  };

  // Login flow – shared between modal and page
  const handleLogin = () => {
    if (passInput && passInput.value.trim() === ADMIN_PASSWORD) {
      if (loginDiv) loginDiv.classList.add('hidden');
      if (panelDiv) panelDiv.classList.remove('hidden');
    } else {
      alert('Senha incorreta');
    }
  };

  // Load and render product cards (admin page)
  const loadProducts = () => {
    const listContainer = document.getElementById('admin-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    window.PRODUCTS.forEach(renderProductCard);
  };

  const renderProductCard = (product) => {
    const listContainer = document.getElementById('admin-list');
    const card = document.createElement('div');
    card.className = 'admin-card bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-md flex flex-col space-y-2';
    card.innerHTML = `
      <img src="${product.image || ''}" alt="${product.title}" class="w-full h-48 object-cover rounded" />
      <h3 class="text-lg font-bold text-white">${product.title}</h3>
      <p class="text-sm text-white">R$ ${product.price.toFixed(2)}</p>
      <p class="text-xs text-white">${product.category}</p>
      <div class="flex space-x-2 mt-auto">
        <button class="edit-btn bg-primary text-white py-1 px-2 rounded" data-id="${product.id}">Editar</button>
        <button class="delete-btn bg-red-600 text-white py-1 px-2 rounded" data-id="${product.id}">Excluir</button>
      </div>
    `;
    // Edit handler
    card.querySelector('.edit-btn').addEventListener('click', () => handleEdit(product.id));
    // Delete handler
    card.querySelector('.delete-btn').addEventListener('click', () => handleDelete(product.id));
    listContainer.appendChild(card);
  };

  const handleEdit = (id) => {
    const prod = window.PRODUCTS.find(p => p.id === id);
    if (!prod) return;
    // Populate form
    document.getElementById('prod-title').value = prod.title;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-desc').value = prod.description;
    document.getElementById('prod-category').value = prod.category;
    document.getElementById('prod-sizes').value = prod.sizes.join(', ');
    // Image preview (if exists)
    if (prod.image && imagePreview) {
      imagePreview.src = prod.image;
      imagePreview.classList.remove('hidden');
    }
    window.__editingProductId = id;
    // Switch button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Salvar Alteração';
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    window.PRODUCTS = window.PRODUCTS.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.PRODUCTS));
    loadProducts();
  };

  // Form submission – add or edit
  const handleFormSubmit = async (e) => {
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
      const newId = (window.PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0) + 1) || 1;
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
    loadProducts();
    alert('Produto salvo com sucesso!');
    form.reset();
    if (imagePreview) imagePreview.classList.add('hidden');
    // Reset submit button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Adicionar Produto';
  };

  // Image preview for file input (both contexts)
  if (document.getElementById('prod-image')) {
    document.getElementById('prod-image').addEventListener('change', function () {
      const file = this.files[0];
      if (!file) { if (imagePreview) imagePreview.classList.add('hidden'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        if (imagePreview) {
          imagePreview.src = reader.result;
          imagePreview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // ------------------- Event Listeners -------------------
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    if (isAdminPage) {
      // On admin page simply hide panel and show login again
      const panel = document.getElementById('admin-panel');
      const login = document.getElementById('admin-login');
      if (panel) panel.classList.add('hidden');
      if (login) login.classList.remove('hidden');
      passInput.value = '';
      window.__editingProductId = null;
    } else {
      // Modal context
      if (panelDiv) panelDiv.classList.add('hidden');
      if (loginDiv) loginDiv.classList.remove('hidden');
      passInput.value = '';
    }
  });

  if (form) form.addEventListener('submit', handleFormSubmit);

  // Modal specific listeners
  if (modalLink) modalLink.addEventListener('click', e => { e.preventDefault(); openModal(); });
  if (scrim) scrim.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Initialize admin page if present
  if (isAdminPage) {
    // Ensure login view is visible
    const loginSection = document.getElementById('admin-login');
    const panelSection = document.getElementById('admin-panel');
    if (loginSection) loginSection.classList.remove('hidden');
    if (panelSection) panelSection.classList.add('hidden');
    loadProducts();
  }
})();
