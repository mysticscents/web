// Función para limpiar el carrito de productos con información nula
function cleanCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id && product.name && product.price && product.image);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para abrir el modal
function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    if (modal) {
        modal.classList.add('active');
        updateCartModal();
    }
}

// Función para cerrar el modal
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
    }
}

// Función para agregar un producto al carrito
function addToCart(productInfo) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(product => product.id === productInfo.id);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        productInfo.quantity = 1;
        cart.push(productInfo);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Producto agregado al carrito:', productInfo);
}

// Función para actualizar el modal del carrito
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cartItemsContainer.innerHTML = '';

    cart.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('modal__item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="modal__thumb">
            <div class="modal__text-product">
                <p><strong>${product.name}</strong></p>
                <p>₡${product.price}</p>
                <p>Cantidad: ${product.quantity}</p>
            </div>
            <button class="modal__btn-remove" data-product-id="${product.id}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(productElement);
    });

    const subtotal = cart.reduce((acc, product) => acc + parseFloat(product.price) * product.quantity, 0);
    document.getElementById('cartSubtotal').textContent = `₡${subtotal.toFixed(2)}`;
    document.getElementById('cartDiscount').textContent = `₡0.00`;
    document.getElementById('cartTotal').textContent = `Total: ₡${subtotal.toFixed(2)}`;

    document.querySelectorAll('.modal__btn-remove').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Función para eliminar una unidad de un producto del carrito
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartModal();
}

// Llama a cleanCart al cargar la página o al abrir el modal
document.addEventListener('DOMContentLoaded', () => {
    cleanCart();

    const goToCartButton = document.querySelector('.btn-cart');
    if (goToCartButton) {
        goToCartButton.addEventListener('click', () => {
            openModal('#jsModalCarrito');
        });
    }

    const buyNowButton = document.querySelector('.btn-primary');
    if (buyNowButton) {
        buyNowButton.addEventListener('click', () => {
            redirectToWhatsApp();
        });
    }
});

const addToCartButtons = document.querySelectorAll('.cartBtn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        const productName = button.getAttribute('data-product-name');
        const productPrice = button.getAttribute('data-product-price');
        const productImage = button.getAttribute('data-product-image');
        
        const productInfo = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        };

        addToCart(productInfo);
        const modalSelector = button.getAttribute('data-modal');
        openModal(modalSelector);
    });
});

const closeModalButtons = document.querySelectorAll('.jsModalClose');
closeModalButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = event.target.closest('.modal');
        closeModal(modal);
    });
});

window.addEventListener('click', (event) => {
    const modal = document.querySelector('.modal.active');
    if (modal && event.target === modal) {
        closeModal(modal);
    }
});

let currentSlide = 1;
const totalSlides = 2;
const intervalTime = 8000;

function nextSlide() {
    currentSlide = (currentSlide % totalSlides) + 1;
    document.getElementById(`slide${currentSlide}`).checked = true;
}

setInterval(nextSlide, intervalTime);

function redirectToWhatsApp() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const phoneNumber = '+50662333599';

    let message = 'Hola, me gustaría comprar los siguientes productos:\n';
    cart.forEach(product => {
        message += `${product.name} - ₡${product.price} x ${product.quantity}\n`;
    });

    const total = cart.reduce((acc, product) => acc + parseFloat(product.price) * product.quantity, 0);
    message += `Total: ₡${total.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

