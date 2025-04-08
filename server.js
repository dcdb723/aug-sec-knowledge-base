const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS配置，允许从GitHub Pages访问API
app.use(cors({
    origin: ['http://localhost:3000', 'https://dcdb723.github.io'], // 允许本地开发和GitHub Pages访问
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname))); // 使用根目录作为静态文件目录

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
    { name: "PHP", count: 145 },
    { name: "Java", count: 92 },
    { name: "Script", count: 87 }
];

// API路由

// 获取初始化数据（包含默认知识项和热门话题）
app.get('/api/init', (req, res) => {
    const initData = {
        defaultItem: knowledgeBase[0],
        popularTopics: popularTopics
    };
    res.json(initData);
});

// 获取热门话题
app.get('/api/topics', (req, res) => {
    res.json(popularTopics);
});

// 按主题筛选文章
app.get('/api/topics/:topicName', (req, res) => {
    const topicName = req.params.topicName.toLowerCase();
    // 这里应该有一个按主题过滤的逻辑
    // 简化示例中我们随机返回1-2个条目
    const filteredItems = knowledgeBase.filter(item => 
        item.category.toLowerCase().includes(topicName) || 
        item.skillsRequired.toLowerCase().includes(topicName) || 
        item.challenges.toLowerCase().includes(topicName)
    );
    
    if (filteredItems.length === 0) {
        // 如果没有找到相关结果，则至少返回一个默认条目
        filteredItems.push(knowledgeBase[0]);
    }
    
    res.json(filteredItems);
});

// 搜索知识库
app.get('/api/search', (req, res) => {
    const searchQuery = req.query.q?.toLowerCase() || '';
    
    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    // 将搜索词分割成单词数组
    const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
    
    // 在query字段中搜索匹配的文章
    const results = knowledgeBase.filter(item => {
        const itemWords = item.query.toLowerCase().split(/\s+/);
        // 检查搜索词是否在query中出现
        return searchWords.some(searchWord => 
            itemWords.some(itemWord => itemWord.includes(searchWord))
        );
    });
    
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
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 