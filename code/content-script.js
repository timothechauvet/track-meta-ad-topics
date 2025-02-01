// content-script.js
function extractTopics() {
    const topics = [];
    // Update this selector based on actual page structure
    document.querySelectorAll('[role="listitem"]').forEach(item => {
        const text = item.textContent.trim();
        if (text) topics.push(text);
    });
    return topics;
}

function simulateClicks() {
    return new Promise((resolve) => {
        const adTopicsBtn = [...document.querySelectorAll('div')].find(el =>
            /Ad topics|Sujets publicitaires/i.test(el.textContent)
        );

        if (adTopicsBtn) {
            adTopicsBtn.click();
            setTimeout(() => {
                const reviewBtn = [...document.querySelectorAll('div')].find(el =>
                    /Review topic choices|Voir les choix publicitaires/i.test(el.textContent)
                );
                if (reviewBtn) {
                    reviewBtn.click();
                    setTimeout(() => {
                        resolve(extractTopics());
                    }, 4000);
                }
            }, 1000);
        }
    });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchTopics") {
        simulateClicks().then(topics => {
            sendResponse({ topics });
        });
        return true;
    }
});