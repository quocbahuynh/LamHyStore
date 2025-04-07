<p align="center">
  <img src="https://github.com/user-attachments/assets/e2adae83-27ed-4f58-bdbf-8ef696ce0342" width="200" alt="LamHyStore Logo" />
</p>

# LamHyStore - Chrome Extension

This is a companion productivity browser extension for LamHyStore administrators.

## Purpose

The extension bridges the gap between the **KiotViet POS system** and the LamHyStore frontend. It allows store administrators to quickly inject or categorize KiotViet products into specific Website Sections directly from their browser while managing their KiotViet dashboard.

## Features

- **Context Menu Integration:** Right-click on a product in KiotViet to add it directly to a LamHyStore website section.
- **Dynamic Configuration:** Automatically fetches active product categories and sections from your LamHyStore backend.
- **Cross-Origin Capability:** Configured with permissions to read data from `*.kiotviet.vn` and submit data to your backend API.

## How to Install (Developer Mode)

To use this extension, you must load it into Chrome locally:

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button.
4. Select this `chrome-extension` directory.
5. The **LamHy.Store Extension** will now appear in your browser!

## How it Works

1. **`background.js`**: Runs silently in the background. It periodically fetches your website's active sections/menus from `api.lamhystore.com` and populates the Chrome context (right-click) menus with those options.
2. **`content.js`**: Injected into KiotViet pages. When an admin clicks the custom context menu, it extracts the KiotViet product code from the page DOM and fires a PUT request to your backend (`api/extension/add-to-section`) to sync the product to your website.
