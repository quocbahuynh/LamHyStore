document.addEventListener("contextmenu", (event) => {
    document.querySelectorAll("[data-right-clicked]").forEach(el => el.removeAttribute("data-right-clicked"));

    if (event.target && event.target instanceof HTMLElement) {
        event.target.setAttribute("data-right-clicked", "true");
        console.log("Right-clicked element:", event.target);
    }
});

function handleMessage(message, sender, sendResponse) {
    if (!message.sectionId) return;
    console.log("Received sectionId:", message.sectionId);

    let clickedElement = document.querySelector("[data-right-clicked='true']");
    if (!clickedElement) {
        chrome.runtime.sendMessage({ type: "failed", title: "Lỗi", message: "Không tìm thấy sản phẩm!" });
        return;
    }

    let productCode = clickedElement.innerText.trim();
    console.log("Selected product code:", productCode);

    fetch("https://api.lamhystore.com/api/extension/add-to-section/" + message.sectionId, {
        method: "PUT",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json-patch+json"
        },
        body: JSON.stringify({ productCode: productCode })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API response:", data);
        chrome.runtime.sendMessage({ type: "success", title: "Thành công", message: `Thêm sản phẩm thành công!` });

        // ✅ Remove `data-right-clicked` attribute after successful API response
        console.log("Removing data-right-clicked from:", clickedElement);
        clickedElement.removeAttribute("data-right-clicked");

        setTimeout(() => {
            if (clickedElement.hasAttribute("data-right-clicked")) {
                console.error("Attribute still exists! Forcing removal.");
                clickedElement.removeAttribute("data-right-clicked");
            } else {
                console.log("Attribute removed successfully.");
            }
        }, 100);
    })
    .catch(error => {
        console.error("API error:", error);
        chrome.runtime.sendMessage({ type: "failed", title: "Thất bại", message: `Đã có lỗi xảy ra!` });
    });
}

// ✅ Prevent multiple event registrations using a global flag
if (!window.hasAddedListener) {
    chrome.runtime.onMessage.addListener(handleMessage);
    window.hasAddedListener = true; // Set flag to prevent duplicate registrations
}
