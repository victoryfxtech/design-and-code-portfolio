// Sample Product Dataset
const productsData = [
  { id: 1, name: "Ceramic Vase", category: "home", price: 45, icon: "🏺" },
  { id: 2, name: "Minimalist Lamp", category: "home", price: 85, icon: "💡" },
  { id: 3, name: "Linen Throw Pillow", category: "home", price: 30, icon: "🛋️" },
  { id: 4, name: "Cotton Tote Bag", category: "fashion", price: 25, icon: "👜" },
  { id: 5, name: "Wool Blend Scarf", category: "fashion", price: 60, icon: "🧣" },
  { id: 6, name: "Classic Sunglasses", category: "fashion", price: 110, icon: "🕶️" }
];

// Cart State from LocalStorage
let cart = JSON.parse(localStorage.getItem('luma_cart')) || [];

// DOM References
const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const countEl = document.getElementById('count');
const totalEl = document.getElementById('total');
const drawerEl = document.getElementById('drawer');

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(productsData);
  updateCart();
});

// 1. Drawer Toggle (matches onclick="toggleCart()")
function toggleCart() {
  drawerEl.classList.toggle('open');
}

// 2. Category Filter (matches onclick="filter('...')")
function filter(category) {
  if (category === 'all') {
    renderProducts(productsData);
  } else {
    const filtered = productsData.filter(item => item.category === category);
    renderProducts(filtered);
  }
}

// 3. Render Product Cards Grid
function renderProducts(items) {
  if (!productsContainer) return;

  if (items.length === 0) {
    productsContainer.innerHTML = '<p>No products available in this category.</p>';
    return;
  }

  productsContainer.innerHTML = items.map(item => `
    <div class="product">
      <div class="pic">${item.icon}</div>
      <div class="info">
        <h3>${item.name}</h3>
        <div class="price">$${item.price}</div>
        <button class="add" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// 4. Cart Logic & Operations
function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = productsData.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  saveAndSyncCart();
  if (!drawerEl.classList.contains('open')) {
    drawerEl.classList.add('open');
  }
}

function updateQuantity(id, change) {
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  saveAndSyncCart();
}

function saveAndSyncCart() {
  localStorage.setItem('luma_cart', JSON.stringify(cart));
  updateCart();
}

// 5. Sync UI Elements
function updateCart() {
  // Update header item badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countEl) countEl.textContent = totalItems;

  // Update cart total amount
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalEl) totalEl.textContent = totalPrice;

  // Render cart items inside side drawer
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="color:#777; padding: 20px 0;">Your cart is empty.</p>';
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cartitem">
      <div>
        <strong>${item.name}</strong>
        <div style="font-size:0.85rem; color:#666;">$${item.price} × ${item.quantity}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button onclick="updateQuantity(${item.id}, -1)" style="cursor:pointer; padding:2px 8px;">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)" style="cursor:pointer; padding:2px 8px;">+</button>
      </div>
    </div>
  `).join('');
}
