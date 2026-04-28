// 1. БАЗА ТОВАРІВ
const products = [
    { 
        id: 1, title: "Зорбел (Zorbel)", 
        currentPrice: 30, oldPrice: 150, 
        cat: ['figet', 'sale'], desc: "Деталізована фігурка Zorbel.", 
        imgs: ['zorbel2.jpg','zorbel1.jpg'] 
    },
    { 
        id: 2, title: "Гекон-антистрес", 
        currentPrice: 20, oldPrice: 100, 
        cat: ['flexi', 'sale'], desc: "Маленький рухомий гекон.", 
        imgs: ['gecon1.jpg', 'gecon2.jpg'] 
    },
    { 
        id: 3, title: "копійкі-антистрес", 
        currentPrice: 25, oldPrice: 100, 
        cat: ['figet', 'sale'], desc: "Маленькі рухомі фіджет копійкі.", 
        imgs: ['coin1.jpg', 'coin2.jpg'] 
    }
];

let cart = JSON.parse(localStorage.getItem('shop_cart')) || {};
let currentProduct = null;
let currentSlide = 0;

// 2. МАЛЮВАННЯ ТОВАРІВ НА ГОЛОВНІЙ
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
        card.onclick = () => openProduct(p.id); 

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

// 3. МОДАЛЬНЕ ВІКНО ТА СЛАЙДЕР
window.openProduct = (id) => {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    document.getElementById('p-title').innerText = currentProduct.title;
    document.getElementById('p-desc').innerText = currentProduct.desc;
    document.getElementById('p-price-cont').innerText = `${currentProduct.currentPrice} ₴`;
    
    const modalSlides = document.getElementById('product-slides');
    if (modalSlides) {
        modalSlides.innerHTML = currentProduct.imgs.map(img => `<img src="${img}" style="width:100%; flex-shrink:0;">`).join('');
    }
    
    currentSlide = 0;
    updateModalSlider();
    
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('show'); // Переконайся, що в CSS є .modal.show { display: flex; }
};

window.closeProduct = () => {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('show');
};

window.moveSlide = (n) => {
    if (!currentProduct) return;
    const total = currentProduct.imgs.length;
    currentSlide = (currentSlide + n + total) % total;
    updateModalSlider();
};

function updateModalSlider() {
    const s = document.getElementById('product-slides');
    if (s) {
        // Рухаємо слайдер на ширину контейнера (100%)
        s.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

// 4. УПРАВЛІННЯ КОШИКОМ
function updateCartUI() {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    
    // Оновлення лічильника на кнопці
    const badge = document.getElementById('cart-count');
    let count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    if (badge) badge.innerText = count;

    // Якщо ми на сторінці кошика — перемальовуємо список
    renderCartPage();
}

const addToCartBtn = document.getElementById('add-to-cart-action');
if (addToCartBtn) {
    addToCartBtn.onclick = () => {
        if (!currentProduct) return;
        
        // 1. Отримуємо дані за твоїм ключем
        let cartData = JSON.parse(localStorage.getItem('shop_cart')) || {};
        const id = currentProduct.id;

        // 2. Оновлюємо або створюємо товар
       
        if (cartData[id]) {
            cartData[id].qty++;
        } else {
            // Перевіряємо, що саме лежить в currentProduct.imgs
            let productImg = 'img/no-photo.jpg';
            
            if (currentProduct.imgs && currentProduct.imgs.length > 0) {
                // Беремо найперше фото з масиву
                productImg = currentProduct.imgs[0];
            } else if (currentProduct.image) {
                // Якщо раптом у тебе поле називається просто image
                productImg = currentProduct.image;
            }

            // У твоєму index.js змініть частину створення товару:
cartData[id] = {
    id: currentProduct.id,
    title: currentProduct.title,
    price: currentProduct.currentPrice,
    allImgs: currentProduct.imgs, // ЗБЕРІГАЄМО ВЕСЬ МАСИВ ФОТО
    qty: 1
};
        }
        // ... далі запис у localStorage ...

        // 3. ЗАПИСУЄМО В ПАМ'ЯТЬ (це найважливіше!)
        localStorage.setItem('shop_cart', JSON.stringify(cartData));

        // 4. ОНОВЛЮЄМО ВНУТРІШНЮ ЗМІННУ (щоб не ламався updateCartUI)
        if (typeof cart !== 'undefined') {
            cart = cartData; 
        }

        // 5. Оновлюємо інтерфейс на головній
        if (typeof updateCartUI === "function") {
            updateCartUI();
        }

        // Твоя анімація кнопки
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = "Додано ✅";
        addToCartBtn.style.background = "#2ecc71";
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.style.background = "";
        }, 1000);
    };
}

// Функція для сторінки cart.html
function renderCartPage() {
    const list = document.getElementById('cart-items-list'); // Має бути такий ID в cart.html
    const totalLabel = document.getElementById('checkout-total');
    if (!list) return;

    const cartArray = Object.values(cart);
    
    if (cartArray.length === 0) {
        list.innerHTML = "<p style='text-align:center; color: #888;'>Кошик порожній...</p>";
        if (totalLabel) totalLabel.innerText = "Разом: 0 ₴";
        return;
    }

    let total = 0;
    list.innerHTML = cartArray.map(item => {
        total += item.price * item.qty;
        return // Приклад того, як у тебе в коді слайдера має генеруватися кнопка:
`
<button onclick="
    let cart = JSON.parse(localStorage.getItem('shop_cart')) || {};
    const id = '${product.id}';
    if(cart[id]) {
        cart[id].qty += 1;
    } else {
        cart[id] = {
            id: id,
            title: '${product.title}',
            price: ${product.price},
            image: '${product.image}', // ОСЬ ТУТ: воно візьме шлях img/gekon.jpg
            qty: 1
        };
    }
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    alert('Додано!');
" class="buy-btn">Купити</button>
`;
    }).join('');

    if (totalLabel) totalLabel.innerText = `Разом: ${total} ₴`;
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

// 5. ПОШУК ТА КАТЕГОРІЇ
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

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.cat);
    };
});

// ЗАПУСК
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
