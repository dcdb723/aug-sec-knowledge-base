// API基础URL - 支持分离部署
// 如果是在本地开发，使用相对路径，否则使用Render上的API地址
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '/api' 
                    : 'https://aug-sec-knowledge-base-server.onrender.com/api'; // 请替换为你的实际Render域名

// 添加调试日志
console.log('当前环境:', window.location.hostname);
console.log('使用API基础URL:', API_BASE_URL);

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchInput = document.querySelector('.search-box input');
    const topicsContainer = document.querySelector('.topics');
    const knowledgeCard = document.querySelector('.knowledge-card');
    const postsContainer = document.querySelector('.posts-container');
    const moreButton = document.querySelector('.more-button');
    
    // 保存原始placeholder
    const originalPlaceholder = searchInput.placeholder;
    
    // 处理输入框焦点事件 - 手动隐藏placeholder
    searchInput.addEventListener('focus', function() {
        this.placeholder = '';
    });
    
    // 处理输入框失焦事件 - 如无输入则恢复placeholder
    searchInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.placeholder = originalPlaceholder;
        }
    });
    
    // 页面初始化加载
    initializeApp();
    
    // 搜索功能
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchKnowledge(query);
            }
        }
    });
    
    // 更多按钮点击事件
    moreButton.addEventListener('click', function() {
        alert('在完整版本中，这里会显示更多相关文章');
    });
    
    // 功能函数
    
    // 初始化应用
    async function initializeApp() {
        try {
            showLoading(true);
            const initUrl = `${API_BASE_URL}/init`;
            console.log('正在请求初始化数据:', initUrl);
            
            const response = await fetch(initUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error('初始化请求失败:', response.status, response.statusText);
                throw new Error(`Failed to initialize app: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('获取到初始化数据:', data);
            
            // 显示热门话题
            displayTopics(data.popularTopics);
            
            // 显示默认知识项
            displayKnowledgeItem(data.defaultItem);
            
            showLoading(false);
        } catch (error) {
            console.error('初始化错误详情:', error);
            showLoading(false);
            showError(`无法加载初始数据，请刷新页面重试。错误: ${error.message}`);
            
            // 在出错时显示模拟数据
            displayFallbackData();
        }
    }
    
    // 如果API调用失败，显示模拟数据
    function displayFallbackData() {
        console.log('使用备用数据');
        
        // 模拟话题数据
        const mockTopics = [
            { name: "encryption", count: 145 },
            { name: "SSL", count: 92 },
            { name: "sql injection", count: 87 },
            { name: "XSS", count: 73 },
            { name: "authentication", count: 68 }
        ];
        
        // 显示模拟话题
        displayTopics(mockTopics);
        
        // 显示模拟知识项
        const mockItem = {
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
        };
        
        displayKnowledgeItem(mockItem);
    }
    
    // 显示热门话题
    function displayTopics(topics) {
        // 保存"Popular topics:"文本，防止被清空
        const popularTopicsSpan = topicsContainer.querySelector('span');
        const popularTopicsText = popularTopicsSpan ? popularTopicsSpan.textContent : 'Popular topics:';
        
        // 清除除第一个span以外的所有内容
        topicsContainer.innerHTML = '';
        
        // 重新添加"Popular topics:"文本
        const newSpan = document.createElement('span');
        newSpan.textContent = popularTopicsText;
        topicsContainer.appendChild(newSpan);
        
        // 添加话题链接
        topics.slice(0, 5).forEach((topic, index) => {
            // 添加空格
            topicsContainer.appendChild(document.createTextNode(' '));
            
            const topicLink = document.createElement('a');
            topicLink.href = '#';
            topicLink.className = 'topic';
            topicLink.textContent = topic.name;
            
            topicLink.addEventListener('click', function(e) {
                e.preventDefault();
                searchByTopic(topic.name);
            });
            
            topicsContainer.appendChild(topicLink);
            
            // 添加逗号分隔符，最后一个不添加
            if (index < 4) {
                topicsContainer.appendChild(document.createTextNode(','));
            }
        });
        
        // 添加省略号
        if (topics.length > 5) {
            topicsContainer.appendChild(document.createTextNode(' ...'));
        }
    }
    
    // 按主题搜索
    async function searchByTopic(topicName) {
        try {
            showLoading(true);
            const response = await fetch(`${API_BASE_URL}/topics/${encodeURIComponent(topicName)}`);
            if (!response.ok) throw new Error('Failed to fetch by topic');
            
            const results = await response.json();
            if (results.length > 0) {
                displayKnowledgeItem(results[0]);
            } else {
                showError(`未找到主题 "${topicName}" 的相关内容`);
            }
            showLoading(false);
        } catch (error) {
            console.error('Error searching by topic:', error);
            showLoading(false);
            showError('搜索主题时出错，请重试');
        }
    }
    
    // 搜索知识库
    async function searchKnowledge(query) {
        try {
            showLoading(true);
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            
            const results = await response.json();
            if (results.length > 0) {
                displayKnowledgeItem(results[0]);
            } else {
                showError('未找到相关内容，请尝试其他搜索词');
            }
            showLoading(false);
        } catch (error) {
            console.error('Search error:', error);
            showLoading(false);
            showError('搜索时出错，请重试');
        }
    }
    
    // 获取特定知识项
    async function fetchKnowledgeItem(id) {
        try {
            showLoading(true);
            const response = await fetch(`${API_BASE_URL}/knowledge/${id}`);
            if (!response.ok) throw new Error('Failed to fetch knowledge item');
            
            const item = await response.json();
            displayKnowledgeItem(item);
            showLoading(false);
        } catch (error) {
            console.error('Error fetching knowledge item:', error);
            showLoading(false);
            showError('加载内容时出错，请重试');
        }
    }
    
    // 显示知识项
    function displayKnowledgeItem(item) {
        // 更新搜索框内容
        searchInput.value = '';
        
        // 更新知识卡片内容
        document.querySelectorAll('.card-item').forEach(cardItem => {
            const labelElement = cardItem.querySelector('.label');
            const valueElement = cardItem.querySelector('.value');
            const label = labelElement.textContent.trim().replace(':', '');
            
            switch(label) {
                case 'Category':
                    valueElement.textContent = item.category;
                    break;
                case 'Challenges':
                    valueElement.textContent = item.challenges;
                    break;
                case 'Skills Required':
                    valueElement.textContent = item.skillsRequired;
                    break;
                case 'LLM solution':
                    valueElement.textContent = item.llmSolution;
                    break;
                case 'Similarity':
                    valueElement.textContent = item.similarity;
                    break;
                case 'Sentimental':
                    valueElement.textContent = item.sentimental;
                    break;
            }
        });
        
        // 更新相关文章
        updateRelatedPosts(item.relatedPosts);
    }
    
    // 更新相关文章区域
    function updateRelatedPosts(posts) {
        // 保存"更多"按钮
        const moreBtn = postsContainer.querySelector('.more-button');
        
        // 清空容器
        postsContainer.innerHTML = '';
        
        // 添加相关文章
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.textContent = post.title;
            
            // 添加点击事件，导航到相关链接
            postElement.addEventListener('click', () => {
                window.open(post.url, '_blank');
            });
            
            postsContainer.appendChild(postElement);
        });
        
        // 重新添加"更多"按钮
        postsContainer.appendChild(moreBtn);
    }
    
    // 显示加载状态
    function showLoading(isLoading) {
        if (isLoading) {
            document.body.classList.add('loading');
            
            // 如果加载时间超过300ms，显示加载指示器
            setTimeout(() => {
                if (document.body.classList.contains('loading')) {
                    document.body.classList.add('show-spinner');
                }
            }, 300);
        } else {
            document.body.classList.remove('loading');
            document.body.classList.remove('show-spinner');
        }
    }
    
    // 显示错误消息
    function showError(message) {
        alert(message);
    }
}); 