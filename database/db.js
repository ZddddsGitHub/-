const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/shopping.db');
const db = new sqlite3.Database(dbPath);

// 创建用户表
db.serialize(() => {
    db.run('DELETE FROM products'); 
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // 创建商品表
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        description TEXT,
        image_url TEXT,
        live_stream_id INTEGER
    )`);
    
    // 创建购物车表
    db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    )`);
    
    // 插入示例商品数据
    const products = [
        { name: '智能手机', price: 2999, description: '最新款智能手机', image_url: '/images/iPhone16.png', live_stream_id: 1 },
        { name: '无线耳机', price: 499, description: '高音质无线耳机', image_url: '/images/airpods.png', live_stream_id: 1 },
        { name: '智能手表', price: 1299, description: '多功能智能手表', image_url: '/images/smartwatch.png', live_stream_id: 1 }
    ];
    
    const stmt = db.prepare("INSERT INTO products (name, price, description, image_url, live_stream_id) VALUES (?, ?, ?, ?, ?)");
    products.forEach(product => {
        stmt.run(product.name, product.price, product.description, product.image_url, product.live_stream_id);
    });
    stmt.finalize();
});

module.exports = db;