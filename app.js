const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 会话管理
app.use(session({
    store: new SQLiteStore,
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

// 路由
app.use('/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// 视图路由
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/cart', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/live/:id', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'live.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});