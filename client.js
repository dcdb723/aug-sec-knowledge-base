// API基础URL - 支持分离部署
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? '/api' 
                    : 'https://aug-sec-knowledge-base-server.onrender.com/api';

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchInput = document.getElementById('searchInput');
    const relatedPosts = document.getElementById('relatedPosts');
    const knowledgeCard = document.getElementById('knowledgeCard');
    const knowledgeTitle = document.getElementById('knowledgeTitle');
    const knowledgeContent = document.getElementById('knowledgeContent');
    const knowledgeDate = document.getElementById('knowledgeDate');
    const backButton = document.getElementById('backButton');
    const topicsList = document.querySelector('.topics-list');
    
    // 获取安全信息相关的DOM元素
    const category = document.getElementById('category');
    const similarity = document.getElementById('similarity');
    const challenges = document.getElementById('challenges');
    const skills = document.getElementById('skills');
    const llmSolution = document.getElementById('llmSolution');
    const sentimental = document.getElementById('sentimental');

    // 初始状态：隐藏相关区域
    relatedPosts.style.display = 'none';
    knowledgeCard.style.display = 'none';

    // 获取并显示热门话题
    async function fetchAndDisplayTopics() {
        try {
            const response = await fetch(`${API_BASE_URL}/topics`);
            if (!response.ok) {
                throw new Error('Failed to fetch topics');
            }
            const topics = await response.json();
            
            // 显示热门话题
            topicsList.innerHTML = topics
                .map(topic => `<span class="topic">${topic.name}</span>`)
                .join('');
            
            // 为新添加的话题绑定点击事件
            attachTopicClickHandlers();
        } catch (error) {
            console.error('Error fetching topics:', error);
            topicsList.innerHTML = '<span class="error">Failed to load topics</span>';
        }
    }

    // 为话题添加点击事件处理
    function attachTopicClickHandlers() {
        document.querySelectorAll('.topic').forEach(topic => {
            topic.addEventListener('click', () => {
                const topicText = topic.textContent.toLowerCase();
                searchInput.value = topicText;
                relatedPosts.style.display = 'block';
                fetchMatchingPosts(topicText);
            });
        });
    }

    // 返回按钮点击事件
    backButton.addEventListener('click', () => {
        knowledgeCard.style.display = 'none';
        relatedPosts.style.display = 'block';
    });

    // 搜索框输入事件处理
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.trim().toLowerCase();
        
        if (searchText) {
            // 显示相关文章列表
            relatedPosts.style.display = 'block';
            // 获取并显示匹配的文章
            fetchMatchingPosts(searchText);
        } else {
            // 清空搜索框时隐藏相关区域
            relatedPosts.style.display = 'none';
            knowledgeCard.style.display = 'none';
        }
    });

    // 从服务器获取匹配的文章
    async function fetchMatchingPosts(searchText) {
        try {
            // 使用搜索API获取匹配的文章
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchText)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const posts = await response.json();
            
            // 如果没有找到匹配的文章
            if (!posts || posts.length === 0) {
                relatedPosts.innerHTML = '<div class="no-results">No related posts found.</div>';
                return;
            }
            
            displayPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            relatedPosts.innerHTML = '<div class="error-message">Failed to load data from server. Please try again later.</div>';
        }
    }

    // 显示文章列表
    function displayPosts(posts) {
        relatedPosts.innerHTML = posts.map(post => `
            <div class="related-post" data-id="${post.id}">
                <h3>${post.query}</h3>
                <p>${post.challenges.substring(0, 100)}...</p>
                <div class="post-meta">
                    <span class="category">${post.category}</span>
                </div>
            </div>
        `).join('');

        // 添加点击事件处理
        relatedPosts.querySelectorAll('.related-post').forEach(post => {
            post.addEventListener('click', () => {
                const postId = post.dataset.id;
                const selectedPost = posts.find(p => p.id === parseInt(postId));
                displayKnowledgeCard(selectedPost);
            });
        });
    }

    // 显示知识卡片
    function displayKnowledgeCard(post) {
        knowledgeCard.style.display = 'block';
        relatedPosts.style.display = 'none';
        
        // 设置基本信息
        knowledgeTitle.textContent = post.query;
        knowledgeContent.textContent = post.challenges;
        
        // 设置安全信息
        category.textContent = post.category;
        similarity.textContent = post.similarity;
        challenges.textContent = post.challenges;
        skills.textContent = post.skillsRequired;
        llmSolution.textContent = post.llmSolution;
        sentimental.textContent = post.sentimental;
    }

    // 初始化：获取热门话题
    fetchAndDisplayTopics();
}); 