// 检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    fetch('/auth/check')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                    window.location.href = '/';
                }
                const usernameDisplay = document.getElementById('usernameDisplay');
                if (usernameDisplay) {
                    usernameDisplay.textContent = `欢迎, ${data.user.username}`;
                }
            } else {
                if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    window.location.href = '/login';
                }
            }
        });
});

// 登录表单处理
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/';
            } else {
                const message = document.getElementById('message');
                message.textContent = data.error || '登录失败';
                message.className = 'message error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// 注册表单处理
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            const message = document.getElementById('message');
            message.textContent = '两次输入的密码不一致';
            message.className = 'message error';
            return;
        }
        
        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const message = document.getElementById('message');
                message.textContent = '注册成功，即将跳转到登录页面';
                message.className = 'message success';
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const message = document.getElementById('message');
                message.textContent = data.error || '注册失败';
                message.className = 'message error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// 登出功能
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetch('/auth/logout')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/login';
                }
            });
    });
}