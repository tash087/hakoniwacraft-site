// 再デプロイ後の新しいURLに変更してください
    const API_URL = 'https://script.google.com/macros/s/AKfycbwuuCsixKhC0CRNaI72KAWRKXptQHSSDLR2smUPlIOXyP1ZzTJOIdWPZuwfroxze6__/exec';
    
    // クエリを保存
    async function saveQuery() {
        const query = document.getElementById('queryInput').value;
        const id = document.getElementById('idInput').value;
        
        if (!query) {
            showMessage('内容を入力してください', 'error');
            return;
        }

        showMessage('保存中...', 'info');
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors', // ← CORSを回避（ただしレスポンスは取得できない）
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    id: id || '',
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });
            
            // mode: 'no-cors' の場合はレスポンスを読み取れない
            showMessage('✅ 保存リクエストを送信しました', 'success');
            document.getElementById('queryInput').value = '';
            document.getElementById('idInput').value = '';
            
            // 少し待ってから履歴を再読み込み
            setTimeout(() => loadQueries(), 1000);
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('エラー: ' + error.message, 'error');
        }
    }
    
    // 保存されたクエリ一覧を取得
    async function loadQueries() {
        try {
            // JSONP方式で取得（CORS回避）
            const callbackName = 'jsonp_callback_' + Date.now();
            
            const script = document.createElement('script');
            script.src = `${API_URL}?method=GET&callback=${callbackName}`;
            
            window[callbackName] = function(result) {
                const container = document.getElementById('queryList');
                
                if (result.success && result.data && result.data.length > 0) {
                    container.innerHTML = result.data.map(item => `
                        <div class="query-item">
                            <div class="query-date">📅 ${new Date(item.timestamp).toLocaleString()}</div>
                            <div><strong>ID:</strong> ${escapeHtml(item.id) || 'なし'}</div>
                            <div><strong>内容:</strong> ${escapeHtml(item.query)}</div>
                        </div>
                    `).join('');
                } else {
                    container.innerHTML = '<p>まだ保存されたデータはありません</p>';
                }
                
                delete window[callbackName];
                document.body.removeChild(script);
            };
            
            document.body.appendChild(script);
            
        } catch (error) {
            console.error('読み込みエラー:', error);
            document.getElementById('queryList').innerHTML = '<p>履歴の読み込みに失敗しました</p>';
        }
    }
    
    function showMessage(msg, type) {
        const div = document.getElementById('message');
        div.innerHTML = `<div class="${type}">${msg}</div>`;
        setTimeout(() => div.innerHTML = '', 3000);
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // ページ読み込み時に履歴を取得
    document.addEventListener('DOMContentLoaded', loadQueries);