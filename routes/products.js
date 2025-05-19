const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 获取所有商品
router.get('/', (req, res) => {
    db.all('SELECT DISTINCT * FROM products', [], (err, products) => { // 添加DISTINCT
        if (err) return res.status(500).json({ error: '数据库错误' });
        res.json(products);
    });
});

module.exports = router;