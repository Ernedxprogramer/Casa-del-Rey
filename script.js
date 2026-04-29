const whatsappNumber = "5351155222";

const products = [
  {
    id: "reloj-dorado",
    name: "Nombre del producto",
    price: 45,
    tag: "Nuevo",
    description: "descripcion del producto.",
    images: ["img/uno.jpg", "img/dos.jpg", "img/tres.jpg"],
  },
  {
    id: "bolso-urbano",
    name: "Nombre del producto",
    price: 35,
    tag: "Top venta",
    description: "Descripcion del producto.",
    images: ["img/dos.jpg", "img/cuatro.jpg", "img/cinco.jpg"],
  },
  {
    id: "gafas-signature",
    name: "Nombre del producto",
    price: 22,
    tag: "Estilo",
    description: "Descripcion del producto.",
    images: ["img/tres.jpg", "img/seis.jpg", "img/siete.jpg"],
  },
  {
    id: "perfume-noir",
    name: "Nombre del producto",
    price: 58,
    tag: "Premium",
    description: "Descripcion del producto.",
    images: ["img/cuatro.jpg", "img/ocho.jpg", "img/uno.jpg"],
  },
  {
    id: "auriculares-pro",
    name: "Nombre del producto",
    price: 42,
    tag: "Tech",
    description: "Descripcion del producto.",
    images: ["img/cinco.jpg", "img/uno.jpg", "img/dos.jpg"],
  },
  {
    id: "zapatillas-elite",
    name: "Nombre del producto",
    price: 64,
    tag: "Favorito",
    description: "Descripcion del producto.",
    images: ["img/seis.jpg", "img/tres.jpg", "img/cuatro.jpg"],
  },
  {
    id: "mochila-travel",
    name: "Nombre del producto",
    price: 39,
    tag: "Util",
    description: "Descripcion del producto.",
    images: ["img/siete.jpg", "img/cinco.jpg", "img/ocho.jpg"],
  },
  {
    id: "set-cuidado",
    name: "Nombre del producto",
    price: 27,
    tag: "Oferta",
    description: "Descripcion del producto.",
    images: ["img/ocho.jpg", "img/seis.jpg", "img/siete.jpg"],
  },
];

const cart = new Map();
const productPhotoIndexes = new Map();

const productGrid = document.querySelector("#productGrid");
const cartDrawer = document.querySelector("#cartDrawer");
const cartToggle = document.querySelector("#cartToggle");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutButton = document.querySelector("#checkoutButton");

const money = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getProductImages(product) {
  return product.images || [product.image];
}

function renderProducts() {
  productGrid.innerHTML = products
    .map((product) => {
      const images = getProductImages(product);
      const activeIndex = productPhotoIndexes.get(product.id) || 0;
      const activeImage = images[activeIndex] || images[0];
      const galleryControls =
        images.length > 1
          ? `
            <div class="product-gallery-controls" aria-label="Fotos de ${product.name}">
              <button class="gallery-button" type="button" data-gallery-action="prev" data-gallery-product-id="${product.id}" aria-label="Foto anterior de ${product.name}">‹</button>
              <span class="gallery-count" data-gallery-count="${product.id}">${activeIndex + 1}/${images.length}</span>
              <button class="gallery-button" type="button" data-gallery-action="next" data-gallery-product-id="${product.id}" aria-label="Foto siguiente de ${product.name}">›</button>
            </div>
          `
          : "";

      return `
        <article class="product-card">
          <div class="product-media">
            <img src="${activeImage}" alt="${product.name}" loading="lazy" data-product-image="${product.id}" />
            <span class="product-tag">${product.tag}</span>
            ${galleryControls}
          </div>
          <div class="product-body">
            <div>
              <h3>${product.name}</h3>
              <p>${product.description}</p>
            </div>
            <div class="product-meta">
              <span class="price">${money.format(product.price)}</span>
            </div>
            <button class="buy-button" type="button" data-product-id="${product.id}">
              Comprar
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function changeProductPhoto(productId, direction) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const images = getProductImages(product);
  if (images.length <= 1) return;

  const currentIndex = productPhotoIndexes.get(productId) || 0;
  const nextIndex = (currentIndex + direction + images.length) % images.length;
  productPhotoIndexes.set(productId, nextIndex);

  const image = productGrid.querySelector(`[data-product-image="${productId}"]`);
  const count = productGrid.querySelector(`[data-gallery-count="${productId}"]`);

  if (image) {
    image.src = images[nextIndex];
  }

  if (count) {
    count.textContent = `${nextIndex + 1}/${images.length}`;
  }
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const current = cart.get(productId);
  cart.set(productId, {
    ...product,
    quantity: current ? current.quantity + 1 : 1,
  });

  renderCart();
  openCart();
}

function updateQuantity(productId, change) {
  const item = cart.get(productId);
  if (!item) return;

  const nextQuantity = item.quantity + change;
  if (nextQuantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, { ...item, quantity: nextQuantity });
  }

  renderCart();
}

function getCartSummary() {
  return [...cart.values()].reduce(
    (summary, item) => {
      summary.count += item.quantity;
      summary.total += item.price * item.quantity;
      return summary;
    },
    { count: 0, total: 0 }
  );
}

function buildWhatsappUrl() {
  const lines = [...cart.values()].map(
    (item) => `- ${item.name} x${item.quantity}: ${money.format(item.price * item.quantity)}`
  );
  const total = money.format(getCartSummary().total);
  const message = `Hola, quiero hacer este pedido en Casa del Rey:\n\n${lines.join("\n")}\n\nTotal: ${total}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function renderCart() {
  const { count, total } = getCartSummary();
  cartCount.textContent = count;
  cartTotal.textContent = money.format(total);

  if (count === 0) {
    cartItems.innerHTML = `<div class="cart-empty">Tu carrito esta vacio.<br />Agrega un producto para comenzar.</div>`;
    checkoutButton.classList.add("disabled");
    checkoutButton.href = "#";
    return;
  }

  cartItems.innerHTML = [...cart.values()]
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <p>${money.format(item.price)} c/u</p>
          </div>
          <div class="qty-controls" aria-label="Cantidad de ${item.name}">
            <button type="button" data-change="-1" data-product-id="${item.id}" aria-label="Restar">-</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-change="1" data-product-id="${item.id}" aria-label="Sumar">+</button>
          </div>
        </div>
      `
    )
    .join("");

  checkoutButton.classList.remove("disabled");
  checkoutButton.href = buildWhatsappUrl();
}

productGrid.addEventListener("click", (event) => {
  const galleryButton = event.target.closest("[data-gallery-action]");
  if (galleryButton) {
    const direction = galleryButton.dataset.galleryAction === "next" ? 1 : -1;
    changeProductPhoto(galleryButton.dataset.galleryProductId, direction);
    return;
  }

  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  addToCart(button.dataset.productId);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  updateQuantity(button.dataset.productId, Number(button.dataset.change));
});

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) {
    closeCartDrawer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCartDrawer();
  }
});

renderProducts();
renderCart();
