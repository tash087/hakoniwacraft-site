/**
 * April Fool 2026 Special Include Script - Final Overload Edition
 */
document.addEventListener("DOMContentLoaded", function() {
    // ヘッダー・フッターの読み込み
    Promise.all([
        fetch('/common/header-41.html').then(res => res.text()),
        fetch('/common/footer-41.html').then(res => res.text())
    ]).then(([headerData, footerData]) => {
        const hp = document.getElementById('header-placeholder');
        const fp = document.getElementById('footer-placeholder');
        if (hp) hp.innerHTML = headerData;
        if (fp) {
            fp.innerHTML = footerData;
            updateServerCounters();
        }
        // 要素がDOMに注入された後に禁止事項を初期化
        initProhibitedActions();
    }).catch(err => console.error("Loading Error:", err));
});

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

function initProhibitedActions() {
    // 画像エリアと名前を取得
    const visual = document.querySelector('.char-visual-wrapper');
    const charName = document.querySelector('.char-name-ja');

    if (!visual) return;

    // 1. 毛穴の計数（クリック）
    let poreCount = 0;
    visual.addEventListener('click', (e) => {
        poreCount++;
        showFloatingText(`毛穴計数中... ${poreCount} / 50,000dpi`, 'red', e.clientX, e.clientY);
        if (poreCount > 10) {
            triggerGlitchedEffect("サーバー同時接続枠を超過。計測中止。");
            poreCount = 0;
        }
    });

    // 2. 物理的接触（マウス激しく動かす）
    let coffeeDetection = 0;
    visual.addEventListener('mousemove', () => {
        coffeeDetection++;
        if (coffeeDetection > 150) { // 少し感度を上げました
            showFloatingText("☕ 微糖の缶コーヒーを検知 ☕", "orange");
            visual.style.filter = "contrast(5) brightness(0.2) sepia(1) hue-rotate(90deg)";
            setTimeout(() => visual.style.filter = "contrast(1.1)", 300);
            coffeeDetection = 0;
        }
    });

    // 3. 過去の否定（右クリック）
    if (charName) {
        charName.style.cursor = "help"; // 触れることを示唆
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            trigger16BitRegression();
        });
    }
}

function triggerGlitchedEffect(message) {
    // アラートの前に画面を揺らす
    document.body.style.animation = "glitched 0.1s infinite";
    setTimeout(() => {
        alert(`[SYSTEM ERROR] ${message}`);
        document.body.style.animation = "none";
    }, 50);
}

function showFloatingText(text, color, x = null, y = null) {
    const span = document.createElement('span');
    span.innerText = text;
    // クリック位置があればそこ、なければランダム
    const posX = x ? x : Math.random() * window.innerWidth;
    const posY = y ? y : Math.random() * window.innerHeight;
    
    span.style.cssText = `
        position:fixed; left:${posX}px; top:${posY}px; 
        color:${color}; font-weight:bold; z-index:10000; 
        pointer-events:none; animation:fadeOutUp 1s forwards;
        text-shadow: 0 0 5px #000;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
}

function trigger16BitRegression() {
    // 1. 画像エリアを取得
    const visual = document.querySelector('.char-visual-wrapper');
    const img = document.querySelector('.char-illust-img');
    
    if (visual && img) {
        // 画像部分だけを強烈にドット絵化（退化）させる
        // width/heightを一時的に小さくして拡大表示させることでピクセルを荒く見せる手法を併用
        img.style.transition = "all 0.5s steps(8)"; // カクカクと変化させる
        img.style.filter = "pixelate(10px) blur(2px) contrast(0.8) sepia(1)"; // 概念的なフィルタ
        
        // 標準CSSでドット感を出すための設定
        img.style.imageRendering = "pixelated"; 
        img.style.width = "10%"; // 一旦極小にする
        
        // 少し遅れて「土ブロック」的な色調へ
        setTimeout(() => {
            visual.style.background = "#542e16"; // 土色背景
            img.style.width = "100%"; // 荒いまま引き伸ばす
            img.style.filter = "contrast(2) saturate(0) sepia(1) hue-rotate(-30deg) brightness(0.7)";
        }, 100);
    }

    // 2. エラーメッセージの表示（背景を透過させて、退化した画像が見えるようにする）
    const msg = document.createElement('div');
    msg.style.cssText = `
        position:fixed; inset:0; 
        background:rgba(0, 0, 0, 0.7); /* 背後の退化した画像が見えるように半透明に */
        color:#fff; display:flex; flex-direction:column; 
        align-items:center; justify-content:center; z-index:10001; 
        font-weight:bold; text-align:center; font-family:monospace;
        backdrop-filter: blur(4px); /* メッセージ周りだけ少しボカす */
    `;
    msg.innerHTML = `
        <h1 style="font-size:3rem; color:#f00; text-shadow: 2px 2px #000;">CRITICAL ERROR</h1>
        <p style="font-size:1.2rem; border:1px solid #f00; padding:10px; background:rgba(255,0,0,0.2);">
            対象個体の解像度が「16bit (土ブロック)」に退行しました。<br>
            tash087の執念が霧散しています。
        </p>
        <div style="margin-top:20px; color:#aaa;">SYSTEM REBOOTING...</div>
    `;
    document.body.appendChild(msg);
    
    // 3. 強制リロード
    setTimeout(() => {
        location.reload(); 
    }, 3500);
}