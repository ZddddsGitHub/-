// 修改渲染逻辑
function renderProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            // 清空容器
            productGrid.innerHTML = '';
            
            // 去重处理
            const uniqueProducts = removeDuplicates(products, 'id');
            
            // 渲染唯一商品
            const liveProductsContainer = document.querySelector('.live-products-grid');
            if (liveProductsContainer) {
                liveProductsContainer.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">¥${product.price.toFixed(2)}</p>
                        <button class="btn add-to-cart" data-id="${product.id}">加入购物车</button>
                    </div>
                `).join('');
            }
        });
}

// 去重辅助函数
function removeDuplicates(array, key) {
    return array.filter((item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
}

// 页面加载时执行一次
document.addEventListener('DOMContentLoaded', renderProducts);
document.addEventListener('DOMContentLoaded', () => {
    // 加载商品
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.getElementById('productGrid');
            if (productGrid) {
                productGrid.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">¥${product.price.toFixed(2)}</p>
                        <p>${product.description}</p>
                        <button class="btn add-to-cart" data-id="${product.id}">加入购物车</button>
                    </div>
                `).join('');
                
                // 添加购物车事件
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        addToCart(productId);
                    });
                });
            }
        });
    
    // 直播间商品加载
    const liveProducts = document.getElementById('liveProducts');
    if (liveProducts) {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                liveProducts.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">¥${product.price.toFixed(2)}</p>
                        <button class="btn add-to-cart" data-id="${product.id}">加入购物车</button>
                    </div>
                `).join('');
                
                // 添加购物车事件
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        addToCart(productId);
                    });
                });
            });
    }
});

// 添加到购物车
function addToCart(productId) {
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('商品已添加到购物车');
        } else {
            alert('添加失败: ' + (data.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}