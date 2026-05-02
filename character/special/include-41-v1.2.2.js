/**
 * April Fool 2026 Special Include Script - URL Absolute Path Edition
 */
document.addEventListener("DOMContentLoaded", function() {
    // 【修正ポイント】相対パスから絶対URLに変更
    const HEADER_URL = 'https://uni-guild.com/common/header-41-v1.0.1.html';
    const FOOTER_URL = 'https://uni-guild.com/common/footer-41.html';

    // ヘッダー・フッターの読み込み
    Promise.all([
        fetch(HEADER_URL).then(res => {
            if (!res.ok) throw new Error('Header fetch failed');
            return res.text();
        }),
        fetch(FOOTER_URL).then(res => {
            if (!res.ok) throw new Error('Footer fetch failed');
            return res.text();
        })
    ]).then(([headerData, footerData]) => {
        // ヘッダー挿入
        const hp = document.getElementById('header-placeholder');
        if (hp) {
            hp.innerHTML = headerData;
            // メニューイベントのバインド（スマホ対応）
            bindMenuEvents();
        }

        // フッター挿入
        const fp = document.getElementById('footer-placeholder');
        if (fp) {
            fp.innerHTML = footerData;
            // カウンター開始
            updateServerCounters();
        }

        // 禁止事項（退化ギミック等）の初期化
        initProhibitedActions();

    }).catch(err => {
        console.error("Critical Loading Error:", err);
        // 万が一フェッチに失敗した時のためのエラー表示（特別仕様）
        const hp = document.getElementById('header-placeholder');
        if (hp) hp.innerHTML = '<div style="color:red; text-align:center; padding:10px; background:#000;">[SYSTEM ERROR] Loading Component Failed.</div>';
    });
});

/**
 * ハンバーガーメニューのバインド（スマホ・CSP対応）
 */
function bindMenuEvents() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');

    if (!btn || !nav || !overlay) return;

    // メニュー開閉のトグル関数
    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        const isActive = btn.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        overlay.classList.toggle('is-active');
        
        // メニューが開いている間は背面スクロールを禁止
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    // イベント登録
    btn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // スマホ版：親メニューのタップでページ遷移させない（展開用にする場合）
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
            }
        });
    }
}

/**
 * 爆速サーバーカウンター
 */
function updateServerCounters() {
    const dispHakoniwa = document.getElementById('disp-hakoniwa');
    const dispTotal = document.getElementById('disp-total');
    const startTime = new Date('2026-04-01T00:00:00').getTime();

    const update = () => {
        const now = Date.now();
        const diff = Math.max(0, now - startTime);
        const acceleratedSeconds = Math.floor(diff); 
        
        if (dispHakoniwa) {
            dispHakoniwa.innerHTML = `実体化進捗：<span class="counter-highlight">${acceleratedSeconds.toLocaleString()}</span> sec accelerated`;
        }
        if (dispTotal) {
            const infoVolume = acceleratedSeconds * 50000;
            dispTotal.innerHTML = `蓄積情報密度: ${infoVolume.toLocaleString()} dpi`;
        }
    };
    setInterval(update, 16);
}

/**
 * 禁止事項ギミック（スマホ対応版）
 */
function initProhibitedActions() {
    const visual = document.querySelector('.char-visual-wrapper');
    const charName = document.querySelector('.char-name-ja');
    if (!visual) return;

    // 1. 毛穴の計数
    let poreCount = 0;
    visual.addEventListener('click', (e) => {
        poreCount++;
        const touch = e.touches ? e.touches[0] : e;
        showFloatingText(`毛穴計数中... ${poreCount}`, 'red', touch.clientX, touch.clientY);
        if (poreCount > 10) {
            triggerGlitchedEffect("同時接続枠超過");
            poreCount = 0;
        }
    });

    // 2. 物理的接触（マウス移動/スワイプ）
    let moveCounter = 0;
    const handleMove = () => {
        moveCounter++;
        if (moveCounter > 150) {
            showFloatingText("☕ 缶コーヒー検知", "orange");
            visual.style.filter = "contrast(5) sepia(1)";
            setTimeout(() => visual.style.filter = "contrast(1.1)", 300);
            moveCounter = 0;
        }
    };
    visual.addEventListener('mousemove', handleMove);
    visual.addEventListener('touchmove', handleMove);

    // 3. 過去の否定（16bit退化）
    if (charName) {
        // 右クリック
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            trigger16BitRegression();
        });
        // スマホ長押し
        let longPressTimer;
        charName.addEventListener('touchstart', () => {
            longPressTimer = setTimeout(trigger16BitRegression, 800);
        });
        charName.addEventListener('touchend', () => clearTimeout(longPressTimer));
    }
}

// --- 演出用共通関数 ---
function showFloatingText(text, color, x, y) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = `position:fixed; left:${x}px; top:${y}px; color:${color}; font-weight:bold; z-index:20000; pointer-events:none; animation:fadeOutUp 1s forwards; text-shadow:0 0 5px #000; white-space:nowrap;`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
}

function triggerGlitchedEffect(msg) {
    document.body.style.animation = "glitched 0.1s infinite";
    setTimeout(() => {
        alert(`[ERROR] ${msg}`);
        document.body.style.animation = "";
    }, 100);
}

function trigger16BitRegression() {
    const img = document.querySelector('.char-illust-img');
    const visual = document.querySelector('.char-visual-wrapper');
    if (img) {
        img.style.imageRendering = "pixelated";
        img.style.filter = "contrast(2) sepia(1) brightness(0.5)";
        img.style.transform = "scale(1.2)";
        if(visual) visual.style.background = "#542e16";
    }

    const msg = document.createElement('div');
    msg.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.9); color:#f00; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:30000; font-family:monospace; text-align:center; padding:20px;";
    msg.innerHTML = "<h1>CRITICAL ERROR</h1><p>解像度が土ブロック(16bit)に退行しました。</p><p>REBOOTING...</p>";
    document.body.appendChild(msg);
    setTimeout(() => location.reload(), 3000);
}