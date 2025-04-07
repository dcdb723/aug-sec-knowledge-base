document.addEventListener('DOMContentLoaded', function() {
    // 获取搜索框元素
    const searchInput = document.querySelector('.search-box input');
    const searchPlaceholder = searchInput.placeholder;
    
    // 搜索框焦点处理
    searchInput.addEventListener('focus', function() {
        this.placeholder = '';
    });
    
    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = searchPlaceholder;
        }
    });

    // Sample data that would be provided by the backend
    const mockData = {
        category: 'How - to',
        challenges: 'Risk of storing passwords in plain text or using weak hashing algorithms like MD5, vulnerability to rainbow table attacks, handling password resets securely',
        skillsRequired: 'bcrypt with password_hash(), avoid MD5, proper salt generation, secure comparison methods',
        llmSolution: 'Use password_hash() to deal with password storage, set proper cost factor, leverage secure comparison with password_verify(), implement proper password policies',
        similarity: '0.91 (Extremely similar)',
        sentimental: 'Easy to read, high level skilled required',
        relatedPosts: [
            { title: 'Best practices for secure password storage in PHP', url: '#' },
            { title: 'Why MD5 is not suitable for password hashing', url: '#' },
            { title: 'How to implement a secure password reset flow', url: '#' }
        ]
    };

    // Function to simulate receiving data from the server
    function simulateServerData() {
        // Update card data
        document.querySelectorAll('.card-item').forEach(item => {
            const label = item.querySelector('.label').textContent.trim().replace(':', '');
            
            switch(label) {
                case 'Category':
                    item.querySelector('.value').textContent = mockData.category;
                    break;
                case 'Challenges':
                    item.querySelector('.value').textContent = mockData.challenges;
                    break;
                case 'Skills Required':
                    item.querySelector('.value').textContent = mockData.skillsRequired;
                    break;
                case 'LLM solution':
                    item.querySelector('.value').textContent = mockData.llmSolution;
                    break;
                case 'Similarity':
                    item.querySelector('.value').textContent = mockData.similarity;
                    break;
                case 'Sentimental':
                    item.querySelector('.value').textContent = mockData.sentimental;
                    break;
            }
        });

        // Update related posts
        const posts = document.querySelectorAll('.post');
        posts.forEach((post, index) => {
            if (index < mockData.relatedPosts.length) {
                post.textContent = mockData.relatedPosts[index].title;
                post.addEventListener('click', () => {
                    // This would navigate to the post URL in a real implementation
                    console.log(`Navigating to: ${mockData.relatedPosts[index].url}`);
                });
            }
        });
    }

    // Search functionality (simulation)
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log(`Search query: ${searchInput.value}`);
            // In a real implementation, this would trigger a server request
            
            // For demo purposes, just show an alert
            alert(`Searching for: "${searchInput.value}"\nIn a real implementation, this would query the server.`);
        }
    });

    // Topic click handler
    document.querySelectorAll('.topic').forEach(topic => {
        topic.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Topic clicked: ${this.textContent}`);
            alert(`Selected topic: ${this.textContent}\nIn a real implementation, this would filter results by topic.`);
        });
    });
    
    // Initialize with mock data
    simulateServerData();
}); 