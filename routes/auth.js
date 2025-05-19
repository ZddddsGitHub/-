const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcryptjs');

// 注册
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: '用户名已存在' });
                }
                res.json({ success: true, userId: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: '服务器错误' });
    }
});

// 登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: '用户名或密码错误' });
        }
        
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                };
                return res.json({ success: true });
            } else {
                return res.status(400).json({ error: '用户名或密码错误' });
            }
        } catch (error) {
            res.status(500).json({ error: '服务器错误' });
        }
    });
});

// 登出
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// 检查登录状态
router.get('/check', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;