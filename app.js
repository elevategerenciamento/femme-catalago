// Femme Lingerie - Premium Interactive Site Script

// --- Database de Produtos ---
const PRODUCTS = [
  {
    id: 1,
    title: 'Camisola Vermelha Femme',
    price: 450.00,
    image: 'images/prod_red_camisole.png',
    description: 'Confeccionada em seda pura italiana e renda chantilly francesa. A Camisola Vermelha Femme apresenta caimento fluido impecável, alças delicadas reguláveis e detalhes de transparência que valorizam a silhueta com extrema elegância e sofisticação.',
    badge: 'Best Seller',
    sizes: ['P', 'M', 'G', 'GG']
  },
  {
    id: 2,
    title: 'Conjunto Noir Elegance',
    price: 380.00,
    image: 'images/prod_noir_elegance.png',
    description: 'Um clássico indispensável em renda onyx de alta costura. O conjunto Noir Elegance traz um sutiã estruturado com aro de sustentação e calcinha hot pant rendada. Conforto extraordinário aliado à sensualidade atemporal do preto profundo.',
    badge: 'Novidade',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 3,
    title: 'Espartilho Champagne',
    price: 520.00,
    image: 'images/prod_champagne_corset.png',
    description: 'Peça escultural estruturada com barbatanas flexíveis e amarração clássica nas costas. O Espartilho Champagne é feito em cetim encorpado de brilho suave e detalhes em renda manual, desenhando e realçando as curvas com precisão milimétrica.',
    badge: 'Edição Limitada',
    sizes: ['P', 'M', 'G', 'GG']
  },
  {
    id: 4,
    title: 'Sutiã Rose Gold Detail',
    price: 290.00,
    image: 'images/prod_rose_gold_bra.png',
    description: 'Bordado exclusivo em fios metálicos sobre tule invisível. O Sutiã Rose Gold Detail cria uma ilusão sofisticada de joia sobre a pele, perfeito para momentos em que a delicadeza e o luxo andam lado a lado.',
    badge: 'Mais Desejado',
    sizes: ['P', 'M', 'G']
  }
];

// --- Estado da Aplicação (Cart) ---
let cart = JSON.parse(localStorage.getItem('femme_cart')) || [];

// --- Elementos do DOM ---
const elements = {
  header: document.querySelector('.global-header'),
  menuToggle: document.querySelector('.menu-toggle'),
  mobileNav: document.querySelector('.mobile-nav-overlay'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
  
  cartDrawer: document.querySelector('.cart-drawer'),
  scrim: document.querySelector('.scrim'),
  cartItemsContainer: document.querySelector('.cart-items'),
  cartCountBadge: document.getElementById('cart-count'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  openCartBtns: document.querySelectorAll('.open-cart-btn'),
  closeCartBtn: document.querySelector('.cart-close-btn'),
  checkoutBtn: document.querySelector('.cart-checkout-btn'),
  
  searchOverlay: document.querySelector('.search-overlay'),
  openSearchBtns: document.querySelectorAll('.open-search-btn'),
  closeSearchBtn: document.querySelector('.search-close-btn'),
  searchInput: document.querySelector('.search-input'),
  searchResultsGrid: document.querySelector('.search-results-grid'),
  searchResultsLabel: document.getElementById('search-results-label'),
  
  modalOverlay: document.querySelector('.modal-overlay'),
  modalContainer: document.querySelector('.modal-container'),
  closeModalBtn: document.querySelector('.modal-close-btn'),
  
  newsletterForm: document.getElementById('newsletter-form'),
  newsletterInput: document.getElementById('newsletter-email'),
  newsletterBtn: document.getElementById('newsletter-btn')
};

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  initScrollHeader();
  initMobileMenu();
  initCart();
  initSearch();
  initModal();
  initAnimations();
  initNewsletter();
});

// --- 1. Cabeçalho ao Rolar a Página ---
function initScrollHeader() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      elements.header.classList.add('scrolled');
    } else {
      elements.header.classList.remove('scrolled');
    }
  });
}

// --- 2. Menu Mobile ---
function initMobileMenu() {
  if (!elements.menuToggle) return;
  
  const toggleMenu = () => {
    const isActive = elements.mobileNav.classList.toggle('is-active');
    const icon = elements.menuToggle.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = isActive ? 'close' : 'menu';
    }
  };
  
  elements.menuToggle.addEventListener('click', toggleMenu);
  
  elements.mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      elements.mobileNav.classList.remove('is-active');
      const icon = elements.menuToggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    });
  });
}

