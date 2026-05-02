/**
 * April Fool 2026 Special Include Script v1.2.3
 */
document.addEventListener("DOMContentLoaded", function() {
    const cacheBuster = `?t=${new Date().getTime()}`;
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
            // 挿入直後にメニューイベントをバインド
            bindMenuEvents();
        }
        if (fp) {
            fp.innerHTML = footerData;
            updateServerCounters();
        }
        
        initProhibitedActions();
    }).catch(err => {
        console.error("Component load failed. Dynamic binding skipped.");
        // すでにHTMLに直接書かれている場合を考慮し、イベントバインドだけ試みる
        bindMenuEvents();
        updateServerCounters();
        initProhibitedActions();
    });
});

function bindMenuEvents() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');

    if (!btn || !nav || !overlay) return;

    // mod_pagespeed等の干渉を防ぐため、一度イベントをクリアしてから登録（簡易的）
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        const isActive = newBtn.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        overlay.classList.toggle('is-active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    newBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) e.preventDefault();
        });
    }
}

function updateServerCounters() {
    const dispHakoniwa = document.getElementById('disp-hakoniwa');
    const dispTotal = document.getElementById('disp-total');
    const startTime = new Date('2026-04-01T00:00:00').getTime();

    const update = () => {
        const now = Date.now();
        const diff = Math.max(0, now - startTime);
        const acceleratedSeconds = Math.floor(diff / 10); // 演出として少し調整
        
        if (dispHakoniwa) {
            dispHakoniwa.innerHTML = `実体化進捗：<span class="counter-highlight">${acceleratedSeconds.toLocaleString()}</span> sec accelerated`;
        }
        if (dispTotal) {
            const infoVolume = acceleratedSeconds * 50000;
            dispTotal.innerHTML = `蓄積情報密度: ${infoVolume.toLocaleString()} dpi`;
        }
    };
    setInterval(update, 50);
}

function initProhibitedActions() {
    const visual = document.querySelector('.char-visual-wrapper');
    const charName = document.querySelector('.char-name-ja');
    if (!visual) return;

    let poreCount = 0;
    visual.addEventListener('click', (e) => {
        poreCount++;
        const pos = e.touches ? e.touches[0] : e;
        showFloatingText(`毛穴計数中... ${poreCount}`, 'red', pos.clientX, pos.clientY);
        if (poreCount > 15) {
            triggerGlitchedEffect("同時接続枠超過");
            poreCount = 0;
        }
    });

    if (charName) {
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            trigger16BitRegression();
        });
    }
}

function showFloatingText(text, color, x, y) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = `position:fixed; left:${x}px; top:${y}px; color:${color}; font-weight:bold; z-index:20000; pointer-events:none; animation:fadeOutUp 1s forwards; text-shadow:0 0 5px #000; white-space:nowrap; font-family:monospace;`;
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
    if (img) {
        img.style.imageRendering = "pixelated";
        img.style.filter = "contrast(2) sepia(1) brightness(0.5)";
    }
    const msg = document.createElement('div');
    msg.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.95); color:#f00; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:30000; font-family:monospace; text-align:center;";
    msg.innerHTML = "<h1>CRITICAL ERROR</h1><p>解像度が退行しました。</p>";
    document.body.appendChild(msg);
    setTimeout(() => location.reload(), 2000);
}