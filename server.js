const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 安全知识库数据 (在实际应用中应该使用数据库)
const knowledgeBase = [
    {
        id: 1,
        query: "How can I safely store passwords in PHP?",
        category: "How - to",
        challenges: "Risk of storing passwords in plain text or using weak hashing algorithms like MD5, vulnerability to rainbow table attacks, handling password resets securely",
        skillsRequired: "bcrypt with password_hash(), avoid MD5, proper salt generation, secure comparison methods",
        llmSolution: "Use password_hash() to deal with password storage, set proper cost factor, leverage secure comparison with password_verify(), implement proper password policies",
        similarity: "0.91 (Extremely similar)",
        sentimental: "Easy to read, high level skilled required",
        relatedPosts: [
            { title: "Best practices for secure password storage in PHP", url: "https://stackoverflow.com/questions/401656/secure-hash-and-salt-for-php-passwords" },
            { title: "Why MD5 is not suitable for password hashing", url: "https://stackoverflow.com/questions/2235158/php-md5-vs-sha1-vs-sha256-which-to-use-for-a-php-login" },
            { title: "How to implement a secure password reset flow", url: "https://stackoverflow.com/questions/1089760/how-to-implement-password-reset-feature" }
        ]
    },
    {
        id: 2,
        query: "How to prevent SQL injection in Java?",
        category: "How - to",
        challenges: "Malicious users can inject SQL code through user inputs, potential data breaches, database corruption",
        skillsRequired: "Prepared statements, parameterized queries, input validation, ORM frameworks",
        llmSolution: "Use PreparedStatement instead of Statement, leverage parameterized queries, implement proper input validation, consider using an ORM like Hibernate",
        similarity: "0.88 (Very similar)",
        sentimental: "Critical security concept, technical implementation",
        relatedPosts: [
            { title: "How to use PreparedStatement in Java to prevent SQL injection", url: "https://stackoverflow.com/questions/8263371/how-prepared-statements-can-protect-from-sql-injection-attacks" },
            { title: "Java ORM solutions for SQL injection prevention", url: "https://stackoverflow.com/questions/9109186/what-is-using-an-orm-more-specifically-hibernate-like" },
            { title: "Input validation techniques for security in Java", url: "https://stackoverflow.com/questions/3116162/what-are-good-ways-to-validate-input-in-java" }
        ]
    },
    {
        id: 3,
        query: "Cross Site Scripting prevention in JavaScript",
        category: "Prevention",
        challenges: "Attackers can inject client-side scripts, cookie theft, session hijacking, defacement",
        skillsRequired: "Input sanitization, content security policy, output encoding, DOM manipulation best practices",
        llmSolution: "Sanitize user inputs, implement Content-Security-Policy headers, use .textContent instead of .innerHTML where possible, encode user-generated content",
        similarity: "0.85 (Highly similar)",
        sentimental: "Advanced technique, implementation complexity medium",
        relatedPosts: [
            { title: "How to prevent XSS with Content Security Policy", url: "https://stackoverflow.com/questions/30280370/how-does-content-security-policy-csp-work" },
            { title: "Sanitizing user input for JavaScript applications", url: "https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery" },
            { title: "DOM-based XSS vulnerabilities and prevention", url: "https://stackoverflow.com/questions/3129899/what-are-the-common-defenses-against-xss" }
        ]
    }
];

// 热门话题
const popularTopics = [
    { name: "encryption", count: 145 },
    { name: "SSL", count: 92 },
    { name: "sql injection", count: 87 },
    { name: "XSS", count: 73 },
    { name: "authentication", count: 68 },
    { name: "CSRF", count: 52 }
];

// API路由

// 获取热门话题
app.get('/api/topics', (req, res) => {
    res.json(popularTopics);
});

// 按主题筛选文章
app.get('/api/topics/:topicName', (req, res) => {
    const topicName = req.params.topicName.toLowerCase();
    // 这里应该有一个按主题过滤的逻辑
    // 简化示例中我们随机返回1-2个条目
    const filteredItems = knowledgeBase.filter((_, index) => index % 2 === 0);
    res.json(filteredItems);
});

// 搜索知识库
app.get('/api/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    // 简单的模糊搜索 (真实应用中应使用更高级的搜索算法或全文搜索引擎如Elasticsearch)
    const results = knowledgeBase.filter(item => 
        item.query.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.challenges.toLowerCase().includes(query) ||
        item.skillsRequired.toLowerCase().includes(query)
    );
    
    res.json(results);
});

// 获取特定条目详情
app.get('/api/knowledge/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = knowledgeBase.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
});

// 为前端应用提供HTML
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 