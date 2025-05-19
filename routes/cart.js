const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 获取购物车商品
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: '未登录' });
    }
    
    db.all(`
        SELECT p.id, p.name, p.price, p.image_url, c.quantity 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `, [req.session.user.id], (err, items) => {
        if (err) {
            return res.status(500).json({ error: '数据库错误' });
        }
        res.json(items);
    });
});

// 添加到购物车
router.post('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: '未登录' });
    }
    
    const { productId } = req.body;
    
    // 检查商品是否存在
    db.get('SELECT id FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
            return res.status(400).json({ error: '商品不存在' });
        }
        
        // 检查是否已在购物车
        db.get('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', 
            [req.session.user.id, productId], (err, cartItem) => {
                if (err) {
                    return res.status(500).json({ error: '数据库错误' });
                }
                
                if (cartItem) {
                    // 已存在，增加数量
                    db.run('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', 
                        [cartItem.id], function(err) {
                            if (err) {
                                return res.status(500).json({ error: '数据库错误' });
                            }
                            res.json({ success: true });
                        });
                } else {
                    // 新添加
                    db.run('INSERT INTO cart (user_id, product_id) VALUES (?, ?)', 
                        [req.session.user.id, productId], function(err) {
                            if (err) {
                                return res.status(500).json({ error: '数据库错误' });
                            }
                            res.json({ success: true });
                        });
                }
            });
    });
});

// 更新购物车商品数量
router.put('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: '未登录' });
    }
    
    const { productId, action } = req.body;
    
    db.get('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', 
        [req.session.user.id, productId], (err, cartItem) => {
            if (err) {
                return res.status(500).json({ error: '数据库错误' });
            }
            
            if (!cartItem) {
                return res.status(400).json({ error: '商品不在购物车中' });
            }
            
            if (action === 'increase') {
                db.run('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', 
                    [cartItem.id], function(err) {
                        if (err) {
                            return res.status(500).json({ error: '数据库错误' });
                        }
                        res.json({ success: true });
                    });
            } else if (action === 'decrease') {
                if (cartItem.quantity <= 1) {
                    db.run('DELETE FROM cart WHERE id = ?', 
                        [cartItem.id], function(err) {
                            if (err) {
                                return res.status(500).json({ error: '数据库错误' });
                            }
                            res.json({ success: true });
                        });
                } else {
                    db.run('UPDATE cart SET quantity = quantity - 1 WHERE id = ?', 
                        [cartItem.id], function(err) {
                            if (err) {
                                return res.status(500).json({ error: '数据库错误' });
                            }
                            res.json({ success: true });
                        });
                }
            } else {
                res.status(400).json({ error: '无效操作' });
            }
        });
});

// 从购物车移除商品
router.delete('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: '未登录' });
    }
    const { productId } = req.body;
    db.run('DELETE FROM cart WHERE user_id = ? AND product_id = ?', 
    [req.session.user.id, productId], function(err) {
        if (err) {
            return res.status(500).json({ error: '数据库错误' });
        }
        res.json({ success: true });
    });
});

module.exports = router;