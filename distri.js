const products = [
    { id: 1, name: 'Coca Cola 2l', price: 3000, wholesalePrice: 22000, wholesaleQty: 8, image: 'imagenes/coca-cola 2l.jpg' },
    { id: 2, name: 'Pepsi 2l', price: 2600, wholesalePrice: 16500, wholesaleQty: 8, image: 'imagenes/pepsi 2l.jpg' },
    { id: 3, name: 'Secco 3L', price: 2400, wholesalePrice: 8000, wholesaleQty: 4, image: 'imagenes/secco 3l.jpg' },
    { id: 4, name: '7up 2L', price: 2600, wholesalePrice: 16500, wholesaleQty: 8, image: 'imagenes/7up 2.25l.jpg' },
    { id: 5, name: 'Vino viñas del balbo', price: 2800, wholesalePrice: 17000, wholesaleQty: 6, image: 'imagenes/vino viñas de balbo.jpg' },
    { id: 6, name: 'Cerveza quilmes', price: 3500, wholesalePrice: 35000, wholesaleQty: 12, image: 'imagenes/cerveza quilmes.jpg' },
    { id: 7, name: 'fanta', price: 3000, wholesalePrice: 22000, wholesaleQty: 8, image: 'imagenes/fanta 2l.jpg' }
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
            <img src="${p.image}" alt="${p.name}" style="width:100%; height:160px; object-fit:contain; border-radius:10px; margin-bottom:15px;">
            <h3>${p.name}</h3>
            <p class="price">$${p.price}</p>
        `;
        card.onclick = () => openModal(p);
        productList.appendChild(card);
    });

    function openModal(p) {
        modalDetail.innerHTML = `
            <img src="${p.image}" style="width:150px; margin-bottom:15px;">
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

    // 1. Empezamos el mensaje
        let texto = "Hola! Quisiera hacer este pedido:%0A%0A";

        // 2. Agregamos cada producto del carrito al texto
        cart.forEach((item) => {
            const detalle = item.isWholesale ? "Fardo" : "Unidad";
            // Usamos concatenación simple para evitar errores de teclado
            texto = texto + "- " + item.name + " (" + detalle + ")%0A";
        });

        // 3. Agregamos el total
        texto = texto + "%0A*Total: " + document.getElementById('cart-total').textContent + "*";

        // 4. Tu número (sin el símbolo +)
        const miNumero = "5493812232861"; 

        // 5. Abrimos el enlace
        window.open("https://wa.me/" + miNumero + "?text=" + texto, '_blank');
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

    // --- LÓGICA DEL BUSCADOR ---
    const searchInput = document.getElementById('product-search');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase(); // Lo que escribe el usuario
        const allCards = document.querySelectorAll('.product-card');

        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            // Si el título incluye lo que escribimos, se muestra; si no, se oculta
            if (title.includes(term)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
     // --- LÓGICA PARA MOSTRAR/OCULTAR PRECIOS ---
    const btnTogglePrices = document.getElementById('toggle-prices');
    let preciosVisibles = true; // Estado inicial

    btnTogglePrices.addEventListener('click', () => {
        // Seleccionamos todos los elementos que tengan la clase "price"
        const precios = document.querySelectorAll('.price');
        
        preciosVisibles = !preciosVisibles; // Cambiamos el estado (true a false o viceversa)

        precios.forEach(p => {
            // Si están visibles, los ocultamos; si no, los mostramos
            p.style.visibility = preciosVisibles ? "visible" : "hidden";
        });

        // Cambiamos el texto del botón para que el usuario sepa qué va a pasar
        btnTogglePrices.textContent = preciosVisibles ? "Ocultar Precios" : "Mostrar Precios";
    });
})
// --- EFECTO DE ESCRIBIR EN EL TÍTULO ---
    const tituloSobreNosotros = document.querySelector('.about-section h2');
    const textoOriginal = tituloSobreNosotros.innerHTML;
    tituloSobreNosotros.innerHTML = ""; // Lo vaciamos primero

    let i = 0;
    function escribirTitulo() {
        if (i < textoOriginal.length) {
            // Vamos sumando letra por letra al DOM
            tituloSobreNosotros.innerHTML = textoOriginal.substring(0, i + 1);
            i++;
            setTimeout(escribirTitulo, 50); // Velocidad de escritura
        } else {
            // Al terminar, nos aseguramos de restaurar el HTML (por si hay etiquetas <span>)
            tituloSobreNosotros.innerHTML = textoOriginal;
        }
    }

    // Iniciamos el efecto apenas carga la página
    escribirTitulo();