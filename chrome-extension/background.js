// Create right-click menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addProduct",
        title: "Thêm sản phẩm vào Website",
        contexts: ["all"],
        documentUrlPatterns: ["*://*.kiotviet.vn/*"]
    });

    chrome.contextMenus.create({
        id: "addToMenu",
        parentId: "addProduct",
        title: "Thêm vào MENU",
        contexts: ["all"]
    });


    fetch("https://api.lamhystore.com/api/page/sections-all") // Replace with your actual API URL
        .then(response => response.json())
        .then(data => {
            data[0].sections.forEach(category => {
                chrome.contextMenus.create({
                    id: `addToSection_${category.id}`,
                    parentId: "addProduct",
                    title: `Thêm vào ${category.title.toUpperCase()}`,
                    contexts: ["all"]
                });
            });
        })
        .catch(error => console.error("Failed to fetch categories:", error));

    fetch("https://api.lamhystore.com/api/page/menu-all") // Replace with your actual API URL
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                chrome.contextMenus.create({
                    id: `addTo_${category.id}`,
                    parentId: "addToMenu",
                    title: `Thêm vào ${category.title.toUpperCase()}`,
                    contexts: ["all"]
                });

                if (category.sections.length > 0) {
                    category.sections.forEach(section => {
                        chrome.contextMenus.create({
                            id: `addToSection_${section.id}`,
                            parentId: `addTo_${category.id}`,
                            title: `Thêm vào ${section.title.toUpperCase()}`,
                            contexts: ["all"]
                        })

                    })
                }
            });
        })
        .catch(error => console.error("Failed to fetch categories:", error));


    fetch("https://api.lamhystore.com/api/page/bestseller-all") // Replace with your actual API URL
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                chrome.contextMenus.create({
                    id: `addTo_${category.id}`,
                    parentId: "addProduct",
                    title: `Thêm vào ${category.title.toUpperCase()}`,
                    contexts: ["all"]
                });

                if (category.sections.length > 0) {
                    category.sections.forEach(section => {
                        chrome.contextMenus.create({
                            id: `addToSection  _${section.id}`,
                            parentId: `addTo_${category.id}`,
                            title: `Thêm vào ${section.title.toUpperCase()}`,
                            contexts: ["all"]
                        })

                    })
                }
            });
        })
        .catch(error => console.error("Failed to fetch categories:", error));

});

// When right-click menu is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("addToSection_")) {
        let sectionId = info.menuItemId.replace("addToSection_", "");
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"] // Inject content script
        }).then(() => {
            // Send `sectionId` to content.js
            chrome.tabs.sendMessage(tab.id, { sectionId: sectionId });
        });;
    }
});

// Handle notifications
chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "success") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "https://cdn-icons-png.flaticon.com/512/148/148767.png",
            title: request.title,
            message: request.message
        });
    } else {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "https://cdn-icons-png.flaticon.com/512/6659/6659895.png",
            title: request.title,
            message: request.message
        });
    }
});
