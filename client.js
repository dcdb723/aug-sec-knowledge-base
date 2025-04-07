// API基础URL
const API_BASE_URL = '/api';

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
            const response = await fetch(`${API_BASE_URL}/init`);
            if (!response.ok) throw new Error('Failed to initialize app');
            
            const data = await response.json();
            
            // 显示热门话题
            displayTopics(data.popularTopics);
            
            // 显示默认知识项
            displayKnowledgeItem(data.defaultItem);
            
            showLoading(false);
        } catch (error) {
            console.error('Initialization error:', error);
            showLoading(false);
            showError('无法加载初始数据，请刷新页面重试');
        }
    }
    
    // 显示热门话题
    function displayTopics(topics) {
        // 保存"Popular topics:"文本，防止被清空
        const popularTopicsSpan = topicsContainer.querySelector('span');
        const popularTopicsText = popularTopicsSpan.textContent;
        
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