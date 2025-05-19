document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    
    // 结算按钮
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('结算功能正在开发中');
        });
    }
});

function loadCartItems() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(cartItems => {
            const cartItemsContainer = document.getElementById('cartItems');
            const totalPriceElement = document.getElementById('totalPrice');
            
            if (cartItemsContainer) {
                if (cartItems.length === 0) {
                    cartItemsContainer.innerHTML = '<p>购物车是空的</p>';
                    totalPriceElement.textContent = '¥0.00';
                    return;
                }
                
                let totalPrice = 0;
                cartItemsContainer.innerHTML = cartItems.map(item => {
                    totalPrice += item.price * item.quantity;
                    return `
                        <div class="cart-item">
                            <img src="${item.image_url}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h3>${item.name}</h3>
                                <p>¥${item.price.toFixed(2)}</p>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                                    <button class="remove-btn" data-id="${item.id}">删除</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                totalPriceElement.textContent = `¥${totalPrice.toFixed(2)}`;
                
                // 添加数量按钮事件
                document.querySelectorAll('.quantity-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        const action = e.target.getAttribute('data-action');
                        updateCartItem(productId, action);
                    });
                });
                
                // 添加删除按钮事件
                document.querySelectorAll('.remove-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        removeCartItem(productId);
                    });
                });
            }
        });
}

function updateCartItem(productId, action) {
    fetch('/api/cart', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadCartItems();
        } else {
            alert('更新失败: ' + (data.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function removeCartItem(productId) {
    fetch('/api/cart', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadCartItems();
        } else {
            alert('删除失败: ' + (data.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}