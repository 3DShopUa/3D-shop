// 1. БАЗА ТОВАРІВ
const products = [
    
    { 
        id: 1, title: "Зорбел (Zorbel)", 
        currentPrice: 30, oldPrice: 150, 
        cat: ['flexi'], desc: "Деталізована фігурка Zorbel.", 
        imgs: ['zorbel2.jpg','zorbel1.jpg'] 
    },
    { 
        id: 2, title: "Гекон-антистрес", 
        currentPrice: 20, oldPrice: 100, 
        cat: ['flexi', 'sale'], desc: "Маленький рухомий гекон.", 
        imgs: ['gecon1.jpg', 'gecon2.jpg'] 
    },
    { 
        id: 3, title: "Кріпер Minecraft", 
        currentPrice: 180, oldPrice: null, 
        cat: ['toys'], desc: "Фігурка Кріпера для фанатів гри.", 
        imgs: ['creeper.jpg'] 
    }
];

let cart = JSON.parse(localStorage.getItem('shop_cart')) || {};
let currentProduct = null;
let currentSlide = 0;

// 2. ФУНКЦІЯ МАЛЮВАННЯ ТОВАРІВ
function renderProducts(filter = 'all') {
    const grid = document.getElementById('grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = products.filter(p => filter === 'all' || p.cat.includes(filter));

    filtered.forEach(p => {
        const hasSale = p.oldPrice && p.oldPrice > p.currentPrice;
        const discount = hasSale ? Math.round((1 - p.currentPrice / p.oldPrice) * 100) : 0;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openProduct(p.id); // Клік по всій картці відкриває модалку

        card.innerHTML = `
            ${hasSale ? `<div class="sale-badge">-${discount}%</div>` : ''}
            
            <div class="card-image-static">
                <img src="${p.imgs[0]}" alt="${p.title}">
            </div>

            <div class="card-info">
                <h3>${p.title}</h3>
                <div class="price-row">
                    <span class="price-new">${p.currentPrice} ₴</span>
                    ${hasSale ? `<span class="price-old">${p.oldPrice} ₴</span>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. ГОРТАННЯ ФОТО (БЕЗ ВІДКРИТТЯ МОДАЛКИ)
window.moveCardSlide = (id, delta) => {
    const p = products.find(i => i.id === id);
    const slidesCont = document.getElementById(`slides-${id}`);
    const card = slidesCont.closest('.card');
    let current = parseInt(card.dataset.currentSlide) || 0;
    
    current = (current + delta + p.imgs.length) % p.imgs.length;
    card.dataset.currentSlide = current;
    slidesCont.style.transform = `translateX(-${current * 100}%)`;
};

// 4. ВІДКРИТТЯ МОДАЛКИ (ВИПРАВЛЕНО)
window.openProduct = (id) => {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    // Заповнюємо дані в модалці
    document.getElementById('p-title').innerText = currentProduct.title;
    document.getElementById('p-desc').innerText = currentProduct.desc;
    document.getElementById('p-price-cont').innerText = `${currentProduct.currentPrice} ₴`;
    
    // Слайдер у модалці
    const modalSlides = document.getElementById('product-slides');
    if (modalSlides) {
        modalSlides.innerHTML = currentProduct.imgs.map(img => `<img src="${img}">`).join('');
    }
    
    currentSlide = 0;
    updateModalSlider();
    
    // Показуємо модалку
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('show');
};

window.closeProduct = () => {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('show');
};

// Слайдер всередині модалки
window.moveSlide = (n) => {
    const total = currentProduct.imgs.length;
    currentSlide = (currentSlide + n + total) % total;
    updateModalSlider();
};

function updateModalSlider() {
    const s = document.getElementById('product-slides');
    if (s) s.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// 5. КОШИК ТА ПОШУК
function updateCartUI() {
    const badge = document.getElementById('cart-count');
    const list = document.getElementById('cart-items-list');
    
    let total = 0, count = 0;
    Object.values(cart).forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
    });
    
    if (badge) badge.innerText = count;
    localStorage.setItem('shop_cart', JSON.stringify(cart));

    if (list) {
        // Логіка для сторінки кошика ( cart.html )
        list.innerHTML = Object.values(cart).map(item => `
            <div class="cart-item-card">
                <div class="cart-item-main">
                    <img src="${window.location.pathname.includes('pages') ? '../'+item.imgs[0] : item.imgs[0]}" class="cart-img-min">
                    <b>${item.title}</b>
                    <button onclick="deleteItem(${item.id})">🗑️</button>
                </div>
                <div class="cart-item-controls">
                    <div>
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                    <div class="price-new">${item.price * item.qty} ₴</div>
                </div>
            </div>
        `).join('');
        const totalLabel = document.getElementById('checkout-total');
        if (totalLabel) totalLabel.innerText = `Загалом: ${total} ₴`;
    }
}

// Додавання в кошик з модалки
// Знаходимо кнопку додавання
const addToCartBtn = document.getElementById('add-to-cart-action');

if (addToCartBtn) {
    addToCartBtn.onclick = () => {
        const id = currentProduct.id;
        
        // Додаємо товар у об'єкт кошика
        if (cart[id]) {
            cart[id].qty++;
        } else {
            cart[id] = { 
                ...currentProduct, 
                qty: 1, 
                price: currentProduct.currentPrice 
            };
        }

        // Оновлюємо інтерфейс та пам'ять
        updateCartUI();

        // --- ЕФЕКТ ГАЛОЧКИ ---
        const originalText = addToCartBtn.innerHTML; // Запам'ятовуємо старий текст ("Додати в кошик")
        
        addToCartBtn.innerHTML = "Додано ✅"; // Міняємо на галочку
        addToCartBtn.style.background = "#2ecc71"; // Робимо кнопку зеленою (опціонально)
        addToCartBtn.disabled = true; // Вимикаємо на секунду, щоб не тиснули сто разів

        setTimeout(() => {
            addToCartBtn.innerHTML = originalText; // Повертаємо текст назад
            addToCartBtn.style.background = ""; // Повертаємо колір
            addToCartBtn.disabled = false;
        }, 1500); // Ефект триватиме 1.5 секунди
    };
}

window.changeQty = (id, delta) => {
    if (cart[id]) {
        cart[id].qty += delta;
        if (cart[id].qty <= 0) delete cart[id];
        updateCartUI();
    }
};

window.deleteItem = (id) => {
    delete cart[id];
    updateCartUI();
};

// Пошук
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.oninput = (e) => {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = title.includes(text) ? "block" : "none";
        });
    };
}

// Категорії
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.cat);
    };
});

// СТАРТ
renderProducts();
updateCartUI();
// Функція плавної прокрутки вгору
window.scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Стежимо за скролом сторінки
window.onscroll = function() {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    }
};