let isInjected = false;

chrome.action.onClicked.addListener((tab) => {
    // 切换注入状态
    if (!isInjected) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        }).then(() => {
            isInjected = true;
        }).catch(err => {
            console.error("Failed to inject content script:", err);
        });
    } else {
        // 移除浮动窗口
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const existingDiv = document.querySelector("#floatingDiv");
                if (existingDiv) {
                    existingDiv.remove();
                    console.log("浮动窗口已移除");
                }
            }
        }).then(() => {
            isInjected = false;
        }).catch(err => {
            console.error("Failed to remove floating div:", err);
        });
    }
});