// --- 3. Carrinho de Compras ---
function initCart() {
  // Abrir Carrinho
  elements.openCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });
  
  // Fechar Carrinho
  if (elements.closeCartBtn) {
    elements.closeCartBtn.addEventListener('click', closeCart);
  }
  if (elements.scrim) {
    elements.scrim.addEventListener('click', closeCart);
  }
  
  // Checkout (WhatsApp Integration)
  if (elements.checkoutBtn) {
    elements.checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      
      let message = 'Olá Femme Lingerie! Gostaria de fazer o pedido dos seguintes itens:\n\n';
      let total = 0;
      
      cart.forEach(item => {
        const itemTotal = item.product.price * item.qty;
        total += itemTotal;
        message += `• *${item.product.title}* - Tam: ${item.size} | Qtd: ${item.qty} (R$ ${item.product.price.toFixed(2)} un.)\n`;
      });
      
      message += `\n*Valor Total:* R$ ${total.toFixed(2)}\n\nComo posso prosseguir com o pagamento e entrega?`;
      
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
  
  renderCart();
}

function openCart() {
  elements.cartDrawer.classList.add('is-open');
  elements.scrim.classList.add('is-active');
  document.body.style.overflow = 'hidden'; // Evita scroll de fundo
}

function closeCart() {
  elements.cartDrawer.classList.remove('is-open');
  elements.scrim.classList.remove('is-active');
  document.body.style.overflow = '';
}

function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Verifica se o mesmo produto com o mesmo tamanho já existe
  const existingIndex = cart.findIndex(item => item.product.id === productId && item.size === size);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ product, qty: 1, size });
  }
  
  saveCart();
  renderCart();
}

function updateQty(productId, size, delta) {
  const index = cart.findIndex(item => item.product.id === productId && item.size === size);
  if (index === -1) return;
  
  cart[index].qty += delta;
  
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  
  saveCart();
  renderCart();
}

function removeFromCart(productId, size) {
  cart = cart.filter(item => !(item.product.id === productId && item.size === size));
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('femme_cart', JSON.stringify(cart));
}

function renderCart() {
  if (!elements.cartItemsContainer) return;
  
  elements.cartItemsContainer.innerHTML = '';
  
  let totalCount = 0;
  let subtotal = 0;
  
  if (cart.length === 0) {
    elements.cartItemsContainer.innerHTML = '<div class="cart-empty-message">Seu carrinho está vazio.</div>';
    if (elements.checkoutBtn) elements.checkoutBtn.style.display = 'none';
  } else {
    if (elements.checkoutBtn) elements.checkoutBtn.style.display = 'flex';
    
    cart.forEach(item => {
      totalCount += item.qty;
      const itemTotal = item.product.price * item.qty;
      subtotal += itemTotal;
      
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.product.image}" alt="${item.product.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.product.title}</h4>
            <div class="cart-item-meta">Tamanho: ${item.size}</div>
          </div>
          <div class="cart-item-price">R$ ${(item.product.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.product.id}, '${item.size}', -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.product.id}, '${item.size}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.product.id}, '${item.size}')">
          <span class="material-symbols-outlined">delete</span>
        </button>
      `;
      elements.cartItemsContainer.appendChild(itemEl);
    });
  }
  
  // Atualiza Badges e Totais
  elements.cartCountBadge.textContent = totalCount;
  elements.cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  elements.cartSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
}

// Globalizar funções do carrinho para atributos inline onClick
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;

// --- 4. Sistema de Busca ---
function initSearch() {
  // Abrir Busca
  elements.openSearchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      elements.searchOverlay.classList.add('is-active');
      setTimeout(() => elements.searchInput.focus(), 300);
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Fechar Busca
  if (elements.closeSearchBtn) {
    elements.closeSearchBtn.addEventListener('click', () => {
      elements.searchOverlay.classList.remove('is-active');
      elements.searchInput.value = '';
      elements.searchResultsGrid.innerHTML = '';
      elements.searchResultsLabel.textContent = '';
      document.body.style.overflow = '';
    });
  }
  
  // Digitar na Busca (Filtro instantâneo)
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        elements.searchResultsGrid.innerHTML = '';
        elements.searchResultsLabel.textContent = '';
        return;
      }
      
      const filtered = PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
      
      renderSearchResults(filtered);
    });
  }
}

function renderSearchResults(results) {
  elements.searchResultsGrid.innerHTML = '';
  
  if (results.length === 0) {
    elements.searchResultsLabel.textContent = 'Nenhum resultado encontrado.';
    return;
  }
  
  elements.searchResultsLabel.textContent = `${results.length} resultado(s) encontrado(s):`;
  
  // Criar Grid de Resultados estilo minimalista
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  
  results.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card-img-container">
        <img src="${product.image}" alt="${product.title}" class="product-card-img">
        <div class="product-hover-action">
          <button class="btn-ghost" onclick="openProductModal(${product.id})">Visualização Rápida</button>
        </div>
      </div>
      <div class="product-info">
        <h4 class="product-title">${product.title}</h4>
        <p class="product-price">R$ ${product.price.toFixed(2)}</p>
      </div>
    `;
    grid.appendChild(card);
  });
  
  elements.searchResultsGrid.appendChild(grid);
}

