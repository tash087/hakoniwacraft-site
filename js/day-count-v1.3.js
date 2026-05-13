/**
 * 箱庭クラフト サーバーカウンター
 * 動的生成版 (v1.4)
 */

(function() {
    // 基準日
    const DATES = {
        total: new Date(2025, 7, 30),   // 2025/08/30
        hakoniwa: new Date(2025, 11, 21) // 2025/12/21
    };

    // 演出パターン
    const ROTATING_EFFECTS = [
        { emoji: '✨', message: '今日も楽しくクラフト！' },
        { emoji: '🏗️', message: '新しい建築に挑戦中！' },
        { emoji: '🤝', message: 'みんなで作る箱庭世界' },
        // ... 他のパターン（省略可、必要に応じて追加）
    ];

    let currentEffectIndex = 0;
    let intervals = [];
    let isVisible = false;

    // 日数計算
    function calculateDays(startDate) {
        const now = new Date();
        const diff = Math.floor((now - startDate) / 86400000);
        return diff > 0 ? diff : 0;
    }

    // 現在日時
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[now.getDay()];
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${year}年${month}月${day}日 (${weekday}) ${hours}:${minutes}:${seconds}`;
    }

    // カウンターHTMLを生成
    function generateCounterHTML(diffHako, diffTotal, effect) {
        return `
            <div id="disp-hakoniwa" class="server-counter-box reborn-days">
                🏠 箱庭クラフト 始動から <span class="counter-highlight">${diffHako}</span> 日目
                <br><small style="font-size:0.7rem; opacity:0.8;">✨ ${effect.message} ✨</small>
            </div>
            <div id="disp-total" class="server-counter-box">
                📜 サーバー開始通算 [tash鯖時代～] <span class="counter-highlight">${diffTotal}</span> 日
                <br><small style="font-size:0.7rem; opacity:0.8;">${effect.emoji} ${effect.message}</small>
            </div>
            <div id="disp-datetime" class="server-counter-box" style="font-size:0.7rem; opacity:0.6;">
                📅 ${getCurrentDateTime()}
            </div>
        `;
    }

    // カウンターを描画（初回＆演出切り替え時）
    function renderCounter() {
        const container = document.getElementById('server-counter-container');
        if (!container) return;

        const diffTotal = calculateDays(DATES.total);
        const diffHako = calculateDays(DATES.hakoniwa);
        const effect = ROTATING_EFFECTS[currentEffectIndex];

        container.innerHTML = generateCounterHTML(diffHako, diffTotal, effect);

        // アニメーション用クラスを付与
        const hakoDiv = document.getElementById('disp-hakoniwa');
        const totalDiv = document.getElementById('disp-total');
        if (hakoDiv) hakoDiv.classList.add('milestone-flash');
        if (totalDiv) totalDiv.classList.add('milestone-flash');
        setTimeout(() => {
            if (hakoDiv) hakoDiv.classList.remove('milestone-flash');
            if (totalDiv) totalDiv.classList.remove('milestone-flash');
        }, 300);
    }

    // 時刻更新のみ（秒単位）
    function updateDateTimeOnly() {
        const datetimeDiv = document.getElementById('disp-datetime');
        if (datetimeDiv) {
            datetimeDiv.innerHTML = `📅 ${getCurrentDateTime()}`;
        }
    }

    // 演出ローテーション
    function rotateEffect() {
        currentEffectIndex = (currentEffectIndex + 1) % ROTATING_EFFECTS.length;
        renderCounter();
    }

    // 初期化＆タイマー設定
    function initCounter() {
        const container = document.getElementById('server-counter-container');
        if (!container) {
            // コンテナが見つからない場合はリトライ（フッター未読込）
            setTimeout(initCounter, 500);
            return;
        }
        // 初回描画
        renderCounter();
        // 演出切り替え（30秒ごと）
        intervals.push(setInterval(rotateEffect, 30000));
        // 時刻更新（1秒ごと）
        intervals.push(setInterval(updateDateTimeOnly, 1000));
        isVisible = true;
    }

    // クリーンアップ（ページ離脱時）
    function cleanup() {
        intervals.forEach(interval => clearInterval(interval));
        intervals = [];
    }

    // DOM準備完了後に開始
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounter);
    } else {
        initCounter();
    }
    window.addEventListener('beforeunload', cleanup);
})();