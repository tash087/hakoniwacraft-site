(function() {
    // 基準日
    const DATES = {
        total: new Date(2025, 7, 30),  // 2025/08/30 (tash鯖時代開始)
        hakoniwa: new Date(2025, 11, 21) // 2025/12/21 (箱庭クラフト始動)
    };
    
    // 演出パターン（記念日用）
    const MILESTONES = {
        30: { emoji: '🌱', message: '1ヶ月達成！' },
        60: { emoji: '🌿', message: '2ヶ月達成！' },
        90: { emoji: '🍃', message: '3ヶ月達成！' },
        100: { emoji: '🎉', message: '100日達成！' },
        120: { emoji: '🌻', message: '4ヶ月達成！' },
        150: { emoji: '⭐', message: '5ヶ月達成！' },
        180: { emoji: '🏆', message: '半年達成！' },
        200: { emoji: '🎊', message: '200日達成！' },
        210: { emoji: '🌸', message: '7ヶ月達成！' },
        240: { emoji: '🍂', message: '8ヶ月達成！' },
        270: { emoji: '🍁', message: '9ヶ月達成！' },
        300: { emoji: '✨', message: '300日達成！' },
        330: { emoji: '❄️', message: '11ヶ月達成！' },
        365: { emoji: '🎂', message: '1周年！！！' },
        400: { emoji: '🔥', message: '400日突破！' },
        500: { emoji: '💎', message: '500日達成！' },
        730: { emoji: '🎈', message: '2周年！' },
        1000: { emoji: '🏅', message: '1000日達成！' }
    };
    
    // 常時演出パターン（ランダムに切り替わる）
    const ROTATING_EFFECTS = [
        { emoji: '✨', message: '今日も楽しくクラフト！' },
        { emoji: '🏗️', message: '新しい建築に挑戦中！' },
        { emoji: '🤝', message: 'みんなで作る箱庭世界' },
        { emoji: '💎', message: '素敵な思い出を共有しよう' },
        { emoji: '🌟', message: 'あなたのアイデアが形に' },
        { emoji: '🎨', message: '創造する喜びを感じて' },
        { emoji: '🏡', message: '第二の家のようなサーバー' },
        { emoji: '⚡', message: '快適なプレイ環境を提供' },
        { emoji: '🎵', message: '素敵な時間をお過ごしください' },
        { emoji: '🌈', message: '毎日が新しい発見' },
        { emoji: '🍀', message: '幸運をあなたに' },
        { emoji: '⭐', message: 'あなたの参加をお待ちしてます' },
        { emoji: '🎪', message: '楽しく交流！' },
        { emoji: '🏆', message: 'ランクアップを目指そう' },
        { emoji: '💬', message: 'Discordで会話しよう' }
    ];
    
    let currentEffectIndex = 0;
    let rotatingInterval = null;
    
    // 日数計算
    function calculateDays(startDate) {
        const now = new Date();
        const diff = Math.floor((now - startDate) / 86400000);
        return diff > 0 ? diff : 0;
    }
    
    // 現在日時を詳細表示
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
    
    // 記念日メッセージを取得
    function getMilestoneMessage(days) {
        if (MILESTONES[days]) {
            return MILESTONES[days];
        }
        return null;
    }
    
    // 通常表示（日数のみ）
    function displayBase(diffHako, diffTotal) {
        const areaHako = document.getElementById('disp-hakoniwa');
        const areaTotal = document.getElementById('disp-total');
        
        if (!areaHako || !areaTotal) return;
        
        const hakoMilestone = getMilestoneMessage(diffHako);
        const totalMilestone = getMilestoneMessage(diffTotal);
        
        // 箱庭クラフト表示（日数のみ）
        if (hakoMilestone) {
            areaHako.setAttribute('data-base', `🎉 ${hakoMilestone.emoji} <span class="counter-highlight">${diffHako}</span> 日目！ ${hakoMilestone.message} 🎉`);
        } else {
            areaHako.setAttribute('data-base', `🏠 箱庭クラフト 始動から <span class="counter-highlight">${diffHako}</span> 日目`);
        }
        
        // 通算表示（日数のみ）
        if (totalMilestone) {
            areaTotal.setAttribute('data-base', `📜 ${totalMilestone.emoji} サーバー開始通算 ${diffTotal} 日 (${totalMilestone.message})`);
        } else {
            areaTotal.setAttribute('data-base', `📜 サーバー開始通算 [tash鯖時代～] ${diffTotal} 日`);
        }
    }
    
    // 演出を表示（日数＋演出メッセージ）
    function displayWithEffect(diffHako, diffTotal, effect) {
        const areaHako = document.getElementById('disp-hakoniwa');
        const areaTotal = document.getElementById('disp-total');
        const areaDateTime = document.getElementById('disp-datetime');
        
        if (!areaHako || !areaTotal) return;
        
        // 日数情報を保持
        const hakoMilestone = getMilestoneMessage(diffHako);
        const totalMilestone = getMilestoneMessage(diffTotal);
        
        // 箱庭クラフト表示（日数＋演出メッセージ）
        if (hakoMilestone) {
            areaHako.innerHTML = `🎉 ${hakoMilestone.emoji} <span class="counter-highlight">${diffHako}</span> 日目！ ${hakoMilestone.message} 🎉`;
        } else {
            areaHako.innerHTML = `🏠 箱庭クラフト 始動から <span class="counter-highlight">${diffHako}</span> 日目<br><small style="font-size:0.7rem; opacity:0.8;">✨ ${effect.message} ✨</small>`;
        }
        
        // 通算表示（日数＋演出メッセージ）
        if (totalMilestone) {
            areaTotal.innerHTML = `📜 ${totalMilestone.emoji} サーバー開始通算 ${diffTotal} 日 (${totalMilestone.message})`;
        } else {
            areaTotal.innerHTML = `📜 サーバー開始通算 [tash鯖時代～] ${diffTotal} 日<br><small style="font-size:0.7rem; opacity:0.8;">${effect.emoji} ${effect.message}</small>`;
        }
        
        // 詳細日時表示
        if (areaDateTime) {
            areaDateTime.innerHTML = `📅 ${getCurrentDateTime()}`;
        }
    }
    
    // 演出を切り替え（常時変化）
    function rotateEffect() {
        const diffTotal = calculateDays(DATES.total);
        const diffHako = calculateDays(DATES.hakoniwa);
        
        const areaHako = document.getElementById('disp-hakoniwa');
        const areaTotal = document.getElementById('disp-total');
        
        if (!areaHako || !areaTotal) return;
        
        // 記念日チェック（記念日の場合は優先）
        const hakoMilestone = getMilestoneMessage(diffHako);
        const totalMilestone = getMilestoneMessage(diffTotal);
        
        if (hakoMilestone || totalMilestone) {
            // 記念日用の特別表示
            if (hakoMilestone) {
                areaHako.innerHTML = `🎉 ${hakoMilestone.emoji} <span class="counter-highlight">${diffHako}</span> 日目！ ${hakoMilestone.message} 🎉`;
            } else {
                areaHako.innerHTML = `🏠 箱庭クラフト 始動から <span class="counter-highlight">${diffHako}</span> 日目`;
            }
            
            if (totalMilestone) {
                areaTotal.innerHTML = `📜 ${totalMilestone.emoji} サーバー開始通算 ${diffTotal} 日 (${totalMilestone.message})`;
            } else {
                areaTotal.innerHTML = `📜 サーバー開始通算 [tash鯖時代～] ${diffTotal} 日<br><small style="font-size:0.7rem; opacity:0.8;">🎉 記念日おめでとう！ 🎉</small>`;
            }
            
            // 記念日演出中もカウンターは続けるが、演出は一時停止
            return;
        }
        
        // 通常演出：次のパターンに切り替え
        currentEffectIndex = (currentEffectIndex + 1) % ROTATING_EFFECTS.length;
        const effect = ROTATING_EFFECTS[currentEffectIndex];
        
        // アニメーション効果（一瞬光る）
        areaHako.classList.add('milestone-flash');
        areaTotal.classList.add('milestone-flash');
        
        // 演出表示
        displayWithEffect(diffHako, diffTotal, effect);
        
        // フラッシュクラスを削除（アニメーションリセット用）
        setTimeout(() => {
            areaHako.classList.remove('milestone-flash');
            areaTotal.classList.remove('milestone-flash');
        }, 300);
    }
    
    // 日付・時刻の更新（秒単位）
    function updateDateTime() {
        const areaDateTime = document.getElementById('disp-datetime');
        if (areaDateTime) {
            areaDateTime.innerHTML = `📅 ${getCurrentDateTime()}`;
        }
    }
    
    // メイン更新処理（日数更新が必要な時のみ）
    function updateDaysIfNeeded() {
        const diffTotal = calculateDays(DATES.total);
        const diffHako = calculateDays(DATES.hakoniwa);
        
        const areaHako = document.getElementById('disp-hakoniwa');
        const areaTotal = document.getElementById('disp-total');
        
        if (!areaHako || !areaTotal) return;
        
        // 保存された日数と比較して変わった場合のみ更新
        const currentHako = areaHako.getAttribute('data-days-hako');
        const currentTotal = areaTotal.getAttribute('data-days-total');
        
        if (currentHako != diffHako || currentTotal != diffTotal) {
            areaHako.setAttribute('data-days-hako', diffHako);
            areaTotal.setAttribute('data-days-total', diffTotal);
            
            // 日数が変わったらベース表示を更新
            const hakoMilestone = getMilestoneMessage(diffHako);
            const totalMilestone = getMilestoneMessage(diffTotal);
            
            if (!hakoMilestone && !totalMilestone) {
                // 演出中でなければ表示を更新
                displayWithEffect(diffHako, diffTotal, ROTATING_EFFECTS[currentEffectIndex]);
            }
        }
    }
    
    // 初期表示
    function init() {
        const diffTotal = calculateDays(DATES.total);
        const diffHako = calculateDays(DATES.hakoniwa);
        
        const areaHako = document.getElementById('disp-hakoniwa');
        const areaTotal = document.getElementById('disp-total');
        
        if (areaHako) areaHako.setAttribute('data-days-hako', diffHako);
        if (areaTotal) areaTotal.setAttribute('data-days-total', diffTotal);
        
        // ランダムな開始インデックス
        currentEffectIndex = Math.floor(Math.random() * ROTATING_EFFECTS.length);
        
        // 初期表示
        rotateEffect();
        
        // 演出切り替え（3秒ごとに変化）
        rotatingInterval = setInterval(rotateEffect, 600000);
        
        // 日付・時刻更新（1秒ごと）
        setInterval(updateDateTime, 600000);
        
        // 日数チェック（10分ごと）
        setInterval(updateDaysIfNeeded, 600000);
    }
    
    // スタート
    init();
    
    // ページロード時にも再実行
    window.addEventListener('load', () => {
        updateDateTime();
        updateDaysIfNeeded();
    });
    
    // スタイルを動的に追加
    const style = document.createElement('style');
    style.textContent = `
        .milestone-flash {
            animation: milestoneGlow 0.3s ease-in-out;
        }
        @keyframes milestoneGlow {
            0% { text-shadow: 0 0 0px rgba(230, 126, 34, 0); background-color: transparent; }
            50% { text-shadow: 0 0 15px rgba(230, 126, 34, 0.8); background-color: rgba(230, 126, 34, 0.15); border-radius: 12px; }
            100% { text-shadow: 0 0 0px rgba(230, 126, 34, 0); background-color: transparent; }
        }
        .counter-highlight {
            font-weight: bold;
            color: var(--primary-color, #e67e22);
            font-size: 1.2em;
            display: inline-block;
            min-width: 60px;
            text-align: center;
            transition: all 0.3s ease;
        }
        #disp-datetime {
            font-size: 0.8rem;
            color: var(--light-text, #888);
            margin-top: 8px;
            text-align: center;
            font-family: monospace;
        }
        .server-counter-box {
            transition: all 0.3s ease;
            padding: 4px 8px;
            display: inline-block;
            width: 100%;
            text-align: center;
        }
        .server-counter-box small {
            display: block;
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);
})();