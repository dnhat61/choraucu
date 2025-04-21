let cart = [];

function updateCart() {
    const cartTable = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const checkoutButton = document.getElementById('checkout');

    cartTable.innerHTML = '';

    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;

        const row = cartTable.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <button onclick="changeQuantity(${index}, 'decrease')">-</button> 
                ${item.quantity} 
                <button onclick="changeQuantity(${index}, 'increase')">+</button>
            </td>
            <td>${item.price.toLocaleString()}đ</td>
            <td>${(item.price * item.quantity).toLocaleString()}đ</td>
            <td><button onclick="removeFromCart(${index})">Hủy</button></td>
        `;
    });

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        checkoutButton.style.display = 'none';
    } else {
        cartEmptyMessage.style.display = 'none';
        checkoutButton.style.display = 'inline-block';
    }
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'), 10);

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    });
});

function changeQuantity(index, action) {
    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease') {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1); // Xóa sản phẩm nếu số lượng giảm về 0
        }
    }

    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length > 0) {
        document.getElementById('payment').style.display = 'block';
        document.getElementById('cart-detail').style.display = 'none'; // Ẩn giỏ hàng khi vào thanh toán
    } else {
        alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ.");
    }
});

document.getElementById('payment-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const confirmPurchase = confirm(`Bạn có chắc chắn muốn thanh toán đơn hàng không?\nTổng tiền: ${totalAmount.toLocaleString()}đ`);
    if (!confirmPurchase) {
        alert("Đã hủy thanh toán.");
        document.getElementById('payment').style.display = 'none';
        document.getElementById('cart-detail').style.display = 'block'; // Hiện lại giỏ hàng
        return;
    }

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!name || !address || !phone || !paymentMethod) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    setTimeout(() => {
        alert(`Cảm ơn ${name}! Đơn hàng của bạn đã được thanh toán. Phương thức thanh toán: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán trực tuyến'}.`);

        document.getElementById('payment-result').style.display = 'block';
        document.getElementById('payment-form').style.display = 'none';

        cart = [];
        updateCart();
        document.getElementById('payment').style.display = 'none';
        document.getElementById('cart-detail').style.display = 'block';
    }, 2000);
});