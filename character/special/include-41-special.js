/**
 * April Fool 2026 Special Logic
 * - 高画質化（50,000dpi）に伴うUIの動的制御
 * - モバイルメニュー、グリッチ演出、カウンター制御
 */

document.addEventListener("DOMContentLoaded", function() {
    initAprilFoolMenu();
    initAprilFoolEffects();
    updateAprilCounters();
});

/**
 * 1. エイプリルフール専用メニュー制御
 * ハンバーガーメニューの開閉とオーバレイの連動
 */
function initAprilFoolMenu() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!btn || !nav) return;

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        const isActive = btn.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        if (overlay) overlay.classList.toggle('is-active');
        
        // メニュー開閉時に背面スクロールを制御
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    btn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // ドロップダウン（スマホ版での挙動補助）
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // スマホ時はデフォルトのホバーが効かないため、クリックで挙動を制御したい場合ここに追加
            }
        });
    });
}

/**
 * 2. 異常検知・グリッチ演出
 * 画像クリックでのエラー表示や16bit退行
 */
function initAprilFoolEffects() {
    // 浮遊テキスト表示用
    window.showFloatingText = function(text, color, x, y) {
        const span = document.createElement('span');
        span.innerText = text;
        span.style.cssText = `
            position: fixed; 
            left: ${x}px; 
            top: ${y}px; 
            color: ${color}; 
            font-weight: bold; 
            z-index: 20000; 
            pointer-events: none; 
            animation: fadeOutUp 1s forwards; 
            text-shadow: 0 0 5px #000; 
            white-space: nowrap; 
            font-family: monospace;
        `;
        document.body.appendChild(span);
        setTimeout(() => span.remove(), 1000);
    };

    // グリッチアラート
    window.triggerGlitchedEffect = function(msg) {
        document.body.style.animation = "glitched 0.1s infinite";
        setTimeout(() => {
            alert(`[SYSTEM ERROR] ${msg}`);
            document.body.style.animation = "";
        }, 100);
    };

    // 16bit退行（低画質化）
    window.trigger16BitRegression = function() {
        const targetImgs = document.querySelectorAll('img');
        targetImgs.forEach(img => {
            img.style.imageRendering = "pixelated";
            img.style.filter = "contrast(2) sepia(1) brightness(0.5)";
        });
        
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.9); color:#f00; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:30000; font-family:monospace; text-align:center;";
        overlay.innerHTML = "<h1>CRITICAL ERROR</h1><p>RESOLUTION REGRESSION DETECTED.</p>";
        document.body.appendChild(overlay);
        
        setTimeout(() => location.reload(), 2000);
    };

    // 各要素へのバインド
    const mainImg = document.querySelector('.char-illust-img');
    if (mainImg) {
        let count = 0;
        mainImg.addEventListener('click', (e) => {
            count++;
            window.showFloatingText(`毛穴計数中... ${count}`, 'red', e.clientX, e.clientY);
            if (count > 15) {
                window.triggerGlitchedEffect("同時接続枠超過: 計測不能");
                count = 0;
            }
        });
    }

    const charName = document.querySelector('.char-name-ja');
    if (charName) {
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            window.trigger16BitRegression();
        });
    }
}

/**
 * 3. サーバーカウンター加速（演出）
 * 始動からの日数を「dpi」や「秒」として高速カウント
 */
function updateAprilCounters() {
    const dispHakoniwa = document.getElementById('disp-hakoniwa');
    const dispTotal = document.getElementById('disp-total');
    
    if (!dispHakoniwa) return;

    const startTime = new Date('2026-04-01T00:00:00').getTime();

    const update = () => {
        const now = Date.now();
        const diff = Math.max(0, now - startTime);
        const acceleratedVal = Math.floor(diff / 10); // 10msごとにカウント
        
        dispHakoniwa.innerHTML = `実体化進捗：<span class="counter-highlight" style="color:#f00; text-shadow:0 0 5px #f00;">${acceleratedVal.toLocaleString()}</span> accelerated`;
        
        if (dispTotal) {
            const density = acceleratedVal * 50;
            dispTotal.innerHTML = `蓄積情報密度: ${density.toLocaleString()} dpi`;
        }
    };

    setInterval(update, 50);
}

/**
 * 4. ロード画面解除
 */
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
            }, 600);
        }, 1200);
    }
});