/**
 * April Fool 2026 Special Include Script v1.2.3
 * 修正版: 関数定義のホイスティング（巻き上げ）とエラーハンドリングを強化
 */

// --- 演出用関数を先に定義 (ReferenceError対策) ---

/** グリッチエフェクトの発動 */
window.triggerGlitchedEffect = function(msg) {
    document.body.style.animation = "glitched 0.1s infinite";
    setTimeout(() => {
        alert(`[ERROR] ${msg}`);
        document.body.style.animation = "";
    }, 100);
};

/** 16bit退行エフェクト */
window.trigger16BitRegression = function() {
    const img = document.querySelector('.char-illust-img');
    if (img) {
        img.style.imageRendering = "pixelated";
        img.style.filter = "contrast(2) sepia(1) brightness(0.5)";
    }
    const msg = document.createElement('div');
    msg.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.95); color:#f00; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:30000; font-family:monospace; text-align:center;";
    msg.innerHTML = "<h1>CRITICAL ERROR</h1><p>解像度が退行しました。</p>";
    document.body.appendChild(msg);
    setTimeout(() => location.reload(), 2000);
};

/** 浮遊テキストの表示 */
window.showFloatingText = function(text, color, x, y) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = `position:fixed; left:${x}px; top:${y}px; color:${color}; font-weight:bold; z-index:20000; pointer-events:none; animation:fadeOutUp 1s forwards; text-shadow:0 0 5px #000; white-space:nowrap; font-family:monospace;`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
};

// --- メイン処理 ---

document.addEventListener("DOMContentLoaded", function() {
    const cacheBuster = `?t=${new Date().getTime()}`;
    // バージョンを 1.0.3 に固定
    const HEADER_URL = 'https://uni-guild.com/common/header-41-v1.0.3.html' + cacheBuster;
    const FOOTER_URL = 'https://uni-guild.com/common/footer-41.html' + cacheBuster;

    Promise.all([
        fetch(HEADER_URL).then(res => res.ok ? res.text() : Promise.reject()),
        fetch(FOOTER_URL).then(res => res.ok ? res.text() : Promise.reject())
    ]).then(([headerData, footerData]) => {
        const hp = document.getElementById('header-placeholder');
        const fp = document.getElementById('footer-placeholder');

        if (hp) {
            hp.innerHTML = headerData;
            bindMenuEvents();
        }
        if (fp) {
            fp.innerHTML = footerData;
            updateServerCounters();
        }
        
        initProhibitedActions();
    }).catch(err => {
        console.error("Critical: Component loading failed.");
        // フォールバック
        bindMenuEvents();
        initProhibitedActions();
    });
});

function bindMenuEvents() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!btn || !nav || !overlay) return;

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        btn.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        overlay.classList.toggle('is-active');
    };

    btn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}

function initProhibitedActions() {
    const visual = document.querySelector('.char-visual-wrapper');
    if (!visual) return;

    let poreCount = 0;
    visual.addEventListener('click', (e) => {
        poreCount++;
        const pos = e.touches ? e.touches[0] : e;
        // グローバル関数として呼び出し
        window.showFloatingText(`毛穴計数中... ${poreCount}`, 'red', pos.clientX, pos.clientY);
        
        if (poreCount > 15) {
            window.triggerGlitchedEffect("同時接続枠超過: 計測を中止してください");
            poreCount = 0;
        }
    });

    const charName = document.querySelector('.char-name-ja');
    if (charName) {
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            window.trigger16BitRegression();
        });
    }
}

function updateServerCounters() {
    const dispHakoniwa = document.getElementById('disp-hakoniwa');
    if (!dispHakoniwa) return;
    
    setInterval(() => {
        const acceleratedSeconds = Math.floor((Date.now() - new Date('2026-04-01T00:00:00')) / 10);
        dispHakoniwa.innerHTML = `実体化進捗：<span class="counter-highlight">${acceleratedSeconds.toLocaleString()}</span> sec accelerated`;
    }, 50);
}