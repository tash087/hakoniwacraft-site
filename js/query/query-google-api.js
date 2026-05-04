// =========================================
// クエリ保存共通ライブラリ
// 全ページで使用可能
// =========================================

// Google Apps ScriptのURL（あなたのものに変更）
const QUERY_SAVER_API = 'https://script.google.com/macros/s/AKfycbwuuCsixKhC0CRNaI72KAWRKXptQHSSDLR2smUPlIOXyP1ZzTJOIdWPZuwfroxze6__/exec';

// 現在のページのクエリパラメータを取得
function getCurrentQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// クエリを保存（現在のページ情報付き）
async function saveCurrentPageQuery(customData = {}) {
    const currentParams = getCurrentQueryParams();
    const pagePath = window.location.pathname;
    const pageTitle = document.title;
    
    const queryData = {
        page: pagePath,
        title: pageTitle,
        params: currentParams,
        url: window.location.href,
        referrer: document.referrer || '',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...customData
    };
    
    try {
        const response = await fetch(QUERY_SAVER_API, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: JSON.stringify(queryData), type: 'page_view' })
        });
        
        console.log('クエリ保存リクエスト送信済み:', pagePath);
        return { success: true };
    } catch (error) {
        console.error('クエリ保存エラー:', error);
        return { success: false, error: error.message };
    }
}

// 特定のアクションを保存（ボタンクリックなど）
async function saveAction(actionName, actionData = {}) {
    const actionLog = {
        action: actionName,
        data: actionData,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    try {
        await fetch(QUERY_SAVER_API, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: JSON.stringify(actionLog), type: 'action' })
        });
        console.log(`アクション "${actionName}" を記録しました`);
        return { success: true };
    } catch (error) {
        console.error('アクション記録エラー:', error);
        return { success: false, error: error.message };
    }
}

// ページロード時に自動記録（オプション）
function enableAutoPageTracking() {
    // ページ読み込み時に記録
    saveCurrentPageQuery({ event: 'page_load' });
    
    // 離脱時に記録（オプション）
    window.addEventListener('beforeunload', () => {
        saveCurrentPageQuery({ event: 'page_exit' });
    });
}

// URLパラメータを取得（既存のquery-google-api.jsの補完）
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// すべてのURLパラメータをオブジェクトで取得
function getAllQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

// クエリパラメータを監視して変更があれば保存
function watchQueryParams(callback) {
    let lastParams = getAllQueryParams();
    
    // ページ遷移（pushState）を監視
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    function checkChange() {
        const currentParams = getAllQueryParams();
        if (JSON.stringify(lastParams) !== JSON.stringify(currentParams)) {
            lastParams = currentParams;
            saveCurrentPageQuery({ event: 'query_change' });
            if (callback) callback(currentParams);
        }
    }
    
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        checkChange();
    };
    
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        checkChange();
    };
    
    window.addEventListener('popstate', checkChange);
}

// フォームの入力値を自動保存（オプション）
function autoSaveFormInputs(formSelector, saveDelay = 1000) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    let timeoutId;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                saveAction('form_input', { formId: form.id || 'unknown', data });
            }, saveDelay);
        });
    });
}

// 外部公開
window.QuerySaver = {
    savePage: saveCurrentPageQuery,
    saveAction: saveAction,
    enableTracking: enableAutoPageTracking,
    getParam: getQueryParam,
    getAllParams: getAllQueryParams,
    watchParams: watchQueryParams,
    autoSaveForm: autoSaveFormInputs,
    apiUrl: QUERY_SAVER_API
};