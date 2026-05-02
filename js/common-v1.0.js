/**
 * js/common.js
 */
const SHOP_CONFIG = {
    'main-shop': { title: "メイン商店街", rows: 60 },
    'gatya-shop': { title: "ガチャ商店街", rows: 12 }
};

// JSON読み込み (パス固定)
async function loadData() {
    try {
        const response = await fetch('../data/shop_data.json?t=' + Date.now());
        if (!response.ok) return {};
        return await response.json();
    } catch (e) {
        return {};
    }
}

// 保存 (admin/save.php を叩く)
async function saveData(allData) {
    try {
        const response = await fetch('../admin/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allData)
        });
        const result = await response.json();
        return result.success;
    } catch (e) {
        console.error("Save Error:", e);
        return false;
    }
}