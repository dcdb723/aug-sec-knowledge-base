// API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchInput = document.querySelector('.search-box input');
    const searchPlaceholder = searchInput.placeholder;
    const topicsContainer = document.querySelector('.topics');
    const knowledgeCard = document.querySelector('.knowledge-card');
    const postsContainer = document.querySelector('.posts-container');
    
    // 搜索框焦点处理
    searchInput.addEventListener('focus', function() {
        this.placeholder = '';
    });
    
    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = searchPlaceholder;
        }
    });

    // 加载热门话题
    fetchPopularTopics();
    
    // 搜索功能
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchKnowledge(query);
            }
        }
    });
    
    // 默认加载第一个知识项
    fetchKnowledgeItem(1);
    
    // 功能函数
    
    // 获取热门话题
    async function fetchPopularTopics() {
        try {
            const response = await fetch(`${API_BASE_URL}/topics`);
            if (!response.ok) throw new Error('Failed to fetch topics');
            
            const topics = await response.json();
            
            // 清除现有内容并保留"Popular topics:"文本
            const popularTopicsText = topicsContainer.firstChild;
            topicsContainer.innerHTML = '';
            topicsContainer.appendChild(popularTopicsText);
            
            // 添加话题链接
            topics.slice(0, 5).forEach((topic, index) => {
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
                    topicsContainer.appendChild(document.createTextNode(', '));
                }
            });
            
            // 添加省略号
            if (topics.length > 5) {
                topicsContainer.appendChild(document.createTextNode(' ...'));
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    }
    
    // 按主题搜索
    async function searchByTopic(topicName) {
        try {
            const response = await fetch(`${API_BASE_URL}/topics/${encodeURIComponent(topicName)}`);
            if (!response.ok) throw new Error('Failed to fetch by topic');
            
            const results = await response.json();
            if (results.length > 0) {
                displayKnowledgeItem(results[0]);
            } else {
                alert(`No results found for topic: ${topicName}`);
            }
        } catch (error) {
            console.error('Error searching by topic:', error);
        }
    }
    
    // 搜索知识库
    async function searchKnowledge(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            
            const results = await response.json();
            if (results.length > 0) {
                displayKnowledgeItem(results[0]);
            } else {
                alert('No results found. Please try a different search term.');
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }
    
    // 获取特定知识项
    async function fetchKnowledgeItem(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/knowledge/${id}`);
            if (!response.ok) throw new Error('Failed to fetch knowledge item');
            
            const item = await response.json();
            displayKnowledgeItem(item);
        } catch (error) {
            console.error('Error fetching knowledge item:', error);
        }
    }
    
    // 显示知识项
    function displayKnowledgeItem(item) {
        // 更新标题和搜索框
        searchInput.value = item.query;
        
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
        // 先移除所有现有的文章和"更多"按钮以外的元素
        const moreButton = document.querySelector('.more-button');
        while (postsContainer.firstChild) {
            postsContainer.removeChild(postsContainer.firstChild);
        }
        
        // 添加相关文章
        item.relatedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.textContent = post.title;
            
            // 添加点击事件，实际环境中会导航到相关链接
            postElement.addEventListener('click', () => {
                window.open(post.url, '_blank');
            });
            
            postsContainer.appendChild(postElement);
        });
        
        // 重新添加"更多"按钮
        postsContainer.appendChild(moreButton);
    }
}); 