browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchTopics") {
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            return browser.tabs.sendMessage(tabs[0].id, { action: "fetchTopics" });
        }).then(response => {
            saveTopics(response.topics);
            sendResponse({ status: "success" });
        });
        return true;
    } else if (message.action === "getTopics") {
        getTopics().then(topics => {
            sendResponse({ topics });
        });
        return true;
    }
});

async function saveTopics(topics) {
    const data = await browser.storage.local.get("metaAdTopics");
    const history = data.metaAdTopics || [];
    history.push({
        timestamp: new Date().toISOString(),
        topics
    });
    await browser.storage.local.set({ metaAdTopics: history });
}

async function getTopics() {
    const data = await browser.storage.local.get("metaAdTopics");
    return data.metaAdTopics || [];
}