// --- 5. Modal de Visualização Rápida (Quick View) ---
function initModal() {
  if (elements.closeModalBtn) {
    elements.closeModalBtn.addEventListener('click', closeProductModal);
  }
  
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeProductModal();
    });
  }
}

let activeSelectedSize = null;

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Fechar busca se estiver aberta
  elements.searchOverlay.classList.remove('is-active');
  elements.searchInput.value = '';
  document.body.style.overflow = '';
  
  // Renderizar Detalhes
  const modalContainer = elements.modalContainer;
  activeSelectedSize = product.sizes[0]; // Seleciona primeiro tamanho por padrão
  
  modalContainer.innerHTML = `
    <button class="modal-close-btn" onclick="closeProductModal()">
      <span class="material-symbols-outlined">close</span>
    </button>
    <div class="modal-gallery">
      <img src="${product.image}" alt="${product.title}" class="modal-img">
    </div>
    <div class="modal-details">
      <span class="modal-tag text-label-sm">${product.badge}</span>
      <h2 class="modal-title font-display text-headline-lg">${product.title}</h2>
      <div class="modal-price">R$ ${product.price.toFixed(2)}</div>
      <p class="modal-desc">${product.description}</p>
      
      <div>
        <div class="modal-option-label">Tamanho</div>
        <div class="size-selector">
          ${product.sizes.map(size => `
            <button class="size-option ${size === activeSelectedSize ? 'is-selected' : ''}" data-size="${size}">${size}</button>
          `).join('')}
        </div>
      </div>
      
      <button class="btn-primary add-to-cart-modal-btn" style="margin-top: 10px;">Adicionar ao Carrinho</button>
    </div>
  `;
  
  // Event listeners para opções de tamanho
  const sizeBtns = modalContainer.querySelectorAll('.size-option');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sizeBtns.forEach(b => b.classList.remove('is-selected'));
      e.target.classList.add('is-selected');
      activeSelectedSize = e.target.getAttribute('data-size');
    });
  });
  
  // Event listener para adicionar ao carrinho
  const addBtn = modalContainer.querySelector('.add-to-cart-modal-btn');
  addBtn.addEventListener('click', () => {
    // Feedback visual animado no botão
    addBtn.textContent = 'Adicionado!';
    addBtn.style.backgroundColor = 'transparent';
    addBtn.style.color = 'var(--color-primary)';
    addBtn.style.borderColor = 'var(--color-primary)';
    
    addToCart(product.id, activeSelectedSize);
    
    setTimeout(() => {
      closeProductModal();
      openCart();
    }, 850);
  });
  
  elements.modalOverlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  elements.modalOverlay.classList.remove('is-active');
  document.body.style.overflow = '';
}

// Globalizar para click dos cards
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;

// --- 6. Scroll triggered fade-in-up animations ---
function initAnimations() {
  const sections = document.querySelectorAll('.fade-in-section');
  if (sections.length === 0) return;
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Roda apenas uma vez
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// --- 7. Newsletter Feedback ---
function initNewsletter() {
  if (!elements.newsletterForm) return;
  
  elements.newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.newsletterInput.value.trim();
    if (!email) return;
    
    // Animação de envio
    const originalText = elements.newsletterBtn.textContent;
    elements.newsletterBtn.textContent = 'Enviando...';
    elements.newsletterBtn.disabled = true;
    
    setTimeout(() => {
      elements.newsletterInput.value = '';
      elements.newsletterBtn.textContent = 'Cadastrado!';
      elements.newsletterBtn.style.borderColor = 'var(--color-secondary)';
      elements.newsletterBtn.style.color = 'var(--color-secondary)';
      
      setTimeout(() => {
        elements.newsletterBtn.textContent = originalText;
        elements.newsletterBtn.disabled = false;
        elements.newsletterBtn.style.borderColor = '';
        elements.newsletterBtn.style.color = '';
      }, 3000);
    }, 1200);
  });
}
