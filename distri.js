const products = [
    { id: 1, name: 'Coca Cola 1.5L', price: 2500, wholesalePrice: 18000, wholesaleQty: 8 },
    { id: 2, name: 'Pepsi 1.5L', price: 2300, wholesalePrice: 16500, wholesaleQty: 8 },
    { id: 3, name: 'Secco Pomelo 2L', price: 1200, wholesalePrice: 6500, wholesaleQty: 6 },
    { id: 4, name: 'Pritty Limón 2L', price: 1500, wholesalePrice: 8200, wholesaleQty: 6 },
    { id: 5, name: 'Vino Malbec Premium', price: 5800, wholesalePrice: 31000, wholesaleQty: 6 },
    { id: 6, name: 'Cerveza Rubia 1L', price: 3200, wholesalePrice: 35000, wholesaleQty: 12 }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const modal = document.getElementById('product-modal');
    const modalDetail = document.getElementById('modal-detail');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    // Renderizar Productos
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="img-placeholder">FOTO</div>
            <h3>${p.name}</h3>
            <p class="price">$${p.price}</p>
        `;
        card.onclick = () => openModal(p);
        productList.appendChild(card);
    });

    function openModal(p) {
        modalDetail.innerHTML = `
            <h2 style="color:var(--accent)">${p.name}</h2>
            <p>Precio unidad: <strong>$${p.price}</strong></p>
            <p>Fardo (${p.wholesaleQty} uds): <strong>$${p.wholesalePrice}</strong></p>
            <div style="display:flex; gap:10px; flex-direction:column; margin-top:20px;">
                <button class="confirm-btn" style="background:#666" onclick="addToCart(${p.id}, false)">+ 1 Unidad</button>
                <button class="confirm-btn" onclick="addToCart(${p.id}, true)">+ 1 Fardo</button>
            </div>
        `;
        modal.style.display = 'block';
    }

    window.addToCart = (id, isWholesale) => {
        const product = products.find(p => p.id === id);
        cart.push({
            ...product,
            isWholesale,
            finalPrice: isWholesale ? product.wholesalePrice : product.price,
            cartUniqueId: Date.now()
        });
        updateCartUI();
        modal.style.display = 'none';
        cartSidebar.classList.add('active');
    };

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.finalPrice;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div><strong>${item.name}</strong><br><small>${item.isWholesale ? 'Fardo' : 'Unidad'}</small></div>
                <div>$${item.finalPrice} <button onclick="removeFromCart(${item.cartUniqueId})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button></div>
            `;
            cartItemsContainer.appendChild(div);
        });
        cartCount.textContent = cart.length;
        cartTotal.textContent = '$' + total;
    }

    window.removeFromCart = (uniqueId) => {
        cart = cart.filter(i => i.cartUniqueId !== uniqueId);
        updateCartUI();
    };

    // BOTÓN DE WHATSAPP SIMPLIFICADO
    document.getElementById('whatsapp-confirm').onclick = () => {
        const numero = "5491122334455"; // Pon tu número aquí
        window.open();
    };

    // UI Eventos
    document.getElementById('cart-toggle').onclick = () => cartSidebar.classList.add('active');
    document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('active');
    document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-theme');

    document.getElementById('lang-toggle').onclick = () => {
        const btn = document.getElementById('lang-toggle');
        const isEn = btn.textContent === 'EN';
        btn.textContent = isEn ? 'ES' : 'EN';
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = isEn ? el.getAttribute('data-en') : el.getAttribute('data-es');
        });
    };
})