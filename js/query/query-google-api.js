// =========================================
// クエリパラメータ取得・保存API
// Google Apps Script連携版
// =========================================

// 基本機能（既存のコードを維持）
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getAllQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

// 追加機能：クエリを自動保存
function enableQueryTracking() {
    const params = getAllQueryParams();
    if (Object.keys(params).length > 0) {
        // クエリがある場合のみ保存
        fetch('https://script.google.com/macros/s/AKfycbwuuCsixKhC0CRNaI72KAWRKXptQHSSDLR2smUPlIOXyP1ZzTJOIdWPZuwfroxze6__/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: window.location.search,
                params: params,
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                referrer: document.referrer
            })
        });
    }
}

// ページ読み込み時に実行（オプション）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableQueryTracking);
} else {
    enableQueryTracking();
}