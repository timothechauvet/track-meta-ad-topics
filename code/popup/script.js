document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const topicsList = document.getElementById('topicsList');
    
    function updateUI(topics) {
        topicsList.innerHTML = topics.length 
            ? `<ul>${topics.map(t => `<li>${t}</li>`).join('')}</ul>`
            : '<p>No topics found</p>';
    }

    fetchBtn.addEventListener('click', () => {
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            if (tabs[0].url.includes('accountscenter.instagram.com/ad_preferences')) {
                browser.runtime.sendMessage({ action: "fetchTopics" }).then(() => {
                    browser.runtime.sendMessage({ action: "getTopics" }).then(response => {
                        const latest = response.topics?.slice(-1)[0]?.topics || [];
                        updateUI(latest);
                    });
                });
            } else {
                topicsList.innerHTML = '<p>Please navigate to Instagram Ad Topics page first</p>';
            }
        });
    });

    // Load existing topics
    browser.runtime.sendMessage({ action: "getTopics" }).then(response => {
        const latest = response.topics?.slice(-1)[0]?.topics || [];
        updateUI(latest);
    });
});