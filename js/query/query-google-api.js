// =========================================
// クエリパラメータ取得・保存API
// Google Apps Script連携版（ID/内容区別）
// =========================================

// ★ ここにデプロイ後の新しいURLを入れてください ★
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxJh_fqcUNKMrdkrE7b4XJEVDtWP5txy5-Sqewe0yQyfvifGVoQmZUeL50Q79zLH2I/exec';

// 基本機能：パラメータを取得
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getAllQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

// クエリをパラメータ単位で分解して保存
async function saveQueryParams() {
    const params = getAllQueryParams();
    const paramKeys = Object.keys(params);
    
    if (paramKeys.length === 0) {
        console.log('保存するクエリパラメータがありません');
        return;
    }

    const pagePath = window.location.pathname;
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    const fullQuery = window.location.search;

    // 各パラメータを個別に保存
    for (const [id, content] of Object.entries(params)) {
        const postData = {
            id: id,
            content: content,
            page: pagePath,
            userAgent: userAgent,
            referrer: referrer,
            fullQuery: fullQuery,
            timestamp: new Date().toISOString()
        };
        
        try {
            await fetch(GAS_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            console.log(`✅ 保存成功: ID=${id}, 内容=${content}`);
        } catch (err) {
            console.error(`❌ 保存エラー (${id}):`, err);
        }
    }
}

// 保存されたデータを取得
async function loadSavedQueries(limit = 50) {
    try {
        const response = await fetch(`${GAS_API_URL}?method=GET`);
        const result = await response.json();
        
        if (result.success && result.data) {
            return result.data.slice(0, limit);
        }
        return [];
    } catch (error) {
        console.error('データ取得エラー:', error);
        return [];
    }
}

// ページ読み込み時に自動実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', saveQueryParams);
} else {
    saveQueryParams();
}

// 外部公開（他のスクリプトから呼び出せるように）
window.QueryAPI = {
    save: saveQueryParams,
    load: loadSavedQueries,
    getParam: getQueryParam,
    getAllParams: getAllQueryParams
};