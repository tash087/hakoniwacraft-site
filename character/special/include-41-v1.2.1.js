/**
 * April Fool 2026 Special Include Script - Mobile & Image Degrade Edition
 */
document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        fetch('/common/header-41-v1.1.html').then(res => res.text()),
        fetch('/common/footer-41-v1.0.html').then(res => res.text())
    ]).then(([headerData, footerData]) => {
        const hp = document.getElementById('header-placeholder');
        const fp = document.getElementById('footer-placeholder');
        if (hp) hp.innerHTML = headerData;
        if (fp) {
            fp.innerHTML = footerData;
            updateServerCounters();
        }
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
    const visual = document.querySelector('.char-visual-wrapper');
    const charName = document.querySelector('.char-name-ja');
    if (!visual) return;

    // 1. 毛穴の計数（タップ/クリック）
    let poreCount = 0;
    const countAction = (e) => {
        poreCount++;
        const touch = e.touches ? e.touches[0] : e;
        showFloatingText(`毛穴計数中... ${poreCount} / 50,000dpi`, 'red', touch.clientX, touch.clientY);
        if (poreCount > 10) {
            triggerGlitchedEffect("サーバー同時接続枠を超過。計測中止。");
            poreCount = 0;
        }
    };
    visual.addEventListener('click', countAction);

    // 2. 物理的接触（スワイプ/マウス移動）
    let coffeeDetection = 0;
    const moveAction = () => {
        coffeeDetection++;
        if (coffeeDetection > 100) {
            showFloatingText("☕ 微糖の缶コーヒーを検知 ☕", "orange");
            visual.style.filter = "contrast(5) brightness(0.2) sepia(1) hue-rotate(90deg)";
            setTimeout(() => visual.style.filter = "contrast(1.1)", 300);
            coffeeDetection = 0;
        }
    };
    visual.addEventListener('mousemove', moveAction);
    visual.addEventListener('touchmove', moveAction); // スマホのスワイプに対応

    // 3. 過去の否定（長押し / 右クリック）
    if (charName) {
        // PC: 右クリック
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            trigger16BitRegression();
        });

        // スマホ: 長押し（ロングタップ）
        let timer;
        charName.addEventListener('touchstart', (e) => {
            timer = setTimeout(() => {
                trigger16BitRegression();
            }, 800); // 0.8秒長押しで発動
        });
        charName.addEventListener('touchend', () => clearTimeout(timer));
        charName.addEventListener('touchmove', () => clearTimeout(timer));
    }
}

function triggerGlitchedEffect(message) {
    document.body.style.animation = "glitched 0.1s infinite";
    setTimeout(() => {
        alert(`[SYSTEM ERROR] ${message}`);
        document.body.style.animation = "none";
    }, 50);
}

function showFloatingText(text, color, x = null, y = null) {
    const span = document.createElement('span');
    span.innerText = text;
    const posX = x ? x : Math.random() * window.innerWidth;
    const posY = y ? y : Math.random() * window.innerHeight;
    
    span.style.cssText = `
        position:fixed; left:${posX}px; top:${posY}px; 
        color:${color}; font-weight:bold; z-index:10000; 
        pointer-events:none; animation:fadeOutUp 1s forwards;
        text-shadow: 0 0 5px #000; font-size: 14px;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
}

/**
 * 画像部分だけを退化（16bit化）させる演出
 */
function trigger16BitRegression() {
    const visual = document.querySelector('.char-visual-wrapper');
    const img = document.querySelector('.char-illust-img');
    
    if (visual && img) {
        // 画像を強制的にドット化
        img.style.imageRendering = "pixelated";
        img.style.transition = "filter 0.3s ease, transform 0.3s ease";
        img.style.filter = "contrast(2) saturate(0) sepia(1) brightness(0.6)";
        img.style.transform = "scale(1.1)"; // 少し歪ませる
        visual.style.background = "#542e16"; 
    }

    const msg = document.createElement('div');
    msg.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.85); 
        color:#fff; display:flex; flex-direction:column; 
        align-items:center; justify-content:center; z-index:10001; 
        font-weight:bold; text-align:center; font-family:monospace; padding: 20px;
    `;
    msg.innerHTML = `
        <h1 style="font-size:2rem; color:#f00;">CRITICAL ERROR</h1>
        <p style="font-size:1rem; margin-top:10px;">
            画像データの解像度が<br>「16bit (土ブロック)」に退行しました。
        </p>
        <div style="margin-top:20px; font-size:0.8rem; border:1px solid #666; padding:10px;">
            REBOOTING SERVER...
        </div>
    `;
    document.body.appendChild(msg);
    
    setTimeout(() => {
        location.reload(); 
    }, 3500);
}