/**
 * April Fool 2026 Special Include Script
 */
document.addEventListener("DOMContentLoaded", function() {
    // 特別なヘッダーの読み込み
    fetch('/common/header-41.html')
        .then(res => res.text())
        .then(data => {
            const hp = document.getElementById('header-placeholder');
            if (hp) { 
                hp.innerHTML = data; 
                // 既存のメニュー制御関数（通常版のJSにあるもの）を呼び出し
                if (typeof initMobileMenu === 'function') initMobileMenu(); 
            }
        }).catch(err => console.error("Special Header error:", err));

    // 特別なフッターの読み込み
    fetch('/common/footer-41.html')
        .then(res => res.text())
        .then(data => {
            const fp = document.getElementById('footer-placeholder');
            if (fp) { 
                fp.innerHTML = data; 
                // サーバーカウンター等の初期化
                updateServerCounters(); 
            }
        }).catch(err => console.error("Special Footer error:", err));
});

// サーバーカウンター（41周年風の嘘データなどを入れる用）
function updateServerCounters() {
    const dispHakoniwa = document.getElementById('disp-hakoniwa');
    if (dispHakoniwa) {
        dispHakoniwa.innerHTML = '実体化完了から <span class="counter-highlight">0</span> 日目';
    }
    const dispTotal = document.getElementById('disp-total');
    if (dispTotal) {
        dispTotal.innerHTML = '総ピクセル数: 30,105,600 px (L-size)';
    }
}