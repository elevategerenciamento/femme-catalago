// admin.js – Handles admin login and product CRUD (add, edit, delete) for both modal (produtos.html) and standalone page (admin.html)
(() => {
  const ADMIN_PASSWORD = '12345';

  window.PRODUCTS = [];

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

  // ---------- Size Selector Helpers ----------
  const sizesSelector = document.getElementById('sizes-selector');
  const prodSizesInput = document.getElementById('prod-sizes');

  const updateSizesInput = () => {
    if (!sizesSelector || !prodSizesInput) return;
    const selected = [];
    sizesSelector.querySelectorAll('.size-btn.active').forEach(btn => {
      selected.push(btn.dataset.size);
    });
    prodSizesInput.value = selected.join(', ');
  };

  const syncSizesUI = () => {
    if (!sizesSelector || !prodSizesInput) return;
    const selectedSizes = prodSizesInput.value.split(',').map(s => s.trim()).filter(Boolean);
    sizesSelector.querySelectorAll('.size-btn').forEach(btn => {
      if (selectedSizes.includes(btn.dataset.size)) {
        btn.classList.add('bg-secondary', 'text-black', 'border-secondary', 'active');
      } else {
        btn.classList.remove('bg-secondary', 'text-black', 'border-secondary', 'active');
      }
    });
  };

  if (sizesSelector) {
    sizesSelector.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('bg-secondary');
        btn.classList.toggle('text-black');
        btn.classList.toggle('border-secondary');
        btn.classList.toggle('active');
        updateSizesInput();
      });
    });
  }

  // ---------- Image Compression Helper ----------
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

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
    if (form) {
      form.reset();
      const fileInput = document.getElementById('prod-image');
      if (fileInput) fileInput.required = true;
      syncSizesUI();
    }
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

  // Load products from Firebase
  const loadProductsFromFirebase = async () => {
    try {
      const snapshot = await window.db.collection('produtos').get();
      window.PRODUCTS = [];
      snapshot.forEach(doc => {
        window.PRODUCTS.push(doc.data());
      });
      window.PRODUCTS.sort((a, b) => a.id - b.id);
    } catch (e) {
      console.error('Failed to load products from Firebase', e);
      window.PRODUCTS = [];
    }
  };

  // Load and render product cards (admin page)
  const loadProducts = async () => {
    const listContainer = document.getElementById('admin-list');
    if (!listContainer) return;
    listContainer.innerHTML = '<div class="text-white col-span-full text-center">Carregando produtos...</div>';
    await loadProductsFromFirebase();
    listContainer.innerHTML = '';
    if (window.PRODUCTS.length === 0) {
      listContainer.innerHTML = '<div class="text-white col-span-full text-center">Nenhum produto cadastrado.</div>';
      return;
    }
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
    syncSizesUI();
    // Image preview (if exists)
    if (prod.image && imagePreview) {
      imagePreview.src = prod.image;
      imagePreview.classList.remove('hidden');
    }
    window.__editingProductId = id;
    // Switch button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Salvar Alteração';
    // Make file input not required during edit
    const fileInput = document.getElementById('prod-image');
    if (fileInput) fileInput.required = false;
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await window.db.collection('produtos').doc(String(id)).delete();
      await loadProducts();
    } catch (e) {
      console.error('Erro ao deletar produto: ', e);
      alert('Erro ao deletar produto');
    }
  };

  // Form submission – add or edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    const title = document.getElementById('prod-title').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const desc = document.getElementById('prod-desc').value.trim();
    const category = document.getElementById('prod-category').value.trim();
    const sizesRaw = document.getElementById('prod-sizes').value.trim();
    const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);
    const fileInput = document.getElementById('prod-image');
    const file = fileInput.files[0];

    if (sizes.length === 0) {
      alert('Por favor, selecione pelo menos um tamanho.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      return;
    }

    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await compressImage(file);
      }

      if (window.__editingProductId) {
        const prodId = window.__editingProductId;
        const docRef = window.db.collection('produtos').doc(String(prodId));
        const doc = await docRef.get();
        const existingData = doc.exists ? doc.data() : {};
        
        const updatedProduct = {
          id: prodId,
          title,
          price,
          description: desc,
          category,
          sizes,
          image: imageUrl || existingData.image || '',
          badge: existingData.badge || '',
          available: existingData.available !== false
        };

        await docRef.set(updatedProduct);
        window.__editingProductId = null;
      } else {
        if (!file) {
          alert('Por favor, selecione uma imagem para o novo produto.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          return;
        }
        await loadProductsFromFirebase();
        const newId = (window.PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0) + 1) || 1;
        const newProduct = {
          id: newId,
          title,
          price,
          image: imageUrl,
          description: desc,
          badge: '',
          category,
          sizes,
          available: true
        };
        await window.db.collection('produtos').doc(String(newId)).set(newProduct);
      }

      await loadProducts();
      alert('Produto salvo com sucesso!');
      form.reset();
      syncSizesUI();
      if (fileInput) fileInput.required = true;
      if (imagePreview) imagePreview.classList.add('hidden');
      
      submitBtn.textContent = 'Adicionar Produto';
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar o produto: ' + err.message);
    } finally {
      submitBtn.disabled = false;
    }
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
      const panel = document.getElementById('admin-panel');
      const login = document.getElementById('admin-login');
      if (panel) panel.classList.add('hidden');
      if (login) login.classList.remove('hidden');
      passInput.value = '';
      window.__editingProductId = null;
    } else {
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
    const loginSection = document.getElementById('admin-login');
    const panelSection = document.getElementById('admin-panel');
    if (loginSection) loginSection.classList.remove('hidden');
    if (panelSection) panelSection.classList.add('hidden');
    loadProducts();
  }
})();
