// background.js

// Listen for messages from content scripts or popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "collectData") {
        const { source, data } = message.payload;
        saveData(source, data).then(() => {
            sendResponse({ status: "success" });
        });
        return true;
    } else if (message.action === "getData") {
        getData().then(data => {
            sendResponse({ data });
        });
        return true;
    }
});

async function saveData(source, data) {
    const timestamp = new Date().toISOString();
    const key = `${source}-data`;
    const existingData = await browser.storage.local.get(key);
    let updatedData = existingData[key] ? [...existingData[key], { timestamp, data }] : [{ timestamp, data }];
  
    // Limit to last 100 entries
    if (updatedData.length > 100) {
      updatedData = updatedData.slice(updatedData.length - 100);
    }
  
    await browser.storage.local.set({ [key]: updatedData });
  }

async function getData() {
    const website1Data = await browser.storage.local.get("website1-data");
    const website2Data = await browser.storage.local.get("website2-data");
    return {
        website1: website1Data["website1-data"] || [],
        website2: website2Data["website2-data"] || []
    };
}